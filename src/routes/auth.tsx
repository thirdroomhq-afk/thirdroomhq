import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

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

  useEffect(() => {
    navigate({ to: "/dashboard", replace: true });
  }, [navigate]);

  return null;
}
