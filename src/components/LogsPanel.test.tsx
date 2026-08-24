import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LogsPanel } from "./LogsPanel";
import type { LogEntry } from "../lib/logger";

const logs: LogEntry[] = [
  { t: "10:00:00", level: "info", msg: "started" },
  { t: "10:00:01", level: "error", msg: "failed badly" },
];

describe("LogsPanel", () => {
  it("renders the live transcript and log entries", () => {
    render(<LogsPanel logs={logs} live="listening..." />);

    expect(screen.getByText("listening...")).toBeInTheDocument();
    expect(screen.getByText(/started/)).toBeInTheDocument();
    expect(screen.getByText(/failed badly/)).toBeInTheDocument();
  });

  it("shows a placeholder when nothing is live", () => {
    render(<LogsPanel logs={[]} live="" />);
    expect(screen.getByText(/Press the mic/)).toBeInTheDocument();
  });

  it("scrolls to the newest log entry when logs change", () => {
    const { rerender } = render(<LogsPanel logs={[]} live="" />);
    const logContainer = screen.getByRole("log");

    Object.defineProperty(logContainer, "scrollHeight", {
      configurable: true,
      value: 480,
    });
    rerender(<LogsPanel logs={logs} live="" />);

    expect(logContainer.scrollTop).toBe(480);
  });
});
