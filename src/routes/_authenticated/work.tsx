import { createFileRoute, Link } from "@tanstack/react-router";
import { FolderKanban, FileText, Boxes, Compass, BadgeDollarSign, Workflow } from "lucide-react";

export const Route = createFileRoute("/_authenticated/work")({
  head: () => ({
    meta: [
      { title: "Work — Third Room HQ" },
      { name: "description", content: "A calm workspace for projects, documents, products, and operations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WorkPage,
});

const WORK_ITEMS = [
  { title: "Projects", description: "Track delivery and milestones", to: "/projects", icon: FolderKanban },
  { title: "Documents", description: "Files, proposals, and notes", to: "/documents", icon: FileText },
  { title: "Products", description: "Roadmaps and launches", to: "/products", icon: Boxes },
  { title: "Blueprints", description: "Playbooks and systems", to: "/blueprints", icon: Compass },
  { title: "Sales", description: "Deals and momentum", to: "/sales", icon: BadgeDollarSign },
  { title: "Operations", description: "Delivery and execution", to: "/operations", icon: Workflow },
];

function WorkPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Work</p>
        <h1 className="mt-1 font-display text-4xl">A place for the day’s work</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Everything important lives here, grouped by context rather than by admin labels.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {WORK_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} to={item.to} className="rounded-3xl border border-border bg-card p-5 shadow-card transition-colors hover:border-charcoal">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-charcoal" />
                <h2 className="font-display text-xl">{item.title}</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
