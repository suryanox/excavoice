import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigField } from "./ConfigField";

describe("ConfigField", () => {
  it("renders a label and forwards changes", async () => {
    const onChange = vi.fn();
    render(<ConfigField label="API base URL" value="" onChange={onChange} />);

    const input = screen.getByLabelText("API base URL");
    await userEvent.type(input, "abc");

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith("c");
  });

  it("applies the password type", () => {
    render(<ConfigField label="Key" type="password" value="" onChange={() => {}} />);
    expect(screen.getByLabelText("Key")).toHaveAttribute("type", "password");
  });
});
