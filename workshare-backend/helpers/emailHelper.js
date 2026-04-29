const nodemailer = require("nodemailer");

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const EMAIL_USER = process.env.EMAIL_USER?.trim();
  const EMAIL_PASS = process.env.EMAIL_PASS?.replace(/\s+/g, "");
  if (!EMAIL_USER || !EMAIL_PASS) return null;

  cachedTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use STARTTLS
    logger: true,
    debug: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  return cachedTransporter;
}

async function sendOTP(email, otp) {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(`OTP email transport is not configured. OTP for ${email}: ${otp}`);
    return {
      delivered: false,
      fallback: true,
      reason: "missing_config",
    };
  }

  try {
    await transporter.sendMail({
      from: `"WorkShare" <${process.env.EMAIL_USER?.trim()}>`,
      to: email,
      subject: "Verify your WorkShare account",
      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;background:#0b1020;color:#f8fafc">
          <div style="max-width:520px;margin:0 auto;background:linear-gradient(180deg,#151c34 0%,#0f172a 100%);border:1px solid #334155;border-radius:20px;padding:32px">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#a5b4fc">WorkShare</p>
            <h2 style="margin:0 0 12px;font-size:28px;color:#ffffff">Verify your account</h2>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#cbd5e1">
              Use the OTP below to finish creating your account. It expires in 10 minutes.
            </p>
            <div style="margin:0 0 24px;padding:18px 22px;border-radius:16px;background:linear-gradient(135deg,#7c3aed 0%,#ec4899 100%);text-align:center">
              <div style="font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.8)">One-time password</div>
              <div style="margin-top:8px;font-size:36px;font-weight:700;letter-spacing:0.35em;color:#ffffff">${otp}</div>
            </div>
            <p style="margin:0;font-size:13px;line-height:1.6;color:#94a3b8">
              If you did not request this, you can ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    return {
      delivered: true,
      fallback: false,
    };
  } catch (error) {
    console.error("OTP mail send failed:", error.message);
    console.warn(`Fallback OTP for ${email}: ${otp}`);

    return {
      delivered: false,
      fallback: true,
      reason: "smtp_error",
      error: error.message,
    };
  }
}

module.exports = {
  sendOTP,
};
