import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "~/lib/db/database.types";

export const supabase = createBrowserClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);