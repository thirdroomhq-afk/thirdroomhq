import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Lock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Third Room HQ" },
      { name: "description", content: "Founder-only command center for Third Room Studio." },
      { property: "og:title", content: "Third Room HQ" },
      { property: "og:description", content: "Founder-only command center for Third Room Studio." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
      else setChecking(false);
    });
  }, [navigate]);

  if (checking) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-between px-6 py-10">
        <header className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-charcoal">
            <div className="h-4 w-2 bg-stone-warm" />
          </div>
          <span className="font-display text-lg tracking-tight">Third Room</span>
        </header>

        <main className="flex flex-1 flex-col justify-center py-16">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Project Atlas</p>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl">
              The central room where the studio thinks.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Third Room HQ is the founder-only command center — captures, decisions,
              partners, and integrations, unified into a single workspace. Capture first.
              Organize never.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/auth"
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:gap-3 hover:bg-primary/90"
              >
                Enter HQ <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" /> Founders only. Google SSO required.
              </p>
            </div>
          </div>
        </main>

        <footer className="flex items-center justify-between border-t border-border pt-6 text-xs text-muted-foreground">
          <span>Third Room Studio · Business design & systems studio</span>
          <span>We design businesses that work.</span>
        </footer>
      </div>
    </div>
  );
}
