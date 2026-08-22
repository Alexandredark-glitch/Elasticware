import { useQuery } from "@tanstack/react-query";
import { supabase } from "~/lib/supabase/supabase.client";
import type { Database } from "~/lib/db/database.types";
import { useSupabaseRealtime } from "./useSupabaseRealtime";

type TicketRow = Database["public"]["Tables"]["tickets"]["Row"];

export function useTickets(orgId: string | null) {
  const query = useQuery({
    queryKey: ["tickets", orgId], // Caching key
    queryFn: async (): Promise<TicketRow[]> => {
      if (!orgId) return [];

      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("org_id", orgId)
        .in("status", ["bot_handling", "open", "resolved"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(orgId),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

    useSupabaseRealtime({
    baseChannelName: `tickets:org:${orgId}`,
    table: "tickets",
    event: "*",
    queryKey: ["tickets", orgId],
    enabled: Boolean(orgId), // !!orgId,
    debug: true,
  });

  return query;
}