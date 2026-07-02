import { useState } from "react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { ChevronDown, SplitSquareHorizontal, X, Volume2 } from "lucide-react";
import type { Trip } from "../types";
import { COLORBLIND_SAFE_PALETTE, EXPENSE_CATEGORIES, FRIENDS, MONTHLY_SPEND, RECENT_EXPENSES } from "../data";
import { Avatar, Badge } from "../components/common";
import { usePreferences } from "../preferences";

export function BudgetScreen({ trip }: { trip: Trip | null }) {
  const { t, speak, accessibility } = usePreferences();
  const total = EXPENSE_CATEGORIES.reduce((s, c) => s + c.amount, 0);
  const [splitOpen, setSplitOpen] = useState(false);
  const [budgetBannerDismissed, setBudgetBannerDismissed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!trip) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-8 text-center">
        <p className="text-sm font-semibold text-foreground">{t("trips.noTrip")}</p>
        <p className="text-xs text-muted-foreground">{t("trips.noTripSub")}</p>
      </div>
    );
  }

  const remaining = trip.budget - total;
  const overBudget = total / trip.budget > 0.8;
  const colorBlindFriendly = accessibility.colorBlindMode !== "off";
  const categories = EXPENSE_CATEGORIES.map((c, i) => ({
    ...c,
    color: colorBlindFriendly ? COLORBLIND_SAFE_PALETTE[i % COLORBLIND_SAFE_PALETTE.length] : c.color,
  }));
  const selected = selectedIndex !== null ? categories[selectedIndex] : null;

  const handleSelectCategory = (index: number) => {
    const next = selectedIndex === index ? null : index;
    setSelectedIndex(next);
    if (next !== null) {
      const c = categories[next];
      const pct = Math.round((c.amount / total) * 100);
      speak(`${c.name}: $${c.amount}, ${pct} percent of spending. ${c.description}`);
    }
  };

  const handleReadSummary = () => {
    speak(`${t("budget.totalBudget")}: $${trip.budget}. ${t("budget.spent")}: $${total}. ${t("budget.remaining")}: $${remaining}.`);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="px-5 pt-12 pb-4">
        {overBudget && !budgetBannerDismissed && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
            <span className="text-amber-500 text-sm mt-0.5">⚠</span>
            <p className="text-xs text-amber-700 font-medium flex-1 leading-snug">{t("budget.warning")}</p>
            <button onClick={() => setBudgetBannerDismissed(true)} className="text-amber-400 flex-shrink-0" aria-label={t("common.close")}>
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground leading-tight">{t("budget.title")}</h1>
            <p className="text-xs text-muted-foreground">{trip.destination}</p>
          </div>
          <button
            onClick={handleReadSummary}
            className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center"
            aria-label={t("budget.readAloud")}
          >
            <Volume2 size={16} className="text-primary" />
          </button>
        </div>

        {/* Summary card */}
        <div
          className="rounded-2xl p-5 mb-2 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1A3F6F, #0e2a4a)" }}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute -right-8 top-8 w-32 h-32 rounded-full bg-white/5" />
          <p className="text-xs text-white/60 font-medium uppercase tracking-wide mb-1">{t("budget.totalBudget")}</p>
          <p className="font-display text-3xl font-semibold mb-4">${trip.budget.toLocaleString()}</p>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full"
              style={{ width: `${(total / trip.budget) * 100}%`, background: "linear-gradient(90deg, #2EC4B6, #FF6B4A)" }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <div>
              <p className="text-white/60">{t("budget.spent")}</p>
              <p className="font-semibold">${total.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60">{t("budget.remaining")}</p>
              <p className="font-semibold text-[#2EC4B6]">${remaining.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground mb-4 px-1">{t("budget.disclaimer")}</p>

        {/* Pie + categories */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={categories}
                    dataKey="amount"
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={52}
                    strokeWidth={2}
                    stroke="var(--card)"
                    onClick={(_, index) => handleSelectCategory(index)}
                    isAnimationActive={!accessibility.reduceMotion}
                  >
                    {categories.map((c, i) => (
                      <Cell
                        key={`pie-${i}`}
                        fill={c.color}
                        cursor="pointer"
                        opacity={selectedIndex === null || selectedIndex === i ? 1 : 0.35}
                      />
                    ))}
                  </Pie>
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {categories.map((c, i) => (
                <button
                  key={`cat-${i}`}
                  onClick={() => handleSelectCategory(i)}
                  className={`w-full flex items-center gap-2 rounded-lg px-1 -mx-1 py-0.5 transition-colors ${
                    selectedIndex === i ? "bg-muted/60" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <span className="text-xs text-muted-foreground flex-1 text-left">{c.name}</span>
                  <span className="text-xs font-semibold font-mono text-foreground">${c.amount}</span>
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <div className="mt-4 flex items-start gap-3 bg-muted/40 rounded-xl p-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${selected.color}22` }}>
                <selected.icon size={14} style={{ color: selected.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">{selected.name} — ${selected.amount} ({Math.round((selected.amount / total) * 100)}% {t("budget.ofTotal")})</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{selected.description}</p>
              </div>
              <button onClick={() => setSelectedIndex(null)} className="flex-shrink-0 text-muted-foreground" aria-label={t("common.close")}>
                <X size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Monthly bar chart */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t("budget.monthlySpend")}</p>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_SPEND} barSize={20}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#7A8899" }} />
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                  formatter={(v: any) => [`$${v}`, ""]}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {MONTHLY_SPEND.map((_, i) => <Cell key={`bar-${i}`} fill={i === 1 ? (colorBlindFriendly ? COLORBLIND_SAFE_PALETTE[1] : "#FF6B4A") : (colorBlindFriendly ? COLORBLIND_SAFE_PALETTE[0] : "#1A3F6F")} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Split bill CTA */}
        <button
          onClick={() => setSplitOpen(!splitOpen)}
          className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl p-4 mb-4 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
            <SplitSquareHorizontal size={18} className="text-primary" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-foreground">{t("budget.splitBill")}</p>
            <p className="text-xs text-muted-foreground">{t("budget.splitBillSub")}</p>
          </div>
          <ChevronDown size={16} className={`text-muted-foreground transition-transform ${splitOpen ? "rotate-180" : ""}`} />
        </button>

        {splitOpen && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-4 space-y-3">
            {FRIENDS.map((f, i) => {
              const share = Math.round(total / 3);
              const diff = i === 0 ? -84 : i === 1 ? 42 : 42;
              return (
                <div key={`split-${f.name}`} className="flex items-center gap-3">
                  <Avatar src={f.avatar} name={f.name} size={32} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">{f.name.split(" ")[0]}</p>
                    <p className="text-[10px] text-muted-foreground">${share} share</p>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${diff < 0 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"}`}>
                    {diff < 0 ? "owes" : "gets"} ${Math.abs(diff)}
                  </div>
                </div>
              );
            })}
            <button className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-xs font-semibold mt-2">
              Send reminders
            </button>
          </div>
        )}

        {/* Recent expenses */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t("budget.recentExpenses")}</p>
        <div className="space-y-2 pb-6">
          {RECENT_EXPENSES.map((e, i) => (
            <div key={`expense-${i}`} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
              <Avatar src={e.avatar} name={e.member} size={32} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{e.label}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge color="#7A8899">{e.category}</Badge>
                  <span className="text-[10px] text-muted-foreground">{e.date}</span>
                </div>
              </div>
              <p className="text-sm font-bold font-mono text-foreground flex-shrink-0">${e.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
