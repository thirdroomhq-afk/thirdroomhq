import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Zap, Github, ExternalLink, KeyRound, LogOut, Trash2 } from "lucide-react";
import { clearMemoryEntries } from "@/lib/memory-store";
import { signOutDemo } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Third Room HQ" },
      { name: "description", content: "Developer settings, Codespace launcher, and vault." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();

  function handleSignOut() {
    signOutDemo();
    navigate({ to: "/auth", replace: true });
  }

  function handleClearMemory() {
    clearMemoryEntries();
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Module 05</p>
        <h1 className="mt-1 font-display text-4xl">Settings</h1>
      </header>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Developer · Codespace Launcher</h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Open the app's cloud-based VS Code environment from any device. Prompt AI to make feature updates and deploy changes live.
            </p>
          </div>
          <Github className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="gap-2">
            <a href="https://github.com/codespaces/new" target="_blank" rel="noreferrer">
              <Zap className="h-4 w-4" /> Open App Codespace <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" /> Repository
            </a>
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Encrypted Vault</h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              External API credentials (OpenAI, Claude, WhatsApp) are stored securely in Lovable Cloud secrets and are never exposed to the client.
            </p>
          </div>
          <KeyRound className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          To add or rotate a secret, use the chat: "add a secret named OPENAI_API_KEY".
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-2xl">Access</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Founder access is enforced by the <code className="rounded bg-muted px-1">allowed_users</code> allowlist in the database.
          Any Google account not on the list is signed out automatically.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-2xl">Data controls</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Reset the local memory store for this browser session when testing or resetting the workspace.
        </p>
        <Button variant="outline" onClick={handleClearMemory} className="mt-4 gap-2">
          <Trash2 className="h-4 w-4" /> Clear memory
        </Button>
      </section>
    </div>
  );
}
