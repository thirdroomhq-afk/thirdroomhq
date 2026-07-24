import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/insights")({
  head: () => ({
    meta: [
      { title: "Insights — Third Room HQ" },
      { name: "description", content: "Monitor performance and trends across the organization." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InsightsPage,
});

const INSIGHTS = [
  { title: "Signal strength", value: "High" },
  { title: "Momentum", value: "Rising" },
  { title: "Risks", value: "2 flagged" },
];

function InsightsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 15</p>
        <h1 className="mt-1 font-display text-4xl">Insights</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Bring together tactical signals, trend analysis, and business pulse checks in one view.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {INSIGHTS.map((item) => (
          <article key={item.title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-charcoal" />
              <h2 className="font-display text-xl">{item.title}</h2>
            </div>
            <p className="mt-3 text-2xl font-semibold">{item.value}</p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" /> Trend lines, anomaly detection, and daily summaries will be summarized here.
        </div>
      </section>
    </div>
  );
}
