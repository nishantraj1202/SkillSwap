"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, FileUp, Loader2, Sparkles, UploadCloud } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ResumeUploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    setError(null);

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
        router.push(`/dashboard/resume/result?id=${result.data.resumeId}`);
      } else {
        setError(result.message || "Upload failed. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to the analysis server. Make sure the backend is running.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="workspace">
      <section className="panel module-panel">
        <div className="panel__header">
          <div className="panel__heading">
            <span className="panel__icon">
              <UploadCloud size={18} />
            </span>
            <h2>Resume Upload</h2>
          </div>
          <Link className="text-link" href="/dashboard/resume/result">
            View sample result <ArrowUpRight size={14} />
          </Link>
        </div>

        <div
          className="upload-zone"
          onClick={!isUploading ? triggerFileSelect : undefined}
          style={{ cursor: isUploading ? "wait" : "pointer" }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx"
            style={{ display: "none" }}
          />

          <div className="upload-zone__icon">
            {isUploading ? <Loader2 size={28} className="animate-spin" /> : <FileUp size={28} />}
          </div>

          <h3>{file ? file.name : "Upload your resume"}</h3>
          <p>Choose a PDF or DOCX file up to 5 MB.</p>

          {error ? <p style={{ color: "var(--danger)", marginTop: "8px", fontWeight: 600 }}>{error}</p> : null}

          <button
            className="primary-button upload-zone__button"
            type="button"
            disabled={!file || isUploading}
            onClick={(e) => {
              e.stopPropagation();
              handleUpload();
            }}
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                {file ? "Upload Resume" : "Select Resume"}
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
