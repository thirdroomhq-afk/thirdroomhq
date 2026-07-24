import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — Third Room HQ" },
      { name: "description", content: "Connect, manage, and toggle third-party integrations." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const qc = useQueryClient();
  const { data: integrations = [] } = useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      const { data } = await supabase.from("integrations").select("*").order("display_name");
      return (data ?? []) as Tables<"integrations">[];
    },
  });

  async function toggle(id: string, enabled: boolean) {
    const { error } = await supabase.from("integrations").update({ is_enabled: enabled }).eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["integrations"] });
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 04</p>
        <h1 className="mt-1 font-display text-4xl">Integrations Hub</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Enable or pause each service. Toggling off hides it from the ecosystem launcher.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((i) => (
          <div key={i.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal text-offwhite font-semibold">
                  {i.display_name[0]}
                </div>
                <div>
                  <p className="font-display text-lg leading-tight">{i.display_name}</p>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{i.provider}</p>
                </div>
              </div>
              <Switch checked={i.is_enabled} onCheckedChange={(v) => toggle(i.id, v)} />
            </div>
            {i.launch_url && (
              <a href={i.launch_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                Open <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
