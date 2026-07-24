import { createFileRoute, Link } from "@tanstack/react-router";
import { BrainCircuit, Compass, FileText, MessageSquareQuote, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge — Third Room HQ" },
      { name: "description", content: "The company memory layer for projects, prompts, research, and related content." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: KnowledgePage,
});

const KNOWLEDGE_SECTIONS = [
  { title: "Topics", description: "Core themes and company language.", icon: Compass },
  { title: "Projects", description: "Context, outputs, and delivery history.", icon: FileText },
  { title: "Prompt Library", description: "Reusable AI prompts and operating playbooks.", icon: Sparkles },
  { title: "Decision Context", description: "Reasoning behind strategy and product choices.", icon: MessageSquareQuote },
];

function KnowledgePage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 03</p>
        <h1 className="mt-1 font-display text-4xl">Knowledge</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          This is the memory layer for Third Room HQ. Captures, projects, and decisions are organized into a searchable, connected workspace.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-warm">Company Memory</p>
            <h2 className="mt-2 font-display text-2xl">Searchable context, not scattered notes</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              The goal is to make the company’s history and reasoning instantly retrievable by humans and AI.
            </p>
          </div>
          <div className="rounded-full bg-stone-warm px-3 py-1 text-xs font-semibold text-charcoal">
            Phase 1
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {KNOWLEDGE_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="rounded-xl border border-border bg-muted/60 p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-charcoal p-2 text-offwhite">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-lg">{section.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{section.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">AI-ready memory</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every new capture can be linked back to projects, decisions, and the wider knowledge graph.
            </p>
          </div>
          <Link to="/blankspace" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <BrainCircuit className="h-4 w-4" /> Add a capture
          </Link>
        </div>
      </section>
    </div>
  );
}
