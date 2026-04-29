"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  GraduationCap,
  Users,
  BriefcaseBusiness,
} from "lucide-react";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import styles from "../glass-auth.module.css";

const roles = [
  {
    label: "Student",
    value: "student" as const,
    icon: GraduationCap,
  },
  {
    label: "Mentor",
    value: "mentor" as const,
    icon: Users,
  },
  {
    label: "Recruiter",
    value: "recruiter" as const,
    icon: BriefcaseBusiness,
  },
];

export default function LoginPage() {
  const { login, signup, verifyOtp, resendOtp } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [isSignup, setIsSignup] = useState(pathname === "/signup");
  const [authStep, setAuthStep] = useState<"form" | "otp">("form");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState<UserRole>("student");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [pendingEmail, setPendingEmail] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authStep !== "otp" || resendCountdown <= 0) return;

    const timer = window.setInterval(() => {
      setResendCountdown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [authStep, resendCountdown]);

  useEffect(() => {
    if (authStep === "otp") {
      window.setTimeout(() => otpRefs.current[0]?.focus(), 40);
    }
  }, [authStep]);

  function toggleMode() {
    setError("");
    setAuthStep("form");
    setIsSignup((current) => !current);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!loginEmail.trim()) {
      setError("Email is required");
      return;
    }
    if (!loginPassword) {
      setError("Password is required");
      return;
    }

    setIsSubmitting(true);
    const result = await login(loginEmail, loginPassword);
    if (result.ok) {
      showToast("Welcome back to WorkShare", "success");
      router.push("/dashboard");
    } else if (result.requiresVerification) {
      setPendingEmail(result.email || loginEmail.trim().toLowerCase());
      setAuthStep("otp");
      setResendCountdown(result.resendAvailableIn || 0);
      setOtpDigits(["", "", "", "", "", ""]);
    } else {
      setError(result.error || "Invalid credentials");
    }
    setIsSubmitting(false);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError("All fields are required");
      return;
    }

    setIsSubmitting(true);
    const result = await signup({
      fullName: signupName.trim(),
      email: signupEmail.trim(),
      password: signupPassword,
      role: signupRole,
    });

    if (result.ok) {
      setPendingEmail(result.email || signupEmail.trim().toLowerCase());
      setAuthStep("otp");
      setResendCountdown(result.resendAvailableIn || 30);
      setOtpDigits(["", "", "", "", "", ""]);
      showToast("OTP sent to your email", "success");
    } else {
      setError(result.error || "Registration failed");
    }
    setIsSubmitting(false);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      setError("Please enter 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    const result = await verifyOtp({ email: pendingEmail, otp });
    if (result.ok) {
      showToast("Verified successfully", "success");
      router.push("/dashboard");
    } else {
      setError(result.error || "Invalid OTP");
    }
    setIsSubmitting(false);
  }

  async function handleResendOtp() {
    if (!pendingEmail || resendCountdown > 0) return;
    setIsSubmitting(true);
    const result = await resendOtp(pendingEmail);
    if (result.ok) {
      setResendCountdown(result.resendAvailableIn || 30);
      setOtpDigits(["", "", "", "", "", ""]);
      showToast("OTP resent", "success");
    } else {
      setError(result.error || "Failed to resend");
    }
    setIsSubmitting(false);
  }

  return (
    <main className={styles.glassPage}>
      <div className={styles.glassCard}>
        {/* Brand */}
        <div className={styles.glassBrand}>
          <div className={styles.logoIcon}>W</div>
          <span className={styles.brandName}>WorkShare</span>
        </div>

        {/* Header */}
        <header className={styles.glassHeader}>
          {authStep === "otp" ? (
            <>
              <h1>Verify Email</h1>
              <p>Enter the code sent to {pendingEmail}</p>
            </>
          ) : (
            <>
              <h1>{isSignup ? "Create Account" : "Welcome Back 👋"}</h1>
              <p>{isSignup ? "Join our community today" : "Enter your credentials to continue"}</p>
            </>
          )}
        </header>

        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Content */}
        {authStep === "otp" ? (
          <form className={styles.glassForm} onSubmit={handleVerifyOtp}>
            <div className={styles.otpGrid}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el; }}
                  className={styles.otpInput}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(-1);
                    const next = [...otpDigits];
                    next[index] = val;
                    setOtpDigits(next);
                    if (val && index < 5) otpRefs.current[index + 1]?.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digit && index > 0) {
                      otpRefs.current[index - 1]?.focus();
                    }
                  }}
                />
              ))}
            </div>
            <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Verify Account"}
            </button>
            <button 
              type="button" 
              className={styles.secondaryText} 
              onClick={handleResendOtp}
              disabled={resendCountdown > 0}
            >
              {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Didn't get a code? Resend"}
            </button>
            <button type="button" className={styles.toggleLink} onClick={() => setAuthStep("form")}>
              Change Email
            </button>
          </form>
        ) : (
          <form className={styles.glassForm} onSubmit={isSignup ? handleSignup : handleLogin}>
            {isSignup && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Full Name</label>
                <input
                  className={styles.glassInput}
                  placeholder="John Doe"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
              </div>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Email Address</label>
              <input
                className={styles.glassInput}
                type="email"
                placeholder="name@example.com"
                value={isSignup ? signupEmail : loginEmail}
                onChange={(e) => isSignup ? setSignupEmail(e.target.value) : setLoginEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Password</label>
              <div className={styles.inputWrapper}>
                <input
                  className={styles.glassInput}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={isSignup ? signupPassword : loginPassword}
                  onChange={(e) => isSignup ? setSignupPassword(e.target.value) : setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Join as</label>
                <div className={styles.roleGrid}>
                  {roles.map((role) => (
                    <div
                      key={role.value}
                      className={`${styles.roleOption} ${signupRole === role.value ? styles.roleActive : ""}`}
                      onClick={() => setSignupRole(role.value)}
                    >
                      <role.icon size={18} />
                      <span>{role.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isSignup && (
              <Link href="#" className={styles.forgotLink}>Forgot Password?</Link>
            )}

            <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {isSignup ? "Create Account" : "Login to WorkShare"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className={styles.secondaryText}>
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <button type="button" className={styles.toggleLink} onClick={toggleMode}>
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
