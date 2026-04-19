"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


interface Transaction {
  id:          number;
  description: string;
  amount:      number;
  category:    string;
  date:        string;
  type:        "income" | "expense";
}


const EXPENSE_CATEGORIES = [
  "Food", "Transport", "Housing", "Entertainment",
  "Health", "Shopping", "Education", "Other",
] as const;

const INCOME_CATEGORIES = [
  "Salary", "Freelance", "Investment", "Gift", "Other",
] as const;

// ─── Month names for chart ────────────────────────────────────────────────────
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── localStorage key ─────────────────────────────────────────────────────────
const STORAGE_KEY    = "franz-expense-transactions";
const BUDGET_KEY     = "franz-expense-budget";


function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Transaction[]) : [];
}

function saveTransactions(data: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}


function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

function calcBalance(t: Transaction[]): number {
  return t.reduce((sum, tx) => (tx.type === "income" ? sum + tx.amount : sum - tx.amount), 0);
}

function calcTotalIncome(t: Transaction[]): number {
  return t.filter((tx) => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
}

function calcTotalExpenses(t: Transaction[]): number {
  return t.filter((tx) => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);
}


const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style:                 "currency",
  currency:              "PHP",
  minimumFractionDigits: 2,
});

function formatPeso(amount: number): string {
  return pesoFormatter.format(amount);
}

// ─── Group transactions by month ──────────────────────────────────────────────
function groupByMonth(transactions: Transaction[]): Record<string, Transaction[]> {
  return transactions.reduce((groups, t) => {
    const month = t.date.slice(0, 7); // "YYYY-MM"
    if (!groups[month]) groups[month] = [];
    groups[month].push(t);
    return groups;
  }, {} as Record<string, Transaction[]>);
}

function formatMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    month: "long",
    year:  "numeric",
  });
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ExpenseTrackerPage() {

  const router = useRouter();
  const [transactions,    setTransactions]    = useState<Transaction[]>(loadTransactions);
  const [type,            setType]            = useState<"income" | "expense">("expense");
  const [description,     setDescription]     = useState("");
  const [amount,          setAmount]          = useState("");
  const [category,        setCategory]        = useState<string>(EXPENSE_CATEGORIES[0]);
  const [date,            setDate]            = useState(todayString());
  const [filterCategory,  setFilterCategory]  = useState("All");
  const [formError,       setFormError]       = useState("");
  const [budget,          setBudget]          = useState(() => {
    if (typeof window === "undefined") return 0;
    const saved = localStorage.getItem(BUDGET_KEY);
    return saved ? Number(saved) : 0;
  });
  const [budgetInput,     setBudgetInput]     = useState("");
  const [showBudgetInput, setShowBudgetInput] = useState(false);

  // ── Save budget ──
  function saveBudget() {
    const num = parseFloat(budgetInput);
    if (isNaN(num) || num <= 0) return;
    setBudget(num);
    localStorage.setItem(BUDGET_KEY, String(num));
    setBudgetInput("");
    setShowBudgetInput(false);
  }

  // ── Type toggle ──
  function handleTypeChange(newType: "income" | "expense") {
    setType(newType);
    setCategory(newType === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  }

  // ── Add transaction ──
  function addTransaction() {
    setFormError("");
    if (!description.trim()) { setFormError("Please enter a description."); return; }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) { setFormError("Please enter a valid amount greater than 0."); return; }
    if (!date) { setFormError("Please select a date."); return; }

    const newTx: Transaction = {
      id:          Date.now(),
      description: description.trim(),
      amount:      parsed,
      category,
      date,
      type,
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
    setDescription("");
    setAmount("");
    setDate(todayString());
  }

  // ── Delete transaction ──
  function deleteTransaction(id: number) {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveTransactions(updated);
  }

  // ── Derived values ──
  const balance       = calcBalance(transactions);
  const totalIncome   = calcTotalIncome(transactions);
  const totalExpenses = calcTotalExpenses(transactions);

  // Budget progress
  const budgetPercent = budget > 0 ? Math.min((totalExpenses / budget) * 100, 100) : 0;
  const overBudget    = budget > 0 && totalExpenses > budget;

  // Category filter
  const allCategories = ["All", ...Array.from(new Set(transactions.map((t) => t.category)))];
  const filtered      = filterCategory === "All"
    ? transactions
    : transactions.filter((t) => t.category === filterCategory);

  const grouped      = groupByMonth(filtered);
  const sortedMonths = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const categoryOptions = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function balanceColor(): string {
    if (balance > 0) return "#2dd4bf";
    if (balance < 0) return "#f87171";
    return "#64748b";
  }

  // ── Build bar chart data for last 6 months ──
  function getChartData() {
    const now    = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const d       = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key     = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label   = MONTH_NAMES[d.getMonth()];
      const income  = transactions.filter((t) => t.type === "income"  && t.date.startsWith(key)).reduce((s, t) => s + t.amount, 0);
      const expense = transactions.filter((t) => t.type === "expense" && t.date.startsWith(key)).reduce((s, t) => s + t.amount, 0);
      months.push({ label, income, expense });
    }

    return months;
  }

  const chartData = getChartData();
  const chartMax  = Math.max(...chartData.map((m) => Math.max(m.income, m.expense)), 1);

  return (
    <>
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.4); cursor: pointer; }
        select option { background: #0e1420; color: #e8edf2; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="mx-auto max-w-2xl px-6 py-12 md:py-20">

        {/* ── Back Button ── */}
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:opacity-70"
          style={{ color: "#2dd4bf" }}
        >
          ← Back to Projects
        </button>

        {/* ── Header ── */}
        <div className="mb-8" style={{ animation: "fade-up 0.4s ease 0.05s both" }}>
          <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: "#2dd4bf" }}>
            Personal Finance
          </p>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-1">
            Expense Tracker
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            Track your income, expenses, and stay within your budget.
          </p>
        </div>

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-3 gap-3 mb-4" style={{ animation: "fade-up 0.4s ease 0.1s both" }}>
          {[
            { label: "Balance",  value: balance,       color: balanceColor() },
            { label: "Income",   value: totalIncome,   color: "#2dd4bf" },
            { label: "Expenses", value: totalExpenses, color: "#f87171" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-4 text-center"
              style={{ background: "#0e1420", border: "1px solid #1e2a38" }}
            >
              <p className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: "#64748b" }}>
                {stat.label}
              </p>
              <p className="font-serif text-lg leading-tight" style={{ color: stat.color }}>
                {formatPeso(stat.value)}
              </p>
            </div>
          ))}
        </div>

        {/* ── Budget card ── */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ background: "#0e1420", border: "1px solid #1e2a38", animation: "fade-up 0.4s ease 0.15s both" }}
        >
          <div className="flex justify-between items-center mb-3">
            <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#2dd4bf" }}>
              Monthly Budget
            </p>
            <div className="flex items-center gap-3">
              {budget > 0 && (
                <span className="font-mono text-xs" style={{ color: "#64748b" }}>
                  <span style={{ color: "#e8edf2", fontWeight: 600 }}>{formatPeso(totalExpenses)}</span>
                  {" / "}{formatPeso(budget)}
                </span>
              )}
              <button
                onClick={() => setShowBudgetInput(!showBudgetInput)}
                className="font-mono text-xs px-3 py-1 rounded-lg transition-all"
                style={{ border: "1px solid #1e2a38", color: "#64748b", background: "transparent", cursor: "pointer" }}
              >
                {budget > 0 ? "Edit" : "Set Budget"}
              </button>
            </div>
          </div>

          {/* Budget progress bar */}
          {budget > 0 && (
            <>
              <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: "#1e2a38" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width:      `${budgetPercent}%`,
                    background: overBudget ? "#f87171" : "#2dd4bf",
                  }}
                />
              </div>
              {overBudget && (
                <p className="font-mono text-xs" style={{ color: "#f87171" }}>
                  ⚠ Over budget by {formatPeso(totalExpenses - budget)}
                </p>
              )}
              {!overBudget && budget > 0 && (
                <p className="font-mono text-xs" style={{ color: "#64748b" }}>
                  {formatPeso(budget - totalExpenses)} remaining
                </p>
              )}
            </>
          )}

          {/* Budget input */}
          {showBudgetInput && (
            <div className="flex gap-2 mt-3">
              <input
                type="number"
                placeholder="Enter budget limit..."
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveBudget()}
                className="flex-1 px-4 py-2.5 rounded-xl font-sans text-sm outline-none"
                style={{
                  background: "#080c10",
                  border:     "1px solid #1e2a38",
                  color:      "#e8edf2",
                }}
              />
              <button
                onClick={saveBudget}
                className="px-5 py-2.5 rounded-xl font-sans text-sm font-semibold"
                style={{ background: "#2dd4bf", color: "#080c10", border: "none", cursor: "pointer" }}
              >
                Save
              </button>
            </div>
          )}
        </div>

        {/* ── Bar Chart ── */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ background: "#0e1420", border: "1px solid #1e2a38", animation: "fade-up 0.4s ease 0.2s both" }}
        >
          <p className="font-mono text-xs uppercase tracking-widest mb-5" style={{ color: "#2dd4bf" }}>
            Monthly Overview — Last 6 Months
          </p>

          {/* Check if ALL months have zero data — if so, show empty state instead of flat bars */}
          {chartData.every((m) => m.income === 0 && m.expense === 0) ? (
            // Empty state — shown before any transactions are added
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-3xl mb-2">📊</p>
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#64748b" }}>
                No data yet — add a transaction to see your chart
              </p>
            </div>
          ) : (
            // Normal chart — only rendered when there is actual data
            <>
              {/* Bars */}
              <div className="flex items-flex-end gap-1.5 mb-2" style={{ height: "140px", alignItems: "flex-end" }}>
                {chartData.map((month) => (
                  <div key={month.label} className="flex-1 flex gap-0.5 items-end" style={{ height: "100%" }}>
              {/* Income bar */}
              <div
                      className="flex-1 rounded-t-sm transition-all duration-500"
                      title={`Income: ${formatPeso(month.income)}`}
                      style={{
                        height:    `${Math.max((month.income / chartMax) * 130, month.income > 0 ? 4 : 0)}px`,
                        background: "rgba(45,212,191,0.6)",
                        minHeight:  month.income > 0 ? "4px" : "0",
                      }}
                    />
              {/* Expense bar */}
              <div
                      className="flex-1 rounded-t-sm transition-all duration-500"
                      title={`Expenses: ${formatPeso(month.expense)}`}
                      style={{
                        height:    `${Math.max((month.expense / chartMax) * 130, month.expense > 0 ? 4 : 0)}px`,
                        background: "rgba(248,113,113,0.6)",
                        minHeight:  month.expense > 0 ? "4px" : "0",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Divider line */}
              <div style={{ height: "1px", background: "#1e2a38", marginBottom: "8px" }} />

              {/* Month labels */}
              <div className="flex gap-1.5 mb-4">
                {chartData.map((month) => (
                  <div key={month.label} className="flex-1 text-center font-mono" style={{ fontSize: "9px", color: "#64748b", textTransform: "uppercase" }}>
                    {month.label}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm" style={{ background: "rgba(45,212,191,0.6)" }} />
                  <span className="text-xs" style={{ color: "#64748b" }}>Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm" style={{ background: "rgba(248,113,113,0.6)" }} />
                  <span className="text-xs" style={{ color: "#64748b" }}>Expenses</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Add transaction form ── */}
        <div
          className="rounded-2xl p-6 mb-4"
          style={{ background: "#0e1420", border: "1px solid #1e2a38", animation: "fade-up 0.4s ease 0.25s both" }}
        >
          <p className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "#2dd4bf" }}>
            Add Transaction
          </p>

          {/* Type toggle */}
          <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: "#080c10", border: "1px solid #1e2a38" }}>
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className="flex-1 py-2.5 rounded-lg font-sans text-sm font-semibold transition-all duration-150"
                style={{
                  background: type === t
                    ? t === "expense" ? "rgba(248,113,113,0.15)" : "rgba(45,212,191,0.15)"
                    : "transparent",
                  color: type === t
                    ? t === "expense" ? "#f87171" : "#2dd4bf"
                    : "#64748b",
                  border:  "none",
                  cursor:  "pointer",
                }}
              >
                {t === "expense" ? "− Expense" : "+ Income"}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Description (e.g. Grocery run)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTransaction()}
                maxLength={60}
                className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-colors"
                style={{ background: "#080c10", border: "1px solid #1e2a38", color: "#e8edf2" }}
              />
            </div>
            <input
              type="number"
              placeholder="Amount (₱)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTransaction()}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-colors"
              style={{ background: "#080c10", border: "1px solid #1e2a38", color: "#e8edf2" }}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-colors"
              style={{ background: "#080c10", border: "1px solid #1e2a38", color: "#e8edf2", colorScheme: "dark" }}
            />
            <div className="col-span-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-colors cursor-pointer"
                style={{ background: "#080c10", border: "1px solid #1e2a38", color: "#e8edf2" }}
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {formError && (
            <p className="text-xs mb-3" style={{ color: "#f87171" }}>⚠ {formError}</p>
          )}

          <button
            onClick={addTransaction}
            className="w-full py-3 rounded-xl font-sans text-sm font-semibold transition-opacity hover:opacity-85 active:opacity-70"
            style={{ background: "#2dd4bf", color: "#080c10", border: "none", cursor: "pointer" }}
          >
            Add {type === "expense" ? "Expense" : "Income"} →
          </button>
        </div>

        {/* ── Category filter pills ── */}
        {transactions.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4" style={{ animation: "fade-up 0.4s ease 0.3s both" }}>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className="px-3 py-1.5 rounded-full font-mono transition-all duration-150 cursor-pointer"
                style={{
                  fontSize:   "10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: filterCategory === cat ? "#2dd4bf" : "transparent",
                  border:     `1px solid ${filterCategory === cat ? "#2dd4bf" : "#1e2a38"}`,
                  color:      filterCategory === cat ? "#080c10" : "#64748b",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Transactions grouped by month ── */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-5xl mb-3">💸</p>
            <p className="text-sm" style={{ color: "#64748b" }}>
              {transactions.length === 0
                ? "No transactions yet. Add one above!"
                : "No transactions in this category."}
            </p>
          </div>
        ) : (
          sortedMonths.map((month) => {
            const monthTxs      = grouped[month];
            const monthIncome   = calcTotalIncome(monthTxs);
            const monthExpenses = calcTotalExpenses(monthTxs);

            return (
              <div
                key={month}
                className="rounded-2xl p-6 mb-3"
                style={{ background: "#0e1420", border: "1px solid #1e2a38", animation: "fade-up 0.5s ease 0.05s both" }}
              >
                {/* Month header */}
                <div className="flex justify-between items-center mb-4">
                  <p className="font-mono text-xs uppercase tracking-widest" style={{ color: "#2dd4bf" }}>
                    {formatMonthLabel(month)}
                  </p>
                  <div className="flex gap-3">
                    <span className="font-mono text-xs" style={{ color: "#2dd4bf" }}>+{formatPeso(monthIncome)}</span>
                    <span className="font-mono text-xs" style={{ color: "#f87171" }}>−{formatPeso(monthExpenses)}</span>
                  </div>
                </div>

                {/* Transaction rows */}
                <div className="flex flex-col gap-2">
                  {monthTxs.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 p-4 rounded-xl"
                      style={{ background: "#080c10", border: "1px solid #1e2a38" }}
                    >
                      {/* Type dot */}
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: t.type === "income" ? "#2dd4bf" : "#f87171" }}
                      />

                      {/* Description + meta */}
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm truncate" style={{ color: "#e8edf2" }}>{t.description}</p>
                        <p className="font-mono text-xs mt-0.5" style={{ color: "#64748b" }}>
                          {t.category} · {t.date}
                        </p>
                      </div>

                      {/* Amount */}
                      <span
                        className="font-mono text-sm font-semibold shrink-0"
                        style={{ color: t.type === "income" ? "#2dd4bf" : "#f87171" }}
                      >
                        {t.type === "income" ? "+" : "−"}{formatPeso(t.amount)}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold transition-opacity hover:opacity-85 shrink-0"
                        style={{
                          background: "rgba(248,113,113,0.1)",
                          color:      "#f87171",
                          border:     "none",
                          cursor:     "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}

      </div>
    </>
  );
}