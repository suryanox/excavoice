import { describe, it, expect, vi, beforeEach } from "vitest";
import { DiagramService, DiagramGenerationError } from "./DiagramService";
import type { ModelProvider } from "../lib/modelProviders";
import type { Logger } from "../lib/logger";
import type { ChatMessage } from "../lib/llm";

function makeLogger(): Logger {
  return {
    info: vi.fn(),
    req: vi.fn(),
    success: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}

const messages: ChatMessage[] = [{ role: "user", content: "x" }];

describe("DiagramService", () => {
  let provider: ModelProvider;
  let complete: ReturnType<typeof vi.fn>;
  let logger: Logger;

  beforeEach(() => {
    logger = makeLogger();
    complete = vi.fn();
  });

  it("returns the mermaid from the first model", async () => {
    provider = { list: vi.fn().mockResolvedValue(["m1"]) };
    complete.mockResolvedValue("graph TD");

    const svc = new DiagramService(provider, (m, msgs) => complete(m, msgs), logger);
    const out = await svc.generate(messages);

    expect(out).toBe("graph TD");
    expect(complete).toHaveBeenCalledWith("m1", messages);
    expect(logger.success).toHaveBeenCalled();
  });

  it("round-robins and falls back on failure", async () => {
    provider = { list: vi.fn().mockResolvedValue(["m1", "m2"]) };
    complete
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce("ok");

    const svc = new DiagramService(provider, (m, msgs) => complete(m, msgs), logger, 4);
    const out = await svc.generate(messages);

    expect(out).toBe("ok");
    expect(complete).toHaveBeenCalledTimes(2);
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("m1 failed"));
  });

  it("throws after exhausting all attempts", async () => {
    provider = { list: vi.fn().mockResolvedValue(["m1"]) };
    complete.mockRejectedValue(new Error("nope"));

    const svc = new DiagramService(provider, (m, msgs) => complete(m, msgs), logger, 3);
    await expect(svc.generate(messages)).rejects.toBeInstanceOf(DiagramGenerationError);
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it("throws when no models are available", async () => {
    provider = { list: vi.fn().mockResolvedValue([]) };
    const svc = new DiagramService(provider, (m, msgs) => complete(m, msgs), logger);
    await expect(svc.generate(messages)).rejects.toBeInstanceOf(DiagramGenerationError);
    expect(complete).not.toHaveBeenCalled();
  });
});
