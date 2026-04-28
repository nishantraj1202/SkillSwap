"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth, type UserProfile } from "@/context/AuthContext";
import styles from "../auth.module.css";

export default function LoginPage() {
  const { login, signup } = useAuth();
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleMode() {
    setError("");
    setIsSignup((current) => !current);
  }

  function handleLogin(e: React.FormEvent) {
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
    setTimeout(() => {
      const result = login(loginEmail, loginPassword);
      if (result.ok) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Login failed.");
      }
      setIsSubmitting(false);
    }, 500);
  }

  function handleSignup(e: React.FormEvent) {
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
    setTimeout(() => {
      const profile: UserProfile = {
        fullName: signupName.trim(),
        email: signupEmail.trim(),
        role: "Student",
        phone: "",
        designation: "",
        institution: "",
        department: "",
        experience: "",
        linkedIn: "",
        idProof: "",
        reason: "",
      };

      const result = signup(profile, signupPassword);
      if (result.ok) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Registration failed.");
      }
      setIsSubmitting(false);
    }, 500);
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
          <h1>Welcome to WorkShare</h1>
          <p>Build skills. Work on projects. Get hired.</p>
          <button type="button" onClick={toggleMode}>
            {isSignup ? "Back to Login" : "SIGNUP"}
          </button>
        </section>

        <section className={styles.switchFormBox}>
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
        </section>
      </div>
    </main>
  );
}
