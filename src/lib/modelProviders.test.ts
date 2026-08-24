import { describe, it, expect, vi, beforeEach } from "vitest";

const { fetchImpl } = vi.hoisted(() => ({ fetchImpl: vi.fn() }));
vi.mock("litellm-client", () => ({
  LiteLLMClient: class {
    models = { list: (...args: unknown[]) => fetchImpl(...args) };
  },
}));

import { FixedModelProvider, FreeModelProvider } from "./modelProviders";

describe("FixedModelProvider", () => {
  it("returns a single model", async () => {
    expect(await new FixedModelProvider("gpt-4o").list()).toEqual(["gpt-4o"]);
  });

  it("returns an empty list for a blank model", async () => {
    expect(await new FixedModelProvider("").list()).toEqual([]);
  });
});

describe("FreeModelProvider", () => {
  beforeEach(() => fetchImpl.mockReset());

  it("fetches and caches the model list", async () => {
    fetchImpl.mockResolvedValue({ data: [{ id: "a" }, { id: "b" }] });
    const provider = new FreeModelProvider("http://x", "k");
    expect(await provider.list()).toEqual(["a", "b"]);
    expect(await provider.list()).toEqual(["a", "b"]);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("throws when no models are returned", async () => {
    fetchImpl.mockResolvedValue({ data: [] });
    await expect(new FreeModelProvider("x", "k").list()).rejects.toThrow(
      "No models returned by /v1/models",
    );
  });
});
