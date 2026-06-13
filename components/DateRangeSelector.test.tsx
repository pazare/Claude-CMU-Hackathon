import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DateRangeSelector from "@/components/DateRangeSelector";

describe("DateRangeSelector", () => {
  it("renders all options with the selected one pressed", () => {
    render(<DateRangeSelector value="All" onChange={() => {}} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Today" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("calls onChange with the chosen range", async () => {
    const onChange = vi.fn();
    render(<DateRangeSelector value="All" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Today" }));
    expect(onChange).toHaveBeenCalledWith("Today");
  });
});
