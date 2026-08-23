import type { Route } from "./+types/dashboard";
import { DashboardShell } from "../features/dashboard/DashboardShell";
import { requireAuth } from "~/lib/supabase/auth.server";
import { useLoaderData } from "react-router";
import { redirect } from "react-router";
import { createSupabaseServerClient } from "~/lib/supabase/supabase.server";


export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/dashboard";

  const { supabase, headers } = createSupabaseServerClient(request);

  const email =
    intent === "demo" ? "demo@elasticbot.com" : (formData.get("email") as string);
  const password =
    intent === "demo" ? "demo123456" : (formData.get("password") as string);

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return Response.json({ error: error.message }, { headers });
  }

  throw redirect(intent === "demo" ? "/sandbox" : redirectTo, { headers });
}

export async function loader({ request }: Route.LoaderArgs) {
  const { user, agent, orgId, headers } = await requireAuth(request);
 return Response.json(
  { user, orgId, agentName: agent["full name"] },
  { headers }
);
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Agent Dashboard — Elasticware" },
    {
      name: "description",
      content:
        "The agent console: view the ticket queue, read message threads, and see the status of every conversation — from bot-handled to resolved.",
    },
    { property: "og:title", content: "Agent Dashboard — Elasticware" },
    {
      property: "og:description",
      content:
        "Agent console with a live ticket queue and message threads. See bot-handled, open, and resolved conversations.",
    },
    { property: "og:type", content: "website" },
  ];
}

export default function DashboardRoute() {
  const {orgId, user, agentName} = useLoaderData<typeof loader>()
  return (
    <DashboardShell
      orgId={orgId}
      user={user}
      name={agentName}

    />
  );
}