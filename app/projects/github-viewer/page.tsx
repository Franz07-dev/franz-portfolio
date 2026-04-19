"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";


interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  created_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

type Status = "idle" | "loading" | "success" | "error";

// ─── Language colors ──────────────────────────────────────────────────────────
const langColors: Record<string, string> = {
  TypeScript:  "#3178c6",
  JavaScript:  "#f7df1e",
  Python:      "#3572A5",
  HTML:        "#e34c26",
  CSS:         "#563d7c",
  Rust:        "#dea584",
  Go:          "#00ADD8",
  Java:        "#b07219",
  "C#":        "#178600",
  "C++":       "#f34b7d",
  C:           "#555555",
  PHP:         "#4F5D95",
  Swift:       "#F05138",
  Kotlin:      "#A97BFF",
  Dart:        "#00B4AB",
  Ruby:        "#701516",
  Shell:       "#89e051",
  Vue:         "#41b883",
  Svelte:      "#ff3e00",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Formats dates to "January 15, 2020" style
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Formats large numbers: 51000 → "51k", 342 → "342"
function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

// Skeleton loader shown while API call is in flight
function SkeletonLoader() {
  return (
    <div style={{ animation: "fade-up 0.4s ease both" }}>
      {/* Profile card skeleton */}
      <div className="bg-[#0e1420] border border-[#1e2a38] rounded-2xl p-7 mb-3">
        <div className="flex gap-5 items-start mb-6">
          {/* Avatar circle */}
          <div className="w-20 h-20 rounded-full bg-[#1e2a38] shrink-0 skeleton-pulse" />
          <div className="flex-1 flex flex-col gap-2 pt-1">
            <div className="h-5 w-2/5 rounded bg-[#1e2a38] skeleton-pulse" />
            <div className="h-3 w-1/4 rounded bg-[#1e2a38] skeleton-pulse" />
            <div className="h-3 w-3/4 rounded bg-[#1e2a38] skeleton-pulse" />
            <div className="h-3 w-1/2 rounded bg-[#1e2a38] skeleton-pulse" />
          </div>
        </div>
        {/* Stats row skeleton */}
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-[#1e2a38] skeleton-pulse" />
          ))}
        </div>
      </div>

      {/* Repo grid skeleton — 6 cards in 2 columns */}
      <div className="bg-[#0e1420] border border-[#1e2a38] rounded-2xl p-7">
        <div className="h-3 w-24 rounded bg-[#1e2a38] mb-4 skeleton-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-[#1e2a38] skeleton-pulse" />
          ))}
        </div>
      </div>

      {/* The shimmer animation — defined inline so we don't touch globals.css */}
      <style>{`
        @keyframes skeleton-shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.75; }
        }
        .skeleton-pulse { animation: skeleton-shimmer 1.4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}


export default function GitHubViewerPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [status, setStatus]     = useState<Status>("idle");
  const [user, setUser]         = useState<GitHubUser | null>(null);
  const [repos, setRepos]       = useState<GitHubRepo[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  async function fetchProfile() {
    const trimmed = username.trim();
    if (!trimmed) return;

    setStatus("loading");
    setUser(null);
    setRepos([]);
    setErrorMsg("");

    try {
      const userRes = await fetch(`https://api.github.com/users/${trimmed}`);

      if (!userRes.ok) {
        if (userRes.status === 404) throw new Error(`User "${trimmed}" not found on GitHub.`);
        if (userRes.status === 403) throw new Error("GitHub API rate limit exceeded. Try again in a minute.");
        throw new Error(`GitHub API error: ${userRes.status}`);
      }

      const userData = (await userRes.json()) as GitHubUser;

      // Ask GitHub to sort by updated — then we take the top 6
      const reposRes = await fetch(
        `https://api.github.com/users/${trimmed}/repos?sort=updated&per_page=6`
      );
      const reposData = (await reposRes.json()) as GitHubRepo[];

      setUser(userData);
      setRepos(reposData);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") fetchProfile();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 md:py-24">

      {/* ── Back Button ── */}
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:opacity-70"
        style={{ color: "#2dd4bf" }}
      >
        ← Back to Projects
      </button>

      {/* ── Header ── */}
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[#2dd4bf] mb-2">
          GitHub Viewer
        </p>
        <h1 className="font-serif text-4xl md:text-5xl leading-tight">
          Explore any<br />
          <span className="text-[#64748b]">GitHub profile.</span>
        </h1>
      </div>

      {/* ── Search ── */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          className="flex-1 px-4 py-3 bg-[#0e1420] border border-[#1e2a38] rounded-xl text-[#e8edf2] placeholder-[#64748b] font-sans text-sm outline-none transition-colors focus:border-[#2dd4bf]"
          placeholder="Enter a GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          className="px-6 py-3 bg-[#2dd4bf] text-[#080c10] rounded-xl font-sans text-sm font-semibold whitespace-nowrap transition-opacity hover:opacity-85 active:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={fetchProfile}
          disabled={status === "loading" || !username.trim()}
        >
          {status === "loading" ? "Searching…" : "Search →"}
        </button>
      </div>

      {/* ── Error ── */}
      {status === "error" && (
        <div className="p-4 mb-6 bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.3)] rounded-xl text-[#f87171] text-sm">
          {errorMsg}
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {status === "loading" && <SkeletonLoader />}

      {/* ── Idle state ── */}
      {status === "idle" && (
        <div
          style={{ animation: "fade-up 0.5s ease 0.25s both" }}
          className="py-16 text-center"
        >
          <p className="text-5xl mb-3">🐙</p>
          <p className="text-[#64748b] text-sm">Search a username to explore their profile</p>
        </div>
      )}

      {/* ── Results ── */}
      {status === "success" && user && (
        <>
          {/* Profile card */}
          <div
            style={{ animation: "fade-up 0.5s ease 0.05s both" }}
            className="bg-[#0e1420] border border-[#1e2a38] rounded-2xl p-7 mb-3"
          >
            <div className="flex gap-5 items-start mb-6">
              {/*
                next/image requires width + height — Next.js throws build error without them.
              */}
              <Image
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                width={80}
                height={80}
                className="rounded-full border border-[#1e2a38] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-2xl leading-tight mb-0.5">
                  {user.name ?? user.login}
                </h2>
                <p className="font-mono text-xs text-[#2dd4bf] mb-2">@{user.login}</p>
                {user.bio && (
                  <p className="text-[#64748b] text-sm leading-relaxed mb-2">{user.bio}</p>
                )}
                <div className="flex flex-wrap gap-3">
                  {user.location && (
                    <span className="text-[#64748b] text-xs">📍 {user.location}</span>
                  )}
                  <span className="text-[#64748b] text-xs">
                    Joined {formatDate(user.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Repos",     value: user.public_repos },
                { label: "Followers", value: user.followers },
                { label: "Following", value: user.following },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#080c10] border border-[#1e2a38] rounded-xl p-3 text-center"
                >
                  <p className="font-mono text-xs uppercase tracking-wider text-[#64748b] mb-1">
                    {stat.label}
                  </p>
                  {/* 
                    formatCount turns large numbers into "51k" style.
                    We use it here since the box is small.
                  */}
                  <p className="font-serif text-2xl text-[#2dd4bf]">
                    {formatCount(stat.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Repo grid */}
          {repos.length > 0 && (
            <div
              style={{ animation: "fade-up 0.5s ease 0.15s both" }}
              className="bg-[#0e1420] border border-[#1e2a38] rounded-2xl p-7 mb-3"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-[#2dd4bf] mb-4">
                Recent Repos
              </p>

              {/* 2-column grid on sm+ screens, 1-column on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {repos.map((repo, i) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    // Each card fades in slightly after the previous one
                    style={{ animation: `fade-up 0.4s ease ${0.05 + i * 0.06}s both` }}
                    className="flex flex-col gap-1.5 p-4 bg-[#080c10] border border-[#1e2a38] rounded-xl hover:border-[#2dd4bf] transition-colors no-underline"
                  >
                    {/* Repo name + star/fork counts */}
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-mono text-sm font-semibold text-[#2dd4bf] truncate">
                        {repo.name}
                      </p>
                      <div className="flex gap-2 shrink-0">
                        <span className="font-mono text-[#64748b] text-xs">
                          ★ {formatCount(repo.stargazers_count)}
                        </span>
                        <span className="font-mono text-[#64748b] text-xs">
                          ⑂ {formatCount(repo.forks_count)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[#64748b] text-xs leading-relaxed flex-1 line-clamp-2">
                      {repo.description ?? "No description provided."}
                    </p>

                    {/* Language dot */}
                    {repo.language && (
                      <div className="flex items-center gap-1.5 mt-auto">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: langColors[repo.language] ?? "#64748b" }}
                        />
                        <span className="text-[#64748b] text-xs">{repo.language}</span>
                      </div>
                    )}
                  </a>
                ))}
              </div>

              {/* Link to full GitHub profile */}
              <div className="mt-5 text-center">
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-widest text-[#2dd4bf] hover:opacity-70 transition-opacity"
                >
                  View full profile on GitHub →
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}