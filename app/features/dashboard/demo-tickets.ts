export type TicketStatus = "bot_handling" | "open" | "resolved";
export type Sender = "customer" | "bot" | "agent";

export type DemoMessage = {
  id: string;
  sender: Sender;
  text: string;
  time: string;
};

export type DemoTicket = {
  id: string;
  subject: string;
  customer: string;
  status: TicketStatus;
  updatedAt: string;
  preview: string;
  messages: DemoMessage[];
};

export const demoTickets: DemoTicket[] = [
  {
    id: "TCK-001",
    subject: "Return request — boots too small",
    customer: "Maya R.",
    status: "open",
    updatedAt: "2 min ago",
    preview: "I'd like to exchange these for a size 9...",
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "Hi, I bought the Ringmaster Leather Boots but they're a size too small. Can I exchange them?",
        time: "10:42 AM",
      },
      {
        id: "m2",
        sender: "bot",
        text: "I'd be happy to help with an exchange! Our return policy allows exchanges within 30 days. Would you like me to start a return label?",
        time: "10:42 AM",
      },
      {
        id: "m3",
        sender: "customer",
        text: "I'd like to exchange these for a size 9, not just return them. Can I talk to a person?",
        time: "10:43 AM",
      },
      {
        id: "m4",
        sender: "bot",
        text: "Of course — I'm connecting you with an agent who can arrange the exchange right away.",
        time: "10:43 AM",
      },
    ],
  },
  {
    id: "TCK-002",
    subject: "Where is my candle order?",
    customer: "Leo K.",
    status: "bot_handling",
    updatedAt: "5 min ago",
    preview: "Bot is answering a shipping question...",
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "I ordered candles 4 days ago and haven't gotten a tracking number. Where is my order?",
        time: "10:35 AM",
      },
      {
        id: "m2",
        sender: "bot",
        text: "Great question! Candle orders ship within 2-3 business days. You should receive a tracking number by email shortly. Let me check the status of your order.",
        time: "10:35 AM",
      },
    ],
  },
  {
    id: "TCK-003",
    subject: "Thanks for the great service!",
    customer: "Priya S.",
    status: "resolved",
    updatedAt: "1 hr ago",
    preview: "Resolved — customer was satisfied.",
    messages: [
      {
        id: "m1",
        sender: "customer",
        text: "Just wanted to say the linen scarf arrived and it's gorgeous. Thank you!",
        time: "9:15 AM",
      },
      {
        id: "m2",
        sender: "bot",
        text: "That's wonderful to hear! Thank you for shopping with Elasticware. We hope to see you again soon!",
        time: "9:15 AM",
      },
      {
        id: "m3",
        text: "You're very welcome, Priya! We're so glad you love it. Enjoy the scarf!",
        sender: "agent",
        time: "9:20 AM",
      },
    ],
  },
];
