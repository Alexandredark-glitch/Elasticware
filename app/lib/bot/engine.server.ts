import { embedText, generateReply } from "~/lib/ai/gemini.server";
import type { createSupabaseServerClient } from "~/lib/supabase/supabase.server";
import { Sentry } from "~/lib/sentry.server";

type Supabase = ReturnType<typeof createSupabaseServerClient>["supabase"];

type BotResult =
  | { replied: true; escalated: false }
  | { replied: false; escalated: true; error?: boolean };

const MAX_MESSAGE_LENGTH = 2000;
const SIMILARITY_THRESHOLD = 0.4;
const MATCH_COUNT = 3;

export async function handleBotReply({
  supabase,
  ticketId,
  orgId,
  customerMessage,
}: {
  supabase: Supabase;
  ticketId: string;
  orgId: string;
  customerMessage: string;
}): Promise<BotResult> {
  try {
    if (customerMessage.length > MAX_MESSAGE_LENGTH) {
      await escalate(supabase, ticketId);
      return { replied: false, escalated: true };
    }

    const embedding = await embedText(customerMessage);

    const { data: matches } = await supabase.rpc("match_kb_articles", {
      query_embedding: `[${embedding.join(",")}]`,
      match_org_id: orgId,
      match_threshold: SIMILARITY_THRESHOLD,
      match_count: MATCH_COUNT,
    });

    if (!matches?.length) {
      await escalate(supabase, ticketId);
      return { replied: false, escalated: true };
    }

    const context = matches
      .map(
        (m: { title: string; content: string }) =>
          `## ${m.title}\n${m.content}`
      )
      .join("\n\n");

    const reply = await generateReply(context, customerMessage);

    if (/don't know|not sure|no information|unable to answer/i.test(reply)) {
      await escalate(supabase, ticketId);
      return { replied: false, escalated: true };
    }

    await supabase.from("messages").insert({
      ticket_id: ticketId,
      sender: "bot",
      content: reply,
    });

    return { replied: true, escalated: false };
  } catch (err) {
    Sentry.captureException(err);
    console.error("Bot error:", err);
    await escalate(supabase, ticketId);
    return { replied: false, escalated: true, error: true };
  }
}

async function escalate(supabase: Supabase, ticketId: string) {
  await supabase
    .from("tickets")
    .update({ status: "open", updated_at: new Date().toISOString() })
    .eq("id", ticketId);

  await supabase.from("messages").insert({
    ticket_id: ticketId,
    sender: "bot",
    content:
      "Let me connect you with an agent to solve your issue. Please wait!",
  });
}