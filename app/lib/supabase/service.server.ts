import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/db/database.types";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is required. Find it in Supabase Dashboard → Project Settings → API."
  );
}

export const supabaseService = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);