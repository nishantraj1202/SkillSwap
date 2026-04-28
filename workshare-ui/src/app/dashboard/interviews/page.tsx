import { AlertTriangle, Clock3 } from "lucide-react";

export default function MockInterviewPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#0D0F1A]">
      <section className="rounded-[12px] border border-[#FBBF24]/30 bg-[#1A1F35] p-6 shadow-xl shadow-black/20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FBBF24]/10 text-[#FBBF24]">
            <AlertTriangle size={24} />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#F0F2FF]">Interviews</h1>
              <span className="rounded-[8px] bg-[#FBBF24]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#FBBF24]">
                Coming Soon
              </span>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-[#8B92B8]">
              This feature will be implemented soon.
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-[#8B92B8]">
              <Clock3 size={16} className="text-[#6C63FF]" />
              We are preparing mock interviews, results, and feedback tools for a future update.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
