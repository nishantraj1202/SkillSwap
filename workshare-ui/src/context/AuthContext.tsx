"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export type UserRole = "student" | "mentor" | "recruiter";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  rawRole: UserRole;
  isVerified: boolean;
}

interface AuthResult {
  ok: boolean;
  error?: string;
  requiresVerification?: boolean;
  email?: string;
  resendAvailableIn?: number;
}

interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (payload: SignupPayload) => Promise<AuthResult>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<AuthResult>;
  resendOtp: (email: string) => Promise<AuthResult>;
  logout: () => void;
}

type StoredSession = {
  token: string;
  user: AuthUser;
};

const AUTH_STORAGE_KEY = "workshare_auth_session";
const AUTH_EVENT = "workshare_auth_change";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

let cachedSessionJson: string | null | undefined;
let cachedSession: StoredSession | null = null;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function formatRole(role: string): string {
  if (role === "recruiter") return "Recruiter";
  if (role === "mentor") return "Mentor";
  return "Student";
}

function mapUser(user: {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.fullName,
    role: formatRole(user.role),
    rawRole: user.role,
    isVerified: user.isVerified,
  };
}

function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored === cachedSessionJson) return cachedSession;

  cachedSessionJson = stored;
  try {
    cachedSession = stored ? (JSON.parse(stored) as StoredSession) : null;
  } catch {
    cachedSession = null;
  }

  return cachedSession;
}

function writeStoredSession(session: StoredSession | null) {
  if (session) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  window.dispatchEvent(new Event(AUTH_EVENT));
}

function subscribeToAuthStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_EVENT, callback);
  };
}

function subscribeToHydration() {
  return () => { };
}

async function postJson<TBody extends object>(path: string, body: TBody) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    let payload: {
      success?: boolean;
      message?: string;
      data?: Record<string, unknown>;
    } = {};

    try {
      payload = await response.json();
    } catch {
      payload = {};
    }

    if (!response.ok) {
      return {
        ok: false,
        error: payload.message || "Something went wrong.",
        data: payload.data || {},
      };
    }

    return {
      ok: true,
      data: payload.data || {},
    };
  } catch {
    return {
      ok: false,
      error: `Unable to reach the WorkShare API.`,
      data: {},
    };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(subscribeToAuthStorage, readStoredSession, () => null);
  const hasHydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const loading = !hasHydrated;
  const router = useRouter();

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const result = await postJson("/api/auth/login", {
      email: email.trim(),
      password,
    });

    if (!result.ok) {
      const resendAvailableIn = Number(result.data.resendAvailableIn || 0);
      return {
        ok: false,
        error: result.error,
        requiresVerification: Boolean(result.data.requiresVerification),
        email: typeof result.data.email === "string" ? result.data.email : email.trim().toLowerCase(),
        resendAvailableIn,
      };
    }

    const token = typeof result.data.token === "string" ? result.data.token : "";
    const user = result.data.user as {
      id: string;
      fullName: string;
      email: string;
      role: UserRole;
      isVerified: boolean;
    };

    writeStoredSession({
      token,
      user: mapUser(user),
    });

    return { ok: true };
  }, []);

  const signup = useCallback(async (payload: SignupPayload): Promise<AuthResult> => {
    const result = await postJson("/api/auth/register", payload);

    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    return {
      ok: true,
      email: typeof result.data.email === "string" ? result.data.email : payload.email,
      resendAvailableIn: Number(result.data.resendAvailableIn || 30),
    };
  }, []);

  const verifyOtp = useCallback(async ({ email, otp }: VerifyOtpPayload): Promise<AuthResult> => {
    const result = await postJson("/api/auth/verify-otp", {
      email: email.trim(),
      otp: otp.trim(),
    });

    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    const token = typeof result.data.token === "string" ? result.data.token : "";
    const user = result.data.user as {
      id: string;
      fullName: string;
      email: string;
      role: UserRole;
      isVerified: boolean;
    };

    writeStoredSession({
      token,
      user: mapUser(user),
    });

    return { ok: true };
  }, []);

  const resendOtp = useCallback(async (email: string): Promise<AuthResult> => {
    const result = await postJson("/api/auth/resend-otp", {
      email: email.trim(),
    });

    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
        resendAvailableIn: Number(result.data.resendAvailableIn || 0),
      };
    }

    return {
      ok: true,
      resendAvailableIn: Number(result.data.resendAvailableIn || 30),
    };
  }, []);

  const logout = useCallback(() => {
    writeStoredSession(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        loading,
        login,
        signup,
        verifyOtp,
        resendOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
