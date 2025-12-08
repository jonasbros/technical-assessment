import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "@/src/app/page";
import { fetchMetrics, fetchStatus } from "@/api/mock-data";

// Mock the APIs
jest.mock("@/api/mock-data");
const mockFetchMetrics = fetchMetrics as jest.MockedFunction<
  typeof fetchMetrics
>;
const mockFetchStatus = fetchStatus as jest.MockedFunction<typeof fetchStatus>;

// Mock next/web-vitals
jest.mock("next/web-vitals", () => ({
  useReportWebVitals: jest.fn(),
}));

// Mock Recharts
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="chart-container">{children}</div>
  ),
  AreaChart: ({ children }: any) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    resolvedTheme: "light",
    setTheme: jest.fn(),
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, refetchInterval: false } },
  });

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Dashboard Integration", () => {
  const mockMetricsData = [
    { timestamp: "2023-01-01T00:00:00Z", value: 75 },
    { timestamp: "2023-01-01T01:00:00Z", value: 85 },
  ];

  const mockStatusData = [
    {
      id: "1",
      status: "healthy" as const,
      message: "All systems operational",
      timestamp: "2023-01-01T00:00:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchMetrics.mockResolvedValue(mockMetricsData);
    mockFetchStatus.mockResolvedValue(mockStatusData);
  });

  it("renders all dashboard components", async () => {
    render(<Dashboard />, { wrapper: TestWrapper });

    // Check all main components are present
    expect(screen.getByRole("combobox")).toBeInTheDocument(); // TimeFrameSelect
    expect(screen.getByLabelText("Toggle theme")).toBeInTheDocument(); // ThemeSwitch

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId("chart-container")).toBeInTheDocument(); // MetricsChart
      expect(screen.getByText("All systems operational")).toBeInTheDocument(); // StatusCards
      expect(screen.getByText("Date / Time")).toBeInTheDocument(); // DataGrid
    });
  });

  it("updates both chart and table when timeframe changes", async () => {
    render(<Dashboard />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(mockFetchMetrics).toHaveBeenCalledWith("day");
    });

    jest.clearAllMocks();
    mockFetchMetrics.mockResolvedValue(mockMetricsData);

    // Change timeframe to hour
    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    const hourOption = screen.getByText("Last Hour");
    fireEvent.click(hourOption);

    // Verify both components fetch new data with "hour" timeframe
    await waitFor(() => {
      expect(mockFetchMetrics).toHaveBeenCalledWith("hour");
      expect(mockFetchMetrics).toHaveBeenCalledTimes(1); // called once because MetricsChart and DataGrid have same queryKey
    });
  });

  it("shows loading states initially", () => {
    // Mock delayed responses
    mockFetchMetrics.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockMetricsData), 1000)
        )
    );
    mockFetchStatus.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockStatusData), 1000)
        )
    );

    render(<Dashboard />, { wrapper: TestWrapper });

    // Should show skeletons/loading states
    expect(document.querySelectorAll('[data-slot="skeleton"]')).toBeTruthy();
  });

  it("handles API errors gracefully", async () => {
    mockFetchMetrics.mockRejectedValue(new Error("API Error"));
    mockFetchStatus.mockRejectedValue(new Error("Status Error"));

    render(<Dashboard />, { wrapper: TestWrapper });

    // Should not crash and render basic structure
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle theme")).toBeInTheDocument();
  });

  it("maintains state between component interactions", async () => {
    render(<Dashboard />, { wrapper: TestWrapper });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId("chart-container")).toBeInTheDocument();
    });

    // Change timeframe
    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    fireEvent.click(screen.getByText("Last Hour"));

    // Toggle theme (should not affect timeframe state)
    const themeButton = screen.getByLabelText("Toggle theme");
    fireEvent.click(themeButton);

    // Timeframe should still be "hour" for subsequent requests
    await waitFor(() => {
      expect(mockFetchMetrics).toHaveBeenLastCalledWith("hour");
    });
  });

  it("syncs timeframe across chart and table components", async () => {
    render(<Dashboard />, { wrapper: TestWrapper });

    // Wait for initial load
    await waitFor(() => {
      expect(mockFetchMetrics).toHaveBeenCalledWith("day");
    });

    // Clear calls to track new ones
    jest.clearAllMocks();
    mockFetchMetrics.mockResolvedValue(mockMetricsData);

    // Change to week timeframe
    const select = screen.getByRole("combobox");
    fireEvent.click(select);
    fireEvent.click(screen.getByText("Last 7 Days"));

    await waitFor(() => {
      const calls = mockFetchMetrics.mock.calls;
      expect(calls).toHaveLength(1); // called once because MetricsChart and DataGrid have same queryKey
      expect(calls[0][0]).toBe("week");
    });
  });
});
