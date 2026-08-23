import type { Route } from "./+types/sandbox";
import { SplitView } from "~/features/sandbox/SplitView";
import { requireAuth } from "~/lib/supabase/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request);
  return null;
}

export function meta ({}:Route.MetaArgs) {
  return [
    { title: "Sandbox — Elasticware" },
    {
      name: "description",
      content:
        "Split-screen sandbox: see the mock shop and agent dashboard side-by-side and watch the AI-to-agent handover happen live.",
    },
    { property: "og:title", content: "Sandbox — Elasticware" },
    {
      property: "og:description",
      content:
        "Watch the AI-to-agent handover live, side-by-side. The store on the left, the agent console on the right.",
    },
    { property: "og:type", content: "website" },
  ];
}

export default function SandboxRoute() {
  return <SplitView />;
}
