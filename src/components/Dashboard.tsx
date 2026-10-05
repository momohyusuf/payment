import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  Search,
  Wallet,
} from "lucide-react";
import type { Transaction } from "../lib/data.ts";
import { balanceOf, inPeriod, money, totalsOf } from "../lib/finance.ts";
import SectionHeading from "./ui/SectionHeading.tsx";
import Status from "./ui/Status.tsx";
import ActivityChart from "./ActivityChart.tsx";
import Assistant from "./Assistant.tsx";
function Metric({
  label,
  amount,
  accent = false,
}: {
  label: string;
  amount: number;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] text-muted">{label}</p>
      <p
        className={`text-[clamp(1.1rem,2vw,1.65rem)] tracking-[-.04em] tabular-nums ${accent ? "text-sage" : ""}`}
      >
        {money(amount)}
      </p>
    </div>
  );
}
export default function Dashboard({
  ledger,
  days,
  onDays,
  onTransfer,
  onOpenAI,
}: {
  ledger: Transaction[];
  days: number;
  onDays: (days: number) => void;
  onTransfer: () => void;
  onOpenAI: (question?: string) => void;
}) {
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [showAll, setShowAll] = useState(false);
  const scoped = inPeriod(ledger, days),
    totals = totalsOf(scoped);
  const filtered = scoped.filter(
    (t) =>
      (filter === "all" || t.direction === filter) &&
      `${t.merchant} ${t.category} ${t.route ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const displayed = showAll ? filtered : filtered.slice(0, 5);
  return (
    <section
      id="workspace"
      className="border-y border-line bg-[#eeefea] px-6 py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1224px]">
        <SectionHeading
          number="02"
          label="Financial intelligence"
          title={
            <>
              Your money. In focus.
              <br />
              <span className="font-editorial italic">
                Your next move. In view.
              </span>
            </>
          }
          description="Less switching tabs. More seeing what matters. Meet your business’s financial command centre."
        />
        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_15px_70px_-40px_#171a2030]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-ink text-[10px] font-semibold text-white">
                KS
              </div>
              <div>
                <p className="text-xs font-semibold">Kora Studio</p>
                <p className="mt-0.5 text-[9px] text-muted">
                  Business workspace{" "}
                  <span className="ml-2 text-cobalt">/ DEMO</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-[10px] text-muted sm:inline">
                5 October 2026
              </span>
              <Status>All systems in view</Status>
            </div>
          </div>
          <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-7 lg:p-7">
            <div className="min-w-0">
              <div className="mb-7 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Overview</h3>
                <label className="relative inline-flex items-center">
                  <span className="sr-only">Reporting period</span>
                  <select
                    aria-label="Reporting period"
                    value={days}
                    onChange={(e) => {
                      onDays(Number(e.target.value));
                      setShowAll(false);
                    }}
                    className="appearance-none rounded-full border border-line bg-white py-2 pr-8 pl-3 text-[10px]"
                  >
                    {[7, 30, 90].map((d) => (
                      <option key={d} value={d}>
                        Last {d} days
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3"
                    size={12}
                  />
                </label>
              </div>
              <div className="mb-7 rounded-2xl bg-ink p-6 text-white">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] text-white/55">
                    Available balance · NGN
                  </span>
                  <Wallet size={16} className="text-white/55" />
                </div>
                <p
                  data-testid="balance"
                  className="text-[clamp(1.8rem,3.6vw,2.8rem)] tracking-[-.055em] tabular-nums"
                >
                  {money(balanceOf(ledger), "NGN", 2)}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-[9px] text-white/50">
                    One account. A world of possibilities.
                  </span>
                  <button
                    type="button"
                    onClick={onTransfer}
                    className="inline-flex min-h-9 items-center gap-2 rounded-full bg-white/10 px-3 text-[10px] hover:bg-white/20"
                  >
                    Send money <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>
              <div className="mb-8 grid grid-cols-3 gap-3 border-b border-line pb-7">
                <Metric label="Revenue" amount={totals.revenue} />
                <Metric label="Spending" amount={totals.spending} />
                <Metric
                  label="Net cash flow"
                  amount={totals.net}
                  accent={totals.net >= 0}
                />
              </div>
              <ActivityChart ledger={scoped} days={days} />
              <div className="mt-8 border-t border-line pt-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold">Recent activity</h3>
                  <div className="flex items-center gap-2 rounded-full border border-line px-3">
                    <Search size={12} className="text-muted" />
                    <label className="sr-only" htmlFor="transaction-search">
                      Search transactions
                    </label>
                    <input
                      id="transaction-search"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setShowAll(false);
                      }}
                      placeholder="Search activity"
                      className="w-32 bg-transparent py-2.5 text-[10px] outline-none sm:w-40"
                    />
                  </div>
                </div>
                <div className="mb-2 flex gap-5">
                  {["all", "incoming", "outgoing"].map((f) => (
                    <button
                      type="button"
                      aria-pressed={filter === f}
                      key={f}
                      onClick={() => {
                        setFilter(f);
                        setShowAll(false);
                      }}
                      className={`min-h-10 border-b-2 text-[10px] capitalize transition ${filter === f ? "border-cobalt text-cobalt" : "border-transparent text-muted hover:text-ink"}`}
                    >
                      {f === "all" ? "All activity" : f}
                    </button>
                  ))}
                </div>
                <div aria-label="Transactions">
                  {displayed.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 border-b border-line/70 py-3.5"
                    >
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-xl ${t.direction === "incoming" ? "bg-sage/10 text-sage" : "bg-[#f1f2f5] text-muted"}`}
                      >
                        {t.direction === "incoming" ? (
                          <ArrowDownLeft size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-medium">
                          {t.merchant}
                        </p>
                        <p className="mt-1 text-[9px] text-muted">
                          {t.category} ·{" "}
                          {new Date(t.timestamp).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            timeZone: "Africa/Lagos",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-[11px] font-medium tabular-nums ${t.direction === "incoming" ? "text-sage" : ""}`}
                        >
                          {t.direction === "incoming" ? "+" : "−"}
                          {money(t.amountMinor, "NGN", 2)}
                        </p>
                        <p className="mt-1 text-[8px] text-muted">
                          Completed · demo
                        </p>
                      </div>
                    </div>
                  ))}
                  {!displayed.length && (
                    <div className="py-10 text-center">
                      <Search className="mx-auto mb-3 text-muted" size={22} />
                      <p className="text-sm">No matching activity</p>
                      <p className="mt-2 text-xs text-muted">
                        Try another search, filter, or reporting period.
                      </p>
                    </div>
                  )}
                </div>
                {filtered.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setShowAll(!showAll)}
                    className="mt-4 inline-flex min-h-10 items-center gap-2 text-[10px] text-cobalt"
                  >
                    {showAll
                      ? "Show less"
                      : `View all ${filtered.length} transactions`}
                    <ArrowUpRight size={12} />
                  </button>
                )}
                <p className="mt-3 text-[9px] text-muted">
                  All values are simulated. Balance includes the full demo
                  ledger; activity follows the selected period.
                </p>
              </div>
            </div>
            <Assistant onOpen={onOpenAI} />
          </div>
        </div>
      </div>
    </section>
  );
}
