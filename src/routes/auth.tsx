import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Third Room HQ" },
      { name: "description", content: "Founder sign-in for Third Room HQ." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notAllowed, setNotAllowed] = useState<string | null>(null);

  useEffect(() => {
    // If already signed in and allowed, bounce to dashboard; if signed in but not allowed, sign out.
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      const email = data.session.user.email ?? "";
      const { data: allowed } = await supabase
        .from("allowed_users")
        .select("email")
        .ilike("email", email)
        .maybeSingle();
      if (allowed) navigate({ to: "/dashboard", replace: true });
      else {
        await supabase.auth.signOut();
        setNotAllowed(email);
      }
    });
  }, [navigate]);

  async function handleGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth",
    });
    if (result.error) {
      toast.error(result.error.message ?? "Sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    // popup / session set — redirect
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="grid min-h-screen bg-background md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-charcoal p-12 text-offwhite md:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-offwhite">
            <div className="h-4 w-2 bg-charcoal" />
          </div>
          <span className="font-display text-lg">Third Room</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-stone-warm">Project Atlas</p>
          <h1 className="mt-6 font-display text-5xl leading-[1.05]">
            The room behind the room.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-offwhite/70">
            Blankspace™ ▸ Blueprint™ ▸ Build™ ▸ Bridge™ ▸ Beyond™ — every partner
            journey, every decision, one workspace.
          </p>
        </div>
        <p className="text-xs text-offwhite/50">© Third Room Studio</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-3xl">Founder access</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with the studio Google account.
          </p>

          {notAllowed && (
            <div className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              <p className="font-medium">Access denied</p>
              <p className="mt-1 text-xs opacity-80">
                {notAllowed} is not on the founder allowlist.
              </p>
            </div>
          )}

          <Button
            onClick={handleGoogle}
            disabled={loading}
            className="mt-8 w-full gap-3"
            size="lg"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Only allowlisted founder emails can enter. All others will be signed out automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.5-1.7 4.3-5.5 4.3-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.5C16.9 3.6 14.7 2.7 12 2.7 6.8 2.7 2.6 6.9 2.6 12.1S6.8 21.5 12 21.5c6.9 0 9.4-4.8 9.4-9v-.5c0-.6 0-1.1-.1-1.7H12z"/>
    </svg>
  );
}
