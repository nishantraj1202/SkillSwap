import {
  BriefcaseBusiness,
  FileText,
  MessageCircleMore,
  Target,
  UserRound,
  Users,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: FileText,
    title: "Resume AI Analysis",
    description: "Deep-scan your resume against industry benchmarks to uncover high-impact action items.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Project Applications",
    description: "Skip the generic applications. Connect directly to real-world projects and build a verifiable portfolio.",
  },
  {
    icon: UserRound,
    title: "Mentorship Ecosystem",
    description: "Gain exclusive access to industry leaders ready to guide your trajectory.",
  },
];

export default function Home() {
  return (
    <main className="landing-page nocturne-theme">
      {/* Ambient Background Glows */}
      <div className="ambient-glow ambient-glow--top-left"></div>
      <div className="ambient-glow ambient-glow--bottom-right"></div>

      <header className="landing-nav glassmorphic-nav">
        <div className="landing-container landing-nav__inner">
          <a className="brand" href="#home">
            <span className="brand__text nocturne-brand">WorkShare</span>
          </a>

          <nav className="landing-nav__links" aria-label="Primary">
            <a href="#home">Home</a>
            <a href="#features">Ecosystem</a>
            <a href="#about">About</a>
          </nav>

          <div className="landing-nav__actions">
            <Link className="landing-link-button" href="/login">
              Login
            </Link>
            <Link className="nocturne-btn nocturne-btn--primary" href="/signup">
              Join the Network
            </Link>
          </div>
        </div>
      </header>

      <section className="hero nocturne-hero" id="home">
        <div className="landing-container">
          <div className="hero__copy nocturne-hero__copy">
            <span className="hero__eyebrow nocturne-eyebrow">The Future of Talent</span>
            <h1 className="nocturne-display">Bridge the gap between ambition & career.</h1>
            <p className="nocturne-subtitle">
              A state-of-the-art ecosystem connecting driven students, visionary mentors, and top-tier recruiters.
            </p>
            <div className="hero__actions nocturne-hero__actions">
              <Link className="nocturne-btn nocturne-btn--primary nocturne-btn--large" href="/signup">
                Get Started <ArrowRight size={18} />
              </Link>
              <a className="nocturne-btn nocturne-btn--glass nocturne-btn--large" href="#features">
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section nocturne-features" id="features">
        <div className="landing-container">
          <div className="feature-grid nocturne-feature-grid">
            {features.map(({ icon: Icon, title, description }, idx) => (
              <article 
                className={`nocturne-card feature-card ${idx === 1 ? 'nocturne-card--elevated' : ''}`} 
                key={title}
              >
                <div className="nocturne-card__icon">
                  <Icon size={32} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band nocturne-cta" id="cta">
        <div className="landing-container cta-band__inner nocturne-cta__inner">
          <h2 className="nocturne-headline">Ready to accelerate your trajectory?</h2>
          <p>Join thousands of users building their professional future on WorkShare.</p>
          <Link className="nocturne-btn nocturne-btn--primary nocturne-btn--large mt-6" href="/signup">
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="landing-footer nocturne-footer" id="contact">
        <div className="landing-container landing-footer__inner">
          <p className="landing-footer__copy">WorkShare © 2026. Designed with Stitch.</p>
          <div className="landing-footer__links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#home">Privacy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
