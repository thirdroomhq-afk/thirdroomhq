import { createFileRoute } from "@tanstack/react-router";
import { FileText, Sparkles, GitBranch } from "lucide-react";

export const Route = createFileRoute("/_authenticated/documents")({
  head: () => ({
    meta: [
      { title: "Documents — Third Room HQ" },
      { name: "description", content: "Central document hub for proposals, contracts, notes, and templates." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DocumentsPage,
});

const DOCS = [
  { title: "Partner proposal v3", kind: "Proposal" },
  { title: "Studio operating SOP", kind: "SOP" },
  { title: "Launch roadmap", kind: "Roadmap" },
];

function DocumentsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 08</p>
        <h1 className="mt-1 font-display text-4xl">Documents</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          A central document hub for proposals, contracts, meeting notes, templates, and AI summaries.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-warm">Knowledge infrastructure</p>
            <h2 className="mt-2 font-display text-2xl">Versioned, searchable, and structured</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Documents become reusable company assets instead of one-off files buried in folders.
            </p>
          </div>
          <div className="rounded-full bg-stone-warm p-3 text-charcoal">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {DOCS.map((doc) => (
            <div key={doc.title} className="rounded-xl border border-border bg-muted/60 p-4">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-charcoal" />
                <h3 className="font-display text-lg">{doc.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{doc.kind}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" /> AI summarization and version history will sit directly inside this module.
        </div>
      </section>
    </div>
  );
}
