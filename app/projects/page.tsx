import Link from "next/link";
import Image from "next/image";

// ── Types ──────────────────────────────────────────────────────────────────────
type ProjectCard = {
  title:      string;
  desc:       string;
  learned:    string;      // Key takeaway for each project
  status:     "Live" | "Soon";
  tags:       string[];
  image?:     string;      // project screenshot
  href?:      string;      // internal route
  externalHref?: string;   // external URL
  featured?:  boolean;     // featured cards are larger
  note?:      string;
};

type ProjectSection = {
  label:    string;
  subtitle: string;
  projects: ProjectCard[];
};

// ── Data ───────────────────────────────────────────────────────────────────────
// Add new projects to the appropriate section. Use externalHref for external apps.
const projectSections: ProjectSection[] = [
  {
    label:    "Featured",
    subtitle: "The projects I'm most proud of — full-stack, real APIs, real data.",
    projects: [
      {
        title:       "Task Manager",
        desc:        "A full-stack task manager with user registration, login, and personal task storage — each user only sees their own tasks, with priority levels and due dates.",
        learned:     "Building a full-stack app with protected API routes, NextAuth.js credentials authentication, bcrypt password hashing, JWT sessions, Prisma ORM with PostgreSQL, and per-user data ownership enforced on the server.",
        status:      "Live",
        image:       "/task-manager.png",
        externalHref: "https://task-manager-three-tau-18.vercel.app",
        featured:    true,
        tags:        ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "NextAuth.js", "bcrypt", "Full-stack", "REST API"],
      },
      {
        title:       "Code Explainer",
        desc:        "Paste any code and let AI explain it in plain English, suggest improvements, or find and fix bugs — powered by OpenRouter.",
        learned:     "Building a secure AI-powered API route in Next.js, prompt engineering for three different modes, rendering markdown responses as HTML, and handling real API errors like rate limits.",
        status:      "Live",
        image:       "/code-explainer.png",
        externalHref: "https://code-explainer-sandy.vercel.app",
        featured:    true,
        tags:        ["Next.js", "TypeScript", "OpenRouter API", "Prompt Engineering", "API Routes"],
      },
      {
        title:       "Weather App",
        desc:        "Search any city for live weather, a 5-day forecast, and recent search history — all from a free public API.",
        learned:     "Chaining two async API calls (geocoding → weather), building skeleton loaders, and managing multiple UI states cleanly.",
        status:      "Live",
        image:       "/weather-app.png",
        href:        "/projects/weather-app",
        featured:    true,
        tags:        ["Next.js", "Open-Meteo API", "TypeScript"],
      },
    ],
  },
  {
    label:    "Main Projects",
    subtitle: "Solid apps that taught me real patterns and techniques.",
    projects: [
      {
        title:    "GitHub Profile Viewer",
        desc:     "Look up any GitHub user to explore their profile stats, bio, and top repositories sorted by last updated.",
        learned:  "Working with REST APIs, TypeScript interfaces, next/image with external domains, and skeleton loaders.",
        status:   "Live",
        image:    "/github-viewer.png",
        href:     "/projects/github-viewer",
        tags:     ["Next.js", "GitHub API", "TypeScript", "Error Handling"],
      },
      {
        title:    "Expense Tracker",
        desc:     "Track income and expenses with category breakdowns, budget limits, and a 6-month bar chart — all with local persistence.",
        learned:  "Complex state management across multiple data types, localStorage persistence, building a bar chart from scratch using inline styles, without any charting library, and building data-driven UI.",
        status:   "Live",
        image:    "/expense-tracker.png",
        href:     "/projects/expense-tracker",
        tags:     ["Next.js", "TypeScript", "localStorage"],
      },
      {
        title:    "To-do List",
        desc:     "A productivity app for organizing tasks with category badges, dual filtering by status and category, inline editing, and local persistence.",
        learned:  "CRUD operations in Next.js, localStorage persistence, derived state with chained filters, and inline edit mode with save/cancel and keyboard shortcuts.",
        status:   "Live",
        image:    "/todo-list.png",
        href:     "/projects/to-do-list",
        tags:     ["Next.js", "TypeScript", "localStorage"],
      },
      {
        title:    "Markdown Previewer",
        desc:     "Write Markdown in the editor tab and switch to a live rendered preview, with copy and .md download support.",
        learned:  "Parsing and rendering Markdown safely in React, and building a split-pane editor layout using the marked library to parse and render Markdown.",
        status:   "Live",
        image:    "/markdown-previewer.png",
        href:     "/projects/markdown-viewer",
        tags:     ["Next.js", "Markdown", "Editor", "marked"],
      },
    ],
  },

  {
    label:    "Foundations",
    subtitle: "Early builds — where I learned the fundamentals of JavaScript and the DOM.",
    projects: [
      {
        title:   "Age Calculator",
        desc:    "Calculates your exact age in years, months, and days from a birthday input.",
        learned: "Date manipulation with JavaScript, DOM updates, and handling edge cases in user input.",
        status:  "Live",
        image:   "/age-calculator.png",
        externalHref: "https://Franz07-dev.github.io/foundations/age-calculator/",
        tags:    ["HTML", "CSS", "JavaScript", "DOM"],
      },
      {
        title:   "Quote Generator",
        desc:    "Displays a random quote with every click, with a copy-to-clipboard and share to Twitter button.",
        learned: "Arrays of objects, Math.random(), clipboard API, and window.open() for social sharing.",
        status:  "Live",
        image:   "/quote-generator.png",
        externalHref: "https://Franz07-dev.github.io/foundations/random-qoute-generator/",
        tags:    ["HTML", "CSS", "JavaScript", "DOM"],
      },
      {
        title:   "Tip Calculator",
        desc:    "Splits bills and calculates tip amounts per person with live number formatting.",
        learned: "Form inputs, basic arithmetic logic, and formatting numbers for real-world display.",
        status:  "Live",
        image:   "/tip-calculator.png",
        externalHref: "https://Franz07-dev.github.io/foundations/tip-calculator/",
        tags:    ["HTML", "CSS", "JavaScript", "DOM", "Forms"],
      },
      {
        title:   "Character & Word Counter",
        desc:    "Real-time text analysis that counts characters, words, sentences, and reading time.",
        learned: "String manipulation, event listeners for live updates, and building utility features.",
        status:  "Live",
        image:   "/character-word-counter.png",
        externalHref: "https://Franz07-dev.github.io/foundations/character-and-word-counter/",
        tags:    ["HTML", "CSS", "JavaScript", "DOM", "Real-time"],
      },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const statusColor: Record<string, string> = {
  Live: "#4ade80",
  Soon: "#fbbf24",
};



// Displays the key takeaway for each project — helps recruiters understand learning outcomes
function LearnedBadge({ text }: { text: string }) {
  return (
    <div
      className="rounded-xl px-3 py-2.5 mb-5 text-xs leading-relaxed"
      style={{
        background:   "rgba(45,212,191,0.06)",
        border:       "1px solid rgba(45,212,191,0.15)",
        color:        "var(--muted)",
      }}
    >
      <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono, monospace)" }}>
        learned →{" "}
      </span>
      {text}
    </div>
  );
}

// A single project card.
// featured cards get a slightly taller min-height and accent left border.
function Card({ project, animDelay }: { project: ProjectCard; animDelay: string }) {
  const isExternal = !!project.externalHref;
  const linkHref   = project.externalHref ?? project.href;

  return (
    <article
      className="anim-scale-in flex flex-col p-6 rounded-3xl transition-all duration-300"
      style={{
        animationDelay: animDelay,
        background:     "var(--surface)",
        border:         linkHref
          ? project.featured
            ? "1px solid rgba(45,212,191,0.3)"   // accent border for featured
            : "1px solid var(--border)"
          : "1px dashed rgba(100,116,139,0.35)",  // dashed = coming soon
        minHeight: project.featured ? "320px" : undefined,
      }}
    >
      {/* Status row */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: statusColor[project.status] }}
          />
          <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>
            {project.status}
          </span>
          {/* "External" badge — makes it clear this opens a different app */}
          {isExternal && (
            <span
              className="px-2 py-0.5 text-[10px] rounded-full font-mono uppercase tracking-widest"
              style={{ background: "rgba(244,114,182,0.1)", color: "var(--accent2)" }}
            >
              external
            </span>
          )}
        </div>
        {project.note && (
          <span
            className="px-2.5 py-1 text-[11px] uppercase tracking-[0.24em] rounded-full"
            style={{ color: "var(--muted)", background: "rgba(100,116,139,0.1)" }}
          >
            {project.note}
          </span>
        )}
      </div>

      {/* Project Screenshot */}
      {project.image && (
        <div className="mb-5 -mx-6 -mt-6">
          <Image
            src={project.image}
            alt={project.title}
            width={600}
            height={400}
            className="w-full rounded-t-3xl object-cover"
            style={{ aspectRatio: "3/2" }}
          />
        </div>
      )}

      {/* Content section with padding */}
      <div className={project.image ? "px-0" : ""}>
        {/* Title */}
        <h3 className="font-semibold mb-3" style={{ fontSize: project.featured ? "1.5rem" : "1.25rem", color: "var(--text)" }}>
          {project.title}
        </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--muted)" }}>
        {project.desc}
      </p>

      {/* What I learned */}
      <LearnedBadge text={project.learned} />

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-[11px] rounded-full"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--muted)" }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer link */}
      <div className="mt-auto pt-3 border-t border-t-[rgba(255,255,255,0.05)]">
        {linkHref ? (
          isExternal ? (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors duration-200 hover:opacity-70"
              style={{ color: "var(--accent)" }}
            >
              Open project ↗
            </a>
          ) : (
            <Link
              href={linkHref}
              className="text-sm font-medium transition-colors duration-200 hover:opacity-70"
              style={{ color: "var(--accent)" }}
            >
              Open project →
            </Link>
          )
        ) : (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Being polished — landing soon.
          </p>
        )}
      </div>
      </div>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Projects() {
  return (
    <section className="py-16">
      {/* Page header */}
      <div className="anim-fade-up delay-1 mb-14">
        <span
          className="font-mono text-xs tracking-widest uppercase"
          style={{ color: "var(--accent)" }}
        >
          What I&apos;ve built
        </span>
        <h1
          className="font-display mt-3 mb-4"
          style={{ fontSize: "clamp(2.5rem,5vw,4rem)", lineHeight: 1.1 }}
        >
          Projects
        </h1>
        <p className="max-w-md" style={{ color: "var(--muted)" }}>
          From foundations to full-stack — every project here taught me something real.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-16">
        {projectSections.map((section, sectionIndex) => (
          <div key={section.label} className="space-y-6">
            {/* Section header */}
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <span
                  className="font-mono text-xs tracking-widest uppercase"
                  style={{ color: "var(--accent)" }}
                >
                  {section.label}
                </span>
                <h2
                  className="font-display text-2xl mt-2"
                  style={{ lineHeight: 1.1, color: "var(--text)" }}
                >
                  {section.subtitle}
                </h2>
              </div>
              <span className="text-sm" style={{ color: "var(--muted)" }}>
                {section.projects.length} project{section.projects.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Cards grid */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {section.projects.map((project, projectIndex) => (
                <Card
                  key={project.title}
                  project={project}
                  // Stagger each card's entrance animation
                  animDelay={`${(sectionIndex * 0.1) + (projectIndex * 0.08)}s`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}