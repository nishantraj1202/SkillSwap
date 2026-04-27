import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, UserRound } from "lucide-react";
import { projects } from "@/data/workshare-data";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="workspace">
      <Link className="text-link" href="/dashboard/projects">
        <ArrowLeft size={14} /> Back to projects
      </Link>

      <section className="panel module-panel">
        <div className="module-detail-grid">
          <div className="module-detail-main">
            <span className="badge">{project.category}</span>
            <h1 className="module-page-title">{project.title}</h1>
            <p className="module-page-copy">{project.description}</p>

            <div className="detail-block">
              <div className="panel__heading">
                <span className="panel__icon">
                  <BriefcaseBusiness size={18} />
                </span>
                <h2>Description</h2>
              </div>
              <p className="module-page-copy">
                This project is designed to simulate a polished product workflow with mentor reviews, iterative delivery, and portfolio-ready outcomes for student candidates.
              </p>
            </div>
          </div>

          <aside className="detail-side-card">
            <div className="panel__heading">
              <span className="panel__icon">
                <UserRound size={18} />
              </span>
              <h2>Mentor Info</h2>
            </div>
            <strong>{project.mentor}</strong>
            <p className="muted-text">{project.mentorRole}</p>
            <p className="module-page-copy">{project.mentorBio}</p>
            <div className="detail-side-card__meta">
              <span>Deadline</span>
              <strong>{project.deadline}</strong>
            </div>
            <button className="primary-button detail-side-card__button" type="button">
              Apply
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
}
