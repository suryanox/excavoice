import { afterEach, describe, expect, it, vi } from "vitest";
import { startTranscription } from "./speech";

class FakeRecognition {
  static instance: FakeRecognition;
  continuous = false;
  interimResults = false;
  lang = "";
  onstart: (() => void) | null = null;
  onresult: ((event: unknown) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onend: (() => void) | null = null;
  start = vi.fn();
  stop = vi.fn();

  constructor() {
    FakeRecognition.instance = this;
  }
}

describe("startTranscription", () => {
  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(window, "SpeechRecognition", {
      configurable: true,
      value: undefined,
    });
  });

  it("waits for the configured pause before completing speech", () => {
    vi.useFakeTimers();
    Object.defineProperty(window, "SpeechRecognition", {
      configurable: true,
      value: FakeRecognition,
    });
    const onFinal = vi.fn();

    startTranscription({ onFinal }, "en", 2);
    const recognition = FakeRecognition.instance;
    recognition.onresult?.({
      resultIndex: 0,
      results: [{ isFinal: true, 0: { transcript: "hello" } }],
    });

    expect(recognition.continuous).toBe(true);
    vi.advanceTimersByTime(1999);
    expect(onFinal).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onFinal).toHaveBeenCalledWith("hello");
    expect(recognition.stop).toHaveBeenCalled();
  });
});
