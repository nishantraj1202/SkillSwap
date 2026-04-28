"use client";

import { useState } from "react";
import { Bell, Loader2, Mail, Save, Shield, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
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

export default function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Profile settings updated successfully!", "success");
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0D0F1A]">
      <header>
        <h2 className="text-2xl font-bold text-[#F0F2FF]">Account Settings</h2>
        <p className="text-[#8B92B8] text-sm">Manage your profile information and preferences</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Sidebar (Mobile) */}
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#6C63FF]/10 text-[#6C63FF] font-medium text-sm transition-all border border-[#6C63FF]/20">
            <User size={18} />
            Profile Information
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl text-[#8B92B8] hover:bg-[#1A1F35] font-medium text-sm transition-all">
            <Bell size={18} />
            Notifications
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl text-[#8B92B8] hover:bg-[#1A1F35] font-medium text-sm transition-all">
            <Shield size={18} />
            Security & Privacy
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[#1A1F35] rounded-2xl border border-[#8B92B8]/5 p-6 space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-[#8B92B8]/5">
              <div className="w-20 h-20 rounded-2xl bg-[#6C63FF] flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-[#6C63FF]/20">
                {user?.name?.[0] || "A"}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F0F2FF]">{user?.name || "Arjun Kumar"}</h3>
                <p className="text-sm text-[#8B92B8]">{user?.role || "Student"} • Pro Member</p>
                <button className="mt-2 text-xs text-[#6C63FF] font-bold hover:underline">Change Avatar</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8B92B8] uppercase tracking-wider">Full Name</label>
                <div className="bg-[#12152B] border border-[#8B92B8]/10 rounded-xl px-4 py-3 flex items-center gap-3">
                  <User size={16} className="text-[#8B92B8]" />
                  <input type="text" defaultValue={user?.name || "Arjun Kumar"} className="bg-transparent border-none text-[#F0F2FF] outline-none w-full text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8B92B8] uppercase tracking-wider">Email Address</label>
                <div className="bg-[#12152B] border border-[#8B92B8]/10 rounded-xl px-4 py-3 flex items-center gap-3">
                  <Mail size={16} className="text-[#8B92B8]" />
                  <input type="email" defaultValue={user?.email || "arjun@example.com"} className="bg-transparent border-none text-[#F0F2FF] outline-none w-full text-sm" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#8B92B8]/5 flex justify-between items-center">
              <AlertDialog>
                <AlertDialogTrigger>
                  <button className="text-[#F87171] text-sm font-medium hover:underline">
                    Delete Account
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account from our servers and remove your data from our database.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => showToast("Account deletion requested.", "error")}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#6C63FF] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#6C63FF]/20 hover:opacity-90 transition-all flex items-center gap-2"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
