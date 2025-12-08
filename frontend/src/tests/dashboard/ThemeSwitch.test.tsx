import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeSwitch } from "@/src/components/dashboard";

const mockSetTheme = jest.fn();

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("ThemeSwitch", () => {
  const mockUseTheme = require("next-themes").useTheme as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock
    mockUseTheme.mockReturnValue({
      theme: "light",
      resolvedTheme: "light",
      setTheme: mockSetTheme,
    });
  });

  it("renders theme toggle button", () => {
    render(<ThemeSwitch />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Toggle theme");
  });

  it("calls setTheme when clicked", () => {
    render(<ThemeSwitch />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("toggles from dark to light", () => {
    mockUseTheme.mockReturnValue({
      theme: "dark",
      resolvedTheme: "dark",
      setTheme: mockSetTheme,
    });

    render(<ThemeSwitch />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("handles system theme correctly", () => {
    // Mock system theme with dark resolved
    mockUseTheme.mockReturnValue({
      theme: "system",
      resolvedTheme: "dark",
      setTheme: mockSetTheme,
    });

    render(<ThemeSwitch />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Should toggle to light when system resolves to dark
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
