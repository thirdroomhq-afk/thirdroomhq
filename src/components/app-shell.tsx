import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Sparkles,
  Users,
  Plug,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { CommandPalette } from "./command-palette";

const NAV = [
  { to: "/dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { to: "/blankspace" as const, label: "Blankspace", icon: Sparkles },
  { to: "/partners" as const, label: "Partners", icon: Users },
  { to: "/integrations" as const, label: "Integrations", icon: Plug },
  { to: "/settings" as const, label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const qc = useQueryClient();
  const [email, setEmail] = useState<string>("");
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 p-4 md:p-6">
        {/* Sidebar */}
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-60 shrink-0 flex-col justify-between rounded-2xl bg-sidebar p-5 text-sidebar-foreground md:flex">
          <div>
            <div className="flex items-center gap-2 px-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-stone-warm">
                <div className="h-4 w-2 bg-charcoal" />
              </div>
              <div>
                <p className="font-display text-base leading-none">Third Room</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-warm/70">HQ · Atlas</p>
              </div>
            </div>

            <button
              onClick={() => setPaletteOpen(true)}
              className="mt-8 flex w-full items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2 text-left text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="flex-1">Search everything</span>
              <kbd className="rounded bg-black/30 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
            </button>

            <nav className="mt-6 space-y-1">
              {NAV.map(({ to, label, icon: Icon }) => {
                const active = pathname === to || pathname.startsWith(to + "/");
                return (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-stone-warm text-charcoal"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="border-t border-sidebar-border pt-4">
              <p className="truncate px-2 text-[11px] text-sidebar-foreground/50">{email}</p>
              <button
                onClick={signOut}
                className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
