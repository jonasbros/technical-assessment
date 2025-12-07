import { dateTimeFormatter } from "@/lib/utils";
import { DEFAULT_TIME_RANGE } from "@/lib/constants";

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface StatusUpdate {
  id: string;
  status: "healthy" | "warning" | "error";
  message: string;
  timestamp: string;
}

export type TimeRange = "hour" | "day" | "week";

export async function fetchMetrics(
  timeRange: TimeRange = DEFAULT_TIME_RANGE
): Promise<TimeSeriesData[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = Date.now();
  const data: TimeSeriesData[] = [];

  // Generate mock time series data
  const intervals = timeRange === "hour" ? 60 : timeRange === "day" ? 24 : 7;
  const step =
    timeRange === "hour" ? 60000 : timeRange === "day" ? 3600000 : 86400000;

  for (let i = intervals - 1; i >= 0; i--) {
    data.push({
      timestamp: new Date(now - i * step).toISOString(),
      value: Math.floor(Math.random() * 100) + 50,
    });
  }

  return data;
}

export async function fetchStatus(): Promise<StatusUpdate[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: "1",
      status: "healthy",
      message: "All systems operational",
      timestamp: dateTimeFormatter(new Date(Date.now() - 300000)), // 5 minutes ago
    },
    {
      id: "2",
      status: "warning",
      message: "High CPU utilization detected",
      timestamp: dateTimeFormatter(new Date(Date.now() - 900000)), // 15 minutes ago
    },
    {
      id: "3",
      status: "error",
      message: "Database connection timeout",
      timestamp: dateTimeFormatter(new Date(Date.now() - 1800000)), // 30 minutes ago
    },
  ];
}
