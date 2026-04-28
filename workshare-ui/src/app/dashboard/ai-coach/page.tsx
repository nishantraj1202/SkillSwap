"use client";

import React, { useState } from "react";
import { 
  Brain, 
  Rocket, 
  Search, 
  GitBranch, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Loader2, 
  ChevronRight, 
  Cpu, 
  Briefcase, 
  Lightbulb, 
  BarChart3, 
  GraduationCap,
  Sparkles
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";

// --- Types ---
type Domain = "Web Development" | "Machine Learning" | "App Development" | "Data Science" | "DevOps";
type Level = "Beginner" | "Intermediate" | "Advanced";
type Goal = "Resume Building" | "Learning Concepts" | "Job Ready" | "Freelancing";

interface RoadmapOutput {
  title: string;
  problem: string;
  importance: string;
  techStack: string[];
  features: string[];
  roadmap: string[];
  timeline: string;
  resumeValue: string;
  recruiterInsight: string;
}

interface ReviewOutput {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  resumeFeedback: string;
  readiness: "Beginner" | "Ready" | "Strong Candidate";
}

export default function AICareerCoachPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"roadmap" | "review">("roadmap");
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  // Roadmap Form State
  const [domain, setDomain] = useState<Domain>("Web Development");
  const [level, setLevel] = useState<Level>("Intermediate");
  const [goal, setGoal] = useState<Goal>("Job Ready");
  const [techStack, setTechStack] = useState<string[]>(["React", "Node.js", "MongoDB"]);
  const [mentorSupport, setMentorSupport] = useState(true);

  // Review Form State
  const [githubUrl, setGithubUrl] = useState("");

  // Output State
  const [roadmapResult, setRoadmapResult] = useState<RoadmapOutput | null>(null);
  const [reviewResult, setReviewResult] = useState<ReviewOutput | null>(null);

  const handleGenerateRoadmap = async () => {
    setIsLoading(true);
    setShowOutput(false);
    
    const messages = [
      "Analyzing industry trends...",
      "Matching tech stack with market demand...",
      "Crafting high-impact project logic...",
      "Generating career growth roadmap..."
    ];

    // Simple message cycling
    let msgIndex = 0;
    const interval = setInterval(() => {
      setThinkingMessage(messages[msgIndex % messages.length]);
      msgIndex++;
    }, 2000);

    try {
      const response = await fetch("http://localhost:5000/api/ai/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, level, goal, techStack, mentorSupport }),
      });

      const result = await response.json();

      if (result.success) {
        setRoadmapResult(result.data);
        setShowOutput(true);
        showToast("Roadmap generated!", "success");
      } else {
        showToast(result.message || "Gemini could not generate a roadmap.", "error");
      }
    } catch {
      showToast("Unable to connect to Gemini project generator.", "error");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const handleReviewProject = async () => {
    if (!githubUrl.includes("github.com")) {
      showToast("Please provide a valid GitHub URL", "warning");
      return;
    }

    setIsLoading(true);
    setShowOutput(false);
    setThinkingMessage("Analyzing codebase architecture...");

    try {
      const response = await fetch("http://localhost:5000/api/ai/review-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl }),
      });

      const result = await response.json();

      if (result.success) {
        setReviewResult(result.data);
        setShowOutput(true);
        showToast("Analysis complete!", "success");
      } else {
        showToast(result.message || "Failed to analyze project.", "error");
      }
    } catch {
      showToast("Unable to connect to the AI server.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#0D0F1A]">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6C63FF]/20 rounded-xl flex items-center justify-center text-[#6C63FF]">
            <Brain size={24} />
          </div>
          <h1 className="text-3xl font-bold text-[#F0F2FF]">AI Career Coach</h1>
        </div>
        <p className="text-[#8B92B8] max-w-2xl">
          Your personalized architect and career advisor. Generate high-impact projects or get your code reviewed by AI.
        </p>
      </header>

      {/* Tabs */}
      <div className="flex p-1 bg-[#12152B] rounded-xl w-fit border border-[#8B92B8]/10">
        <button 
          onClick={() => { setActiveTab("roadmap"); setShowOutput(false); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "roadmap" ? "bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/20" : "text-[#8B92B8] hover:text-[#F0F2FF]"}`}
        >
          <Rocket size={18} />
          Roadmap Generator
        </button>
        <button 
          onClick={() => { setActiveTab("review"); setShowOutput(false); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "review" ? "bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/20" : "text-[#8B92B8] hover:text-[#F0F2FF]"}`}
        >
          <Search size={18} />
          Project Review
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1A1F35] rounded-2xl border border-[#8B92B8]/10 p-6 space-y-6 shadow-xl">
            {activeTab === "roadmap" ? (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#F0F2FF] flex items-center gap-2">
                    <Zap size={18} className="text-[#6C63FF]" />
                    Project Configuration
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8B92B8] uppercase tracking-widest">Domain</label>
                    <select 
                      value={domain}
                      onChange={(e) => setDomain(e.target.value as Domain)}
                      className="w-full bg-[#12152B] border border-[#8B92B8]/10 rounded-xl px-4 py-3 text-[#F0F2FF] outline-none focus:border-[#6C63FF] transition-all appearance-none cursor-pointer"
                    >
                      <option>Web Development</option>
                      <option>Machine Learning</option>
                      <option>App Development</option>
                      <option>Data Science</option>
                      <option>DevOps</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8B92B8] uppercase tracking-widest">Difficulty Level</label>
                    <div className="flex gap-2">
                      {(["Beginner", "Intermediate", "Advanced"] as Level[]).map((l) => (
                        <button
                          key={l}
                          onClick={() => setLevel(l)}
                          className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition-all ${level === l ? "bg-[#6C63FF]/10 border-[#6C63FF] text-[#6C63FF]" : "bg-[#12152B] border-[#8B92B8]/10 text-[#8B92B8] hover:border-[#8B92B8]/30"}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8B92B8] uppercase tracking-widest">Career Goal</label>
                    <div className="flex flex-wrap gap-2">
                      {(["Resume Building", "Learning Concepts", "Job Ready", "Freelancing"] as Goal[]).map((g) => (
                        <button
                          key={g}
                          onClick={() => setGoal(g)}
                          className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${goal === g ? "bg-[#6C63FF] border-[#6C63FF] text-white" : "bg-[#12152B] border-[#8B92B8]/10 text-[#8B92B8] hover:border-[#8B92B8]/30"}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8B92B8] uppercase tracking-widest">Preferred Stack</label>
                    <div className="bg-[#12152B] border border-[#8B92B8]/10 rounded-xl px-4 py-3 flex flex-wrap gap-2">
                      {techStack.map(tag => (
                        <span key={tag} className="bg-[#6C63FF]/10 text-[#6C63FF] px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">
                          {tag}
                          <button onClick={() => setTechStack(prev => prev.filter(t => t !== tag))} className="hover:text-white">×</button>
                        </span>
                      ))}
                      <input 
                        type="text" 
                        placeholder="Add tag..." 
                        className="bg-transparent border-none outline-none text-xs text-[#F0F2FF] flex-1 min-w-[60px]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.currentTarget.value) {
                            setTechStack(prev => [...prev, e.currentTarget.value]);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#12152B] rounded-xl border border-[#8B92B8]/5">
                    <div className="flex items-center gap-3">
                      <GraduationCap size={18} className="text-[#6C63FF]" />
                      <span className="text-sm font-medium text-[#F0F2FF]">Include Mentor Support</span>
                    </div>
                    <button 
                      onClick={() => setMentorSupport(!mentorSupport)}
                      className={`w-12 h-6 rounded-full transition-all relative ${mentorSupport ? "bg-[#6C63FF]" : "bg-[#1A1F35] border border-[#8B92B8]/20"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${mentorSupport ? "right-1" : "left-1"}`} />
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateRoadmap}
                  disabled={isLoading}
                  className="w-full py-6 rounded-xl text-lg group relative overflow-hidden"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Generate Project Plan
                    </div>
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#F0F2FF] flex items-center gap-2">
                    <Search size={18} className="text-[#6C63FF]" />
                    Project Analysis
                  </h3>
                  <p className="text-sm text-[#8B92B8]">Paste your GitHub repository link for a comprehensive AI evaluation of your codebase.</p>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8B92B8] uppercase tracking-widest">GitHub Repository</label>
                    <div className="bg-[#12152B] border border-[#8B92B8]/10 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-[#6C63FF] transition-all">
                      <GitBranch size={18} className="text-[#8B92B8]" />
                      <input 
                        type="text" 
                        placeholder="https://github.com/username/repo" 
                        className="bg-transparent border-none text-[#F0F2FF] outline-none w-full text-sm"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-[#8B92B8]/10 rounded-2xl p-8 text-center flex flex-col items-center gap-3 hover:border-[#6C63FF]/30 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-[#6C63FF]/10 rounded-xl flex items-center justify-center text-[#6C63FF]">
                      <Cpu size={24} />
                    </div>
                    <span className="text-sm font-medium text-[#8B92B8]">Or upload project documentation</span>
                  </div>
                </div>

                <Button 
                  onClick={handleReviewProject}
                  disabled={isLoading}
                  className="w-full py-6 rounded-xl text-lg group"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={20} className="animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Search size={20} className="group-hover:scale-110 transition-transform" />
                      Analyze Project
                    </div>
                  )}
                </Button>
              </>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#6C63FF]/20 to-transparent p-6 rounded-2xl border border-[#6C63FF]/20 space-y-3">
             <div className="flex items-center gap-2 text-[#6C63FF]">
               <Sparkles size={18} />
               <h4 className="font-bold">Pro Account Feature</h4>
             </div>
             <p className="text-xs text-[#8B92B8] leading-relaxed">
               Unlock detailed architectural diagrams and direct mentor feedback for your AI-generated roadmaps.
             </p>
             <button className="text-xs font-bold text-white hover:underline flex items-center gap-1">
               Learn more <ChevronRight size={14} />
             </button>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="bg-[#1A1F35] rounded-2xl border border-[#8B92B8]/10 p-12 h-full flex flex-col items-center justify-center space-y-6">
               <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-[#6C63FF]/10 rounded-full" />
                  <div className="absolute inset-0 border-4 border-t-[#6C63FF] rounded-full animate-spin" />
                  <Brain size={40} className="absolute inset-0 m-auto text-[#6C63FF] animate-pulse" />
               </div>
               <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-[#F0F2FF]">AI is Thinking...</h3>
                  <p className="text-sm text-[#8B92B8] animate-pulse">{thinkingMessage || "Synthesizing your career data..."}</p>
               </div>
            </div>
          ) : showOutput ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {activeTab === "roadmap" && roadmapResult ? (
                <div className="space-y-6">
                  {/* Result Card */}
                  <div className="bg-[#1A1F35] p-6 rounded-2xl border border-[#6C63FF]/30 relative overflow-hidden shadow-2xl">
                    <div className="absolute right-0 top-0 bg-[#6C63FF] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">AI Recommended</div>
                    <h2 className="text-2xl font-bold text-[#F0F2FF] mb-2">{roadmapResult.title}</h2>
                    <p className="text-[#8B92B8] text-sm leading-relaxed">{roadmapResult.problem}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#1A1F35] p-5 rounded-xl border border-[#8B92B8]/5 space-y-3">
                      <div className="flex items-center gap-2 text-[#6C63FF]">
                        <Lightbulb size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Strategic Importance</span>
                      </div>
                      <p className="text-sm text-[#F0F2FF] leading-relaxed">{roadmapResult.importance}</p>
                    </div>
                    <div className="bg-[#1A1F35] p-5 rounded-xl border border-[#8B92B8]/5 space-y-3">
                      <div className="flex items-center gap-2 text-[#FBBF24]">
                        <BarChart3 size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Estimated Timeline</span>
                      </div>
                      <p className="text-sm text-[#F0F2FF] font-bold">{roadmapResult.timeline}</p>
                      <div className="h-1.5 bg-[#12152B] rounded-full overflow-hidden"><div className="h-full bg-[#FBBF24]" style={{ width: "70%" }} /></div>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="bg-[#1A1F35] p-5 rounded-xl border border-[#8B92B8]/5">
                    <h3 className="text-xs font-bold text-[#8B92B8] uppercase tracking-widest mb-4">Optimized Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {roadmapResult.techStack.map((tech, i) => (
                        <span key={i} className="bg-[#12152B] border border-[#6C63FF]/20 text-[#6C63FF] px-3 py-1 rounded-lg text-xs font-semibold">{tech}</span>
                      ))}
                    </div>
                  </div>

                  {/* Roadmap Timeline */}
                  <div className="bg-[#1A1F35] p-6 rounded-2xl border border-[#8B92B8]/5 space-y-6">
                    <h3 className="text-lg font-bold text-[#F0F2FF]">Phase-by-Phase Roadmap</h3>
                    <div className="space-y-4 relative">
                      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-[#6C63FF]/20" />
                      {roadmapResult.roadmap.map((step, i) => (
                        <div key={i} className="flex gap-4 items-start relative z-10">
                          <div className="w-8 h-8 rounded-full bg-[#12152B] border border-[#6C63FF]/30 flex items-center justify-center text-xs font-bold text-[#6C63FF] shrink-0">{i + 1}</div>
                          <div className="bg-[#12152B]/50 p-4 rounded-xl flex-1 border border-transparent hover:border-[#6C63FF]/20 transition-all">
                            <p className="text-sm text-[#F0F2FF]">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Career Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#1A1F35] p-5 rounded-xl border border-[#4ADE80]/20 space-y-3">
                      <div className="flex items-center gap-2 text-[#4ADE80]">
                        <Briefcase size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Resume Impact</span>
                      </div>
                      <p className="text-sm italic text-[#8B92B8]">&ldquo;{roadmapResult.resumeValue}&rdquo;</p>
                    </div>
                    <div className="bg-[#1A1F35] p-5 rounded-xl border border-[#6C63FF]/20 space-y-3">
                      <div className="flex items-center gap-2 text-[#6C63FF]">
                        <CheckCircle2 size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Recruiter Insight</span>
                      </div>
                      <p className="text-sm text-[#F0F2FF]">{roadmapResult.recruiterInsight}</p>
                    </div>
                  </div>
                </div>
              ) : reviewResult ? (
                <div className="space-y-6">
                  {/* Score Header */}
                  <div className="bg-[#1A1F35] p-8 rounded-2xl border border-[#8B92B8]/5 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                     <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="58" fill="none" stroke="#12152B" strokeWidth="10" />
                          <circle cx="64" cy="64" r="58" fill="none" stroke="#6C63FF" strokeWidth="10" strokeDasharray="364.4" strokeDashoffset={364.4 * (1 - reviewResult.score/100)} strokeLinecap="round" />
                        </svg>
                        <span className="absolute text-3xl font-bold text-[#F0F2FF]">{reviewResult.score}</span>
                     </div>
                     <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-[#F0F2FF]">Technical Evaluation</h2>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <span className="text-[#8B92B8] text-sm font-medium">Hiring Potential:</span>
                          <span className="bg-[#4ADE80]/10 text-[#4ADE80] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{reviewResult.readiness}</span>
                        </div>
                     </div>
                     <button className="md:ml-auto bg-[#6C63FF]/10 text-[#6C63FF] px-6 py-2.5 rounded-xl text-sm font-bold border border-[#6C63FF]/20 hover:bg-[#6C63FF]/20">
                        Detailed Feedback
                     </button>
                  </div>

                  {/* Feedback Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#1A1F35] p-6 rounded-2xl border border-transparent hover:border-[#4ADE80]/20 transition-all space-y-4">
                      <div className="flex items-center gap-2 text-[#4ADE80]">
                        <CheckCircle2 size={20} />
                        <h3 className="font-bold text-[#F0F2FF]">Strengths</h3>
                      </div>
                      <div className="space-y-2">
                        {reviewResult.strengths.map((s, i) => (
                          <div key={i} className="p-3 bg-[#12152B] border-l-2 border-[#4ADE80] rounded-r-lg text-sm text-[#8B92B8]">{s}</div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#1A1F35] p-6 rounded-2xl border border-transparent hover:border-[#F87171]/20 transition-all space-y-4">
                      <div className="flex items-center gap-2 text-[#F87171]">
                        <XCircle size={20} />
                        <h3 className="font-bold text-[#F0F2FF]">Weaknesses</h3>
                      </div>
                      <div className="space-y-2">
                        {reviewResult.weaknesses.map((w, i) => (
                          <div key={i} className="p-3 bg-[#12152B] border-l-2 border-[#F87171] rounded-r-lg text-sm text-[#8B92B8]">{w}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Resume Section */}
                  <div className="bg-gradient-to-r from-[#6C63FF]/20 to-transparent p-6 rounded-2xl border border-[#6C63FF]/30">
                    <h3 className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest mb-2">Resume Optimization</h3>
                    <p className="text-[#F0F2FF] italic">&ldquo;{reviewResult.resumeFeedback}&rdquo;</p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="bg-[#1A1F35] rounded-2xl border border-dashed border-[#8B92B8]/10 p-12 h-full flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
               <div className="w-16 h-16 bg-[#12152B] rounded-2xl flex items-center justify-center text-[#8B92B8]/30">
                 {activeTab === "roadmap" ? <Rocket size={32} /> : <Search size={32} />}
               </div>
               <div>
                  <h3 className="text-lg font-bold text-[#F0F2FF]">Awaiting Configuration</h3>
                  <p className="text-sm text-[#8B92B8] max-w-xs mx-auto mt-1">
                    Select your preferences and click &quot;Generate&quot; to see your personalized AI career roadmap.
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
