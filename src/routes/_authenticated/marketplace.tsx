import { createFileRoute } from "@tanstack/react-router";
import { Store, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Third Room HQ" },
      { name: "description", content: "Surface offerings, channels, and commercial opportunities." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MarketplacePage,
});

const OFFERS = [
  { title: "Studio Sprint", status: "Available" },
  { title: "Blueprint Pack", status: "Launching" },
  { title: "Advisory Retainer", status: "Open" },
];

function MarketplacePage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 19</p>
        <h1 className="mt-1 font-display text-4xl">Marketplace</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Make offers, services, and commerce channels visible and easier to coordinate.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {OFFERS.map((offer) => (
          <article key={offer.title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-charcoal" />
              <h2 className="font-display text-xl">{offer.title}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{offer.status}</p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" /> Commercial packaging, channels, and momentum will be managed here.
        </div>
      </section>
    </div>
  );
}
