"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", icon: "DB", href: "/dashboard" },
  { label: "Resume", icon: "CV", href: "/dashboard/resume" },
  { label: "Projects", icon: "PR", href: "/dashboard/projects" },
  { label: "Interviews", icon: "IN", href: "/dashboard/interviews" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar__brand">
          <div className="sidebar__brand-mark">WS</div>
          <div className="sidebar__brand-copy">
            <span className="sidebar__eyebrow">Professional Network</span>
            <span className="sidebar__title">WorkShare</span>
          </div>
        </div>

        <nav className="sidebar__nav" aria-label="Primary">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                className={`nav-item${isActive ? " nav-item--active" : ""}`}
                href={item.href}
              >
                <span className="nav-item__icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar__footer">
        <p className="section-label">Premium Insight</p>
        <h3 className="sidebar__footer-title">Your profile is trending this week.</h3>
        <p className="sidebar__footer-text">
          Recruiter views are up 24% and your top project was shortlisted by three hiring teams.
        </p>
        <button className="sidebar__footer-action" type="button">
          Review Opportunities
        </button>
      </div>
    </aside>
  );
}
