import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useConfig } from "./useConfig";

const { getConfigMock, saveConfigMock } = vi.hoisted(() => ({
  getConfigMock: vi.fn(),
  saveConfigMock: vi.fn(),
}));
vi.mock("../lib/storage", () => ({
  getConfig: (...args: unknown[]) => getConfigMock(...args),
  saveConfig: (...args: unknown[]) => saveConfigMock(...args),
}));

const logger = {
  info: vi.fn(),
  req: vi.fn(),
  success: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

describe("useConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    saveConfigMock.mockResolvedValue(undefined);
  });

  it("reports an invalid config without persisting", () => {
    const { result } = renderHook(() => useConfig(logger));
    act(() => result.current.save());

    expect(result.current.status).toEqual({
      text: "API base URL is required.",
      ok: false,
    });
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Config invalid"),
    );
    expect(saveConfigMock).not.toHaveBeenCalled();
  });

  it("saves a valid config and reports success", async () => {
    const { result } = renderHook(() => useConfig(logger));
    act(() => {
      result.current.setBaseUrl(" http://x ");
      result.current.setApiKey("k");
      result.current.setModel("m");
      result.current.setFreeModels(false);
    });
    act(() => result.current.save());

    expect(saveConfigMock).toHaveBeenCalledWith({
      baseUrl: "http://x",
      apiKey: "k",
      model: "m",
      freeModels: false,
    });
    await waitFor(() => expect(result.current.status?.ok).toBe(true));
    expect(logger.success).toHaveBeenCalled();
  });

  it("requires a model unless free models is enabled", () => {
    const { result } = renderHook(() => useConfig(logger));
    act(() => {
      result.current.setBaseUrl("http://x");
      result.current.setApiKey("k");
      result.current.setFreeModels(false);
    });
    act(() => result.current.save());
    expect(result.current.status?.text).toMatch(/Model is required/);
  });

  it("loads persisted config into state", async () => {
    getConfigMock.mockResolvedValue({
      baseUrl: "b",
      apiKey: "k",
      model: "m",
      freeModels: true,
    });
    const { result } = renderHook(() => useConfig(logger));
    act(() => result.current.load());

    await waitFor(() => expect(result.current.baseUrl).toBe("b"));
    expect(result.current.freeModels).toBe(true);
  });
});
