import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/community")({
  head: () => ({
    meta: [
      { title: "Community — Third Room HQ" },
      { name: "description", content: "Coordinate community, feedback, and engagement loops." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CommunityPage,
});

const THREADS = [
  { title: "Feedback loop", status: "Active" },
  { title: "Member updates", status: "Queued" },
  { title: "Events", status: "Planning" },
];

function CommunityPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 21</p>
        <h1 className="mt-1 font-display text-4xl">Community</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Create a visible layer for feedback, events, and community relationships.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {THREADS.map((thread) => (
          <article key={thread.title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <MessagesSquare className="h-4 w-4 text-charcoal" />
              <h2 className="font-display text-xl">{thread.title}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{thread.status}</p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" /> Community signals, events, and relationships will be managed here.
        </div>
      </section>
    </div>
  );
}
