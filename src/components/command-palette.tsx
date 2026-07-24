import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { FileText, CheckSquare, Users, Sparkles, LayoutDashboard } from "lucide-react";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const { data } = useQuery({
    queryKey: ["global-search", query],
    enabled: open,
    queryFn: async () => {
      const q = query.trim();
      const [captures, tasks, partners] = await Promise.all([
        q
          ? supabase.from("captures").select("id, summary, raw_content, capture_type, created_at")
              .or(`summary.ilike.%${q}%,raw_content.ilike.%${q}%`).order("created_at", { ascending: false }).limit(6)
          : supabase.from("captures").select("id, summary, raw_content, capture_type, created_at").order("created_at", { ascending: false }).limit(6),
        q
          ? supabase.from("tasks").select("id, task_text, due_date, status").ilike("task_text", `%${q}%`).order("due_date", { ascending: true, nullsFirst: false }).limit(6)
          : supabase.from("tasks").select("id, task_text, due_date, status").eq("status", "pending").order("due_date", { ascending: true, nullsFirst: false }).limit(6),
        q
          ? supabase.from("partners").select("id, brand_name, current_phase").ilike("brand_name", `%${q}%`).limit(6)
          : supabase.from("partners").select("id, brand_name, current_phase").limit(6),
      ]);
      return { captures: captures.data ?? [], tasks: tasks.data ?? [], partners: partners.data ?? [] };
    },
  });

  function go(to: "/dashboard" | "/blankspace" | "/partners" | "/integrations" | "/settings") {
    onOpenChange(false);
    navigate({ to });
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput value={query} onValueChange={setQuery} placeholder="Search captures, tasks, partners…" />
      <CommandList>
        <CommandEmpty>Nothing found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/dashboard")}><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</CommandItem>
          <CommandItem onSelect={() => go("/blankspace")}><Sparkles className="mr-2 h-4 w-4" /> Blankspace</CommandItem>
          <CommandItem onSelect={() => go("/partners")}><Users className="mr-2 h-4 w-4" /> Partners</CommandItem>
        </CommandGroup>

        {data?.captures.length ? (
          <CommandGroup heading="Captures">
            {data.captures.map((c) => (
              <CommandItem key={c.id} onSelect={() => go("/blankspace")}>
                <FileText className="mr-2 h-4 w-4" />
                <span className="truncate">{c.summary || c.raw_content?.slice(0, 80) || "Untitled capture"}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {data?.tasks.length ? (
          <CommandGroup heading="Tasks">
            {data.tasks.map((t) => (
              <CommandItem key={t.id} onSelect={() => go("/dashboard")}>
                <CheckSquare className="mr-2 h-4 w-4" />
                <span className="truncate">{t.task_text}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {data?.partners.length ? (
          <CommandGroup heading="Partners">
            {data.partners.map((p) => (
              <CommandItem key={p.id} onSelect={() => go("/partners")}>
                <Users className="mr-2 h-4 w-4" />
                <span className="truncate">{p.brand_name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{p.current_phase}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}
