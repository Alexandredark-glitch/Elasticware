import type { Route } from "./+types/mock-shop";
import { Storefront } from "../features/mock-shop/Storefront";
import { ChatWidget } from "../features/chat-widget/ChatWidget";
import { useSearchParams } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Elasticware — Mock Storefront" },
    {
      name: "description",
      content:
        "A demo storefront with handcrafted goods. Browse the collection and chat with a Bot — the AI support assistant.",
    },
    { property: "og:title", content: "Elasticware — Mock Storefront" },
    {
      property: "og:description",
      content:
        "Browse handcrafted goods and chat with a bot, the AI assistant that handles customer questions.",
    },
    { property: "og:type", content: "website" },
  ];
}

export default function MockShopRoute() {
  const [searchParams] = useSearchParams();
  const orgKey = searchParams.get("org") || "demo";

  return (
    <>
      <Storefront />
      <ChatWidget orgKey={orgKey} />
    </>
  );
}