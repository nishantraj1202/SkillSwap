const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendOTP } = require("../helpers/emailHelper");

const OTP_EXPIRY_MINUTES = 10;
const OTP_RESEND_COOLDOWN_SECONDS = 30;
const MAX_OTP_ATTEMPTS = 5;

function generateOTP() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "workshare-dev-secret",
    { expiresIn: "7d" }
  );
}

function sanitizeUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function getOtpExpiryDate() {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

function getSecondsUntilResend(lastSent) {
  if (!lastSent) return 0;

  const elapsedMs = Date.now() - new Date(lastSent).getTime();
  const remainingMs = OTP_RESEND_COOLDOWN_SECONDS * 1000 - elapsedMs;
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
}

function normalizeRole(role) {
  const normalized = String(role || "").trim().toLowerCase();
  if (["student", "mentor", "recruiter"].includes(normalized)) return normalized;
  return "student";
}

async function register(req, res) {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required.",
      });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const lowerEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: lowerEmail });

    if (existingUser?.isVerified) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const payload = {
      fullName: fullName.trim(),
      email: lowerEmail,
      password: hashedPassword,
      role: normalizeRole(role),
      isVerified: false,
      otp: hashedOtp,
      otpExpires: getOtpExpiryDate(),
      otpAttempts: 0,
      otpLastSent: new Date(),
    };

    let user;
    if (existingUser) {
      Object.assign(existingUser, payload);
      user = await existingUser.save();
    } else {
      user = await User.create(payload);
    }

    const delivery = await sendOTP(lowerEmail, otp);

    return res.status(existingUser ? 200 : 201).json({
      success: true,
      message: delivery.delivered
        ? "OTP sent to your email address."
        : "OTP generated, but email delivery failed. Check backend logs for the OTP.",
      data: {
        email: user.email,
        isVerified: user.isVerified,
        otpExpires: user.otpExpires,
        resendAvailableIn: OTP_RESEND_COOLDOWN_SECONDS,
        delivered: delivery.delivered,
      },
    });
  } catch (error) {
    console.error("Register error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return res.status(500).json({
      success: false,
      message: "Unable to register user right now.",
      error: process.env.NODE_ENV === "production" ? undefined : error.message
    });
  }
}

async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email?.trim() || !otp?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isVerified) {
      const token = signToken(user);
      return res.status(200).json({
        success: true,
        message: "Account already verified.",
        data: {
          token,
          user: sanitizeUser(user),
        },
      });
    }

    if (!user.otp || !user.otpExpires || user.otpExpires.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        message: "Too many invalid OTP attempts. Please request a new OTP.",
      });
    }

    const isMatch = await bcrypt.compare(otp.trim(), user.otp);

    if (!isMatch) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message:
          user.otpAttempts >= MAX_OTP_ATTEMPTS
            ? "Too many invalid OTP attempts. Please request a new OTP."
            : "Invalid OTP. Please try again.",
        data: {
          attemptsRemaining: Math.max(0, MAX_OTP_ATTEMPTS - user.otpAttempts),
        },
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    user.otpAttempts = 0;
    user.otpLastSent = null;
    await user.save();

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
      data: {
        token,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP right now.",
    });
  }
}

async function resendOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "This account is already verified. Please log in.",
      });
    }

    const resendAvailableIn = getSecondsUntilResend(user.otpLastSent);
    if (resendAvailableIn > 0) {
      return res.status(429).json({
        success: false,
        message: `Please wait ${resendAvailableIn} seconds before requesting another OTP.`,
        data: {
          resendAvailableIn,
        },
      });
    }

    const otp = generateOTP();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpires = getOtpExpiryDate();
    user.otpAttempts = 0;
    user.otpLastSent = new Date();
    await user.save();

    const delivery = await sendOTP(user.email, otp);

    return res.status(200).json({
      success: true,
      message: delivery.delivered
        ? "A new OTP has been sent to your email address."
        : "A new OTP was generated, but email delivery failed. Check backend logs for the OTP.",
      data: {
        email: user.email,
        otpExpires: user.otpExpires,
        resendAvailableIn: OTP_RESEND_COOLDOWN_SECONDS,
        delivered: delivery.delivered,
      },
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to resend OTP right now.",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
        data: {
          requiresVerification: true,
          email: user.email,
          resendAvailableIn: getSecondsUntilResend(user.otpLastSent),
        },
      });
    }

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to log in right now.",
    });
  }
}

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
};
