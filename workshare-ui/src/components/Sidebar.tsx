"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutGrid, 
  FileText, 
  BriefcaseBusiness, 
  MessageSquareMore, 
  Settings,
  Brain,
  X
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
  { label: "AI Career Coach", icon: Brain, href: "/dashboard/ai-coach" },
  { label: "Projects", icon: BriefcaseBusiness, href: "/dashboard/projects" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const pathname = usePathname();

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
      active
        ? "bg-[#6C63FF]/10 text-[#6C63FF]"
        : "text-[#8B92B8] hover:bg-[#6C63FF]/5 hover:text-[#F0F2FF]"
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 bottom-0 z-50 h-screen w-[240px] flex-col overflow-y-auto bg-[#12152B] p-6 transition-transform duration-300 ease-in-out md:translate-x-0 md:flex ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3 font-bold text-xl">
            <div className="bg-[#6C63FF] w-8 h-8 flex items-center justify-center rounded-lg text-white">
              WS
            </div>
            <span className="text-[#F0F2FF]">WorkShare</span>
          </div>
          <button 
            className="md:hidden text-[#8B92B8] hover:text-[#F0F2FF]"
            onClick={onClose}
          >
            <X size={20} />
          </button>
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
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Interviews — not implemented, show AlertDialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
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
    </>
  );
}
