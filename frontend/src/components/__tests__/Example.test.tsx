import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Example from "../Example";

describe("Example Component", () => {
  it("renders correctly", () => {
    render(<Example />);
    expect(screen.getByText("Example Component")).toBeInTheDocument();
  });

  it("handles user interaction", () => {
    render(<Example />);
    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(screen.getByText("Clicked!")).toBeInTheDocument();
  });
});
