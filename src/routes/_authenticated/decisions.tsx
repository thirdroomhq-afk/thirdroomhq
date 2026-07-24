import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Gavel, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/decisions")({
  head: () => ({
    meta: [
      { title: "Decision Log — Third Room HQ" },
      { name: "description", content: "A searchable decision log that captures rationale, alternatives, owner, and impact." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DecisionsPage,
});

const DECISIONS = [
  { title: "Position Third Room as a business design studio", owner: "Founders", impact: "Core positioning" },
  { title: "Prioritize knowledge capture over feature sprawl", owner: "Ops", impact: "Foundation for AI" },
  { title: "Use partners as the first growth loop", owner: "Partner lead", impact: "Client expansion" },
];

function DecisionsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 07</p>
        <h1 className="mt-1 font-display text-4xl">Decision Log</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Important company decisions become searchable records with rationale, owner, impact, and related content.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-warm">Searchable memory</p>
            <h2 className="mt-2 font-display text-2xl">Why this matters</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              A decision log turns company history into a living archive instead of a collection of scattered chats.
            </p>
          </div>
          <div className="rounded-full bg-stone-warm p-3 text-charcoal">
            <Gavel className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {DECISIONS.map((decision) => (
            <div key={decision.title} className="flex items-center justify-between rounded-xl border border-border bg-muted/60 px-4 py-3">
              <div>
                <h3 className="font-display text-lg">{decision.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Owner · {decision.owner}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{decision.impact}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" /> This module will connect decision records to projects, captures, and partner context over time.
        </div>
      </section>
    </div>
  );
}
