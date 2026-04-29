"use client";

import { useEffect, useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0F1A]">
        <div className="text-center text-[#8B92B8]">
          <div className="bg-[#6C63FF] w-14 h-14 flex items-center justify-center rounded-xl text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-[#6C63FF]/20">
            W
          </div>
          <p className="animate-pulse">Loading WorkShare…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="h-screen overflow-hidden bg-[#0D0F1A] text-[#F0F2FF]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex h-full min-w-0 flex-col md:ml-[240px]">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
