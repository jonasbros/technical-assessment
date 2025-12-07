import { Suspense } from "react";
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
} from "@/api/mock-data";

export default async function Dashboard() {
  const [metrics, statuses]: [TimeSeriesData[], StatusUpdate[]] =
    await Promise.all([fetchMetrics(), fetchStatus()]);

  console.log(metrics);
  return (
    <div className="dashboard-layout">
      <Suspense fallback={<Loading />}>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto p-4 space-y-6">
            {/* Status Cards - Summary metrics */}
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
                <MetricsChart />
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
