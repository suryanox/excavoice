import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLogger } from "./useLogger";

describe("useLogger", () => {
  it("appends timestamped entries", () => {
    const { result } = renderHook(() => useLogger());
    expect(result.current.logs).toHaveLength(0);

    act(() => result.current.info("hello"));
    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0]).toMatchObject({ level: "info", msg: "hello" });
    expect(typeof result.current.logs[0].t).toBe("string");
  });

  it("exposes a stable Logger across renders", () => {
    const { result, rerender } = renderHook(() => useLogger());
    const first = result.current;
    rerender();
    expect(result.current.info).toBe(first.info);
  });
});
