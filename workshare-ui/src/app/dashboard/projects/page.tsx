"use client";

import Link from "next/link";
import { ArrowUpRight, Calendar, Filter, Search, User } from "lucide-react";
import { projects } from "@/data/workshare-data";
import { useToast } from "@/context/ToastContext";

export default function ProjectListPage() {
  const { showToast } = useToast();

  const handleApply = (title: string) => {
    showToast(`Application submitted for ${title}!`, "success");
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0D0F1A]">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#F0F2FF]">Available Projects</h2>
          <p className="text-[#8B92B8] text-sm">Find and apply to real-world projects from top companies</p>
        </div>
        <Link
          className="bg-[#6C63FF]/10 text-[#6C63FF] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#6C63FF]/20 transition-all"
          href="/dashboard/projects/status"
        >
          Application status <ArrowUpRight size={16} />
        </Link>
      </header>

      <div className="flex gap-4">
        <div className="flex-1 bg-[#1A1F35] rounded-xl px-4 py-2.5 flex items-center gap-3 border border-[#8B92B8]/5">
          <Search size={18} className="text-[#8B92B8]" />
          <input
            type="text"
            placeholder="Search projects by title, technology, or company..."
            className="bg-transparent border-none text-[#F0F2FF] outline-none w-full text-sm placeholder:text-[#8B92B8]/40"
          />
        </div>
        <button className="bg-[#1A1F35] border border-[#8B92B8]/5 p-2.5 rounded-xl text-[#8B92B8] hover:text-[#F0F2FF] transition-all">
          <Filter size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="bg-[#1A1F35] rounded-2xl border border-[#8B92B8]/5 p-6 flex flex-col transition-all hover:border-[#6C63FF]/30 hover:translate-y-[-4px] group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-[#6C63FF]/10 text-[#6C63FF] text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full">
                {project.category}
              </span>
              <div className="flex items-center gap-1.5 text-[#8B92B8] text-xs">
                <Calendar size={12} />
                <span>{project.deadline}</span>
              </div>
            </div>

            <h3 className="text-[#F0F2FF] font-bold text-lg mb-2 group-hover:text-[#6C63FF] transition-colors line-clamp-1">
              {project.title}
            </h3>

            <div className="flex items-center gap-2 text-[#8B92B8] text-sm mb-6">
              <User size={14} className="text-[#6C63FF]" />
              <span>
                Mentor: <span className="text-[#F0F2FF]">{project.mentor}</span>
              </span>
            </div>

            <div className="mt-auto pt-4 border-t border-[#8B92B8]/5 flex items-center justify-between gap-3">
              <Link
                className="text-[#8B92B8] hover:text-[#F0F2FF] text-sm font-medium transition-colors"
                href={`/dashboard/projects/${project.slug}`}
              >
                View Details
              </Link>
              <button
                className="bg-[#6C63FF] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#6C63FF]/20 hover:opacity-90 transition-all"
                type="button"
                onClick={() => handleApply(project.title)}
              >
                Apply Now
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
