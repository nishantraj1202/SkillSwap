"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ListChecks, TrendingUp, Loader2, AlertCircle, Cpu, ShieldCheck, XCircle } from "lucide-react";

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
    if (!id) {
      return;
    }

    const fetchResult = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/resume/detail/${id}`);
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
      <div className="workspace" style={{ display: "grid", placeItems: "center", minHeight: "400px" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 size={48} className="animate-spin" style={{ color: "var(--primary)", margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Fetching Analysis...</h2>
          <p style={{ color: "var(--text-muted)" }}>We&apos;re gathering the insights from your resume.</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="workspace" style={{ display: "grid", placeItems: "center", minHeight: "400px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <AlertCircle size={48} style={{ color: "var(--danger)", margin: "0 auto 16px" }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>{error || "No analysis ID provided. Please upload your resume first."}</p>
          <a href="/dashboard/resume" className="primary-button">Back to Upload</a>
        </div>
      </div>
    );
  }

  const score = data.score;

  return (
    <div className="workspace">
      <section className="panel module-panel">
        <div className="panel__header">
          <div className="panel__heading">
            <span className="panel__icon">
              <TrendingUp size={18} />
            </span>
            <h2>Resume Analysis Result</h2>
          </div>
          <div className="section-label" style={{ background: "var(--surface-muted)", color: "var(--text-muted)" }}>
            File: {data.originalName}
          </div>
        </div>

        <div className="result-hero">
          <div className="score-card">
            <span className="section-label">Resume Score</span>
            <div className="score-card__value">{score}</div>
            <p className="score-card__unit">out of 100</p>
          </div>

          <div className="result-summary">
            <h3>{score >= 80 ? "High potential with a few high-impact fixes." : score >= 60 ? "Solid foundation with room for growth." : "Potential identified, needs structural refinement."}</h3>
            <p>
              Your resume has been analyzed by our AI career engine. We&apos;ve detected key skills and identified specific areas where you can improve your impact.
            </p>
            <div className="score-progress">
              <div className="score-progress__bar">
                <div className="score-progress__fill" style={{ width: `${score}%`, background: score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--danger)" }} />
              </div>
              <span className="score-progress__label">{score}% match strength</span>
            </div>
            
            <div className="metric-highlight-grid" style={{ marginTop: "24px" }}>
              <article className="metric-highlight-card">
                <span className="section-label">Skills Detected</span>
                <strong>{data.skills.length}</strong>
              </article>
              <article className="metric-highlight-card">
                <span className="section-label">Action Items</span>
                <strong>{data.suggestions.length}</strong>
              </article>
            </div>
          </div>
        </div>
      </section>

      <div className="student-sections-grid">
        <section className="panel module-panel">
          <div className="panel__heading">
            <span className="panel__icon">
              <ShieldCheck size={18} />
            </span>
            <h2>Strengths</h2>
          </div>
          <div className="insight-list">
            {data.strengths.map((item, idx) => (
              <article className="insight-card" key={idx} style={{ borderLeft: "4px solid var(--success)" }}>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel module-panel">
          <div className="panel__heading">
            <span className="panel__icon">
              <XCircle size={18} />
            </span>
            <h2>Weaknesses</h2>
          </div>
          <div className="insight-list">
            {data.weaknesses.map((item, idx) => (
              <article className="insight-card" key={idx} style={{ borderLeft: "4px solid var(--danger)" }}>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel module-panel">
          <div className="panel__heading">
            <span className="panel__icon">
              <ListChecks size={18} />
            </span>
            <h2>Actionable Suggestions</h2>
          </div>
          <div className="insight-list">
            {data.suggestions.map((item, idx) => (
              <article className="insight-card" key={idx} style={{ borderLeft: "4px solid var(--primary)" }}>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel module-panel">
          <div className="panel__heading">
            <span className="panel__icon">
              <Cpu size={18} />
            </span>
            <h2>Skills Highlighted</h2>
          </div>
          <div className="skill-pills-container" style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "16px" }}>
            {data.skills.map((skill, idx) => (
              <span 
                key={idx} 
                style={{ 
                  background: "var(--primary-soft)", 
                  color: "var(--primary)", 
                  padding: "6px 12px", 
                  borderRadius: "999px", 
                  fontSize: "0.85rem", 
                  fontWeight: 600,
                  border: "1px solid var(--line)"
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ResumeResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent />
    </Suspense>
  );
}
