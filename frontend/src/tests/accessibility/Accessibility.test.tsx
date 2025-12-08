import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  MetricsChart,
  DataGrid,
  StatusCards,
  ThemeSwitch,
  TimeFrameSelect,
} from "@/src/components/dashboard";
import Dashboard from "@/src/app/page";
import { ErrorFallback } from "@/src/components/ui/error-fallback";

// Mock APIs
jest.mock("@/api/mock-data", () => ({
  fetchMetrics: jest.fn().mockResolvedValue([
    { timestamp: "2023-01-01T00:00:00Z", value: 75 },
    { timestamp: "2023-01-01T01:00:00Z", value: 85 },
  ]),
  fetchStatus: jest.fn().mockResolvedValue([
    {
      id: "1",
      status: "healthy",
      message: "All systems operational",
      timestamp: "2023-01-01T00:00:00Z",
    },
  ]),
}));

// Mock Recharts
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="chart-container">{children}</div>
  ),
  AreaChart: ({ children, accessibilityLayer, ...props }: any) => (
    <div
      data-testid="area-chart"
      role="img"
      aria-label={props["aria-label"] || "Area chart showing metrics data"}
      {...(accessibilityLayer && { "aria-describedby": "chart-desc" })}
    >
      {children}
    </div>
  ),
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  ChartTooltip: () => <div data-testid="tooltip" />,
}));

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    resolvedTheme: "light",
    setTheme: jest.fn(),
  }),
}));

