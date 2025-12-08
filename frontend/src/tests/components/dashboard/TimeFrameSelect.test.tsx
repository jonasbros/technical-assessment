import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TimeFrameSelect } from "@/src/components/dashboard";

const mockHandleTimeframeChange = jest.fn();

describe("TimeFrameSelect", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders select dropdown with default value", () => {
    render(
      <TimeFrameSelect handleTimeframeChange={mockHandleTimeframeChange} />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Last 24 Hours")).toBeInTheDocument();
  });

  it("shows all timeframe options when opened", () => {
    render(
      <TimeFrameSelect handleTimeframeChange={mockHandleTimeframeChange} />
    );

    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    expect(screen.getAllByText("Last 24 Hours")).toHaveLength(2);
    expect(screen.getByText("Last Hour")).toBeInTheDocument();
    expect(screen.getByText("Last 7 Days")).toBeInTheDocument();
  });

  it("calls handleTimeframeChange when selection changes", () => {
    render(
      <TimeFrameSelect handleTimeframeChange={mockHandleTimeframeChange} />
    );

    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    const hourOption = screen.getByText("Last Hour");
    fireEvent.click(hourOption);

    expect(mockHandleTimeframeChange).toHaveBeenCalledWith("hour");
  });
});
