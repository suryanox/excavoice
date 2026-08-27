import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ConfigPanel } from "./ConfigPanel";

function renderPanel() {
  const props = {
    baseUrl: "http://x",
    setBaseUrl: vi.fn(),
    apiKey: "k",
    setApiKey: vi.fn(),
    model: "m",
    setModel: vi.fn(),
    freeModels: false,
    setFreeModels: vi.fn(),
    language: "en",
    setLanguage: vi.fn(),
    pauseSeconds: 5,
    setPauseSeconds: vi.fn(),
    status: null,
    onSave: vi.fn(),
  };

  render(<ConfigPanel {...props} />);
  return props;
}

describe("ConfigPanel", () => {
  it("renders all configurable fields", () => {
    renderPanel();

    expect(screen.getByLabelText("API base URL")).toHaveValue("http://x");
    expect(screen.getByLabelText("API key")).toHaveValue("k");
    expect(screen.getByLabelText("Model")).toHaveValue("m");
    expect(screen.getByLabelText("Pause before submitting (seconds)")).toHaveValue(5);
    expect(screen.getByRole("combobox")).toHaveTextContent("English");
  });

  it("forwards changes for the free-model and pause settings", () => {
    const props = renderPanel();

    fireEvent.click(screen.getByLabelText("Use OpenRouter free models"));
    fireEvent.change(screen.getByLabelText("Pause before submitting (seconds)"), {
      target: { value: "7" },
    });

    expect(props.setFreeModels).toHaveBeenCalledWith(true);
    expect(props.setPauseSeconds).toHaveBeenCalledWith(7);
  });

  it("forwards language changes", () => {
    const props = renderPanel();

    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "French (Français)" }));

    expect(props.setLanguage).toHaveBeenCalledWith("fr");
  });
});
