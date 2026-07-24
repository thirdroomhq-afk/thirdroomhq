import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock3, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Third Room HQ" },
      { name: "description", content: "Project management workspace for milestones, tasks, dependencies, and health." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProjectsPage,
});

const PROJECTS = [
  { name: "Blankspace rollout", status: "In progress", owner: "Founders", progress: "72%" },
  { name: "Partner onboarding", status: "Review", owner: "Operations", progress: "54%" },
  { name: "AI briefing system", status: "Planned", owner: "Product", progress: "24%" },
];

function ProjectsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 05</p>
        <h1 className="mt-1 font-display text-4xl">Projects</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          A project system designed around milestones, dependencies, AI summaries, and healthy delivery.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {PROJECTS.map((project) => (
          <article key={project.name} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl">{project.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Owner · {project.owner}</p>
              </div>
              <div className="rounded-full bg-stone-warm px-2 py-1 text-[10px] uppercase tracking-wider text-charcoal">
                {project.status}
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-muted p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">{project.progress}</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-border">
                <div className="h-2 rounded-full bg-charcoal" style={{ width: project.progress }} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" /> Milestones tracked
              <Clock3 className="ml-2 h-4 w-4" /> Dependencies planned
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">AI status summaries</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This view is where future AI summaries, risk flags, and next actions will live.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
            <Sparkles className="h-4 w-4" /> Coming soon
          </div>
        </div>
      </section>
    </div>
  );
}
