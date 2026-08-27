import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import type { Database } from "~/lib/db/database.types";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
if (!SUPABASE_URL) {
  throw new Error("VITE_SUPABASE_URL is required");
}

const SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("VITE_SUPABASE_PUBLISHABLE_KEY is required");
}


const url: string = SUPABASE_URL;
const key: string = SUPABASE_PUBLISHABLE_KEY;

export function createSupabaseServerClient(request: Request) {
  const headers = new Headers();

  const supabase = createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
       
        setAll(cookiesToSet: Array<{ name: string; value: string; options: any }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append("Set-Cookie", serializeCookieHeader(name, value, options));
          });
        },
      },
    }
  );

  return { supabase, headers };
}
