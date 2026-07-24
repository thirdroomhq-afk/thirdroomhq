import { createFileRoute } from "@tanstack/react-router";
import { Users, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/people")({
  head: () => ({
    meta: [
      { title: "People — Third Room HQ" },
      { name: "description", content: "Track staffing, responsibilities, and team health." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PeoplePage,
});

const PEOPLE = [
  { name: "Ava", role: "Operations Lead" },
  { name: "Nico", role: "Product Partner" },
  { name: "Mina", role: "Growth Strategist" },
];

function PeoplePage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 13</p>
        <h1 className="mt-1 font-display text-4xl">People</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Coordinate talent, roles, capacity, and execution accountability across the organization.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {PEOPLE.map((person) => (
          <article key={person.name} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-charcoal" />
              <h2 className="font-display text-xl">{person.name}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{person.role}</p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" /> Team capacity, hiring plans, and ownership views will be managed here.
        </div>
      </section>
    </div>
  );
}
