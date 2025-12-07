import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Loading from "../Loading";

describe("Example Component", () => {
  it("renders correctly", () => {
    render(<Loading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
