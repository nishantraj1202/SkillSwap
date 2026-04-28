"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, FileUp, Info, Loader2, Sparkles, UploadCloud, X } from "lucide-react";
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

export default function ResumeUploadPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      showToast("File size exceeds 5MB limit.", "error");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    showToast(`File selected: ${selectedFile.name}`, "info");
  };

  const handleUpload = async () => {
    if (!file || !user) {
      showToast("Please select a file first.", "warning");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("userId", user.email);

    try {
      const response = await fetch("http://localhost:5000/api/resume/upload-resume", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        showToast("Resume uploaded successfully! Analyzing...", "success");
        router.push(`/dashboard/resume/result?id=${result.data.resumeId}`);
      } else {
        showToast(result.message || "Upload failed. Please try again.", "error");
      }
    } catch (err) {
      showToast("Unable to connect to the server. Is the backend running?", "error");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0D0F1A]">
      <section className="bg-[#1A1F35] p-8 rounded-[12px] border border-[#6C63FF]/20 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#6C63FF]/5 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#6C63FF]/10 rounded-xl flex items-center justify-center text-[#6C63FF]">
              <UploadCloud size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#F0F2FF]">Resume Upload</h2>
              <p className="text-sm text-[#8B92B8]">Get AI-powered insights on your resume</p>
            </div>
          </div>
          <Link 
            className="flex items-center gap-2 text-sm text-[#6C63FF] hover:underline" 
            href="/dashboard/resume/result"
          >
            View sample result <ArrowUpRight size={16} />
          </Link>
        </div>

        <div
          className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all ${
            file ? 'border-[#6C63FF] bg-[#6C63FF]/5' : 'border-[#8B92B8]/20 bg-[#12152B]/50 hover:border-[#6C63FF]/50'
          }`}
          onClick={!isUploading ? triggerFileSelect : undefined}
          style={{ cursor: isUploading ? "wait" : "pointer" }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx"
            className="hidden"
          />

          <div className="w-16 h-16 bg-[#6C63FF]/10 rounded-2xl flex items-center justify-center text-[#6C63FF] mb-6 shadow-lg shadow-[#6C63FF]/5">
            {isUploading ? <Loader2 size={32} className="animate-spin" /> : <FileUp size={32} />}
          </div>

          <h3 className="text-lg font-semibold text-[#F0F2FF] mb-2">
            {file ? file.name : "Choose a file or drag it here"}
          </h3>
          <p className="text-[#8B92B8] text-sm mb-8 max-w-xs mx-auto">
            Supported formats: PDF, DOCX (Max 5MB)
          </p>

          <div className="flex gap-4">
            {file && !isUploading && (
              <AlertDialog>
                <AlertDialogTrigger>
                  <button
                    type="button"
                    className="bg-transparent border border-[#F87171]/20 text-[#F87171] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#F87171]/10 transition-all flex items-center gap-2"
                  >
                    <X size={16} />
                    Clear
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove selected file?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove <strong>{file.name}</strong>. You&apos;ll need to select it again if you want to analyze it.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep file</AlertDialogCancel>
                    <AlertDialogAction onClick={() => setFile(null)}>Remove</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <button
              className="bg-[#6C63FF] text-white px-8 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#6C63FF]/20"
              type="button"
              disabled={!file || isUploading}
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  {file ? "Analyze Resume" : "Select Resume"}
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Info Card */}
      <div className="bg-[#1A1F35] p-6 rounded-[12px] border border-[#8B92B8]/5 flex items-start gap-4">
        <div className="w-10 h-10 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center text-[#FBBF24] shrink-0">
          <Info size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-[#F0F2FF]">Why analyze your resume?</h4>
          <p className="text-xs text-[#8B92B8] leading-relaxed">
            Our AI model checks your resume against 50+ industry standards, ATS algorithms, and keyword relevance to help you stand out to top-tier recruiters.
          </p>
        </div>
      </div>
    </div>
  );
}
