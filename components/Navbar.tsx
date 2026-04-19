"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { name: "Home",     href: "/" },
  { name: "About",    href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Contact",  href: "/contact" },
];

export default function Navbar() {
  const pathname  = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header style={{ borderBottom: "1px solid var(--border)", background: "rgba(8,12,16,0.85)" }}
      className="sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-display text-xl" style={{ color: "var(--text)" }}>
          Franz<span style={{ color: "var(--accent)" }}>.</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color:      active ? "var(--accent)"  : "var(--muted)",
                  background: active ? "rgba(45,212,191,0.08)" : "transparent",
                }}
              >
                {link.name}
              </Link>
            );
          })}
          <a
            href="/resume.pdf"
            download
            className="ml-3 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-80"
            style={{ background: "rgba(45,212,191,0.1)", color: "var(--accent)" }}
          >
            Resume
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8"
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 rounded transition-all duration-200"
            style={{ background: "var(--text)", transform: open ? "rotate(45deg) translateY(8px)" : "none" }} />
          <span className="block h-0.5 rounded transition-all duration-200"
            style={{ background: "var(--text)", opacity: open ? 0 : 1 }} />
          <span className="block h-0.5 rounded transition-all duration-200"
            style={{ background: "var(--text)", transform: open ? "rotate(-45deg) translateY(-8px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1"
          style={{ borderTop: "1px solid var(--border)" }}>
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
                style={{ color: active ? "var(--accent)" : "var(--muted)" }}
              >
                {link.name}
              </Link>
            );
          })}
          <a
            href="/resume.pdf"
            download
            onClick={() => setOpen(false)}
            className="px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
            style={{ color: "var(--accent)" }}
          >
            Resume
          </a>
        </div>
      )}
    </header>
  );
}