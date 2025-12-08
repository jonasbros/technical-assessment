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
});
