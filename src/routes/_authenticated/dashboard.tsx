import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isPast, isToday, parseISO } from "date-fns";
import { ArrowRight, CheckCircle2, Circle, ExternalLink, Plus, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIORITY_MODULES } from "@/lib/prd-modules";
import type { Tables } from "@/integrations/supabase/types";

const PHASES = ["Blankspace", "Blueprint", "Build", "Bridge", "Beyond"] as const;

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Third Room HQ" },
      { name: "description", content: "Command dashboard: health metrics, tasks, partner pipeline, ecosystem launcher." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const qc = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", "pending"],
    queryFn: async () => {
      const { data } = await supabase.from("tasks").select("*").eq("status", "pending").order("due_date", { ascending: true, nullsFirst: false });
      return (data ?? []) as Tables<"tasks">[];
    },
  });

  const { data: partners = [] } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data } = await supabase.from("partners").select("*").order("created_at", { ascending: false });
      return (data ?? []) as Tables<"partners">[];
    },
  });

  const { data: integrations = [] } = useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      const { data } = await supabase.from("integrations").select("*").order("display_name");
      return (data ?? []) as Tables<"integrations">[];
    },
  });

  const { data: captures = [] } = useQuery({
    queryKey: ["captures", "recent"],
    queryFn: async () => {
      const { data } = await supabase.from("captures").select("*").order("created_at", { ascending: false }).limit(6);
      return (data ?? []) as Tables<"captures">[];
    },
  });

  const activePartners = partners.length;
  const avgHealth = partners.length
    ? Math.round(partners.reduce((s, p) => s + (p.health_score ?? 0), 0) / partners.length)
    : 0;

  const overdue = tasks.filter((t) => t.due_date && isPast(parseISO(t.due_date)) && !isToday(parseISO(t.due_date)));
  const dueToday = tasks.filter((t) => t.due_date && isToday(parseISO(t.due_date)));
  const upcoming = tasks.filter((t) => !t.due_date || (!isPast(parseISO(t.due_date)) && !isToday(parseISO(t.due_date))));

  async function toggleTask(id: string) {
    await supabase.from("tasks").update({ status: "done" }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["tasks"] });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Third Room HQ</p>
          <h1 className="mt-1 font-display text-4xl">Command Center</h1>
        </div>
        <Link
          to="/blankspace"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Capture
        </Link>
      </header>

      {/* Bento grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Health */}
        <Card className="lg:col-span-2 bg-charcoal text-offwhite">
          <div className="flex h-full flex-col justify-between p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-stone-warm">System Health</p>
                <h2 className="mt-2 font-display text-3xl">Operations at a glance</h2>
              </div>
              <TrendingUp className="h-5 w-5 text-stone-warm" />
            </div>
            <div className="mt-8 grid grid-cols-3 gap-8">
              <Metric label="System Score" value={`${avgHealth || 84}`} suffix="/100" />
              <Metric label="Active Partners" value={String(activePartners)} />
              <Metric label="Pending Tasks" value={String(tasks.length)} />
            </div>
          </div>
        </Card>

        {/* Tasks */}
        <Card>
          <div className="flex h-full flex-col p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Smart To-Do</h3>
              <span className="text-xs text-muted-foreground">{tasks.length} pending</span>
            </div>
            <div className="mt-4 flex-1 space-y-3 overflow-y-auto max-h-80">
              <TaskGroup label="Overdue" tasks={overdue} tone="destructive" onToggle={toggleTask} />
              <TaskGroup label="Due today" tasks={dueToday} tone="primary" onToggle={toggleTask} />
              <TaskGroup label="Upcoming" tasks={upcoming.slice(0, 6)} tone="muted" onToggle={toggleTask} />
              {tasks.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No tasks yet. Drop thoughts into <Link to="/blankspace" className="underline">Blankspace</Link>.
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Pipeline */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Partner Pipeline</h3>
              <Link to="/partners" className="text-xs text-muted-foreground hover:text-foreground">
                View all <ArrowRight className="inline h-3 w-3" />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-5 gap-2">
              {PHASES.map((phase) => {
                const count = partners.filter((p) => p.current_phase === phase).length;
                return (
                  <div key={phase} className="rounded-lg bg-muted p-3 text-center">
                    <p className="font-display text-2xl">{count}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{phase}™</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 space-y-2">
              {partners.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm">
                  <span className="font-medium">{p.brand_name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{p.current_phase}</span>
                    <span className="inline-flex h-6 w-14 items-center justify-center rounded-full bg-stone-warm text-xs font-semibold text-charcoal">
                      {p.health_score}
                    </span>
                  </div>
                </div>
              ))}
              {partners.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No partners yet. <Link to="/partners" className="underline">Add one</Link>.
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Capture feed */}
        <Card>
          <div className="p-6">
            <h3 className="font-display text-xl">Capture Feed</h3>
            <div className="mt-4 space-y-3">
              {captures.map((c) => (
                <div key={c.id} className="border-b border-border pb-3 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-stone-warm px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-charcoal">
                      {c.capture_type ?? "note"}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {format(parseISO(c.created_at), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-foreground/90">{c.summary || c.raw_content}</p>
                </div>
              ))}
              {captures.length === 0 && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-3 w-3" /> Nothing captured yet.
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Priority modules */}
        <Card className="lg:col-span-3">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Phase 1 operating system</h3>
              <span className="text-xs text-muted-foreground">PRD priority modules</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {PRIORITY_MODULES.map((module) => (
                <Link
                  key={module.id}
                  to={module.route as string}
                  className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-charcoal"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{module.subtitle}</p>
                  <h4 className="mt-2 font-display text-lg">{module.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{module.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </Card>

        {/* Ecosystem launcher */}
        <Card className="lg:col-span-3">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Ecosystem Launcher</h3>
              <Link to="/integrations" className="text-xs text-muted-foreground hover:text-foreground">Manage <ArrowRight className="inline h-3 w-3" /></Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {integrations.filter((i) => i.is_enabled).map((i) => (
                <a
                  key={i.id}
                  href={i.launch_url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-charcoal hover:shadow-card"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal text-offwhite">
                    <span className="text-sm font-semibold">{i.display_name[0]}</span>
                  </div>
                  <span className="text-center text-xs text-foreground">{i.display_name}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card shadow-card", className)}>{children}</div>
  );
}

function Metric({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div>
      <p className="font-display text-4xl">{value}<span className="text-lg text-stone-warm/70">{suffix}</span></p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-stone-warm/80">{label}</p>
    </div>
  );
}

function TaskGroup({
  label, tasks, tone, onToggle,
}: {
  label: string;
  tasks: Tables<"tasks">[];
  tone: "destructive" | "primary" | "muted";
  onToggle: (id: string) => void;
}) {
  if (tasks.length === 0) return null;
  return (
    <div>
      <p className={cn("mb-1 text-[10px] uppercase tracking-wider",
        tone === "destructive" && "text-destructive",
        tone === "primary" && "text-foreground",
        tone === "muted" && "text-muted-foreground",
      )}>{label}</p>
      <ul className="space-y-1">
        {tasks.map((t) => (
          <li key={t.id}>
            <button onClick={() => onToggle(t.id)} className="group flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted">
              {t.status === "done" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
              ) : (
                <Circle className="mt-0.5 h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              )}
              <div className="flex-1">
                <span className="line-clamp-2">{t.task_text}</span>
                {t.due_date && (
                  <span className="text-[10px] text-muted-foreground">{format(parseISO(t.due_date), "MMM d, h:mm a")}</span>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
