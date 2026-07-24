import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signInDemo } from "@/lib/auth";

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

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage.getItem("thirdroom-auth")) {
      navigate({ to: "/home", replace: true });
    }
  }, [navigate]);

  function handleSignIn() {
    setLoading(true);
    signInDemo();
    navigate({ to: "/home", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-card">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Third Room HQ</p>
        <h1 className="mt-3 font-display text-3xl">Welcome back</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in to access your workspace, memory, and AI briefs.
        </p>
        <Button onClick={handleSignIn} disabled={loading} className="mt-6 w-full">
          {loading ? "Signing in…" : "Continue to workspace"}
        </Button>
      </div>
    </div>
  );
}
