import { redirect } from "react-router";
import { createSupabaseServerClient } from "./supabase.server";
import type { Database } from "~/lib/db/database.types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type AgentRow = Database["public"]["Tables"]["agents"]["Row"];

export interface AuthContext {
  user: SupabaseUser;
  agent: AgentRow;
  orgId: string;
  supabase: ReturnType<typeof createSupabaseServerClient>["supabase"];
  headers: Headers;
}

export async function requireAuth(request: Request): Promise<AuthContext> {
  const { supabase, headers } = createSupabaseServerClient(request);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
  const pathname = new URL(request.url).pathname.replace(/\.data$/, "");
  const redirectTo = encodeURIComponent(pathname);
  throw redirect(`/login?redirectTo=${redirectTo}`);
}

  const { data: agent, error: agentError } = await supabase
    .from("agents")
    .select("*")
    .eq("id", user.id)
    .single();

  if (agentError || !agent) {
    throw redirect("/login?error=unauthorized");
  }

  if (!agent.org_id) {
    throw redirect("/login?error=no-org");
  }

  return {
    user,
    agent,
    orgId: agent.org_id,
    supabase,
    headers,
  };
}