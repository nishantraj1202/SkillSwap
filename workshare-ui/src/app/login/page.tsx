"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "../auth.module.css";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = login(email, password);
      if (result.ok) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Login failed.");
      }
      setIsSubmitting(false);
    }, 600);
  }

  return (
    <main className={styles.authPage}>
      <div className={styles.authWrap}>
        <section className={styles.authIntro}>
          <Link className={styles.brand} href="/">
            <span className={styles.brandMark}>WS</span>
            <span>WorkShare</span>
          </Link>
          <span className={styles.eyebrow}>Student access</span>
          <h1 className={styles.introTitle}>Login and keep your career momentum moving.</h1>
          <p className={styles.introText}>
            Jump back into projects, interviews, and mentorship sessions from one clean workspace.
          </p>

          <div className={styles.featureGrid}>
            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Sparkles size={20} />
              </div>
              <strong>Polished student flow</strong>
              <p>Simple sign-in, smooth transitions, and a focused experience for daily progress.</p>
            </article>
            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Target size={20} />
              </div>
              <strong>Track what matters</strong>
              <p>Pick up where you left off with resume score, active applications, and upcoming sessions.</p>
            </article>
            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Users size={20} />
              </div>
              <strong>Mentors and recruiters</strong>
              <p>Stay close to feedback, interviews, and project opportunities without digging around.</p>
            </article>
          </div>
        </section>

        <section className={styles.authCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Login</h2>
            <p className={styles.cardText}>Use your email and password to enter WorkShare.</p>
          </div>

          {error && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Password</span>
              <div className={styles.passwordWrap}>
                <input
                  className={styles.input}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <button className={styles.submit} type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className={styles.spinner} /> Signing in...
                </>
              ) : (
                <>
                  Login <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className={styles.switchText}>
            New to WorkShare?{" "}
            <Link className={styles.link} href="/register">
              Register here
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
