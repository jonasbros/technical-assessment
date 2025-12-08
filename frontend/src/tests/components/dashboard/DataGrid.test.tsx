import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataGrid } from "@/src/components/dashboard";
import { fetchMetrics } from "@/api/mock-data";

// Mock the API
jest.mock("@/api/mock-data");
const mockFetchMetrics = fetchMetrics as jest.MockedFunction<
  typeof fetchMetrics
>;

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("DataGrid", () => {
  const TIMEFRAME = "day";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders table with data", async () => {
    const mockData = [
      {
        timestamp: "2023-01-01T00:00:00Z",
        value: 75,
      },
      {
        timestamp: "2023-01-01T01:00:00Z",
        value: 85,
      },
    ];

    mockFetchMetrics.mockResolvedValue(mockData);

    render(<DataGrid timeframe={TIMEFRAME} />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("75")).toBeInTheDocument();
      expect(screen.getByText("85")).toBeInTheDocument();
    });

    // Check table headers
    expect(screen.getByText("Date / Time")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
  });

  it("filters data when searching", async () => {
    const mockData = [
      { timestamp: "2025-01-01T00:00:00Z", value: 75 }, // Contains "25" in year
      { timestamp: "2023-01-01T00:00:01Z", value: 25 }, // Contains "25" in value
      { timestamp: "2023-01-01T00:00:02Z", value: 85 }, // No "25"
    ];

    mockFetchMetrics.mockResolvedValue(mockData);
    render(<DataGrid timeframe={TIMEFRAME} />, { wrapper: TestWrapper });

    await waitFor(() => expect(screen.getByText("75")).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "25" } });

    await waitFor(() => {
      // Should match BOTH the 2025 date AND value 25
      expect(screen.getByText("75")).toBeInTheDocument(); // 2025 year
      expect(screen.getByText("25")).toBeInTheDocument(); // value 25
      expect(screen.queryByText("85")).not.toBeInTheDocument(); // no match
    });
  });

  it("shows empty table when no data", async () => {
    mockFetchMetrics.mockResolvedValue([]);

    render(<DataGrid timeframe={TIMEFRAME} />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("Date / Time")).toBeInTheDocument();
      expect(screen.getByText("Value")).toBeInTheDocument();
    });

    expect(screen.getByText("No Results Found.")).toBeInTheDocument();
  });

  it("shows 'No Results Found' when search returns no matches", async () => {
    const mockData = [
      { timestamp: "2023-01-01T00:00:00Z", value: 75 },
      { timestamp: "2023-01-01T01:00:00Z", value: 85 },
    ];

    mockFetchMetrics.mockResolvedValue(mockData);
    render(<DataGrid timeframe={TIMEFRAME} />, { wrapper: TestWrapper });

    await waitFor(() => expect(screen.getByText("75")).toBeInTheDocument());

    // Search for something that doesn't exist
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "999" } });

    await waitFor(() => {
      expect(screen.getByText("No Results Found.")).toBeInTheDocument();
      expect(screen.queryByText("75")).not.toBeInTheDocument();
      expect(screen.queryByText("85")).not.toBeInTheDocument();
    });
  });
});
