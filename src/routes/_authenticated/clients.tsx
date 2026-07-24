import { createFileRoute } from "@tanstack/react-router";
import { BriefcaseBusiness, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/clients")({
  head: () => ({
    meta: [
      { title: "Clients — Third Room HQ" },
      { name: "description", content: "Track client relationships, engagement, and strategic value." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClientsPage,
});

const CLIENTS = [
  { name: "Northwind", value: "Expansion" },
  { name: "Aster Labs", value: "Retainer" },
  { name: "Fabric House", value: "Pilot" },
];

function ClientsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 18</p>
        <h1 className="mt-1 font-display text-4xl">Clients</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Hold the account layer for relationship health, engagements, and client outcomes.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {CLIENTS.map((client) => (
          <article key={client.name} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4 text-charcoal" />
              <h2 className="font-display text-xl">{client.name}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{client.value}</p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" /> Client status summaries and strategic activity will live here.
        </div>
      </section>
    </div>
  );
}
