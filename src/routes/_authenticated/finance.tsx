import { createFileRoute } from "@tanstack/react-router";
import { Wallet, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/finance")({
  head: () => ({
    meta: [
      { title: "Finance — Third Room HQ" },
      { name: "description", content: "Review budgets, runway, and financial health." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FinancePage,
});

const FINANCE_ITEMS = [
  { label: "Runway", value: "18 months" },
  { label: "Burn", value: "$42k/mo" },
  { label: "Margin", value: "34%" },
];

function FinancePage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 14</p>
        <h1 className="mt-1 font-display text-4xl">Finance</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Give leadership a dependable view of budgets, forecasts, burn, and financial commitments.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {FINANCE_ITEMS.map((item) => (
          <article key={item.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-charcoal" />
              <h2 className="font-display text-xl">{item.label}</h2>
            </div>
            <p className="mt-3 text-3xl font-semibold">{item.value}</p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" /> Forecasting, budget reviews, and financial controls will be surfaced here.
        </div>
      </section>
    </div>
  );
}
