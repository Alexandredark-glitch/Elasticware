import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/db/database.types";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is required. Find it in Supabase Dashboard → Project Settings → API."
  );
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
if (!SUPABASE_URL) {
  throw new Error("VITE_SUPABASE_URL is required");
}

export const supabaseService = createClient<Database>(
  SUPABASE_URL,
  SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);