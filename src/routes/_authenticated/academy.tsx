import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/academy")({
  head: () => ({
    meta: [
      { title: "Academy — Third Room HQ" },
      { name: "description", content: "Share playbooks, onboarding, and learning materials." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AcademyPage,
});

const PROGRAMS = [
  { title: "Partner onboarding", level: "Core" },
  { title: "Operations playbooks", level: "Advanced" },
  { title: "AI enablement", level: "New" },
];

function AcademyPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 20</p>
        <h1 className="mt-1 font-display text-4xl">Academy</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Build a learning layer for onboarding, certification, and knowledge transfer.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {PROGRAMS.map((program) => (
          <article key={program.title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-charcoal" />
              <h2 className="font-display text-xl">{program.title}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{program.level}</p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" /> Learning paths and training progress will be tracked here.
        </div>
      </section>
    </div>
  );
}
