import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "~/lib/supabase/supabase.client";

interface UseSupabaseRealtimeOptions {
  baseChannelName: string; // e.g. "tickets:org:demo-uuid"
  table: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
  queryKey: unknown[];
  enabled?: boolean;
  debug?: boolean;
}

export function useSupabaseRealtime({
  baseChannelName,
  table,
  event = "*",
  filter,
  queryKey,
  enabled = true,
  debug = false,
}: UseSupabaseRealtimeOptions) {
  const queryClient = useQueryClient();
  const instanceRef = useRef(crypto.randomUUID().slice(0, 8));
  const optionsRef = useRef({ table, event, filter, queryKey, debug });

  // Keep latest options in a ref so the effect always sees current values
  // without re-subscribing when they change.
  useEffect(() => {
    optionsRef.current = { table, event, filter, queryKey, debug };
  });

  const channelName = `${baseChannelName}:inst:${instanceRef.current}`;

  useEffect(() => {
    if (!enabled) return;

    const { table: t, event: e, filter: f, queryKey: key, debug: d } =
      optionsRef.current;

    const log = (...args: unknown[]) => {
      if (d) console.log(`[Realtime:${channelName}]`, ...args);
    };

    log("Subscribing...", { table: t, event: e, filter: f });

    const config: any = { event: e, schema: "public", table: t };
    if (f) config.filter = f;

    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", config, (payload) => {
        log("Change received:", payload);
        queryClient.invalidateQueries({ queryKey: key });
      })
      .subscribe((status, err) => {
        log("Status:", status);
        if (status === "CHANNEL_ERROR" || err) {
          console.error(`[Realtime:${channelName}] Subscription error:`, err);
        }
      });

    return () => {
      log("Cleaning up...");
      supabase.removeChannel(channel);
    };
  }, [channelName, enabled, queryClient]);
}