import Link from "next/link";
import {
  ArrowRight,
  CirclePlay,
  Sparkles,
} from "lucide-react";

const sidebarItems = [
  "Dashboard",
  "Projects",
  "AI Resume",
  "Interview Prep",
  "Mentors",
  "Learning",
  "Jobs",
  "Messages",
  "Settings",
];

const recentProjects = [
  ["AI Resume Builder", "92%"],
  ["E-commerce Dashboard", "88%"],
  ["Smart Expense Tracker", "85%"],
  ["Career Path Predictor", "80%"],
];

const practiceStats = [
  ["Cleared", "32 (47%)"],
  ["Average", "22 (32%)"],
  ["Needs Work", "14 (21%)"],
];

export default function Home() {
  return (
    <main className="ws-exact-home ws-bg-hero relative min-h-screen overflow-hidden text-white">
      <div className="ws-grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="ws-primary-glow absolute -left-40 top-20 h-96 w-96 rounded-full blur-3xl" />
      <div className="ws-accent-glow absolute -right-40 bottom-0 h-96 w-96 rounded-full blur-3xl" />

      <header className="relative z-20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link className="flex items-center gap-2" href="/">
            <div className="ws-bg-gradient-primary ws-shadow-glow flex h-9 w-9 items-center justify-center rounded-lg">
              <span className="text-lg font-black text-white">W</span>
            </div>
            <span className="text-xl font-bold tracking-tight">WorkShare</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              className="hidden h-10 items-center rounded-md px-4 text-sm font-medium transition hover:bg-white/10 sm:inline-flex"
              href="/login"
            >
              Sign In
            </Link>
            <Link
              className="ws-bg-gradient-primary ws-shadow-glow flex h-10 items-center rounded-md px-5 text-sm font-semibold text-white transition hover:opacity-90"
              href="/signup"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <section className="relative mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="ws-card-translucent ws-border-soft inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur">
            <Sparkles className="ws-text-accent h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Employability Platform</span>
          </div>

          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Bridge the gap
            <br />
            between skills &amp;
            <br />
            <span className="ws-text-gradient">real-world careers</span>
          </h1>

          <p className="ws-muted-text mt-6 max-w-lg text-lg">
            WorkShare uses AI to help students build in-demand skills, work on
            real projects, get expert mentorship, and land dream careers.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              className="ws-bg-gradient-primary ws-shadow-glow group inline-flex h-14 items-center gap-2 rounded-xl px-8 text-base font-semibold text-white transition hover:opacity-90"
              href="/signup"
            >
              Get Started
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>
            <a
              className="ws-card-soft ws-border-soft inline-flex h-14 items-center gap-2 rounded-xl border px-8 text-base font-medium backdrop-blur transition hover:bg-white/10"
              href="#features"
            >
              <CirclePlay className="h-5 w-5" />
              Explore Features
            </a>
          </div>




        </div>

        <div className="relative flex items-center justify-center">
          <div className="ws-dashboard-glow absolute inset-0 rounded-[2rem] blur-2xl" />
          <div className="ws-card-solid ws-shadow-card ws-border-soft relative grid w-full grid-cols-[180px_1fr] overflow-hidden rounded-2xl border max-[720px]:grid-cols-1">
            <aside className="ws-sidebar-bg ws-border-soft border-r p-4 max-[720px]:border-b max-[720px]:border-r-0">
              <div className="mb-6 flex items-center gap-2">
                <div className="ws-bg-gradient-primary h-7 w-7 rounded-md" />
                <span className="text-sm font-bold">WorkShare</span>
              </div>

              <nav className="ws-muted-text space-y-1 text-xs">
                {sidebarItems.map((item, index) => (
                  <div
                    className={`rounded-md px-3 py-2 ${
                      index === 0 ? "ws-active-nav font-medium text-white" : ""
                    }`}
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </nav>
            </aside>

            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">
                    <span aria-hidden="true">{"\u{1F44B}"}</span> Hey, Arjun
                  </div>
                  <div className="ws-muted-text text-[10px]">
                    Track your progress and unlock new opportunities.
                  </div>
                </div>
              </div>

              <div className="mb-3 grid grid-cols-3 gap-2 max-[520px]:grid-cols-1">
                <div className="ws-panel-box rounded-lg border p-3">
                  <div className="ws-muted-text text-[10px]">AI Resume Score</div>
                  <div className="ws-text-gradient mt-1 text-2xl font-bold">85</div>
                  <div className="ws-muted-text text-[9px]">/100</div>
                </div>
                <div className="ws-panel-box rounded-lg border p-3">
                  <div className="ws-muted-text text-[10px]">Projects Completed</div>
                  <div className="mt-1 text-2xl font-bold">12</div>
                  <div className="text-[9px] text-green-400">{"\u2191"} 20%</div>
                </div>
                <div className="ws-panel-box rounded-lg border p-3">
                  <div className="ws-muted-text text-[10px]">Interview Score</div>
                  <div className="mt-1 text-2xl font-bold">78%</div>
                  <div className="text-[9px] text-green-400">{"\u2191"} 15%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 max-[520px]:grid-cols-1">
                <div className="ws-panel-box rounded-lg border p-3" id="projects">
                  <div className="mb-2 text-[10px] font-semibold">Recent Projects</div>
                  <div className="space-y-1.5 text-[10px]">
                    {recentProjects.map(([name, score]) => (
                      <div className="flex justify-between gap-3" key={name}>
                        <span>{name}</span>
                        <span className="ws-text-accent">{score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ws-panel-box rounded-lg border p-3" id="mentors">
                  <div className="mb-2 text-[10px] font-semibold">Interview Practice</div>
                  <div className="my-2 text-center">
                    <div className="text-2xl font-bold">68</div>
                    <div className="ws-muted-text text-[9px]">Total Interviews</div>
                  </div>
                  <div className="ws-muted-text space-y-1 text-[9px]">
                    {practiceStats.map(([label, value]) => (
                      <div className="flex justify-between gap-3" key={label}>
                        <span>{"\u25CF"} {label}</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}
