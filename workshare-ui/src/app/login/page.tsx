"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  GraduationCap,
  Mail,
  RefreshCcw,
  Users,
  BriefcaseBusiness,
} from "lucide-react";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import styles from "../auth.module.css";

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
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
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
    setOtpDigits(["", "", "", "", "", ""]);
    setPendingEmail("");
    setResendCountdown(0);
    setIsSignup((current) => !current);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!loginEmail.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!loginPassword) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(loginEmail, loginPassword);
    if (result.ok) {
      showToast("Welcome back to WorkShare.", "success");
      router.push("/dashboard");
    } else if (result.requiresVerification) {
      setPendingEmail(result.email || loginEmail.trim().toLowerCase());
      setAuthStep("otp");
      setResendCountdown(result.resendAvailableIn || 0);
      setOtpDigits(["", "", "", "", "", ""]);
      setError("Your account is not verified yet. Enter the OTP sent to your email.");
    } else {
      setError(result.error || "Login failed.");
    }
    setIsSubmitting(false);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!signupName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!signupEmail.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!signupPassword.trim()) {
      setError("Please create a password.");
      return;
    }
    if (signupPassword.trim().length < 6) {
      setError("Password must be at least 6 characters.");
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
      setError("");
      showToast("OTP sent. Check your inbox to verify your account.", "success");
    } else {
      setError(result.error || "Registration failed.");
    }
    setIsSubmitting(false);
  }

  function updateOtpDigit(index: number, value: string) {
    const nextChar = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = nextChar;
    setOtpDigits(nextDigits);

    if (nextChar && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpPaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    event.preventDefault();
    const nextDigits = ["", "", "", "", "", ""];
    pasted.split("").forEach((digit, index) => {
      nextDigits[index] = digit;
    });
    setOtpDigits(nextDigits);
    otpRefs.current[Math.min(pasted.length, 6) - 1]?.focus();
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setIsSubmitting(true);
    const result = await verifyOtp({ email: pendingEmail, otp });

    if (result.ok) {
      showToast("Account verified successfully.", "success");
      router.push("/dashboard");
    } else {
      setError(result.error || "OTP verification failed.");
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
      setError("");
      otpRefs.current[0]?.focus();
      showToast("A fresh OTP has been sent.", "success");
    } else {
      setError(result.error || "Unable to resend OTP.");
      if (result.resendAvailableIn) {
        setResendCountdown(result.resendAvailableIn);
      }
    }
    setIsSubmitting(false);
  }

  return (
    <main className={styles.switchAuthPage}>
      <div className={`${styles.switchBlob} ${styles.switchBlobOne}`} />
      <div className={`${styles.switchBlob} ${styles.switchBlobTwo}`} />

      <div
        className={`${styles.switchContainer} ${isSignup ? styles.switchContainerActive : ""
          }`}
      >
        <section className={styles.switchPanel}>
          <Link className={styles.switchBrand} href="/">
            <span>W</span>
            WorkShare
          </Link>
          <h1>{authStep === "otp" ? "Verify your email" : "Welcome to WorkShare"}</h1>
          <p>
            {authStep === "otp"
              ? "Enter the code we sent to your inbox to unlock your dashboard."
              : "Build skills. Work on projects. Get hired."}
          </p>
          {authStep === "otp" ? (
            <button
              type="button"
              onClick={() => {
                setAuthStep("form");
                setOtpDigits(["", "", "", "", "", ""]);
                setError("");
              }}
            >
              Back to {isSignup ? "Signup" : "Login"}
            </button>
          ) : (
            <button type="button" onClick={toggleMode}>
              {isSignup ? "Back to Login" : "SIGNUP"}
            </button>
          )}
        </section>

        <section className={styles.switchFormBox}>
          {authStep === "otp" ? (
            <form className={`${styles.switchForm} ${styles.switchOtp}`} onSubmit={handleVerifyOtp}>
              <h2>Enter OTP</h2>
              <div className={styles.switchOtpMeta}>
                <div className={styles.switchOtpBadge}>
                  <Mail size={16} />
                  <span>{pendingEmail}</span>
                </div>
                <p>
                  We sent a 6-digit verification code to your email. It expires in 10 minutes.
                </p>
              </div>
              {error && (
                <div className={styles.switchError}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
              <div className={styles.switchOtpGrid} onPaste={handleOtpPaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      otpRefs.current[index] = element;
                    }}
                    className={styles.switchOtpInput}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    onChange={(event) => {
                      updateOtpDigit(index, event.target.value);
                      setError("");
                    }}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  />
                ))}
              </div>

              <div className={styles.switchOtpActions}>
                <button className={styles.switchSubmit} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className={styles.spinner} />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className={styles.switchGhostButton}
                  onClick={handleResendOtp}
                  disabled={isSubmitting || resendCountdown > 0}
                >
                  <RefreshCcw size={16} />
                  {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <form
                className={`${styles.switchForm} ${styles.switchLogin}`}
                onSubmit={handleLogin}
              >
                <h2>Login</h2>
                {!isSignup && error && (
                  <div className={styles.switchError}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                <input
                  className={styles.switchInput}
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setError("");
                  }}
                />
                <div className={styles.switchPasswordWrap}>
                  <input
                    className={styles.switchInput}
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setError("");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((current) => !current)}
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button className={styles.switchSubmit} type="submit" disabled={isSubmitting}>
                  {isSubmitting && !isSignup ? (
                    <>
                      <Loader2 size={18} className={styles.spinner} />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <form
                className={`${styles.switchForm} ${styles.switchSignup}`}
                onSubmit={handleSignup}
              >
                <h2>Sign Up</h2>
                {isSignup && error && (
                  <div className={styles.switchError}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                <input
                  className={styles.switchInput}
                  type="text"
                  placeholder="Name"
                  value={signupName}
                  onChange={(e) => {
                    setSignupName(e.target.value);
                    setError("");
                  }}
                />
                <input
                  className={styles.switchInput}
                  type="email"
                  placeholder="Email"
                  value={signupEmail}
                  onChange={(e) => {
                    setSignupEmail(e.target.value);
                    setError("");
                  }}
                />
                <div className={styles.switchPasswordWrap}>
                  <input
                    className={styles.switchInput}
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => {
                      setSignupPassword(e.target.value);
                      setError("");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword((current) => !current)}
                    aria-label={showSignupPassword ? "Hide password" : "Show password"}
                  >
                    {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className={styles.switchRoleSection}>
                  <span className={styles.switchRoleLabel}>Role</span>
                  <div className={styles.switchRoleGrid}>
                    {roles.map(({ label, value, icon: Icon }) => (
                      <label
                        className={`${styles.switchRoleOption} ${signupRole === value ? styles.switchRoleActive : ""}`}
                        key={label}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={value}
                          checked={signupRole === value}
                          onChange={() => setSignupRole(value)}
                          className="hidden"
                        />
                        <Icon size={16} />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button className={styles.switchSubmit} type="submit" disabled={isSubmitting}>
                  {isSubmitting && isSignup ? (
                    <>
                      <Loader2 size={18} className={styles.spinner} />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
