import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MetricsChart } from "@/src/components/dashboard";
import { fetchMetrics } from "@/api/mock-data";

// Mock the API
jest.mock("@/api/mock-data");
const mockFetchMetrics = fetchMetrics as jest.MockedFunction<
  typeof fetchMetrics
>;

// Mock Recharts components
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

describe("MetricsChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders chart with data", async () => {
    const mockData = [
      { timestamp: "2023-01-01T00:00:00Z", value: 75 },
      { timestamp: "2023-01-01T01:00:00Z", value: 85 },
    ];

    mockFetchMetrics.mockResolvedValue(mockData);

    render(<MetricsChart timeframe="day" />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByTestId("chart-container")).toBeInTheDocument();
      expect(screen.getByTestId("area-chart")).toBeInTheDocument();
    });

    expect(screen.getByText("Metrics Data")).toBeInTheDocument();
  });

  it("shows loading skeleton initially", () => {
    mockFetchMetrics.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    const { container } = render(<MetricsChart timeframe="day" />, {
      wrapper: TestWrapper,
    });

    expect(container.querySelector(".metrics-card__skeleton")).not.toBeNull();
  });

  describe("Network Failure Edge Cases", () => {
    beforeEach(() => {
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("handles 500 server errors gracefully", async () => {
      const serverError = new Error("HTTP 500: Internal Server Error");
      mockFetchMetrics.mockRejectedValue(serverError);

      render(<MetricsChart timeframe="day" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
      });
    });

    it("handles network connection failures", async () => {
      const networkError = new Error("Failed to fetch");
      networkError.name = "TypeError";
      mockFetchMetrics.mockRejectedValue(networkError);

      render(<MetricsChart timeframe="day" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("handles malformed JSON responses", async () => {
      const jsonError = new SyntaxError("Unexpected token < in JSON at position 0");
      mockFetchMetrics.mockRejectedValue(jsonError);

      render(<MetricsChart timeframe="day" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("handles CORS errors", async () => {
      const corsError = new Error("CORS policy blocked");
      mockFetchMetrics.mockRejectedValue(corsError);

      render(<MetricsChart timeframe="day" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("handles empty response gracefully", async () => {
      mockFetchMetrics.mockResolvedValue(null);

      render(<MetricsChart timeframe="day" />, { wrapper: TestWrapper });

      await waitFor(() => {
        // Should render chart container even with null data
        expect(screen.getByTestId("chart-container")).toBeInTheDocument();
      });
    });

    it("handles API timeout errors", async () => {
      const timeoutError = new Error("Request timeout after 30000ms");
      mockFetchMetrics.mockRejectedValue(timeoutError);

      render(<MetricsChart timeframe="day" />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });
  });
});
