import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex flex-col justify-center items-center text-center">
      <p className="font-mono text-xs tracking-widest uppercase mb-4"
        style={{ color: "var(--accent)" }}>
        404 — Page not found
      </p>
      <h1 className="font-display mb-4" style={{ fontSize: "clamp(4rem,12vw,9rem)", lineHeight: 1, color: "var(--border)" }}>
        Oops.
      </h1>
      <p className="mb-10 max-w-sm" style={{ color: "var(--muted)" }}>
        This page doesn&apos;t exist. Maybe it was moved, deleted, or never existed in the first place.
      </p>
      <Link href="/"
        className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity duration-200 hover:opacity-80"
        style={{ background: "var(--accent)", color: "#080c10" }}>
        ← Back to Home
      </Link>
    </section>
  );
}