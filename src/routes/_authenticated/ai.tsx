import { createFileRoute } from "@tanstack/react-router";
import { Bot, Sparkles, Wand2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ai")({
  head: () => ({
    meta: [
      { title: "AI — Third Room HQ" },
      { name: "description", content: "AI chief of staff surface for summaries, prep, retrieval, and action suggestions." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AiPage,
});

const PROMPTS = [
  { title: "Daily brief", description: "Summarize priorities, deadlines, and risks for the day." },
  { title: "Meeting prep", description: "Pull the latest context for the next important conversation." },
  { title: "Decision recall", description: "Recover rationale, alternatives, and owners in seconds." },
  { title: "Proposal drafts", description: "Turn partner context into a tailored proposal outline." },
];

function AiPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 06</p>
        <h1 className="mt-1 font-display text-4xl">AI</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          The chief of staff layer for summaries, planning, research, and retrieval across the company memory.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-warm">Assistant</p>
            <h2 className="mt-2 font-display text-2xl">An operating layer for the whole company</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every conversation, project, and decision can be surfaced through a single AI experience.
            </p>
          </div>
          <div className="rounded-full bg-charcoal p-3 text-offwhite">
            <Bot className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {PROMPTS.map((prompt) => (
            <div key={prompt.title} className="rounded-xl border border-border bg-muted/60 p-4">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-charcoal" />
                <h3 className="font-display text-lg">{prompt.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{prompt.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" /> The AI experience is being wired into the knowledge, projects, and partner modules first.
        </div>
      </section>
    </div>
  );
}
