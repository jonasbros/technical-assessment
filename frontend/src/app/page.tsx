"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import {
  MetricsChart,
  DataGrid,
  StatusCards,
} from "@/src/components/dashboard";
import Loading from "@/src/components/Loading";

import {
  fetchMetrics,
  fetchStatus,
  StatusUpdate,
  TimeSeriesData,
  TimeRange,
} from "@/api/mock-data";

export default function Dashboard() {
  const [chartData, setChartData] = useState<TimeSeriesData[]>([]);
  const [statuses, setStatuses] = useState<StatusUpdate[]>([]);
  const [timeframe, setTimeframe] = useState<TimeRange>("day");

  const handleTimeframe = useCallback((timeframe: TimeRange) => {
    setTimeframe(timeframe);
  }, []);

  const fetchData = async () => {
    const [metrics, _statuses]: [TimeSeriesData[], StatusUpdate[]] =
      await Promise.all([fetchMetrics("day"), fetchStatus()]);

    setChartData(metrics);
    setStatuses(_statuses);
  };

  // fetch data on page load
  useEffect(() => {
    fetchData();
  }, []);

  // fetch metrics on timeframe change
  useEffect(() => {
    const fetchChartData = async () => {
      const metrics = await fetchMetrics(timeframe);
      setChartData(metrics);
    };
    fetchChartData();
  }, [timeframe]);

  // polling for fetching both metrics and status
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [timeframe]);

  return (
    <div className="dashboard-layout">
      <Suspense fallback={<Loading />}>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto p-4 space-y-6">
            {/* Status Cards */}
            {statuses.length &&
              statuses.map(({ id, status, message, timestamp }) => (
                <StatusCards
                  key={id}
                  status={status}
                  message={message}
                  timestamp={timestamp}
                />
              ))}

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {statuses.length && (
                  <MetricsChart
                    chartData={chartData}
                    handleTimeframe={handleTimeframe}
                  />
                )}
              </div>
              <div className="lg:col-span-1">
                <DataGrid />
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
