"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  FileText, 
  BriefcaseBusiness, 
  MessageSquareMore, 
  Settings,
  LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { label: "Resume", icon: FileText, href: "/dashboard/resume" },
  { label: "Projects", icon: BriefcaseBusiness, href: "/dashboard/projects" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
      active
        ? "bg-[#6C63FF]/10 text-[#6C63FF]"
        : "text-[#8B92B8] hover:bg-[#6C63FF]/5 hover:text-[#F0F2FF]"
    }`;

  return (
    <aside className="w-[240px] bg-[#12152B] flex flex-col p-6 z-50 h-screen hidden md:flex">
      <div className="flex items-center gap-3 font-bold text-xl mb-10">
        <div className="bg-[#6C63FF] w-8 h-8 flex items-center justify-center rounded-lg text-white">
          WS
        </div>
        <span className="text-[#F0F2FF]">WorkShare</span>
      </div>

      <nav className="flex-grow space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={navLinkClass(isActive)}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Interviews — not implemented, show AlertDialog */}
        <AlertDialog>
          <AlertDialogTrigger>
            <button className={navLinkClass(false) + " w-full"}>
              <MessageSquareMore size={20} strokeWidth={2} />
              <span>Interviews</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Feature Coming Soon</AlertDialogTitle>
              <AlertDialogDescription>
                The AI Mock Interview module is currently under development.
                You&apos;ll be notified as soon as it&apos;s ready. Stay tuned!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Got it</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </nav>

      <div className="mt-auto pt-5 border-t border-[#8B92B8]/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#6C63FF] flex items-center justify-center font-semibold text-[#F0F2FF]">
            {user?.name?.[0] || "A"}
          </div>
          <div className="flex-grow overflow-hidden">
            <div className="text-sm font-semibold text-[#F0F2FF] flex items-center gap-1.5">
              <span className="truncate">{user?.name?.split(" ")[0] || "Arjun"}</span>
              <span className="bg-[#FBBF24] text-black text-[10px] px-1.5 py-0.5 rounded font-bold">PRO</span>
            </div>
            <div className="text-[11px] text-[#8B92B8]">{user?.role || "Student"}</div>
          </div>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger>
            <button 
              className="flex items-center gap-2 text-[#8B92B8] hover:text-[#F87171] text-sm transition-colors w-full text-left group"
            >
              <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
              Logout
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ready to leave?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be signed out of your account. You&apos;ll need to log in again to access your dashboard and projects.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Stay logged in</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Sign out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}
