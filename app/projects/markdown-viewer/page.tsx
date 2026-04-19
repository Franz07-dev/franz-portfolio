"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_MARKDOWN = `# Hello, Markdown!

## What is Markdown?
Markdown is a lightweight markup language. Write plain text with simple symbols — it renders as formatted HTML.

## Text Formatting
**Bold text** and *italic text* and ~~strikethrough~~.

You can also write \`inline code\` like this.

## Lists

### Unordered
- Item one
- Item two
  - Nested item
  - Another nested item

### Ordered
1. First step
2. Second step
3. Third step

## Links & Images
[Visit GitHub](https://github.com)

## Blockquote
> "First, solve the problem. Then, write the code." — John Johnson

## Code Block
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Franz"));
\`\`\`

## Table
| Feature | Supported |
|---------|-----------|
| Bold    | ✅        |
| Tables  | ✅        |
| Code    | ✅        |

---
*Switch to Preview tab to see the rendered output!*
`;

type Tab = "write" | "preview";

export default function MarkdownPreviewerTabbed() {
  const router = useRouter();
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [html, setHtml]         = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("write");
  const [copied, setCopied]     = useState(false);

  useEffect(() => {
    // Parse markdown input using marked library and update preview HTML
    async function parseMarkdown() {
      const { marked } = await import("marked");
      marked.use({ breaks: true, gfm: true });
      const result = await marked.parse(markdown);
      setHtml(result);
    }
    parseMarkdown();
  }, [markdown]);

  const wordCount = markdown.trim() === ""
    ? 0
    : markdown.trim().split(/\s+/).filter(Boolean).length;
  const charCount = markdown.length;

  async function handleCopy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <style>{`
        .prose-preview h1 { font-family: 'DM Serif Display', serif; font-size: 1.875rem; color: #e8edf2; margin-bottom: 0.5rem; border-bottom: 1px solid #1e2a38; padding-bottom: 0.5rem; }
        .prose-preview h2 { font-family: 'DM Serif Display', serif; font-size: 1.375rem; color: #e8edf2; margin: 1.25rem 0 0.5rem; }
        .prose-preview h3 { font-size: 1.1rem; font-weight: 600; color: #e8edf2; margin: 1rem 0 0.4rem; }
        .prose-preview p  { color: #94a3b8; line-height: 1.75; margin-bottom: 0.75rem; font-size: 0.9rem; }
        .prose-preview a  { color: #2dd4bf; text-decoration: underline; }
        .prose-preview a:hover { opacity: 0.8; }
        .prose-preview strong { color: #e8edf2; font-weight: 600; }
        .prose-preview em { color: #94a3b8; font-style: italic; }
        .prose-preview del { color: #64748b; }
        .prose-preview ul, .prose-preview ol { color: #94a3b8; padding-left: 1.5rem; margin-bottom: 0.75rem; font-size: 0.9rem; }
        .prose-preview ul { list-style-type: disc; }
        .prose-preview ol { list-style-type: decimal; }
        .prose-preview li { margin-bottom: 0.25rem; line-height: 1.6; }
        .prose-preview blockquote { border-left: 3px solid #2dd4bf; padding-left: 1rem; margin: 1rem 0; color: #64748b; font-style: italic; }
        .prose-preview code { font-family: 'DM Mono', monospace; background: #080c10; border: 1px solid #1e2a38; border-radius: 4px; padding: 0.15em 0.4em; font-size: 0.8rem; color: #2dd4bf; }
        .prose-preview pre  { background: #080c10; border: 1px solid #1e2a38; border-radius: 12px; padding: 1.25rem; overflow-x: auto; margin-bottom: 1rem; }
        .prose-preview pre code { background: none; border: none; padding: 0; color: #94a3b8; font-size: 0.82rem; }
        .prose-preview table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 0.875rem; }
        .prose-preview th { background: #080c10; color: #2dd4bf; font-family: 'DM Mono', monospace; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.6rem 0.75rem; border: 1px solid #1e2a38; text-align: left; }
        .prose-preview td { padding: 0.6rem 0.75rem; border: 1px solid #1e2a38; color: #94a3b8; }
        .prose-preview tr:hover td { background: #080c10; }
        .prose-preview hr { border: none; border-top: 1px solid #1e2a38; margin: 1.5rem 0; }
        .prose-preview img { max-width: 100%; border-radius: 8px; }
        .md-editor::-webkit-scrollbar { width: 4px; }
        .md-editor::-webkit-scrollbar-track { background: transparent; }
        .md-editor::-webkit-scrollbar-thumb { background: #1e2a38; border-radius: 2px; }
      `}</style>

      <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">

          {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:opacity-70"
          style={{ color: "#2dd4bf" }}
        >
          ← Back to Projects
        </button>

        {/* Header with stats and actions */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#2dd4bf] mb-2">
              Markdown Previewer
            </p>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight">
              Write and preview<br />
              <span className="text-[#64748b]">Markdown live.</span>
            </h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="px-4 py-2 bg-[#0e1420] border border-[#1e2a38] rounded-xl font-mono text-xs text-[#64748b] flex items-center gap-3">
              <span>{wordCount} words</span>
              <span className="text-[#1e2a38]">|</span>
              <span>{charCount} chars</span>
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-[#0e1420] border border-[#1e2a38] rounded-xl font-sans text-sm font-semibold text-[#64748b] transition-all hover:border-[#2dd4bf] hover:text-[#2dd4bf] cursor-pointer"
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-[#2dd4bf] text-[#080c10] rounded-xl font-sans text-sm font-semibold transition-opacity hover:opacity-85 cursor-pointer"
            >
              Download .md
            </button>
          </div>
        </div>

        {/* Tab panel with write/preview panes */}
        <div className="bg-[#0e1420] border border-[#1e2a38] rounded-2xl flex flex-col" style={{ height: "72vh" }}>

          {/* Tab bar */}
          <div className="flex items-center gap-1 px-3 pt-3 pb-0 border-b border-[#1e2a38]">
            {(["write", "preview"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 font-mono text-xs uppercase tracking-widest rounded-t-lg transition-all duration-150 cursor-pointer border-none -mb-px"
                style={{
                  background:   activeTab === tab ? "var(--bg, #080c10)" : "transparent",
                  color:        activeTab === tab ? "#2dd4bf" : "#64748b",
                  borderBottom: activeTab === tab ? "2px solid #2dd4bf" : "2px solid transparent",
                }}
              >
                {tab === "write" ? "✏ Write" : "👁 Preview"}
              </button>
            ))}
            {/* Live indicator — only visible on write tab */}
            {activeTab === "write" && (
              <span className="ml-auto mr-2 font-mono text-[10px] text-[#1e2a38] tracking-widest uppercase">
                live
              </span>
            )}
          </div>

          {/* Write pane: raw markdown editor */}
          <div className={`flex-1 overflow-hidden ${activeTab === "write" ? "block" : "hidden"}`}>
            <textarea
              className="md-editor w-full h-full p-5 bg-transparent text-[#94a3b8] font-mono text-sm leading-relaxed resize-none outline-none placeholder-[#64748b]"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Start writing markdown..."
              spellCheck={false}
            />
          </div>

          {/* Preview pane: rendered HTML output */}
          <div className={`flex-1 overflow-y-auto p-5 ${activeTab === "preview" ? "block" : "hidden"}`}>
            {html ? (
              <div
                className="prose-preview"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <p className="text-[#64748b] text-sm font-mono">Nothing to preview yet.</p>
            )}
          </div>

        </div>

      </div>
    </>
  );
}