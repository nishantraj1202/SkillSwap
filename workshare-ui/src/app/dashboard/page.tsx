"use client";

import React from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  BriefcaseBusiness,
  UserCheck,
  CalendarClock,
  Lock,
  Phone
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

const recentProjects = [
  { title: "Campus Connect Portal", meta: "Full Stack • Applied 2d ago", status: "Open", statusClass: "bg-[#4ADE80]/10 text-[#4ADE80]" },
  { title: "AI Resume Analyzer", meta: "ML/NLP • Applied 5d ago", status: "In Review", statusClass: "bg-[#FBBF24]/10 text-[#FBBF24]" },
  { title: "Skill Swap Community", meta: "UI Design • Closing soon", status: "Suggested", statusClass: "bg-[#8B92B8]/10 text-[#8B92B8]" }
];

const interviewResults = [
  { company: "Nimbus Labs", meta: "Frontend Dev Intern • Apr 24", status: "Passed", statusClass: "bg-[#4ADE80]/10 text-[#4ADE80]" },
  { company: "CodeHarbor", meta: "UI Engineer • Apr 29", status: "Next Round", statusClass: "bg-[#FBBF24]/10 text-[#FBBF24]" },
  { company: "BrightPath", meta: "Product Analyst • Apr 21", status: "Feedback Sent", statusClass: "bg-[#8B92B8]/10 text-[#8B92B8]" }
];

const mentorshipSessions = [
  { name: "Priya Sharma", topic: "System Design", time: "Tomorrow 6:30PM", active: true },
  { name: "Rahul Verma", topic: "Portfolio Review", time: "Apr 30", active: false },
  { name: "Anita Desai", topic: "Behavioral Prep", time: "May 3", active: false }
];

interface ResumeSummary {
  _id: string;
  score: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [resumes, setResumes] = React.useState<ResumeSummary[]>([]);
  const firstName = user?.name?.split(" ")[0] || "Arjun";

