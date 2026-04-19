"use client";

import { useState } from "react";

const socials = [
  { label: "GitHub",   href: "https://github.com/Franz07-dev",   handle: "Franz07-dev" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/franz-jerome-verano-01b32a281/",  handle: "franz-jerome-verano" },
  { label: "Email",    href: "mailto:franzjeromeverano@gmail.com", handle: "franzjeromeverano@gmail.com" },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  return (
    <section className="py-16">

      <div className="anim-fade-up delay-1 mb-12">
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "var(--accent)" }}>
          Say hello
        </span>
        <h1 className="font-display mt-3 mb-4" style={{ fontSize: "clamp(2.5rem,5vw,4rem)", lineHeight: 1.1 }}>
          Contact Me
        </h1>
        <p className="max-w-md" style={{ color: "var(--muted)" }}>
          Have a project idea or just want to talk? I&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-4xl">

        {/* Form */}
        <div className="anim-fade-up delay-2">
          {sent ? (
            <div className="p-8 rounded-2xl text-center"
              style={{ border: "1px solid rgba(45,212,191,0.3)", background: "rgba(45,212,191,0.05)" }}>
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-semibold text-xl mb-2">Message sent!</h3>
              <p style={{ color: "var(--muted)" }}>Thanks for reaching out — I&apos;ll reply soon.</p>
              <button
                onClick={() => {
                  setSent(false);
                  setFormData({ name: "", email: "", subject: "", message: "" });
                  setError("");
                }}
                className="mt-4 px-4 py-2 rounded-lg text-sm transition-opacity duration-200 hover:opacity-80"
                style={{ background: "var(--accent)", color: "#080c10" }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {error && (
                <div className="p-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "rgb(239,68,68)" }}>
                  {error}
                </div>
              )}
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: "var(--surface)",
                  border:     "1px solid var(--border)",
                  color:      "var(--text)",
                }}
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, email: value });
                  if (error) setError("");
                }}
                onBlur={() => {
                  if (formData.email && !isValidEmail(formData.email)) {
                    setError("Please enter a valid email address");
                  }
                }}
                className="w-full p-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                }}
              />
              <input
                type="text"
                placeholder="Subject (optional)"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                style={{
                  background: "var(--surface)",
                  border:     "1px solid var(--border)",
                  color:      "var(--text)",
                }}
              />
              <textarea
                placeholder="Your message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full p-3.5 rounded-xl text-sm outline-none resize-none transition-all duration-200"
                style={{
                  background: "var(--surface)",
                  border:     "1px solid var(--border)",
                  color:      "var(--text)",
                }}
              />
              <button
                onClick={async () => {
                  if (!formData.name || !formData.email || !formData.message) {
                    setError("Please fill in name, email, and message");
                    return;
                  }

                  if (!isValidEmail(formData.email)) {
                    setError("Please enter a valid email address");
                    return;
                  }

                  setLoading(true);
                  setError("");

                  try {
                    const response = await fetch("/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(formData),
                    });

                    if (!response.ok) {
                      const data = await response.json();
                      throw new Error(data.error || "Failed to send email");
                    }

                    setSent(true);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to send message");
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-opacity duration-200 hover:opacity-80 disabled:opacity-50"
                style={{ background: "var(--accent)", color: "#080c10" }}
              >
                {loading ? "Sending..." : "Send Message →"}
              </button>
            </div>
          )}
        </div>

        <div className="anim-fade-up delay-3 space-y-8">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase mb-5"
              style={{ color: "var(--accent)" }}>
              Find me online
            </p>
            <div className="space-y-3">
              {socials.map(({ label, href, handle }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl transition-all duration-200"
                  style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
                  <span className="font-medium text-sm">{label}</span>
                  <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>{handle}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl"
            style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
            <p className="font-mono text-xs tracking-widest uppercase mb-3"
              style={{ color: "var(--accent)" }}>
              Response time
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              I usually respond{" "}
              <span style={{ color: "var(--text)" }}>same day or within 24 hours</span>.
              I&apos;m available most of the time.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}