import Link from "next/link";

export default function Home() {
  return (
    <section className="relative min-h-[86vh] flex flex-col justify-center overflow-hidden">

      <div className="orb absolute w-96 h-96 -top-24 -right-24 opacity-40"
        style={{ background: "var(--accent)" }} />
      <div className="orb absolute w-72 h-72 -bottom-16 -left-16 opacity-20"
        style={{ background: "var(--accent2)", animationDelay: "2.5s" }} />

      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(rgba(45,212,191,0.12) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      <div className="relative z-10 max-w-3xl">

        <div className="anim-slide-r delay-1 flex items-center gap-3 mb-6">
          <span className="w-6 h-px" style={{ background: "var(--accent)" }} />
          <span className="font-mono text-xs tracking-widest uppercase"
            style={{ color: "var(--accent)" }}>
            Web Developer · Open to opportunities
          </span>
        </div>

        <h1 className="anim-fade-up delay-2 font-display leading-tight mb-6"
          style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", lineHeight: 1 }}>
          Hi, I&apos;m{" "}
          <span style={{ color: "var(--accent)" }}>Franz</span>
          <span className="cursor-blink" />
          <br />
          <span style={{ color: "var(--muted)" }}>I build things</span>
          <br />
          for the web.
        </h1>

        <p className="anim-fade-up delay-3 text-lg leading-relaxed mb-10 max-w-xl"
          style={{ color: "var(--muted)" }}>
          Web Developer at{" "}
          <span style={{ color: "var(--text)" }}>Caball Tech Corp</span> building
          real products for startups. CS graduate specializing in{" "}
          <span style={{ color: "var(--text)" }}>React</span>,{" "}
          <span style={{ color: "var(--text)" }}>Next.js</span>,{" "}
          <span style={{ color: "var(--text)" }}>PHP</span>, and{" "}
          <span style={{ color: "var(--text)" }}>full-stack development</span>.
        </p>

        <div className="anim-fade-up delay-4 flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity duration-200 hover:opacity-80"
            style={{ background: "var(--accent)", color: "#080c10" }}
          >
            View Projects →
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            About Me
          </Link>
          {/* Place resume.pdf in public/ — serves at /resume.pdf */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2"
            style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            Resume ↓
          </a>
        </div>

        <div className="anim-fade-up delay-5 mt-16 pt-10 flex flex-wrap gap-10"
          style={{ borderTop: "1px solid var(--border)" }}>
          {[
            { val: "1+",  label: "Year experience" },
            { val: "11+",  label: "Projects built" },
            { val: "Computer Science",  label: "Graduate" },
          ].map(({ val, label }) => (
            <div key={label}>
              <div className="font-display text-3xl" style={{ color: "var(--text)" }}>{val}</div>
              <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>{label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}