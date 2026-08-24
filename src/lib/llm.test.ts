import { describe, it, expect, vi } from "vitest";

const { completeImpl } = vi.hoisted(() => ({ completeImpl: vi.fn() }));
vi.mock("litellm-client", () => ({
  LiteLLMClient: class {
    chat = { completions: { create: (...args: unknown[]) => completeImpl(...args) } };
  },
}));

import { normalizeBaseUrl, buildMessages, complete } from "./llm";

describe("normalizeBaseUrl", () => {
  it("strips trailing slashes", () => {
    expect(normalizeBaseUrl("http://example.com/")).toBe("http://example.com");
  });

  it("strips a trailing /v1 segment", () => {
    expect(normalizeBaseUrl("http://example.com/v1")).toBe("http://example.com");
  });

  it("strips both slashes and /v1", () => {
    expect(normalizeBaseUrl("http://example.com/v1/")).toBe("http://example.com");
  });

  it("leaves non-v1 paths intact", () => {
    expect(normalizeBaseUrl("http://example.com/api")).toBe("http://example.com/api");
  });
});

describe("buildMessages", () => {
  it("returns a system + user pair", () => {
    const messages = buildMessages("draw a circle");
    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe("system");
    expect(messages[1].role).toBe("user");
    expect(messages[1].content).toBe("draw a circle");
  });
});

describe("complete", () => {
  it("returns trimmed content", async () => {
    completeImpl.mockResolvedValue({ choices: [{ message: { content: "  graph TD  " } }] });
    const out = await complete(
      { baseUrl: "http://x/v1/", apiKey: "k", model: "m" },
      [{ role: "user", content: "hi" }],
    );
    expect(out).toBe("graph TD");
  });

  it("throws on an empty response", async () => {
    completeImpl.mockResolvedValue({ choices: [{}] });
    await expect(
      complete({ baseUrl: "x", apiKey: "k", model: "m" }, []),
    ).rejects.toThrow("Empty response from LLM");
  });
});
