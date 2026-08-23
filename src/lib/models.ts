import { LiteLLMClient } from "litellm-client";
import { normalizeBaseUrl } from "./llm";

// Lists models from the configured LiteLLM proxy via the litellm package
// (no raw fetch). When "free models" is enabled we round-robin across
// whatever the proxy exposes, rather than hardcoding ids.
export async function fetchModels(baseUrl: string, apiKey: string): Promise<string[]> {
  const client = new LiteLLMClient({ baseUrl: normalizeBaseUrl(baseUrl), apiKey });
  const res = await client.models.list();
  const ids = (res.data ?? [])
    .map((m) => m.id)
    .filter((id): id is string => Boolean(id));
  if (ids.length === 0) throw new Error("No models returned by /v1/models");
  return ids;
}
