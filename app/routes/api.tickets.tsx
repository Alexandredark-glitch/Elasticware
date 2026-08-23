import type { Route } from "./+types/api.tickets";
import { supabaseApi } from "~/lib/supabase/api";
import { CreateTicketSchema } from "~/lib/db/schema";
import { requireAuth } from "~/lib/supabase/auth.server";

export async function action({ request }: Route.ActionArgs) {
  /*
  We will receive this via the network in our server
        { org_key: "demo", session_id: sessionId, content: text },
        { method: "post", action: "/api/tickets" }
     
  */
  const form = await request.formData();
 
  const intent = form.get("intent");

  if (intent === "resolve") {
  const { supabase } = await requireAuth(request);
  
  const ticket_id = form.get("ticket_id");
  if (!ticket_id || typeof ticket_id !== "string") {
    return Response.json({ error: "Missing ticket_id" }, { status: 400 });
  }

  const { error } = await supabase
    .from("tickets")
    .update({ status: "resolved", updated_at: new Date().toISOString() })
    .eq("id", ticket_id);

  if (error) {
    return Response.json({ error: "Failed to resolve ticket" }, { status: 500 });
  }
  return Response.json({ ok: true, resolved: true });
}

  // ── DELETE ──
  if (intent === "delete") {
    const { supabase } = await requireAuth(request);
  
  const ticket_id = form.get("ticket_id");
  if (!ticket_id || typeof ticket_id !== "string") {
    return Response.json({ error: "Missing ticket_id" }, { status: 400 });
  }

  const { error: msgErr } = await supabase
    .from("messages")
    .delete()
    .eq("ticket_id", ticket_id);
    if (msgErr) {
      return Response.json({ error: "Failed to delete messages" }, { status: 500 });
    }
    const { error: ticketErr } = await supabase
      .from("tickets")
      .delete()
      .eq("id", ticket_id);
    if (ticketErr) {
      return Response.json({ error: "Failed to delete ticket" }, { status: 500 });
    }
    return Response.json({ ok: true, ticket_id });
  }

  
  const raw = {
    org_key: form.get("org_key"),
    session_id: form.get("session_id"),
    content: form.get("content"),
  };

  const parsed = CreateTicketSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  } // Just for safety

  const { org_key, session_id, content } = parsed.data;

  const { data: org } = await supabaseApi
    .from("organizations")
    .select("id")
    .eq("slug", org_key)
    .single();

  if (!org) {
    return Response.json({ error: "Org not found" }, { status: 404 });
  }

  const { data: ticket, error: ticketErr } = await supabaseApi
    .from("tickets")
    .insert({
      org_id: org.id,
      customer_session_id: session_id, // From the client uuid in useWidgetSession
      status: "bot_handling",
      subject: content.slice(0, 100),
      preview: content.slice(0, 150),
    })
    .select()
    .single();

  if (ticketErr || !ticket) {
    return Response.json({ error: "Failed to create ticket" }, { status: 500 });
  }

  const { error: msgErr } = await supabaseApi.from("messages").insert({
    ticket_id: ticket.id,
    sender: "customer",
    content,
  });

  if (msgErr) {
    return Response.json({ error: "Failed to save message" }, { status: 500 });
  }

  return Response.json({ ticket_id: ticket.id });
}