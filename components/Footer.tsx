import Link from "next/link";

export default function Footer() {
  return (
    <footer className="max-w-5xl mx-auto px-6 py-10 mt-10"
      style={{ borderTop: "1px solid var(--border)" }}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm"
        style={{ color: "var(--muted)" }}>

        <span className="font-display text-base" style={{ color: "var(--text)" }}>
          Franz<span style={{ color: "var(--accent)" }}>.</span>
        </span>

        <div className="flex gap-6">
          {[
            { name: "About",    href: "/about" },
            { name: "Projects", href: "/projects" },
            { name: "Contact",  href: "/contact" },
          ].map((l) => (
            <Link key={l.name} href={l.href}
              className="transition-colors duration-200 hover:text-white"
              style={{ color: "var(--muted)" }}>
              {l.name}
            </Link>
          ))}
        </div>

        <span>© {new Date().getFullYear()} Franz. Built with Next.js.</span>
      </div>
    </footer>
  );
}