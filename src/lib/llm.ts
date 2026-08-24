import { LiteLLMClient } from "litellm-client";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, "").replace(/\/v1$/i, "");
}

const MERMAID_SYSTEM_PROMPT = `You are a Mermaid diagram compiler.

The user's message may be written in any human language. Understand it semantically, but always output Mermaid syntax only.

Hard rules:
- Output exactly one valid Mermaid diagram.
- The first line must be a Mermaid diagram declaration such as flowchart TD, sequenceDiagram, erDiagram.
- Do not output explanations, translations, comments, titles, introductions, or apologies.
- Do not use Markdown code fences.
- Do not prefix the response with words like "Here is".
- Use English Mermaid keywords even when the user's language is not English.
- Keep user-provided labels in the user's original language when possible.
- If details are ambiguous, make a reasonable assumption and still return a valid diagram.`;

export function buildMessages(transcript: string): ChatMessage[] {
  return [
    {
      role: "system",
      content: MERMAID_SYSTEM_PROMPT,
    },
    { role: "user", content: transcript },
  ];
}

export interface CompleteOptions {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export async function complete(
  opts: CompleteOptions,
  messages: ChatMessage[],
): Promise<string> {
  const client = new LiteLLMClient({
    baseUrl: normalizeBaseUrl(opts.baseUrl),
    apiKey: opts.apiKey,
  });

  const res = await client.chat.completions.create({
    model: opts.model,
    messages: messages as unknown as Parameters<typeof client.chat.completions.create>[0]["messages"],
    temperature: 0,
  });

  const content = res.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from LLM");
  return String(content).trim();
}
