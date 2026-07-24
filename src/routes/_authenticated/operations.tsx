import { createFileRoute } from "@tanstack/react-router";
import { Activity, Workflow } from "lucide-react";

export const Route = createFileRoute("/_authenticated/operations")({
  head: () => ({
    meta: [
      { title: "Operations — Third Room HQ" },
      { name: "description", content: "Monitor delivery, execution, and internal operating rhythm." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OperationsPage,
});

const OPS = [
  { title: "Delivery health", value: "92%" },
  { title: "Escalations", value: "4" },
  { title: "Cycle time", value: "6d" },
];

function OperationsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 12</p>
        <h1 className="mt-1 font-display text-4xl">Operations</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Provide a live operating system for delivery, coordination, and execution management.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {OPS.map((item) => (
          <article key={item.title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-charcoal" />
              <h2 className="font-display text-xl">{item.title}</h2>
            </div>
            <p className="mt-3 text-3xl font-semibold">{item.value}</p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Workflow className="h-4 w-4" /> Workflow checkpoints, staffing views, and milestone handoffs will be owned here.
        </div>
      </section>
    </div>
  );
}
