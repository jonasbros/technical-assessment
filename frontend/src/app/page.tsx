"use client";

import { useState, Profiler } from "react";
import { useReportWebVitals } from "next/web-vitals";

import {
  MetricsChart,
  DataGrid,
  StatusCards,
  TimeFrameSelect,
  ThemeSwitch,
} from "@/src/components/dashboard";
import { TimeRange } from "@/api/mock-data";

import { DEFAULT_TIME_RANGE } from "@/lib/constants";

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<TimeRange>(DEFAULT_TIME_RANGE);

  useReportWebVitals((metric) => {
    console.log("Web Vitals:", metric);
  });

  // PROFILER CALLBACK
  function onRenderCallback(id, phase, actualDuration, baseDuration) {
    console.log("Performance:", {
      component: id,
      phase, // "mount" or "update"
      actualDuration, // Time spent rendering
      baseDuration, // Estimated time without memoization
    });
  }

  return (
    <Profiler id="Dashboard" onRender={onRenderCallback}>
      <div className="dashboard-layout flex flex-col gap-4 pb-8 px-6">
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
    </Profiler>
  );
}
