import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });

    // Enforce founder allowlist client-side too (RLS is the real gate).
    const email = data.session.user.email ?? "";
    const { data: allowed } = await supabase
      .from("allowed_users")
      .select("email")
      .ilike("email", email)
      .maybeSingle();
    if (!allowed) {
      await supabase.auth.signOut();
      throw redirect({ to: "/auth" });
    }
    return { user: data.session.user };
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
