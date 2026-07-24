import { createFileRoute } from "@tanstack/react-router";
import { Bot, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/automations")({
  head: () => ({
    meta: [
      { title: "Automations — Third Room HQ" },
      { name: "description", content: "Create, manage, and monitor automated workflows." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AutomationsPage,
});

const FLOW_STEPS = [
  { title: "Intake", state: "Live" },
  { title: "Review", state: "Ready" },
  { title: "Publish", state: "Queued" },
];

function AutomationsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 16</p>
        <h1 className="mt-1 font-display text-4xl">Automations</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Manage repeatable workflows and AI-driven operations from a dedicated control center.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {FLOW_STEPS.map((step) => (
          <article key={step.title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-charcoal" />
              <h2 className="font-display text-xl">{step.title}</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{step.state}</p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" /> Workflow triggers, approvals, and handoffs will be orchestrated here.
        </div>
      </section>
    </div>
  );
}
