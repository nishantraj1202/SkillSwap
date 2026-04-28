"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Search, Bell, X } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);

  /* derive initials from the user's name */
  const initials = user
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "WS";

  return (
    <>
      <header className="h-[64px] flex items-center justify-between px-6 bg-[#0D0F1A] border-b border-[#8B92B8]/5 sticky top-0 z-40">
        <div className="text-[#8B92B8] text-sm hidden sm:block">Pages / Dashboard</div>

        <div className="bg-[#1A1F35] rounded-full px-4 py-2 flex items-center gap-3 w-full max-w-[400px] mx-4">
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
            onClick={() => setShowNotif(true)}
          >
            <Bell size={20} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#6C63FF] rounded-full border-2 border-[#0D0F1A]"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-[#6C63FF] flex items-center justify-center font-semibold text-[#F0F2FF] text-xs">
            {initials}
          </div>
        </div>
      </header>

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
