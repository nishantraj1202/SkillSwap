"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, Search } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  /* derive initials from the user's name */
  const initials = user
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "WS";

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <div className="navbar__brand-mark">W</div>
        <div className="navbar__brand-copy">
          <span className="navbar__eyebrow">Talent Network</span>
          <span className="navbar__title">WorkShare Control Center</span>
        </div>
      </div>

      <div className="navbar__actions">
        <label className="search-pill" aria-label="Search WorkShare">
          <Search size={16} style={{ flexShrink: 0 }} />
          <input type="text" placeholder="Roles, proposals, mentors..." />
        </label>

        <div className="profile-chip">
          <div className="avatar">{initials}</div>
          <div className="profile-chip__meta">
            <span className="profile-chip__name">
              {user?.name || "Guest"}
            </span>
            <span className="profile-chip__role">
              {user?.role || "Not signed in"}
            </span>
          </div>
        </div>

        <button className="ghost-button" type="button" onClick={logout}>
          <LogOut size={16} style={{ marginRight: 6, verticalAlign: "-2px" }} />
          Logout
        </button>
      </div>
    </header>
  );
}
