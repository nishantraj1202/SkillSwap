"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarClock,
  FileText,
  GraduationCap,
  MessageSquareMore,
  Sparkles,
  Upload,
  UserCheck,
} from "lucide-react";

const stats = [
  {
    label: "Resume Score",
    value: "88%",
    detail: "Stronger than last review",
    icon: FileText,
  },
  {
    label: "Applied Projects",
    value: "14",
    detail: "3 awaiting mentor feedback",
    icon: BriefcaseBusiness,
  },
  {
    label: "Interviews Taken",
    value: "6",
    detail: "2 with top-tier recruiters",
    icon: UserCheck,
  },
  {
    label: "Upcoming Sessions",
    value: "4",
    detail: "Next session starts tomorrow",
    icon: CalendarClock,
  },
];

const recentProjects = [
  {
    title: "Campus Connect Portal",
    desc: "Frontend build with React, mentor-reviewed and waiting for final application.",
    meta: "UI Engineering",
    status: "Open",
  },
  {
    title: "AI Resume Analyzer",
    desc: "Resume parsing and score visualization project with 2 teammates.",
    meta: "Applied 2 days ago",
    status: "In Review",
  },
  {
    title: "Skill Swap Community",
    desc: "Full-stack collaboration opportunity focused on dashboards and mentoring flows.",
    meta: "Closing soon",
    status: "Suggested",
  },
];

const interviewResults = [
  {
    company: "Nimbus Labs",
    role: "Frontend Developer Intern",
    status: "Passed",
    statusClass: "badge--success",
    date: "April 24, 2026",
  },
  {
    company: "CodeHarbor",
    role: "UI Engineer",
    status: "Next Round",
    statusClass: "badge--warning",
    date: "April 29, 2026",
  },
  {
    company: "BrightPath",
    role: "Product Analyst",
    status: "Feedback Sent",
    statusClass: "",
    date: "April 21, 2026",
  },
];

const mentorshipSessions = [
  {
    name: "Priya Sharma",
    topic: "System Design Mock Interview",
    time: "Tomorrow, 6:30 PM",
  },
  {
    name: "Rahul Verma",
    topic: "Portfolio review and resume refinement",
    time: "April 30, 2026",
  },
  {
    name: "Anita Desai",
    topic: "Behavioral prep for recruiter round",
    time: "May 3, 2026",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <div className="workspace">
      <section className="hero-card">
        <div className="hero-card__content">
          <p className="section-label" style={{ color: "rgba(255,255,255,0.68)" }}>
            Student dashboard
          </p>
          <h1>Welcome back, {firstName}.</h1>
          <p>
            Keep your resume sharp, stay active in project applications, and move smoothly between mentorship and interview prep.
          </p>
          <div className="hero-card__actions">
            <Link href="/dashboard/resume" className="primary-button">
              <Upload size={16} />
              Upload Resume
            </Link>
            <Link href="/dashboard/projects" className="ghost-button">
              <ArrowUpRight size={16} />
              Apply Project
            </Link>
          </div>
        </div>
      </section>

      <div className="metrics-grid">
        {stats.map(({ label, value, detail, icon: Icon }) => (
          <article className="metric-card metric-card--student" key={label}>
            <div className="metric-card__top">
              <span className="section-label">{label}</span>
              <span className="metric-card__icon">
                <Icon size={18} />
              </span>
            </div>
            <div className="metric-card__value">{value}</div>
            <span className="metric-card__delta">{detail}</span>
          </article>
        ))}
      </div>

      <div className="student-sections-grid">
        <section className="panel student-panel">
          <div className="panel__header">
            <div className="panel__heading">
              <span className="panel__icon">
                <BriefcaseBusiness size={18} />
              </span>
              <h2>Recent Projects</h2>
            </div>
            <a className="text-link" href="#">
              View all <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="student-card-list">
            {recentProjects.map(({ title, desc, meta, status }) => (
              <article className="student-info-card" key={title}>
                <div className="student-info-card__top">
                  <div>
                    <span className="student-info-card__title">{title}</span>
                    <p className="muted-text">{desc}</p>
                  </div>
                  <span className="badge badge--warning">{status}</span>
                </div>
                <span className="student-info-card__meta">{meta}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel student-panel">
          <div className="panel__header">
            <div className="panel__heading">
              <span className="panel__icon">
                <Sparkles size={18} />
              </span>
              <h2>Interview Results</h2>
            </div>
            <a className="text-link" href="#">
              See all <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="student-card-list">
            {interviewResults.map(({ company, role, status, statusClass, date }) => (
              <article className="student-info-card" key={company}>
                <div className="student-info-card__top">
                  <div>
                    <span className="student-info-card__title">{company}</span>
                    <p className="muted-text">{role}</p>
                  </div>
                  <span className={`badge ${statusClass}`.trim()}>{status}</span>
                </div>
                <span className="student-info-card__meta">{date}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel student-panel">
          <div className="panel__header">
            <div className="panel__heading">
              <span className="panel__icon">
                <GraduationCap size={18} />
              </span>
              <h2>Mentorship Sessions</h2>
            </div>
            <a className="text-link" href="#">
              Manage <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="student-card-list">
            {mentorshipSessions.map(({ name, topic, time }) => (
              <article className="student-info-card" key={name}>
                <div className="student-info-card__top">
                  <div>
                    <span className="student-info-card__title">{name}</span>
                    <p className="muted-text">{topic}</p>
                  </div>
                  <span className="badge">
                    <MessageSquareMore size={14} />
                    Session
                  </span>
                </div>
                <span className="student-info-card__meta">{time}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
