"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth, type UserProfile } from "@/context/AuthContext";
import styles from "../auth.module.css";

const roles = [
  {
    label: "Student",
    value: "Student" as const,
    description: "Build projects, improve your resume, and prepare for interviews.",
    icon: GraduationCap,
  },
  {
    label: "Mentor",
    value: "Mentor" as const,
    description: "Guide learners through projects, practice, and feedback.",
    icon: Users,
  },
  {
    label: "Recruiter",
    value: "Recruiter / HR" as const,
    description: "Review talent pipelines and discover promising student profiles.",
    icon: BriefcaseBusiness,
  },
];

export default function RegisterPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserProfile["role"]>("Student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }
    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const profile: UserProfile = {
        fullName: name.trim(),
        email: email.trim(),
        role,
        phone: "",
        designation: "",
        institution: "",
        department: "",
        experience: "",
        linkedIn: "",
        idProof: "",
        reason: "",
      };

      const result = signup(profile, password);
      if (result.ok) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Registration failed.");
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
          <span className={styles.eyebrow}>New account</span>
          <h1 className={styles.introTitle}>Register and start building your WorkShare profile.</h1>
          <p className={styles.introText}>
            Create an account in a few steps, choose your role, and step into a cleaner student-first workspace.
          </p>

          <div className={styles.featureGrid}>
            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Sparkles size={20} />
              </div>
              <strong>Fast onboarding</strong>
              <p>Minimal fields, strong visual hierarchy, and a centered card flow that feels lightweight.</p>
            </article>
            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <GraduationCap size={20} />
              </div>
              <strong>Role-based experience</strong>
              <p>Select the role that best matches how you want to use WorkShare from day one.</p>
            </article>
          </div>
        </section>

        <section className={styles.authCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Register</h2>
            <p className={styles.cardText}>Set up your account and choose how you want to use WorkShare.</p>
          </div>

          {error && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.field}>
              <span className={styles.label}>Name</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
              />
            </label>

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
                  placeholder="Create a strong password"
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

            <div className={styles.field}>
              <span className={styles.label}>Role</span>
              <div className={styles.roleGrid}>
                {roles.map(({ label, value, description, icon: Icon }) => (
                  <label className={styles.roleOption} key={label}>
                    <input
                      className={styles.roleInput}
                      type="radio"
                      name="role"
                      value={value}
                      checked={role === value}
                      onChange={() => setRole(value)}
                    />
                    <span className={styles.roleCard}>
                      <span className={styles.featureIcon}>
                        <Icon size={18} />
                      </span>
                      <strong>{label}</strong>
                      <span>{description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button className={styles.submit} type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className={styles.spinner} /> Creating account...
                </>
              ) : (
                <>
                  Register <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{" "}
            <Link className={styles.link} href="/login">
              Login here
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
