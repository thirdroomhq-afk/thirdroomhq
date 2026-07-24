import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrainCircuit, Plus, Sparkles, Clock3, Bookmark, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadMemoryEntries, saveMemoryEntry, type MemoryEntry } from "@/lib/memory-store";

export const Route = createFileRoute("/_authenticated/memory")({
  head: () => ({
    meta: [
      { title: "Memory — Third Room HQ" },
      { name: "description", content: "A dedicated memory layer for lasting notes, preferences, and context." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MemoryPage,
});

const DEFAULT_MEMORY_ITEMS = [
  {
    title: "Product direction",
    details: "Keep the workspace calm, simple, and action-oriented.",
    type: "Preference",
  },
  {
    title: "Partner context",
    details: "They prefer concise updates and clear next steps.",
    type: "Context",
  },
  {
    title: "Launch notes",
    details: "Website launch should stay focused on clarity and momentum.",
    type: "Note",
  },
];

function MemoryPage() {
  const [items, setItems] = useState<MemoryEntry[]>([]);

  useEffect(() => {
    const stored = loadMemoryEntries();
    const seeded = stored.length > 0 ? stored : DEFAULT_MEMORY_ITEMS.map((item) => ({
      id: `${item.title}-${Math.random()}`,
      createdAt: new Date().toISOString(),
      ...item,
    }));
    setItems(seeded);
  }, []);

  function handleAddMemory() {
    const entry = saveMemoryEntry({
      title: "New memory",
      details: "Added from the memory workspace",
      type: "Note",
    });
    setItems((prev) => [entry, ...prev]);
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Memory</p>
            <h1 className="mt-1 font-display text-4xl">A lasting layer for what matters</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Store preferences, people context, and important reminders so the workspace feels grounded and useful over time.
            </p>
          </div>
          <Button onClick={handleAddMemory} className="gap-2">
            <Plus className="h-4 w-4" /> Add memory
          </Button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            <h2 className="font-display text-2xl">Saved memories</h2>
          </div>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border bg-muted/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <span className="rounded-full bg-stone-warm px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-charcoal">
                    {item.type}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.details}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            <h2 className="font-display text-2xl">How it works</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><Sparkles className="mt-0.5 h-4 w-4 text-charcoal" /> Capture ideas, preferences, or context once.</li>
            <li className="flex gap-2"><Search className="mt-0.5 h-4 w-4 text-charcoal" /> Retrieve them later through the workspace search and AI surfaces.</li>
            <li className="flex gap-2"><Clock3 className="mt-0.5 h-4 w-4 text-charcoal" /> Let the system build a richer, more personal operating memory over time.</li>
          </ul>
          <Link to="/blankspace" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-charcoal">
            Capture new memory <Plus className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
