import type { Route } from "./+types/dashboard";
import { supabaseApi } from "~/lib/supabase/api";
import { DashboardShell } from "../features/dashboard/DashboardShell";
import { useLoaderData } from "react-router";

export async function loader() {
  const { data: org } = await supabaseApi
    .from("organizations")
    .select("id")
    .eq("slug", "demo")
    .single();

  return { orgId: org?.id ?? null };
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
  const { orgId } = useLoaderData<typeof loader>();
  return <DashboardShell orgId={orgId} />;
}