"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ListChecks, TrendingUp, Loader2, AlertCircle, Cpu, ShieldCheck, XCircle, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ResumeData {
  _id: string;
  score: number;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  originalName: string;
}

function ResultContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchResult = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resume/detail/${id}`);
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || "Could not find the analysis result.");
        }
      } catch (err) {
        setError("Unable to connect to the analysis server.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-[#0D0F1A]">
        <Loader2 size={48} className="animate-spin text-[#6C63FF] mb-4" />
        <h2 className="text-xl font-bold text-[#F0F2FF]">Analyzing your resume...</h2>
        <p className="text-[#8B92B8]">Gathering AI-powered insights for your career.</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-[#0D0F1A]">
        <AlertCircle size={48} className="text-[#F87171] mb-4" />
        <h2 className="text-xl font-bold text-[#F0F2FF] mb-2">Analysis Failed</h2>
        <p className="text-[#8B92B8] mb-6 max-w-md">{error || "No analysis data found. Please try uploading again."}</p>
        <Link href="/dashboard/resume" className="bg-[#6C63FF] text-white px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all">
          Return to Upload
        </Link>
      </div>
    );
  }

  const score = data.score;
  const getScoreColor = (s: number) => {
    if (s >= 80) return "#4ADE80"; // Success
    if (s >= 60) return "#FBBF24"; // Warning
    return "#F87171"; // Danger
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0D0F1A]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#8B92B8]">
        <Link href="/dashboard" className="hover:text-[#F0F2FF]">Dashboard</Link>
        <ChevronRight size={12} />
        <Link href="/dashboard/resume" className="hover:text-[#F0F2FF]">Resume</Link>
        <ChevronRight size={12} />
        <span className="text-[#6C63FF]">Analysis Result</span>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#1A1F35] p-8 rounded-[12px] border border-[#6C63FF]/20 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#6C63FF]/5 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#6C63FF]/10 rounded-xl flex items-center justify-center text-[#6C63FF]">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#F0F2FF]">Resume Analysis Result</h2>
              <div className="flex items-center gap-2 mt-1">
                <FileText size={14} className="text-[#8B92B8]" />
                <span className="text-sm text-[#8B92B8] truncate max-w-[200px]">{data.originalName}</span>
              </div>
            </div>
          </div>
          <div className="bg-[#12152B] border border-[#8B92B8]/10 px-4 py-2 rounded-lg text-xs font-semibold text-[#8B92B8]">
            ID: {id?.slice(-8).toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Score Card */}
          <div className="lg:col-span-4 bg-[#12152B] rounded-2xl p-8 flex flex-col items-center justify-center border border-[#8B92B8]/5 shadow-inner">
             <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#1A1F35" strokeWidth="12" />
                  <circle cx="80" cy="80" r="70" fill="none" stroke={getScoreColor(score)} strokeWidth="12" strokeDasharray="439.8" strokeDashoffset={439.8 * (1 - score/100)} strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-bold text-[#F0F2FF]">{score}</span>
                  <span className="text-xs text-[#8B92B8] uppercase tracking-widest mt-1">Score</span>
                </div>
             </div>
             <p className="text-[#8B92B8] text-sm mt-6">out of 100 points</p>
          </div>

          {/* Summary & Metrics */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-[#F0F2FF] mb-3">
                {score >= 80 ? "High potential with a few high-impact fixes." : score >= 60 ? "Solid foundation with room for growth." : "Potential identified, needs structural refinement."}
              </h3>
              <p className="text-[#8B92B8] leading-relaxed">
                Your resume has been analyzed by our AI career engine. We&apos;ve detected key skills and identified specific areas where you can improve your impact.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#12152B] p-5 rounded-xl border border-[#8B92B8]/5 hover:border-[#6C63FF]/30 transition-all group">
                <span className="text-[#8B92B8] text-xs uppercase tracking-widest block mb-2 group-hover:text-[#6C63FF] transition-colors">Skills Detected</span>
                <strong className="text-2xl text-[#F0F2FF]">{data.skills.length}</strong>
              </div>
              <div className="bg-[#12152B] p-5 rounded-xl border border-[#8B92B8]/5 hover:border-[#6C63FF]/30 transition-all group">
                <span className="text-[#8B92B8] text-xs uppercase tracking-widest block mb-2 group-hover:text-[#6C63FF] transition-colors">Action Items</span>
                <strong className="text-2xl text-[#F0F2FF]">{data.suggestions.length}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#8B92B8]">Match Strength</span>
                <span className="font-bold" style={{ color: getScoreColor(score) }}>{score}%</span>
              </div>
              <div className="h-2.5 bg-[#12152B] rounded-full overflow-hidden border border-[#8B92B8]/10">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: getScoreColor(score) }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <section className="bg-[#1A1F35] p-6 rounded-[12px] border border-transparent hover:border-[#4ADE80]/20 transition-all space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#4ADE80]/10 rounded-lg flex items-center justify-center text-[#4ADE80]">
              <ShieldCheck size={18} />
            </div>
            <h2 className="font-bold text-[#F0F2FF]">Strengths</h2>
          </div>
          <div className="space-y-3">
            {data.strengths.map((item, idx) => (
              <div key={idx} className="p-3 bg-[#12152B] border-l-2 border-[#4ADE80] rounded-r-lg text-sm text-[#F0F2FF]">
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Weaknesses */}
        <section className="bg-[#1A1F35] p-6 rounded-[12px] border border-transparent hover:border-[#F87171]/20 transition-all space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#F87171]/10 rounded-lg flex items-center justify-center text-[#F87171]">
              <XCircle size={18} />
            </div>
            <h2 className="font-bold text-[#F0F2FF]">Weaknesses</h2>
          </div>
          <div className="space-y-3">
            {data.weaknesses.map((item, idx) => (
              <div key={idx} className="p-3 bg-[#12152B] border-l-2 border-[#F87171] rounded-r-lg text-sm text-[#F0F2FF]">
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Suggestions */}
        <section className="bg-[#1A1F35] p-6 rounded-[12px] border border-transparent hover:border-[#6C63FF]/20 transition-all space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#6C63FF]/10 rounded-lg flex items-center justify-center text-[#6C63FF]">
              <ListChecks size={18} />
            </div>
            <h2 className="font-bold text-[#F0F2FF]">Suggestions</h2>
          </div>
          <div className="space-y-3">
            {data.suggestions.map((item, idx) => (
              <div key={idx} className="p-3 bg-[#12152B] border-l-2 border-[#6C63FF] rounded-r-lg text-sm text-[#F0F2FF]">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Skills Highlighted */}
      <section className="bg-[#1A1F35] p-6 rounded-[12px] border border-[#8B92B8]/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-[#FBBF24]/10 rounded-lg flex items-center justify-center text-[#FBBF24]">
            <Cpu size={18} />
          </div>
          <h2 className="font-bold text-[#F0F2FF]">Skills Highlighted</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, idx) => (
            <span 
              key={idx} 
              className="bg-[#12152B] text-[#8B92B8] border border-[#8B92B8]/10 px-4 py-1.5 rounded-full text-xs font-medium hover:border-[#6C63FF] hover:text-[#6C63FF] transition-all cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function ResumeResultPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-[#0D0F1A]"><Loader2 size={40} className="animate-spin text-[#6C63FF]" /></div>}>
      <ResultContent />
    </Suspense>
  );
}
