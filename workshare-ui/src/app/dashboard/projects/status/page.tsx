import { BadgeCheck, CircleDashed, CircleX } from "lucide-react";
import { projects } from "@/data/workshare-data";

const statusConfig = {
  Pending: { icon: CircleDashed, className: "badge--warning" },
  Accepted: { icon: BadgeCheck, className: "badge--success" },
  Rejected: { icon: CircleX, className: "badge--danger" },
} as const;

export default function ApplicationStatusPage() {
  return (
    <div className="workspace">
      <section className="panel module-panel">
        <div className="panel__header">
          <div className="panel__heading">
            <span className="panel__icon">
              <BadgeCheck size={18} />
            </span>
            <h2>Application Status</h2>
          </div>
        </div>

        <div className="card-grid">
          {projects.map((project) => {
            const config = statusConfig[project.status as keyof typeof statusConfig];
            const Icon = config.icon;

            return (
              <article className="module-card" key={project.slug}>
                <div className="module-card__top">
                  <span className="section-label">{project.title}</span>
                  <span className={`badge ${config.className}`}>
                    <Icon size={14} />
                    {project.status}
                  </span>
                </div>
                <p className="muted-text">Mentor: {project.mentor}</p>
                <p className="module-card__meta">Deadline: {project.deadline}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
