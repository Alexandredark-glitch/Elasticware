import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "~/lib/supabase/supabase.client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/lib/db/database.types";

interface UseSupabaseRealtimeOptions {
  baseChannelName: string;
  table: keyof Database["public"]["Tables"];
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
  queryKey: unknown[];
  enabled?: boolean;
  debug?: boolean;
  client?: SupabaseClient<Database>;
}

export function useSupabaseRealtime({
  baseChannelName,
  table,
  event = "*",
  filter,
  queryKey,
  enabled = true,
  debug = false,
  client,
}: UseSupabaseRealtimeOptions) {
  const queryClient = useQueryClient();
  const instanceRef = useRef(crypto.randomUUID().slice(0, 8));
  const channelName = `${baseChannelName}:inst:${instanceRef.current}`;
  const queryKeyString = JSON.stringify(queryKey);

  useEffect(() => {
    if (!enabled) return;

    const log = (...args: unknown[]) => {
      if (debug) console.log(`[Realtime:${channelName}]`, ...args);
    };

    log("Subscribing...", { table, event, filter });

    const sb = client ?? supabase;

    const channel = sb
      .channel(channelName)
      .on(
        "postgres_changes",
        { event, schema: "public", table, ...(filter ? { filter } : {}) },
        (payload) => {
          log("Change received:", payload);
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe((status, err) => {
        log("Status:", status);
        if (status === "CHANNEL_ERROR" || err) {
          console.error(`[Realtime:${channelName}] Subscription error:`, err);
        }
      });

    return () => {
      log("Cleaning up...");
      sb.removeChannel(channel);
    };
  }, [channelName, enabled, queryClient, client, table, event, filter, queryKeyString, debug]);
}