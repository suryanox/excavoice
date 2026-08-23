import { LiteLLMClient } from "litellm-client";
import type { ExcaVoiceConfig } from "./storage";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function buildMessages(transcript: string): ChatMessage[] {
  return [
    {
      role: "system",
      content:
        "You are a diagram generation assistant. Convert the user's spoken description " +
        "into a Mermaid diagram. Respond with ONLY the Mermaid code. No explanations, " +
        "no markdown code fences, no surrounding text.",
    },
    { role: "user", content: transcript },
  ];
}

export async function complete(
  cfg: ExcaVoiceConfig,
  messages: ChatMessage[],
): Promise<string> {
  const client = new LiteLLMClient({
    baseUrl: cfg.baseUrl,
    apiKey: cfg.apiKey,
  });

  const res = await client.chat.completions.create({
    model: cfg.model,
    messages: messages as unknown as Parameters<typeof client.chat.completions.create>[0]["messages"],
    temperature: 0,
  });

  const content = res.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from LLM");
  return String(content).trim();
}
