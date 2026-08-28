import { describe, it, expect, vi } from "vitest";

const { completeImpl } = vi.hoisted(() => ({ completeImpl: vi.fn() }));
vi.mock("litellm-client", () => ({
  LiteLLMClient: class {
    chat = { completions: { create: (...args: unknown[]) => completeImpl(...args) } };
  },
}));

import { cleanMermaidResponse, normalizeBaseUrl, buildMessages, complete } from "./llm";

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
    expect(messages[0].content).toContain("any human language");
    expect(messages[0].content).toContain("Output exactly one valid Mermaid diagram");
    expect(messages[0].content).toContain("Do not use Markdown code fences");
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

  it("removes Mermaid Markdown fences from model output", async () => {
    completeImpl.mockResolvedValue({
      choices: [{ message: { content: "```mermaid\nflowchart TD\n  A --> B\n```" } }],
    });

    await expect(
      complete({ baseUrl: "http://x", apiKey: "k", model: "m" }, []),
    ).resolves.toBe("flowchart TD\n  A --> B");
  });

  it("removes leading prose before a Mermaid declaration", () => {
    expect(cleanMermaidResponse("Here is the diagram:\nflowchart TD\n  A --> B")).toBe(
      "flowchart TD\n  A --> B",
    );
  });

  it("rejects output that is not a Mermaid diagram", () => {
    expect(() => cleanMermaidResponse("Here is an explanation.")).toThrow(
      "Model did not return a Mermaid diagram",
    );
  });
});