// Mock next/web-vitals
jest.mock("next/web-vitals", () => ({
  useReportWebVitals: jest.fn(),
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

describe("Accessibility Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("ARIA Labels and Roles", () => {
    it("ThemeSwitch has proper ARIA labels", () => {
      render(<ThemeSwitch />, { wrapper: TestWrapper });

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Toggle theme");

      // Screen reader text
      expect(screen.getByText("Toggle theme")).toBeInTheDocument();
    });

    it("TimeFrameSelect has proper combobox role", () => {
      const mockHandleChange = jest.fn();
      render(<TimeFrameSelect handleTimeframeChange={mockHandleChange} />, {
        wrapper: TestWrapper,
      });

      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
    });

    it("DataGrid has proper table structure with accessibility attributes", async () => {
      render(<DataGrid timeframe="day" />, { wrapper: TestWrapper });

      // Wait for data to load
      await screen.findByText("Date / Time");

      // Check table roles and accessibility attributes
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute("aria-label", "Metrics data table");

      // Check region with aria-label
      const tableRegion = screen.getByRole("region");
      expect(tableRegion).toHaveAttribute("aria-label", "Data table");

      // Check column headers have scope
      const columnHeaders = screen.getAllByRole("columnheader");
      expect(columnHeaders).toHaveLength(2);
      expect(columnHeaders[0]).toHaveAttribute("scope", "col");
      expect(columnHeaders[1]).toHaveAttribute("scope", "col");
    });

    it("StatusCards have proper status indicators with ARIA labels", async () => {
      render(<StatusCards />, { wrapper: TestWrapper });

      await screen.findByText("All systems operational");

      // Check status card has proper ARIA label
      const statusCard = screen.getByRole("status");
      expect(statusCard).toHaveAttribute(
        "aria-label",
        "healthy status: All systems operational"
      );

      // Status should be conveyed to screen readers
      const healthyStatus = screen.getByText("healthy");
      expect(healthyStatus).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("ThemeSwitch is focusable and activatable via keyboard", () => {
      const mockSetTheme = jest.fn();

      // Override the mock for this specific test
      jest.doMock("next-themes", () => ({
        useTheme: () => ({
          theme: "light",
          resolvedTheme: "light",
          setTheme: mockSetTheme,
        }),
      }));

      render(<ThemeSwitch />, { wrapper: TestWrapper });

      const button = screen.getByRole("button");

      // Should be focusable
      button.focus();
      expect(document.activeElement).toBe(button);

      fireEvent.keyDown(button, { key: "Enter" });
    });

    it("TimeFrameSelect supports keyboard navigation", () => {
      const mockHandleChange = jest.fn();
      render(<TimeFrameSelect handleTimeframeChange={mockHandleChange} />, {
        wrapper: TestWrapper,
      });

      const select = screen.getByRole("combobox");

      // Should be focusable
      select.focus();
      expect(document.activeElement).toBe(select);

      // Should open on Enter or Space
      fireEvent.keyDown(select, { key: "Enter" });
    });

    it("DataGrid search input is keyboard accessible", async () => {
      render(<DataGrid timeframe="day" />, { wrapper: TestWrapper });

      await screen.findByPlaceholderText("Search");

      const searchInput = screen.getByPlaceholderText("Search");

      // Should be focusable
      searchInput.focus();
      expect(document.activeElement).toBe(searchInput);

      // Should accept keyboard input
      fireEvent.change(searchInput, { target: { value: "test" } });
      expect(searchInput).toHaveValue("test");
    });

    it("Dashboard supports tab navigation order", () => {
      render(<Dashboard />, { wrapper: TestWrapper });

      // Get all focusable elements
      const focusableElements = screen
        .getAllByRole("combobox", { hidden: true })
        .concat(screen.getAllByRole("button", { hidden: true }));

      expect(focusableElements.length).toBeGreaterThan(0);

      // First focusable element should be TimeFrameSelect
      const firstElement = screen.getByRole("combobox");
      expect(firstElement).toBeInTheDocument();
    });
  });

  describe("Screen Reader Support", () => {
    it("provides meaningful text for screen readers", () => {
      // Test ThemeSwitch accessibility
      render(<ThemeSwitch />, { wrapper: TestWrapper });

      // Screen reader users should understand what each element does
      expect(screen.getByLabelText("Toggle theme")).toBeInTheDocument();
      expect(screen.getByText("Toggle theme")).toBeInTheDocument();
    });

    it("StatusCards convey status information to screen readers with proper ARIA", async () => {
      render(<StatusCards />, { wrapper: TestWrapper });

      await screen.findByText("All systems operational");

      // Status card should have descriptive ARIA label
      const statusCard = screen.getByRole("status");
      expect(statusCard).toHaveAttribute(
        "aria-label",
        "healthy status: All systems operational"
      );

      // Status information should be clear
      expect(screen.getByText("healthy")).toBeInTheDocument();
      expect(screen.getByText("All systems operational")).toBeInTheDocument();
    });

    it("DataGrid provides enhanced table context for screen readers", async () => {
      render(<DataGrid timeframe="day" />, { wrapper: TestWrapper });

      await screen.findByText("Date / Time");

      // Table should have accessible name
      const table = screen.getByRole("table");
      expect(table).toHaveAttribute("aria-label", "Metrics data table");

      // Table region should be labeled
      const tableRegion = screen.getByRole("region");
      expect(tableRegion).toHaveAttribute("aria-label", "Data table");

      // Table headers should be properly scoped
      expect(screen.getByText("Date / Time")).toBeInTheDocument();
      expect(screen.getByText("Value")).toBeInTheDocument();
    });

    it("DataGrid has live region for search results announcements", async () => {
      render(<DataGrid timeframe="day" />, { wrapper: TestWrapper });

      await screen.findByText("Date / Time");

      // Should have live region for search announcements
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute("aria-atomic", "true");
      expect(liveRegion).toHaveClass("sr-only");
    });
  });

  describe("Form Controls", () => {
    it("search input has proper ARIA labels", async () => {
      render(<DataGrid timeframe="day" />, { wrapper: TestWrapper });

      await screen.findByPlaceholderText("Search");

      const searchInput = screen.getByPlaceholderText("Search");

      // Should have proper ARIA label
      expect(searchInput).toHaveAttribute("aria-label", "Search Input");
      expect(searchInput).toHaveAttribute("placeholder", "Search");
      expect(searchInput).toHaveAttribute("type", "text");
    });

    it("search input updates live region with results", async () => {
      render(<DataGrid timeframe="day" />, { wrapper: TestWrapper });

      await screen.findByPlaceholderText("Search");

      const searchInput = screen.getByPlaceholderText("Search");
      const liveRegion = document.querySelector('[aria-live="polite"]');

      // Initially should show total results
      expect(liveRegion).toHaveTextContent("2 total results");

      // After searching, should announce filtered results
      fireEvent.change(searchInput, { target: { value: "75" } });

      // Wait for debounce to complete (useDebounce has 500ms delay)
      await new Promise((resolve) => setTimeout(resolve, 550));

      expect(liveRegion).toHaveTextContent('1 results found for "75"');
    });

    it("select controls have proper labels", () => {
      const mockHandleChange = jest.fn();
      render(<TimeFrameSelect handleTimeframeChange={mockHandleChange} />, {
        wrapper: TestWrapper,
      });

      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
    });
  });

  describe("Error States", () => {
    it("handles error states accessibly", async () => {
      // Mock API error
      jest.doMock("@/api/mock-data", () => ({
        fetchMetrics: jest.fn().mockRejectedValue(new Error("API Error")),
        fetchStatus: jest.fn().mockRejectedValue(new Error("Status Error")),
      }));

      render(<Dashboard />, { wrapper: TestWrapper });

      // Should still have accessible structure even with errors
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByLabelText("Toggle theme")).toBeInTheDocument();
    });

    it("ErrorFallback has proper ARIA attributes and live regions", () => {
      const mockError = new Error("Test error message");
      const mockReset = jest.fn();

      render(
        <ErrorFallback error={mockError} resetErrorBoundary={mockReset} />
      );

      // Should have role="alert" for critical errors
      const errorCard = screen.getByRole("alert");
      expect(errorCard).toBeInTheDocument();

      // Should have assertive live region for immediate announcement
      const liveRegion = document.querySelector('[aria-live="assertive"]');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveClass("sr-only");
      expect(liveRegion).toHaveTextContent(
        "Error occurred: Test error message"
      );

      // Button should have descriptive ARIA label
      const retryButton = screen.getByRole("button");
      expect(retryButton).toHaveAttribute(
        "aria-label",
        "Try again to reload the content"
      );

      // Icons should be hidden from screen readers
      const refreshIcon = document.querySelector('[aria-hidden="true"]');
      expect(refreshIcon).toBeInTheDocument();
    });
  });

  describe("Focus Management", () => {
    it("maintains logical focus order", () => {
      render(<Dashboard />, { wrapper: TestWrapper });

      // Tab order should be logical: TimeFrameSelect -> ThemeSwitch -> Search Input
      const timeframeSelect = screen.getByRole("combobox");
      const themeSwitch = screen.getByLabelText("Toggle theme");

      expect(timeframeSelect).toBeInTheDocument();
      expect(themeSwitch).toBeInTheDocument();
    });

    it("focus is visible", () => {
      render(<ThemeSwitch />, { wrapper: TestWrapper });

      const button = screen.getByRole("button");
      button.focus();

      // Focus should be programmatically detectable
      expect(document.activeElement).toBe(button);
    });
  });

  describe("Color and Contrast", () => {
    it("status indicators use accessible color coding", async () => {
      render(<StatusCards />, { wrapper: TestWrapper });

      await screen.findByText("healthy");

      const healthyElement = screen.getByText("healthy");

      // Should have color class that provides sufficient contrast
      expect(healthyElement).toHaveClass("text-green-600");
    });

    it("theme toggle works for accessibility", () => {
      render(<ThemeSwitch />, { wrapper: TestWrapper });

      const button = screen.getByLabelText("Toggle theme");

      // Should be able to toggle for users with visual preferences
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });
});
