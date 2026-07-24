import { createFileRoute } from "@tanstack/react-router";
import { Boxes, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/products")({
  head: () => ({
    meta: [
      { title: "Products — Third Room HQ" },
      { name: "description", content: "Manage products, roadmaps, pricing, and launch plans in one place." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProductsPage,
});

const PRODUCTS = [
  { name: "Blankspace", stage: "Growth" },
  { name: "Essentials", stage: "Launch" },
  { name: "Blueprints", stage: "Validation" },
];

function ProductsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 09</p>
        <h1 className="mt-1 font-display text-4xl">Products</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Track every product across roadmap, pricing, documentation, launch planning, and feedback.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {PRODUCTS.map((product) => (
          <article key={product.name} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl">{product.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Stage · {product.stage}</p>
              </div>
              <div className="rounded-full bg-stone-warm px-2 py-1 text-[10px] uppercase tracking-wider text-charcoal">
                Active
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" /> Product analytics, changelog, and launch planning will be surfaced here.
        </div>
      </section>
    </div>
  );
}
