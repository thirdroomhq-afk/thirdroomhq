import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BrainCircuit, Compass, MessageSquareText, Sparkles, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "Home — Third Room HQ" },
      { name: "description", content: "A calm home surface for focus, memory, and next actions." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: HomePage,
});

const QUICK_ACTIONS = [
  { title: "Continue", subtitle: "Brand Bible", to: "/knowledge" },
  { title: "Resume", subtitle: "Partner Proposal", to: "/documents" },
  { title: "Open", subtitle: "Website sprint", to: "/products" },
];

const MEMORY_ITEMS = [
  "Pricing architecture",
  "Blueprint ideas",
  "Meeting with dev",
];

function HomePage() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-border bg-card p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Good evening, Snigdha</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">Thursday, July 24</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          A quiet place to begin. Pick up where you left off, capture something new, or let HQ help you find the next step.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Today</p>
              <h2 className="mt-2 font-display text-2xl">Your focus is clear</h2>
            </div>
            <div className="rounded-full bg-stone-warm px-3 py-1 text-xs font-medium text-charcoal">2 tasks</div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-muted/60 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Tasks</p>
              <p className="mt-2 font-display text-3xl">2</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/60 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Meeting</p>
              <p className="mt-2 font-display text-3xl">1</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/60 p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Captures</p>
              <p className="mt-2 font-display text-3xl">3</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.title} to={action.to} className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-charcoal">
                <Compass className="h-4 w-4" /> {action.title} · {action.subtitle}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <h2 className="font-display text-2xl">Ask HQ</h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Find pricing, summarize yesterday, or generate a proposal.</p>
          <div className="mt-4 rounded-2xl border border-border bg-muted/60 p-4">
            <p className="text-sm text-muted-foreground">“Find our pricing.”</p>
          </div>
          <Link to="/ai" className="mt-4 inline-flex items-center gap-2 text-sm text-foreground hover:text-charcoal">
            Open AI workspace <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            <h2 className="font-display text-2xl">Recent memory</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {MEMORY_ITEMS.map((item) => (
              <li key={item} className="rounded-2xl border border-border bg-muted/60 px-4 py-3 text-sm text-foreground">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4" />
            <h2 className="font-display text-2xl">Quick capture</h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Paste an idea, upload a file, or speak a thought into the room.</p>
          <Link to="/blankspace" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Capture something
          </Link>
        </section>
      </div>
    </div>
  );
}
