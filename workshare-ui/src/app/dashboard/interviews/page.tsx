import Link from "next/link";
import { ArrowUpRight, Mic, Sparkles } from "lucide-react";

export default function MockInterviewPage() {
  return (
    <div className="workspace interview-workspace">
      <section className="panel module-panel interview-panel">
        <div className="interview-focus">
          <span className="interview-focus__icon">
            <Mic size={28} />
          </span>
          <span className="eyebrow-chip">Interview module</span>
          <h1 className="module-page-title">Mock Interview</h1>
          <p className="module-page-copy">
            Start a focused practice round, simulate recruiter-style questions, and review performance with score-based feedback.
          </p>
          <div className="module-card__actions module-card__actions--center">
            <button className="primary-button interview-start-button" type="button">
              <Sparkles size={16} />
              Start Interview
            </button>
            <Link className="ghost-button module-link-button" href="/dashboard/interviews/result">
              View Result
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
