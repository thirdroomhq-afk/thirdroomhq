import { createFileRoute } from "@tanstack/react-router";
import { BadgeDollarSign, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/sales")({
  head: () => ({
    meta: [
      { title: "Sales — Third Room HQ" },
      { name: "description", content: "Track pipeline, opportunities, offers, and revenue motion." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SalesPage,
});

const DEALS = [
  { name: "Northwind Studio", amount: "$48k", stage: "Negotiation" },
  { name: "Aster Labs", amount: "$22k", stage: "Discovery" },
  { name: "Fabric House", amount: "$15k", stage: "Review" },
];

function SalesPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 11</p>
        <h1 className="mt-1 font-display text-4xl">Sales</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Keep the revenue engine visible with opportunities, offers, follow-up, and forecasting.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {DEALS.map((deal) => (
          <article key={deal.name} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">{deal.name}</h2>
              <BadgeDollarSign className="h-4 w-4 text-charcoal" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{deal.stage}</p>
            <p className="mt-3 text-lg font-semibold">{deal.amount}</p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" /> Forecasting and handoff workflows will be embedded here.
        </div>
      </section>
    </div>
  );
}
