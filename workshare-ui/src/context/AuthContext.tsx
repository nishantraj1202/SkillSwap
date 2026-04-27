"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

/* ─────────────────────────── Types ─────────────────────────── */

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  role: "Student" | "Mentor" | "Recruiter / HR";
  designation: string;
  institution: string;
  department: string;
  experience: string;
  linkedIn: string;
  idProof: string;
  reason: string;
}

export interface AuthUser {
  email: string;
  name: string;
  role: string;
  profile?: UserProfile;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (profile: UserProfile, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

/* ─────────────────────── Demo accounts ─────────────────────── */

const DEMO_ACCOUNTS: Record<string, { password: string; name: string; role: string }> = {
  "student@workshare.com": { password: "student123", name: "Demo Student", role: "Student" },
  "mentor@workshare.com": { password: "mentor123", name: "Demo Mentor", role: "Mentor" },
  "recruiter@workshare.com": { password: "recruiter123", name: "Demo Recruiter", role: "Recruiter / HR" },
  "admin@workshare.com": { password: "admin123", name: "Demo Admin", role: "Admin" },
};

/* ──────────────────────── Storage keys ─────────────────────── */

const USER_KEY = "workshare_user";
const ACCOUNTS_KEY = "workshare_accounts";

/* helper: get registered accounts from localStorage */
function getAccounts(): Record<string, { password: string; name: string; role: string; profile?: UserProfile }> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAccounts(accounts: Record<string, { password: string; name: string; role: string; profile?: UserProfile }>) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

/* ──────────────────────── Context ──────────────────────────── */

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const loading = false;
  const router = useRouter();

  /* persist whenever user changes */
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  /* ── Login ───────────────────────────────────────────────── */
  const login = useCallback(
    (email: string, password: string): { ok: boolean; error?: string } => {
      const lowerEmail = email.trim().toLowerCase();

      /* check demo accounts first */
      const demo = DEMO_ACCOUNTS[lowerEmail];
      if (demo && demo.password === password) {
        setUser({ email: lowerEmail, name: demo.name, role: demo.role });
        return { ok: true };
      }

      /* then registered accounts */
      const accounts = getAccounts();
      const acct = accounts[lowerEmail];
      if (acct && acct.password === password) {
        setUser({
          email: lowerEmail,
          name: acct.name,
          role: acct.role,
          profile: acct.profile,
        });
        return { ok: true };
      }

      if (demo || acct) return { ok: false, error: "Incorrect password. Please try again." };
      return { ok: false, error: "No account found with this email. Please sign up first." };
    },
    [],
  );

  /* ── Signup ──────────────────────────────────────────────── */
  const signup = useCallback(
    (profile: UserProfile, password: string): { ok: boolean; error?: string } => {
      const lowerEmail = profile.email.trim().toLowerCase();

      if (DEMO_ACCOUNTS[lowerEmail]) {
        return { ok: false, error: "This email is reserved for a demo account. Use a different email." };
      }

      const accounts = getAccounts();
      if (accounts[lowerEmail]) {
        return { ok: false, error: "An account with this email already exists. Please login instead." };
      }

      accounts[lowerEmail] = {
        password,
        name: profile.fullName,
        role: profile.role,
        profile,
      };
      saveAccounts(accounts);

      setUser({
        email: lowerEmail,
        name: profile.fullName,
        role: profile.role,
        profile,
      });
      return { ok: true };
    },
    [],
  );

  /* ── Logout ─────────────────────────────────────────────── */
  const logout = useCallback(() => {
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
