import type { Route } from "./+types/logout";
import { redirect } from "react-router";
import { createSupabaseServerClient } from "~/lib/supabase/supabase.server";

export async function action({ request }: Route.ActionArgs) {
  const { supabase, headers } = createSupabaseServerClient(request);
  await supabase.auth.signOut();
  throw redirect("/login", { headers });
}