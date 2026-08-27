export type ChatMessage = {
  id: string;
  sender: "customer" | "bot" | "agent";
  text: string;
  timestamp: number;
};

export const BOT_GREETING: ChatMessage = {
  id: "greeting",
  sender: "bot",
  text: "Welcome to Elasticware! I can help with returns, shipping, and more. If I don't know the answer, I'll connect you seamlessly to an agent.",
  timestamp: Date.now(),
};
