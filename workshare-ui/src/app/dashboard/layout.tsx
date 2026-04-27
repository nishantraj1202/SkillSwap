"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="app-shell" style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
          <div className="navbar__brand-mark" style={{ width: 56, height: 56, fontSize: "1.5rem", margin: "0 auto 16px" }}>W</div>
          <p>Loading WorkShare…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="app-shell">
      <div className="shell-frame">
        <Sidebar />
        <div className="main-column">
          <Navbar />
          {children}
        </div>
      </div>
    </div>
  );
}
