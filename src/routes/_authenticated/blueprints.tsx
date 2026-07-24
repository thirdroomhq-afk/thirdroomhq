import { createFileRoute } from "@tanstack/react-router";
import { Blocks, Compass } from "lucide-react";

export const Route = createFileRoute("/_authenticated/blueprints")({
  head: () => ({
    meta: [
      { title: "Blueprint Library — Third Room HQ" },
      { name: "description", content: "Reusable operating patterns, playbooks, and templates." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BlueprintsPage,
});

const BLUEPRINTS = [
  { title: "Partner onboarding", category: "Operations" },
  { title: "Launch sequence", category: "Product" },
  { title: "Decision review", category: "Leadership" },
];

function BlueprintsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 10</p>
        <h1 className="mt-1 font-display text-4xl">Blueprint Library</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          A reusable library of playbooks, workflows, and structural patterns for execution.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {BLUEPRINTS.map((blueprint) => (
          <article key={blueprint.title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-charcoal" />
              <h2 className="font-display text-xl">{blueprint.title}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{blueprint.category}</p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Blocks className="h-4 w-4" /> Blueprints will connect directly to workflows, docs, and decision history.
        </div>
      </section>
    </div>
  );
}
