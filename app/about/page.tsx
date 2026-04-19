import Link from "next/link";
import Image from "next/image";

const skills = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    category: "Backend",
    items: ["PHP", "Laravel", "MySQL", "Node.js", "REST APIs", "Prisma"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "VS Code", "Figma", "Postman", "XAMPP", "Canva"],
  },
];

const experience = [
  {
    role:     "Web Developer",
    company:  "Caball Tech Corp (Startup)",
    location: "Biñan, Laguna, Philippines",
    period:   "Aug 2025 – Present",
    points: [
      "Designed and developed the company landing page using HTML, CSS, JavaScript, Tailwind CSS, and React.",
      "Built the admin dashboard with PHP, MySQL, and React — enabling secure content management and role-based access.",
      "Collaborated in a 4-person team (Android Dev, iOS Dev, UI/UX Designer) on web vs. native app strategy.",
      "Transitioned from UI/UX Designer to Web Developer, applying Figma prototypes directly into functional code.",
    ],
  },
];

const timeline = [
  {
    year:  "2025",
    title: "Web Developer — Caball Tech Corp",
    desc:  "Building real products for a startup — landing page, admin dashboard, and more.",
  },
  {
    year:  "2023",
    title: "CS Graduate",
    desc:  "Completed Bachelor of Science in Computer Science at Cavite State University.",
  },
  {
    year:  "2022",
    title: "Capstone — Full-Stack E-Commerce",
    desc:  "Built a complete e-commerce platform with React, PHP, and MySQL as capstone project.",
  },
  {
    year:  "2021",
    title: "Started Web Development",
    desc:  "Learned HTML, CSS, JavaScript — fell in love with building things for the web.",
  },
];

export default function About() {
  return (
    <section className="py-16 space-y-20">

      {/* ── Header — bio + photo ── */}
      <div className="anim-fade-up delay-1">
        <div className="flex flex-col lg:flex-row gap-12 items-center">

          {/* Left: text */}
          <div className="flex-1">
            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--accent)" }}>
              Who I am
            </span>
            <h1 className="font-display mt-3 mb-5" style={{ fontSize: "clamp(2.5rem,5vw,4rem)", lineHeight: 1.1 }}>
              About Me
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl" style={{ color: "var(--muted)" }}>
              I&apos;m a Computer Science graduate and Web Developer at{" "}
              <span style={{ color: "var(--text)" }}>Caball Tech Corp</span>,
              a startup in Biñan, Laguna. I build landing pages, admin dashboards,
              and full-stack web applications. I care about writing clean, maintainable
              code and creating interfaces that feel great to use.
            </p>

            {/* Info pills */}
            <div className="flex flex-wrap gap-3 mt-6">
              {[
                { icon: "📍", text: "Biñan, Laguna, Philippines" },
                { icon: "🎓", text: "CS Graduate — Cavite State University" },
                { icon: "💼", text: "Web Dev at Caball Tech Corp" },
                { icon: "✅", text: "Open to opportunities" },
              ].map(({ icon, text }) => (
                <span
                  key={text}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}
                >
                  {icon} {text}
                </span>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity duration-200 hover:opacity-80 inline-flex items-center gap-2"
                style={{ background: "var(--accent)", color: "#080c10" }}
              >
                Download Resume ↓
              </a>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
              >
                Contact Me
              </Link>
            </div>
          </div>

          <div className="shrink-0 flex justify-center">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full opacity-25"
                style={{ background: "var(--accent)", filter: "blur(50px)", transform: "scale(0.9)" }}
              />
              <Image
                src="/franz.png"
                alt="Franz Jerome Verano"
                width={260}
                height={260}
                className="relative rounded-full object-cover object-top"
                style={{ width: "260px", height: "260px", border: "3px solid var(--border)" }}
                priority
              />
            </div>
          </div>

        </div>
      </div>

      <div className="anim-fade-up delay-2">
        <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
          <span className="w-5 h-px" style={{ background: "var(--accent)" }} />
          Skills & Tools
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {skills.map(({ category, items }) => (
            <div key={category} className="p-5 rounded-2xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="font-mono text-xs tracking-widest uppercase mb-4"
                style={{ color: "var(--accent)" }}>
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span key={skill}
                    className="px-3 py-1.5 rounded-lg text-sm"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--muted)" }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="anim-fade-up delay-3">
        <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
          <span className="w-5 h-px" style={{ background: "var(--accent)" }} />
          Work Experience
        </h2>
        <div className="space-y-6">
          {experience.map(({ role, company, location, period, points }) => (
            <div key={role + company} className="p-6 rounded-2xl"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                <h3 className="font-bold text-lg">{role}</h3>
                <span className="font-mono text-xs px-3 py-1 rounded-full"
                  style={{ background: "rgba(45,212,191,0.08)", color: "var(--accent)", border: "1px solid rgba(45,212,191,0.2)" }}>
                  {period}
                </span>
              </div>
              <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
                {company} · {location}
              </p>
              <ul className="space-y-2">
                {points.map((point, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "var(--accent)" }} />
                    {point}
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>
      </div>

      <div className="anim-fade-up delay-4">
        <h2 className="text-2xl font-semibold mb-10 flex items-center gap-3">
          <span className="w-5 h-px" style={{ background: "var(--accent)" }} />
          Journey
        </h2>
        <div className="space-y-0">
          {timeline.map(({ year, title, desc }, i) => (
            <div key={year + title} className="relative pl-8 pb-10 last:pb-0">
              {i < timeline.length - 1 && (
                <div className="absolute left-2.5 top-7 bottom-0 w-px"
                  style={{ background: "var(--border)" }} />
              )}
              <div className="absolute left-0 top-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "var(--surface)", border: "2px solid var(--accent)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />
              </div>
              <div className="flex items-baseline gap-3 mb-1">
                <h3 className="font-semibold text-lg">{title}</h3>
                <span className="font-mono text-xs" style={{ color: "var(--accent)" }}>{year}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="anim-fade-up delay-5 flex flex-col sm:flex-row justify-between items-center gap-6 p-8 rounded-2xl"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <div>
          <h3 className="font-semibold text-xl mb-1">Want to work together?</h3>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            I&apos;m open to freelance and full-time opportunities.
          </p>
        </div>
        <Link href="/contact"
          className="whitespace-nowrap px-6 py-3 rounded-xl font-semibold text-sm transition-opacity duration-200 hover:opacity-80"
          style={{ background: "var(--accent)", color: "#080c10" }}>
          Get in Touch →
        </Link>
      </div>

    </section>
  );
}