export type ChatMessage = {
  id: string;
  sender: "customer" | "bot" | "agent";
  text: string;
  timestamp: number;
};

export const BOT_GREETING: ChatMessage = {
  id: "greeting",
  sender: "bot",
  text: "Welcome to Elasticware! I'm your assistant. Ask me about returns, shipping, or anything else — I'm here to help.",
  timestamp: Date.now(),
};
