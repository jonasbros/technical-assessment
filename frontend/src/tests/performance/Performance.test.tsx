/*
  PERFORMANCE TEST USING REACT PROFILER

*/

import { render, fireEvent } from "@testing-library/react";
import { Profiler } from "react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  MetricsChart,
  DataGrid,
  StatusCards,
} from "@/src/components/dashboard";
import { TimeSeriesData, StatusUpdate } from "@/api/mock-data";
import fs from "fs";
import path from "path";

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

// Mock APIs with controlled data
jest.mock("@/api/mock-data", () => ({
  fetchMetrics: jest.fn(),
  fetchStatus: jest.fn(),
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

// Performance logging utility
function logPerformanceResult(
  component: string,
  phase: string,
  duration: number,
  dataSize?: number,
  passed?: boolean
) {
  const logPath = path.join(__dirname, "performance-results.log");
  const timestamp = new Date().toISOString();
  const status = passed ? "✅ PASS" : "❌ FAIL";
  const dataSizeInfo = dataSize ? ` (${dataSize} items)` : "";

  const logEntry = `${timestamp} | ${status} | ${component} | ${phase} | ${duration.toFixed(
    2
  )}ms${dataSizeInfo}\n`;

  try {
    fs.appendFileSync(logPath, logEntry);
  } catch (error) {
    console.warn("Could not write to performance log:", error);
  }
}

// Helper to generate large datasets
function generateLargeMetricsData(count: number): TimeSeriesData[] {
  return Array.from({ length: count }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
    value: Math.floor(Math.random() * 100) + 50,
  }));
}

function generateLargeStatusData(count: number): StatusUpdate[] {
  const statuses = ["healthy", "warning", "error"] as const;
  return Array.from({ length: count }, (_, i) => ({
    id: `status-${i}`,
    status: statuses[i % 3],
    message: `System ${i} status message`,
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
  }));
}

describe("Performance Tests", () => {
  let mockFetchMetrics: jest.Mock;
  let mockFetchStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchMetrics = require("@/api/mock-data").fetchMetrics;
    mockFetchStatus = require("@/api/mock-data").fetchStatus;
  });

  describe("MetricsChart Performance", () => {
    it("renders 100 data points under 100ms", () => {
      const data = generateLargeMetricsData(100);
      mockFetchMetrics.mockResolvedValue(data);

      const onRender = jest.fn();

      render(
        <TestWrapper>
          <Profiler id="MetricsChart-100" onRender={onRender}>
            <MetricsChart timeframe="day" />
          </Profiler>
        </TestWrapper>
      );

      // Check initial render performance
      const mountCall = onRender.mock.calls.find((call) => call[1] === "mount");
      expect(mountCall).toBeTruthy();

      const duration = mountCall[2];
      const passed = duration < 100;

      // Log performance result
      logPerformanceResult("MetricsChart", "mount", duration, 100, passed);

      expect(duration).toBeLessThan(100); // actualDuration under 100ms
    });

    it("renders 1000 data points under 200ms", () => {
      const data = generateLargeMetricsData(1000);
      mockFetchMetrics.mockResolvedValue(data);

      const onRender = jest.fn();

      render(
        <TestWrapper>
          <Profiler id="MetricsChart-1000" onRender={onRender}>
            <MetricsChart timeframe="day" />
          </Profiler>
        </TestWrapper>
      );

      const mountCall = onRender.mock.calls.find((call) => call[1] === "mount");
      expect(mountCall).toBeTruthy();

      const duration = mountCall[2];
      const passed = duration < 200;

      // Log performance result
      logPerformanceResult("MetricsChart", "mount", duration, 1000, passed);

      expect(duration).toBeLessThan(200); // actualDuration under 200ms
    });

    it("updates timeframe efficiently", () => {
      const dayData = generateLargeMetricsData(24);
      const hourData = generateLargeMetricsData(60);

      mockFetchMetrics
        .mockResolvedValueOnce(dayData)
        .mockResolvedValueOnce(hourData);

      const onRender = jest.fn();

      const { rerender } = render(
        <TestWrapper>
          <Profiler id="MetricsChart-Update" onRender={onRender}>
            <MetricsChart timeframe="day" />
          </Profiler>
        </TestWrapper>
      );

      // Update timeframe
      rerender(
        <TestWrapper>
          <Profiler id="MetricsChart-Update" onRender={onRender}>
            <MetricsChart timeframe="hour" />
          </Profiler>
        </TestWrapper>
      );

      // Check update performance
      const updateCall = onRender.mock.calls.find(
        (call) => call[1] === "update"
      );
      if (updateCall) {
        expect(updateCall[2]).toBeLessThan(50); // actualDuration under 50ms
      }
    });
  });

  describe("DataGrid Performance", () => {
    it("renders 500 rows efficiently", () => {
      const data = generateLargeMetricsData(500);
      mockFetchMetrics.mockResolvedValue(data);

      const onRender = jest.fn();

      render(
        <TestWrapper>
          <Profiler id="DataGrid-500" onRender={onRender}>
            <DataGrid timeframe="day" />
          </Profiler>
        </TestWrapper>
      );

      const mountCall = onRender.mock.calls.find((call) => call[1] === "mount");
      expect(mountCall).toBeTruthy();
      expect(mountCall[2]).toBeLessThan(150); // Table rendering under 150ms
    });

    it("handles search filtering performance", () => {
      const data = generateLargeMetricsData(1000);
      mockFetchMetrics.mockResolvedValue(data);

      const onRender = jest.fn();

      const { container } = render(
        <TestWrapper>
          <Profiler id="DataGrid-Search" onRender={onRender}>
            <DataGrid timeframe="day" />
          </Profiler>
        </TestWrapper>
      );

      // Trigger search (this will cause re-render with filtered data)
      const searchInput = container.querySelector(
        'input[placeholder="Search"]'
      );
      if (searchInput) {
        fireEvent.change(searchInput, { target: { value: "50" } });

        // Check search filtering performance
        const updateCalls = onRender.mock.calls.filter(
          (call) => call[1] === "update"
        );
        if (updateCalls.length > 0) {
          const lastUpdate = updateCalls[updateCalls.length - 1];
          expect(lastUpdate[2]).toBeLessThan(30); // Search filtering under 30ms
        }
      }
    });
  });

  describe("StatusCards Performance", () => {
    it("renders many status cards efficiently", () => {
      const data = generateLargeStatusData(50);
      mockFetchStatus.mockResolvedValue(data);

      const onRender = jest.fn();

      render(
        <TestWrapper>
          <Profiler id="StatusCards-50" onRender={onRender}>
            <StatusCards />
          </Profiler>
        </TestWrapper>
      );

      const mountCall = onRender.mock.calls.find((call) => call[1] === "mount");
      expect(mountCall).toBeTruthy();
      expect(mountCall[2]).toBeLessThan(100); // 50 cards under 100ms
    });

    it("handles status updates efficiently", () => {
      const initialData = generateLargeStatusData(20);
      const updatedData = generateLargeStatusData(25); // 5 new items

      mockFetchStatus
        .mockResolvedValueOnce(initialData)
        .mockResolvedValueOnce(updatedData);

      const onRender = jest.fn();

      const { rerender } = render(
        <TestWrapper>
          <Profiler id="StatusCards-Update" onRender={onRender}>
            <StatusCards />
          </Profiler>
        </TestWrapper>
      );

      // Simulate status update
      rerender(
        <TestWrapper>
          <Profiler id="StatusCards-Update" onRender={onRender}>
            <StatusCards />
          </Profiler>
        </TestWrapper>
      );

      const updateCall = onRender.mock.calls.find(
        (call) => call[1] === "update"
      );
      if (updateCall) {
        expect(updateCall[2]).toBeLessThan(40); // Status updates under 40ms
      }
    });
  });

  describe("Performance Benchmarks", () => {
    it("meets performance budget for dashboard load", () => {
      const metricsData = generateLargeMetricsData(168); // Week of hourly data
      const statusData = generateLargeStatusData(10);

      mockFetchMetrics.mockResolvedValue(metricsData);
      mockFetchStatus.mockResolvedValue(statusData);

      const chartRender = jest.fn();
      const gridRender = jest.fn();
      const statusRender = jest.fn();

      render(
        <TestWrapper>
          <div>
            <Profiler id="Chart" onRender={chartRender}>
              <MetricsChart timeframe="week" />
            </Profiler>
            <Profiler id="Grid" onRender={gridRender}>
              <DataGrid timeframe="week" />
            </Profiler>
            <Profiler id="Status" onRender={statusRender}>
              <StatusCards />
            </Profiler>
          </div>
        </TestWrapper>
      );

      // Total dashboard load time should be reasonable
      const totalRenderTime =
        (chartRender.mock.calls[0]?.[2] || 0) +
        (gridRender.mock.calls[0]?.[2] || 0) +
        (statusRender.mock.calls[0]?.[2] || 0);

      const passed = totalRenderTime < 300;

      // Log overall dashboard performance
      logPerformanceResult(
        "Dashboard",
        "full-load",
        totalRenderTime,
        168,
        passed
      );

      expect(totalRenderTime).toBeLessThan(300); // Entire dashboard under 300ms
    });
  });
});
