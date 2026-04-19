"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Task {
  id:       number;
  text:     string;
  done:     boolean;
  category: Category;
  editText: string;    // Temporary text used during editing
}

type Filter   = "all" | "active" | "done";
type Category = "Work" | "Personal" | "Study" | "Other";

const CATEGORIES: { value: Category; color: string }[] = [
  { value: "Work",     color: "#3178c6" },  // blue
  { value: "Personal", color: "#f472b6" },  // pink
  { value: "Study",    color: "#f59e0b" },  // amber
  { value: "Other",    color: "#64748b" },  // muted gray
];

// Helper: return color for a given category
function getCategoryColor(cat: Category): string {
  return CATEGORIES.find((c) => c.value === cat)?.color ?? "#64748b";
}


const STORAGE_KEY = "franz-todo-tasks";

function loadTasks(): Task[] {
  // SSR guard: localStorage doesn't exist on the server (no browser window).
  // Without this check, Next.js would crash during server-side rendering.
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Task[]) : [];
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export default function TodoPage() {
  const router = useRouter();

  const [tasks,    setTasks]    = useState<Task[]>(loadTasks);
  const [input,    setInput]    = useState("");
  const [filter,   setFilter]   = useState<Filter>("all");

  // NEW: which category is selected in the add-task form.
  // Defaults to "Work" so the user doesn't have to pick one every time.
  const [newCategory, setNewCategory] = useState<Category>("Work");

  // NEW: which category filter is active. "all" means show every category.
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");

  // NEW: which task is currently being edited (tracked by its id).
  // null means nothing is being edited right now.
  const [editingId, setEditingId] = useState<number | null>(null);

  // Derived state: computed from tasks, filter, and categoryFilter on each render.
  // Filters by status first, then by category. Single source of truth prevents bugs.
  const visibleTasks = tasks
    // Step 1: filter by status
    .filter((t) =>
      filter === "all"    ? true :
      filter === "active" ? !t.done :
                             t.done
    )
    // Step 2: filter by category (chain another .filter() on the result)
    .filter((t) =>
      categoryFilter === "all" ? true : t.category === categoryFilter
    );

  const activeCount = tasks.filter((t) => !t.done).length;

  function addTask() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id:       Date.now(),    // milliseconds since epoch — unique enough for local data
      text:     trimmed,
      done:     false,
      category: newCategory,  // NEW: attach the selected category
      editText: trimmed,      // NEW: editText starts as a copy of the real text
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    saveTasks(updated);
    setInput("");
  }

  function toggleTask(id: number) {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTasks(updated);
    saveTasks(updated);
  }

  function deleteTask(id: number) {
    // If the task being deleted is currently being edited, close the editor.
    if (editingId === id) setEditingId(null);
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
  }

  function clearCompleted() {
    const updated = tasks.filter((t) => !t.done);
    setTasks(updated);
    saveTasks(updated);
  }


  function startEdit(id: number) {
    // Just set editingId — the input will appear because of conditional rendering
    setEditingId(id);
  }

  function updateEditText(id: number, value: string) {
    // While typing in edit input, update ONLY editText. Commit to real text on Save.
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, editText: value } : t
    );
    setTasks(updated);
    // We do NOT call saveTasks here — we only save when the edit is confirmed
  }

  function saveEdit(id: number) {
    const updated = tasks.map((t) => {
      if (t.id !== id) return t;
      const trimmed = t.editText.trim();
      // If the user cleared the input entirely, keep the original text
      if (!trimmed) return { ...t, editText: t.text };
      // Otherwise commit editText → text (the real field)
      return { ...t, text: trimmed, editText: trimmed };
    });
    setTasks(updated);
    saveTasks(updated);   // NOW we save — the edit is confirmed
    setEditingId(null);   // close the editor
  }

  function cancelEdit(id: number) {
    // Reset editText back to the current real text, then close the editor.
    // This is why we kept editText separate — cancelling is trivial.
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, editText: t.text } : t
    );
    setTasks(updated);
    setEditingId(null);
  }

  // ─── Keyboard handlers ────────────────────────────────────────────────────

  function handleAddKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") addTask();
  }

  function handleEditKeyDown(e: React.KeyboardEvent<HTMLInputElement>, id: number) {
    // Enter = save,  Escape = cancel
    if (e.key === "Enter")  saveEdit(id);
    if (e.key === "Escape") cancelEdit(id);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // JSX — what gets rendered in the browser
  // ─────────────────────────────────────────────────────────────────────────
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
          To-Do List
        </p>
        <h1 className="font-serif text-4xl md:text-5xl leading-tight">
          Stay on<br />
          <span className="text-[#64748b]">track.</span>
        </h1>
        <p className="text-[#64748b] text-sm mt-3">
          {activeCount === 0
            ? "All caught up. Ship something."
            : `${activeCount} task${activeCount !== 1 ? "s" : ""} remaining`}
        </p>
      </div>

      {/* ── Add task input ── */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a new task…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleAddKeyDown}
          maxLength={120}
          autoComplete="off"
          className="flex-1 px-4 py-3 bg-[#0e1420] border border-[#1e2a38] rounded-xl text-[#e8edf2] placeholder-[#64748b] font-sans text-sm outline-none transition-colors focus:border-[#2dd4bf]"
        />
        <button
          onClick={addTask}
          disabled={!input.trim()}
          className="px-6 py-3 bg-[#2dd4bf] text-[#080c10] rounded-xl font-sans text-sm font-semibold whitespace-nowrap transition-opacity hover:opacity-85 active:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add →
        </button>
      </div>

      {/* ── NEW: Category selector for new tasks ──────────────────────────────
          Shown below the input so the user can pick a category before adding.
          .map() over CATEGORIES to render one button per category.
          The active category gets a colored border + colored text.
          Inactive categories are muted — they don't compete visually.
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setNewCategory(cat.value)}
            className="px-3 py-1 rounded-full text-xs font-mono transition-all duration-150 cursor-pointer border"
            style={{
              // Active: colored border + colored text from the category's color
              // Inactive: muted border + muted text
              borderColor: newCategory === cat.value ? cat.color : "#1e2a38",
              color:       newCategory === cat.value ? cat.color : "#64748b",
              background:  newCategory === cat.value
                ? `${cat.color}18`   // 18 = ~10% opacity in hex — subtle tint
                : "transparent",
            }}
          >
            {cat.value}
          </button>
        ))}
      </div>

      {/* ── Status filter tabs ── */}
      {/* Same as before — filters by all / active / done */}
      <div
        className="flex gap-1 rounded-xl p-1 mb-3"
        style={{ background: "#080c10", border: "1px solid #1e2a38" }}
        role="tablist"
      >
        {(["all", "active", "done"] as Filter[]).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 px-3 rounded-lg font-mono text-[11px] tracking-widest uppercase transition-colors duration-150 cursor-pointer border-none ${
              filter === f
                ? "bg-[rgba(45,212,191,0.15)] text-[#2dd4bf]"
                : "bg-transparent text-[#4a6080] hover:text-slate-400"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── NEW: Category filter tabs ─────────────────────────────────────────
          A second row of filter buttons — one per category plus "All".
          These work TOGETHER with the status filter above.
          Example: status=active + category=Work → shows only unfinished Work tasks.

          We build the options array inline: "all" first, then spread CATEGORIES.
          The dot (●) before each label uses the category's color, giving
          an instant visual cue for what each button represents.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        className="flex gap-1 rounded-xl p-1 mb-8 flex-wrap"
        style={{ background: "#080c10", border: "1px solid #1e2a38" }}
      >
        {/* "All categories" option first */}
        <button
          onClick={() => setCategoryFilter("all")}
          className={`flex-1 py-2 px-3 rounded-lg font-mono text-[11px] tracking-widest uppercase transition-colors duration-150 cursor-pointer border-none ${
            categoryFilter === "all"
              ? "bg-[rgba(45,212,191,0.15)] text-[#2dd4bf]"
              : "bg-transparent text-[#4a6080] hover:text-slate-400"
          }`}
        >
          All
        </button>

        {/* One button per category */}
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className="flex-1 py-2 px-3 rounded-lg font-mono text-[11px] tracking-widest uppercase transition-colors duration-150 cursor-pointer border-none flex items-center justify-center gap-1"
            style={{
              // Active: tinted background + category color text
              // Inactive: muted text
              background: categoryFilter === cat.value ? `${cat.color}18` : "transparent",
              color:      categoryFilter === cat.value ? cat.color : "#4a6080",
            }}
          >
            {/* Colored dot — gives instant visual context */}
            <span
              style={{
                width: "6px", height: "6px",
                borderRadius: "50%",
                background: cat.color,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            {cat.value}
          </button>
        ))}
      </div>

      {/* ── Task list ── */}
      {visibleTasks.length === 0 ? (
        // Empty state
        <div
          style={{ animation: "fade-up 0.5s ease 0.25s both" }}
          className="py-16 text-center"
        >
          <p className="text-5xl mb-3">✓</p>
          <p className="text-[#64748b] text-sm">
            {filter === "done"   ? "No completed tasks yet." :
             filter === "active" ? "All caught up. Ship something." :
                                   "No tasks yet. Add one above!"}
          </p>
        </div>
      ) : (
        <div
          style={{ animation: "fade-up 0.5s ease 0.05s both" }}
          className="bg-[#0e1420] border border-[#1e2a38] rounded-2xl p-7 mb-3"
        >
          <ul className="flex flex-col gap-2" role="list">
            {visibleTasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center gap-3 py-3 border-b border-[#1e2a38] last:border-b-0 transition-opacity duration-150 ${
                  task.done ? "opacity-50" : ""
                }`}
              >
                {/* Custom circular checkbox — same as before */}
                <div
                  role="checkbox"
                  aria-checked={task.done}
                  tabIndex={0}
                  onClick={() => toggleTask(task.id)}
                  onKeyDown={(e) => e.key === "Enter" && toggleTask(task.id)}
                  className="w-5 h-5 min-w-5 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 shrink-0"
                  style={{
                    border:     task.done ? "1.5px solid #2dd4bf" : "1.5px solid #1e2a38",
                    background: task.done ? "#2dd4bf" : "transparent",
                  }}
                >
                  {task.done && (
                    <span className="text-[10px] font-bold" style={{ color: "#080c10" }}>
                      ✓
                    </span>
                  )}
                </div>

                {/* ── Task body: either edit mode or display mode ───────────────
                    This is the key part of the edit feature.
                    We check: is this task's id the one currently being edited?
                      YES → show an input field (edit mode)
                      NO  → show the task text + category badge (display mode)

                    flex-1 makes this section fill all available space between
                    the checkbox and the action buttons.
                ──────────────────────────────────────────────────────────────── */}
                <div className="flex-1 min-w-0">
                  {editingId === task.id ? (
                    // ── EDIT MODE ──
                    // Shown only for the task currently being edited.
                    // The input is pre-filled with editText (not the real text).
                    // Enter = save, Escape = cancel.
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={task.editText}
                        onChange={(e) => updateEditText(task.id, e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                        maxLength={120}
                        autoFocus  // automatically focuses when edit mode opens
                        className="flex-1 px-3 py-1.5 bg-[#080c10] border border-[#2dd4bf] rounded-lg text-[#e8edf2] text-sm outline-none font-sans"
                      />
                      {/* Save button */}
                      <button
                        onClick={() => saveEdit(task.id)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold font-mono cursor-pointer border-none transition-colors"
                        style={{ background: "rgba(45,212,191,0.15)", color: "#2dd4bf" }}
                      >
                        Save
                      </button>
                      {/* Cancel button */}
                      <button
                        onClick={() => cancelEdit(task.id)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold font-mono cursor-pointer border-none transition-colors"
                        style={{ background: "transparent", color: "#64748b" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    // ── DISPLAY MODE ──
                    // Normal view: task text + category badge side by side.
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-sans text-sm wrap-break-word ${
                          task.done
                            ? "line-through text-[#4a6080]"
                            : "text-[#e8edf2]"
                        }`}
                      >
                        {task.text}
                      </span>

                      {/* ── NEW: Category badge ─────────────────────────────────
                          A small colored pill showing the task's category.
                          The color comes from getCategoryColor() — same colors
                          as the filter buttons above so they visually match.
                          18 hex = ~10% opacity for the background tint.
                      ──────────────────────────────────────────────────────────── */}
                      <span
                        className="px-2 py-0.5 rounded-full font-mono text-[10px] shrink-0"
                        style={{
                          color:       getCategoryColor(task.category),
                          background:  `${getCategoryColor(task.category)}18`,
                          border:      `1px solid ${getCategoryColor(task.category)}33`,
                        }}
                      >
                        {task.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Action buttons (Edit + Delete) ────────────────────────────
                    Only shown in display mode — hidden during editing because
                    the Save/Cancel buttons replace them.
                    
                    We check editingId !== task.id to hide them during editing.
                ──────────────────────────────────────────────────────────────── */}
                {editingId !== task.id && (
                  <div className="flex gap-1 shrink-0">
                    {/* Edit button — opens edit mode for this task */}
                    <button
                      onClick={() => startEdit(task.id)}
                      aria-label={`Edit task: ${task.text}`}
                      className="px-3 py-1 rounded-lg text-xs font-semibold transition-colors duration-150 border-none cursor-pointer"
                      style={{ background: "transparent", color: "#64748b" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#2dd4bf")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                    >
                      Edit
                    </button>
                    {/* Delete button — same as before, turns red on hover */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Delete task: ${task.text}`}
                      className="px-3 py-1 rounded-lg text-xs font-semibold transition-colors duration-150 border-none cursor-pointer hover:text-[#f87171]"
                      style={{ background: "transparent", color: "#64748b" }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Footer ── */}
      {tasks.length > 0 && (
        <div
          style={{ animation: "fade-up 0.5s ease 0.15s both" }}
          className="flex justify-between items-center px-1 font-mono text-[11px] tracking-wide text-[#64748b]"
        >
          <span>
            {tasks.filter((t) => t.done).length} / {tasks.length} done
          </span>
          {tasks.some((t) => t.done) && (
            <button
              onClick={clearCompleted}
              className="font-mono text-[11px] tracking-wide cursor-pointer transition-colors duration-150 hover:text-[#f87171] border-none bg-transparent text-[#64748b]"
            >
              Clear completed
            </button>
          )}
        </div>
      )}
    </div>
  );
}