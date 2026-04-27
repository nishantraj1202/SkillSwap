import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { projects } from "@/data/workshare-data";

export default function ProjectListPage() {
  return (
    <div className="workspace">
      <section className="panel module-panel">
        <div className="panel__header">
          <div className="panel__heading">
            <span className="panel__icon">
              <BriefcaseBusiness size={18} />
            </span>
            <h2>Project List</h2>
          </div>
          <Link className="text-link" href="/dashboard/projects/status">
            Application status <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="card-grid">
          {projects.map((project) => (
            <article className="module-card" key={project.slug}>
              <div className="module-card__top">
                <span className="badge">{project.category}</span>
                <span className="module-card__meta">{project.deadline}</span>
              </div>
              <h3>{project.title}</h3>
              <p className="muted-text">Mentor: {project.mentor}</p>
              <div className="module-card__actions">
                <Link className="ghost-button module-link-button" href={`/dashboard/projects/${project.slug}`}>
                  View Details
                </Link>
                <button className="primary-button" type="button">
                  Apply
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
