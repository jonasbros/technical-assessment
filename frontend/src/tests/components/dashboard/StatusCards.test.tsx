import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StatusCards from "@/src/components/dashboard/StatusCards";
import { fetchStatus } from "@/api/mock-data";

// Mock the API
jest.mock("@/api/mock-data");
const mockFetchStatus = fetchStatus as jest.MockedFunction<typeof fetchStatus>;

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("StatusCards", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    mockFetchStatus.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    const { container } = render(<StatusCards />, { wrapper: TestWrapper });
    expect(container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(
      12
    );
  });

  it("renders status cards after data loads", async () => {
    const mockData = [
      {
        id: "1",
        status: "healthy" as const,
        message: "All systems operational",
        timestamp: "2023-01-01T00:00:00Z",
      },
    ];

    mockFetchStatus.mockResolvedValue(mockData);

    render(<StatusCards />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText("All systems operational")).toBeInTheDocument();
    });

    expect(screen.getByText("healthy")).toHaveClass("text-green-600");
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
      mockFetchStatus.mockRejectedValue(serverError);

      render(<StatusCards />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
      });
    });

    it("handles network connection failures", async () => {
      const networkError = new Error("Failed to fetch");
      networkError.name = "TypeError";
      mockFetchStatus.mockRejectedValue(networkError);

      render(<StatusCards />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("handles malformed JSON responses", async () => {
      const jsonError = new SyntaxError("Unexpected token < in JSON at position 0");
      mockFetchStatus.mockRejectedValue(jsonError);

      render(<StatusCards />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("handles 429 rate limiting errors", async () => {
      const rateLimitError = new Error("HTTP 429: Too Many Requests");
      mockFetchStatus.mockRejectedValue(rateLimitError);

      render(<StatusCards />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("handles empty response gracefully", async () => {
      mockFetchStatus.mockResolvedValue(null);

      render(<StatusCards />, { wrapper: TestWrapper });

      await waitFor(() => {
        // Should not crash, component should handle null gracefully
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      });
    });

    it("handles CORS errors", async () => {
      const corsError = new Error("CORS policy: No 'Access-Control-Allow-Origin' header");
      mockFetchStatus.mockRejectedValue(corsError);

      render(<StatusCards />, { wrapper: TestWrapper });

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });
  });
});
