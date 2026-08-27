import type { Route } from "./+types/api.widget-auth";
import { signWidgetToken } from "~/lib/supabase/widget-auth.server";
import { supabaseApi } from "~/lib/supabase/api";
import { corsResponse, corsPreflight } from "~/lib/cors";

export async function action({ request }: Route.ActionArgs) {
  if (request.method === "OPTIONS") return corsPreflight();

  const form = await request.formData();
  const session_id = form.get("session_id");
  const org_key = form.get("org_key");

  if (typeof session_id !== "string" || typeof org_key !== "string") {
    return corsResponse({ error: "Missing session_id or org_key" }, 400);
  }

  const { data: org, error: orgError } = await supabaseApi
    .from("organizations")
    .select("id")
    .eq("slug", org_key)
    .single();

  if (orgError || !org) {
    return corsResponse({ error: "Invalid org_key" }, 404);
  }

  const token = await signWidgetToken({
    sub: session_id,
    org_id: org.id,
  });

  return corsResponse({ token, expires_in: 3600 });
}