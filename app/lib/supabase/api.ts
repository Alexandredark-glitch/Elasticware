import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/db/database.types";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL) {
  throw new Error("VITE_SUPABASE_URL is required");
}
if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("VITE_SUPABASE_PUBLISHABLE_KEY is required");
}

export const supabaseApi = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);