import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/db/database.types";
import { Sentry } from "~/lib/sentry.server";

type SupabaseClient = ReturnType<typeof createClient<Database>>;

export function useWidgetSupabase(sessionId: string, orgKey: string = "demo") {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    async function init(attempt = 1) {
      try {
        const res = await fetch("/api/widget-auth", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ session_id: sessionId, org_key: orgKey }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Auth failed");

        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        if (!url || !key) throw new Error("Missing Supabase env vars");

        const supabase = createClient<Database>(url, key, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
          global: {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          },
        });

        supabase.realtime.setAuth(data.token);

        if (!cancelled) setClient(supabase);
      } catch (err) {
        Sentry.captureException(err);
        if (cancelled) return;

        if (attempt < 3) {
          const delay = Math.min(1000 * 2 ** attempt, 8000);
          setTimeout(() => init(attempt + 1), delay);
          return;
        }

        setError(err instanceof Error ? err.message : "Auth failed");
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [sessionId, orgKey]);

  return { client, error };
}