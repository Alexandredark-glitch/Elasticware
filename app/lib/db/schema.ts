import { z } from "zod";

export const CreateTicketSchema = z.object({
  org_key: z.string().min(1),
  session_id: z.string().uuid(),
  content: z.string().min(1).max(2000),
});

export const CreateMessageSchema = z.object({
  ticket_id: z.string().uuid(),
  sender: z.enum(["customer", "bot", "agent"]),
  content: z.string().min(1).max(2000),
});

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;
export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;