  React.useEffect(() => {
    if (!user?.id) return;

    const fetchResumes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/resume/${user.id}`);
        const data = await response.json();
        if (data.success) {
          setResumes(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };

    fetchResumes();
  }, [user?.id]);

  const latestResume = resumes.length > 0 ? resumes[0] : null;
  const hasResume = !!latestResume;

  const dashboardStats = [
    {
      label: "Resume Score",
      value: hasResume ? `${latestResume.score}%` : "—",
      detail: hasResume ? "Stronger than last review" : "Upload resume to see score",
      icon: FileText,
      color: hasResume ? "text-[#4ADE80]" : "text-[#8B92B8]",
      hidden: false
    },
    {
      label: "Applied Projects",
      value: "14",
      detail: "3 awaiting mentor feedback",
      icon: BriefcaseBusiness,
      color: "text-[#F0F2FF]",
      hidden: false
    },
    {
      label: "Interviews Taken",
      value: "6",
      detail: "2 with top-tier recruiters",
      icon: UserCheck,
      color: "text-[#F0F2FF]",
      hidden: false
    },
    {
      label: "Upcoming Sessions",
      value: "4",
      detail: "Next session starts tomorrow",
      icon: CalendarClock,
      color: "text-[#FBBF24]",
      hidden: false
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#0D0F1A]">
      {/* Hero Banner */}
      <section className="relative min-h-[160px] md:h-[180px] bg-gradient-to-br from-[#1a237e] to-[#0d0f1a] rounded-[12px] p-6 md:p-10 flex flex-col justify-center overflow-hidden">
        <h1 className="text-2xl md:text-[36px] font-bold text-[#F0F2FF] mb-2 leading-tight">
          Welcome back, {firstName}.
        </h1>
        <p className="text-[#8B92B8] mb-6 max-w-[500px] text-sm md:text-base">
          {hasResume
            ? "Track your progress, manage applications, and connect with mentors to accelerate your career journey."
            : "Get started by uploading your resume to get an AI-powered analysis and unlock personalized project suggestions."}
        </p>
        <div className="flex flex-wrap gap-3 md:gap-4">
          <Link href="/dashboard/resume" className="bg-[#6C63FF] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-[#6C63FF]/20 hover:bg-[#5B54E8] transition-all text-sm">
            <Upload size={16} strokeWidth={2.5} />
            {hasResume ? "Update Resume" : "Upload Resume"}
          </Link>
          <Link href="/dashboard/projects" className="border border-[#6C63FF] text-[#6C63FF] px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-semibold hover:bg-[#6C63FF]/10 transition-all text-sm">
            Apply Project
          </Link>
        </div>
        {/* Abstract decoration */}
        <div className="absolute -right-[50px] -top-[50px] w-[300px] height-[300px] border-[40px] border-[#6C63FF]/5 rounded-full pointer-events-none" />
      </section>

      {/* Stat Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, idx) => (
          <article key={idx} className="bg-[#1A1F35] p-5 rounded-[12px] border border-transparent hover:border-[#6C63FF]/30 transition-all">
            <span className="text-[#8B92B8] text-sm mb-2 block">{stat.label}</span>
            <span className={`text-[28px] font-bold mb-1 block ${stat.color}`}>{stat.value}</span>
            <span className="text-[#8B92B8] text-xs">{stat.detail}</span>
          </article>
        ))}
      </div>

      {/* Three Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1: Recent Projects */}
        <section className="bg-[#1A1F35] p-5 rounded-[12px] border border-transparent hover:border-[#6C63FF]/30 transition-all">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold">Recent Projects</h2>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project, idx) => (
              <div key={idx} className="flex justify-between items-center py-3 border-b border-[#8B92B8]/5 last:border-0">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-sm">{project.title}</span>
                  <span className="text-[#8B92B8] text-xs">{project.meta}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-[8px] text-[11px] font-bold ${project.statusClass}`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Col 2: Interview Results */}
        <section className="bg-[#1A1F35] p-5 rounded-[12px] border border-transparent hover:border-[#6C63FF]/30 transition-all">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold">Interview Results</h2>
          </div>
          <div className="space-y-4">
            {interviewResults.map((result, idx) => (
              <div key={idx} className="flex justify-between items-center py-3 border-b border-[#8B92B8]/5 last:border-0">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-sm">{result.company}</span>
                  <span className="text-[#8B92B8] text-xs">{result.meta}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-[8px] text-[11px] font-bold ${result.statusClass}`}>
                  {result.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Col 3: Mentorship Sessions */}
        <section className="bg-[#1A1F35] p-5 rounded-[12px] border border-transparent hover:border-[#6C63FF]/30 transition-all">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold">Mentorship Sessions</h2>
          </div>
          <div className="space-y-4">
            {mentorshipSessions.map((session, idx) => (
              <div key={idx} className="flex justify-between items-center py-3 border-b border-[#8B92B8]/5 last:border-0">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-sm">{session.name}</span>
                  <span className="text-[#8B92B8] text-xs">{session.topic} • {session.time}</span>
                </div>
                <Phone size={16} className={session.active ? "text-[#6C63FF]" : "text-[#8B92B8]"} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Score Breakdown */}
        {hasResume ? (
          <section className="bg-[#1A1F35] p-5 rounded-[12px] border border-transparent hover:border-[#6C63FF]/30 transition-all">
            <h2 className="text-lg font-semibold mb-5">Resume Score Breakdown</h2>
            <div className="flex items-center gap-8">
              {/* Circular Progress */}
              <div className="relative w-[120px] h-[120px] flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#12152B" strokeWidth="12" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#6C63FF" strokeWidth="12" strokeDasharray="339.29" strokeDashoffset={339.29 * (1 - (latestResume.score / 100))} strokeLinecap="round" />
                </svg>
                <span className="absolute text-2xl font-bold">{latestResume.score}%</span>
              </div>
              <div className="flex-1 space-y-3">
                {[
                  { label: "ATS Optimization", value: 94 },
                  { label: "Keywords Match", value: 85 },
                  { label: "Formatting", value: 90 },
                  { label: "Structure", value: 78 }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs text-[#8B92B8]">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="h-1.5 bg-[#12152B] rounded-full overflow-hidden">
                      <div className="h-full bg-[#6C63FF]" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-[#1A1F35] p-5 rounded-[12px] border border-dashed border-[#6C63FF]/30 flex flex-col items-center justify-center text-center py-10">
            <div className="w-16 h-16 bg-[#6C63FF]/10 rounded-full flex items-center justify-center mb-4">
              <FileText size={32} className="text-[#6C63FF]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Resume Analyzed</h3>
            <p className="text-[#8B92B8] text-sm max-w-[280px] mb-6">
              Upload your resume to see your ATS score and detailed breakdown.
            </p>
            <Link href="/dashboard/resume" className="bg-[#6C63FF] text-white px-6 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-all">
              Upload Now
            </Link>
          </section>
        )}

        {/* Application Funnel */}
        <section className="bg-[#1A1F35] p-5 rounded-[12px] border border-transparent hover:border-[#6C63FF]/30 transition-all">
          <h2 className="text-lg font-semibold mb-5">Application Funnel</h2>
          <div className="space-y-2">
            {[
              { label: "Applied", value: 14, width: "100%", color: "bg-[#6C63FF]" },
              { label: "Reviewed", value: 9, width: "80%", color: "bg-[#6C63FF]/80" },
              { label: "Shortlisted", value: 4, width: "50%", color: "bg-[#6C63FF]/60" },
              { label: "Offered", value: 1, width: "20%", color: "bg-[#4ADE80]" }
            ].map((step, idx) => (
              <div key={idx} className={`${step.color} h-8 flex items-center px-4 rounded-[4px] text-xs font-medium text-white`} style={{ width: step.width }}>
                {step.label}: {step.value}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Premium Insight Panel */}
      <section className="bg-[#1A1F35] p-5 rounded-[12px] border border-[#6C63FF] flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Your profile is trending this week.</h2>
          <span className="bg-[#FBBF24]/10 text-[#FBBF24] px-2.5 py-1 rounded-[8px] text-[11px] font-bold uppercase tracking-wider">
            Premium Insight
          </span>
        </div>
        <p className="text-sm text-[#8B92B8]">
          Recruiter views are up 24% and your top project was shortlisted by three hiring teams. Upgrade to unlock full analytics.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <ul className="space-y-2">
            <li className="flex items-center gap-2.5 text-xs text-[#8B92B8]">
              <Lock size={14} className="text-[#6C63FF]" />
              Who viewed your profile
            </li>
            <li className="flex items-center gap-2.5 text-xs text-[#8B92B8]">
              <Lock size={14} className="text-[#6C63FF]" />
              Detailed recruiter feedback
            </li>
          </ul>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="bg-[#6C63FF] text-white px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all text-sm">
                Upgrade to Pro
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
                <AlertDialogDescription>
                  Pro subscriptions are not live yet. We&apos;ll unlock premium analytics, recruiter insights, and priority mentorship here as soon as billing is ready.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Maybe later</AlertDialogCancel>
                <AlertDialogAction>Notify me</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </section>
    </div>
  );
}
