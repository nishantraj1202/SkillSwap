"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  FileText, 
  BriefcaseBusiness, 
  MessageSquareMore, 
  Settings
} from "lucide-react";
import {
  AlertDialog,
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
    </aside>
  );
}
