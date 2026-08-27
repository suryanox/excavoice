import { beforeEach, describe, expect, it, vi } from "vitest";
import { getConfig, saveConfig, type ExcaVoiceConfig } from "./storage";

const chromeMock = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
};

describe("storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("chrome", chromeMock);
  });

  it("merges defaults into an older partial configuration", async () => {
    chromeMock.storage.local.get.mockImplementation((_key, callback) => {
      callback({ "xcv-config": { baseUrl: "http://x", apiKey: "k" } });
    });

    await expect(getConfig()).resolves.toEqual({
      baseUrl: "http://x",
      apiKey: "k",
      model: "",
      freeModels: false,
      language: "en",
      pauseSeconds: 5,
    });
  });

  it("returns null when no configuration is stored", async () => {
    chromeMock.storage.local.get.mockImplementation((_key, callback) => callback({}));

    await expect(getConfig()).resolves.toBeNull();
  });

  it("saves the complete configuration under the extension key", async () => {
    const config: ExcaVoiceConfig = {
      baseUrl: "http://x",
      apiKey: "k",
      model: "m",
      freeModels: true,
      language: "de",
      pauseSeconds: 5,
    };
    chromeMock.storage.local.set.mockImplementation((_value, callback) => callback());

    await saveConfig(config);

    expect(chromeMock.storage.local.set).toHaveBeenCalledWith(
      { "xcv-config": config },
      expect.any(Function),
    );
  });
});
