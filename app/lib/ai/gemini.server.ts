const KEYS = [
  process.env.GEMINI_KEY_1,
  process.env.GEMINI_KEY_2,
  process.env.GEMINI_KEY_3,
].filter(Boolean) as string[];

if (!KEYS.length) throw new Error("No GEMINI_KEY env vars found.");

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
const TIMEOUT_MS = 10_000;


interface EmbedResponse {
  embedding?: {
    values?: number[];
  };
}

interface GenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

async function geminiFetch<T>(path: string, body: object, key: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${GEMINI_BASE}/${path}?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

// ── Key rotation ─────────────────────────────────────────────────────
async function withRotation<T>(fn: (key: string) => Promise<T>): Promise<T> {
  for (const key of KEYS) {
    try {
      return await fn(key);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("429") || msg.includes("exhausted")) continue;
      throw e;
    }
  }
  throw new Error("All Gemini keys rate-limited.");
} // AI code

export async function embedText(text: string): Promise<number[]> {
  const data = await withRotation((key) =>
    geminiFetch<EmbedResponse>(
      "models/gemini-embedding-001:embedContent",
      {
        model: "models/gemini-embedding-001",
        content: { parts: [{ text }] },
        outputDimensionality: 768,
      },
      key
    )
  );

  const values = data.embedding?.values;
  if (!Array.isArray(values)) throw new Error("Invalid embedding response");
  return values;
}

const botPrompt = (context: string, question: string) =>
  `You are a helpful support assistant. Use ONLY the following docs to answer. Be concise (1-2 sentences). If the answer is not in the docs, say "I don't know."

Docs:
${context}

Question: ${question}`;

export async function generateReply(
  context: string,
  question: string
): Promise<string> {
  const data = await withRotation((key) =>
    geminiFetch<GenerateResponse>(
      "models/gemini-3.1-flash-lite:generateContent",
      {
        contents: [{ parts: [{ text: botPrompt(context, question) }] }],
      },
      key
    )
  );

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return text ?? "I don't know! Please wait, you will be connected to real person.";
}