import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Panel } from "./Panel";

describe("Panel", () => {
  it("renders the title, children and fires onClose", () => {
    const onClose = vi.fn();
    render(
      <Panel title="Configuration" onClose={onClose}>
        <p>body content</p>
      </Panel>,
    );

    expect(screen.getByText("Configuration")).toBeInTheDocument();
    expect(screen.getByText("body content")).toBeInTheDocument();

    screen.getByLabelText("Close").click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
