import { Award, Lightbulb, MessageSquareQuote } from "lucide-react";
import { interviewFeedback, interviewSuggestions } from "@/data/workshare-data";

const score = 84;

export default function InterviewResultPage() {
  return (
    <div className="workspace interview-workspace">
      <section className="panel module-panel">
        <div className="result-hero result-hero--compact">
          <div className="score-card score-card--performance">
            <span className="section-label">Interview Score</span>
            <div className="score-card__value">{score}</div>
            <p className="score-card__unit">performance score</p>
          </div>

          <div className="result-summary">
            <div className="panel__heading">
              <span className="panel__icon">
                <Award size={18} />
              </span>
              <h2>Result Overview</h2>
            </div>
            <p>
              You came across as thoughtful and technically sound. The next jump in performance is mostly about sharper structure and more explicit tradeoff communication.
            </p>
            <div className="score-progress">
              <div className="score-progress__bar">
                <div className="score-progress__fill score-progress__fill--gold" style={{ width: `${score}%` }} />
              </div>
              <span className="score-progress__label">Overall performance: {score}%</span>
            </div>
          </div>
        </div>
      </section>

      <div className="student-sections-grid">
        <section className="panel module-panel">
          <div className="panel__heading">
            <span className="panel__icon">
              <MessageSquareQuote size={18} />
            </span>
            <h2>Feedback</h2>
          </div>
          <div className="insight-list">
            {interviewFeedback.map((item) => (
              <article className="insight-card" key={item}>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel module-panel">
          <div className="panel__heading">
            <span className="panel__icon">
              <Lightbulb size={18} />
            </span>
            <h2>Suggestions</h2>
          </div>
          <div className="insight-list">
            {interviewSuggestions.map((item) => (
              <article className="insight-card" key={item}>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
