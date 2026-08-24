import { describe, it, expect } from "vitest";
import { formatError } from "./logger";

describe("formatError", () => {
  it("extracts the message from an Error", () => {
    expect(formatError(new Error("boom"))).toBe("boom");
  });

  it("stringifies primitive values", () => {
    expect(formatError("plain")).toBe("plain");
    expect(formatError(null)).toBe("null");
  });
});
