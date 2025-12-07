"use client";

import { useState } from "react";
import {
  MetricsChart,
  DataGrid,
  StatusCards,
  TimeFrameSelect,
  ThemeSwitch,
} from "@/src/components/dashboard";
import { TimeRange } from "@/api/mock-data";

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<TimeRange>("day");

  return (
    <div className="dashboard-layout flex flex-col gap-4 pb-8">
      <div className="flex justify-between">
        <TimeFrameSelect handleTimeframeChange={setTimeframe} />
        <ThemeSwitch />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:col-span-3">
          <StatusCards />
        </div>
        <div className="lg:col-span-2">
          <MetricsChart timeframe={timeframe} />
        </div>
        <div className="lg:col-span-1">
          <DataGrid timeframe={timeframe} />
        </div>
      </div>
    </div>
  );
}
