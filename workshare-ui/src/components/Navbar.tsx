"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Bell, ChevronDown, LogOut, Search, Settings, X, Menu } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  /* derive initials from the user's name */
  const initials = user
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "WS";
  const displayName = user?.name || "Arjun";
  const firstName = displayName.split(" ")[0];
  const role = user?.role || "Student";

  return (
    <>
      <header className="h-[64px] flex items-center justify-between px-6 bg-[#0D0F1A] border-b border-[#8B92B8]/5 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-[#8B92B8] hover:text-[#F0F2FF] transition-colors"
            onClick={onMenuClick}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="text-[#8B92B8] text-sm hidden lg:block">Pages / Dashboard</div>
        </div>

        <div className="bg-[#1A1F35] rounded-full px-4 py-2 hidden sm:flex items-center gap-3 w-full max-w-[400px] mx-4">
          <Search size={16} className="text-[#8B92B8] shrink-0" />
          <input 
            type="text" 
            placeholder="Search for projects, companies..." 
            className="bg-transparent border-none text-[#F0F2FF] outline-none w-full text-sm placeholder:text-[#8B92B8]/50"
          />
        </div>

        <div className="flex items-center gap-5">
          <button 
            className="relative text-[#8B92B8] hover:text-[#F0F2FF] transition-colors"
            onClick={() => {
              setShowUserMenu(false);
              setShowNotif(true);
            }}
          >
            <Bell size={20} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#6C63FF] rounded-full border-2 border-[#0D0F1A]"></span>
          </button>

          <div className="relative z-[60]">
            <button
              type="button"
              aria-label="Open user menu"
              aria-expanded={showUserMenu}
              className="flex items-center gap-2 rounded-full border border-transparent p-1 pr-2 text-[#F0F2FF] transition-all hover:border-[#6C63FF]/40 hover:bg-[#1A1F35]"
              onClick={() => setShowUserMenu((current) => !current)}
            >
              <span className="w-8 h-8 rounded-full bg-[#6C63FF] flex items-center justify-center font-semibold text-[#F0F2FF] text-xs">
                {initials}
              </span>
              <ChevronDown
                size={14}
                className={`text-[#8B92B8] transition-transform ${showUserMenu ? "rotate-180" : ""}`}
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-[#8B92B8]/10 bg-[#12152B] shadow-2xl shadow-black/40">
                <div className="flex items-center gap-3 border-b border-[#8B92B8]/10 p-4">
                  <div className="w-11 h-11 rounded-full bg-[#6C63FF] flex items-center justify-center font-semibold text-[#F0F2FF]">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-[#F0F2FF]">{firstName}</p>
                      <span className="rounded-md bg-[#FBBF24] px-2 py-0.5 text-[10px] font-bold text-black">
                        PRO
                      </span>
                    </div>
                    <p className="text-xs text-[#8B92B8]">{role}</p>
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#8B92B8] transition-colors hover:bg-[#6C63FF]/10 hover:text-[#F0F2FF]"
                  >
                    <Settings size={16} />
                    Account settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowLogoutDialog(true);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#8B92B8] transition-colors hover:bg-[#F87171]/10 hover:text-[#F87171]"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showUserMenu && (
        <button
          type="button"
          aria-label="Close user menu"
          className="fixed inset-0 z-30 cursor-default"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
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

      {/* Notification Drawer Overlay */}
      {showNotif && (
        <div className="fixed inset-0 bg-black/50 z-[1000] transition-opacity" onClick={() => setShowNotif(false)}>
          <div 
            className="absolute top-0 right-0 w-full max-w-[350px] h-full bg-[#12152B] p-6 shadow-2xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-[#F0F2FF]">Notifications</h2>
              <button onClick={() => setShowNotif(false)} className="text-[#8B92B8] hover:text-[#F0F2FF]">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-[#1A1F35] border border-[#8B92B8]/5">
                <div className="font-medium text-sm text-[#F0F2FF]">New Project Match</div>
                <div className="text-xs text-[#8B92B8]">Fintech Startup needs a React Developer</div>
              </div>
              <div className="p-4 rounded-lg bg-[#1A1F35] border border-[#8B92B8]/5">
                <div className="font-medium text-sm text-[#F0F2FF]">Interview Scheduled</div>
                <div className="text-xs text-[#8B92B8]">CodeHarbor • Tomorrow at 10:00 AM</div>
              </div>
              <div className="p-4 rounded-lg bg-[#1A1F35] border border-[#8B92B8]/5">
                <div className="font-medium text-sm text-[#F0F2FF]">Resume Tip</div>
                <div className="text-xs text-[#8B92B8]">Add Cloud Computing to increase matches by 15%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
