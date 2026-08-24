import { describe, it, expect, vi, beforeEach } from "vitest";

const { getConfigMock, saveConfigMock } = vi.hoisted(() => ({
  getConfigMock: vi.fn(),
  saveConfigMock: vi.fn(),
}));
vi.mock("../lib/storage", () => ({
  DEFAULT_CONFIG: {
    baseUrl: "",
    apiKey: "",
    model: "",
    freeModels: false,
    language: "en",
  },
  getConfig: (...args: unknown[]) => getConfigMock(...args),
  saveConfig: (...args: unknown[]) => saveConfigMock(...args),
}));

const { startTranscriptionMock } = vi.hoisted(() => ({ startTranscriptionMock: vi.fn() }));
vi.mock("../lib/speech", () => ({
  startTranscription: (...args: unknown[]) => startTranscriptionMock(...args),
}));

const { sendToExcalidrawMock } = vi.hoisted(() => ({ sendToExcalidrawMock: vi.fn() }));
vi.mock("../lib/excalidraw", () => ({
  sendToExcalidraw: (...args: unknown[]) => sendToExcalidrawMock(...args),
}));

const { completeImpl } = vi.hoisted(() => ({ completeImpl: vi.fn() }));
vi.mock("litellm-client", () => ({
  LiteLLMClient: class {
    chat = { completions: { create: (...args: unknown[]) => completeImpl(...args) } };
  },
}));

import { renderHook, act, waitFor } from "@testing-library/react";
import { useExcaVoice } from "./useExcaVoice";

const CONFIG = { baseUrl: "http://x", apiKey: "k", model: "m", freeModels: false };

describe("useExcaVoice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sendToExcalidrawMock.mockResolvedValue(undefined);
    completeImpl.mockResolvedValue({ choices: [{ message: { content: "graph TD" } }] });
  });

  it("streams a transcript into a generated diagram", async () => {
    getConfigMock.mockResolvedValue(CONFIG);
    let handlers: Record<string, (...a: unknown[]) => void> = {};
    startTranscriptionMock.mockImplementation((h: typeof handlers) => {
      handlers = h;
      return () => {};
    });

    const { result } = renderHook(() => useExcaVoice());

    act(() => result.current.showConfig());
    await waitFor(() => expect(result.current.model).toBe("m"));

    act(() => result.current.onMic(() => {}));
    expect(result.current.listening).toBe(true);
    expect(startTranscriptionMock).toHaveBeenCalledWith(expect.anything(), "en");

    act(() => handlers.onFinal?.("draw a flowchart"));
    await waitFor(() => expect(sendToExcalidrawMock).toHaveBeenCalledWith("graph TD"));
    expect(result.current.logs.some((l) => l.level === "success")).toBe(true);
  });

  it("refuses to generate without configuration", async () => {
    getConfigMock.mockResolvedValue(null);
    let handlers: Record<string, (...a: unknown[]) => void> = {};
    startTranscriptionMock.mockImplementation((h: typeof handlers) => {
      handlers = h;
      return () => {};
    });

    const { result } = renderHook(() => useExcaVoice());
    act(() => result.current.onMic(() => {}));
    act(() => handlers.onFinal?.("x"));

    await waitFor(() =>
      expect(result.current.logs.some((l) => l.level === "error")).toBe(true),
    );
    expect(sendToExcalidrawMock).not.toHaveBeenCalled();
  });

  it("stops listening when mic is pressed again", () => {
    const stop = vi.fn();
    startTranscriptionMock.mockReturnValue(stop);

    const { result } = renderHook(() => useExcaVoice());
    act(() => result.current.onMic(() => {}));
    act(() => result.current.onMic(() => {}));

    expect(stop).toHaveBeenCalled();
    expect(result.current.listening).toBe(false);
  });
});
