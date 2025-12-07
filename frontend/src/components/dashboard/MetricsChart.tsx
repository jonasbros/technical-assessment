"use client";

import { useState, useEffect } from "react";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

import {
  fetchMetrics,
  fetchStatus,
  StatusUpdate,
  TimeSeriesData,
  TimeRange,
} from "@/api/mock-data";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function MetricsChart() {
  const [chartData, setChartData] = useState<TimeSeriesData[]>([]);
  const [timeframe, setTimeframe] = useState<TimeRange>("day");

  // instantly fetch metrics on select change
  useEffect(() => {
    const getInitialMetrics = async () => {
      const initialMetrics = await fetchMetrics(timeframe);
      setChartData(initialMetrics);
    };
    getInitialMetrics();
  }, [timeframe]);

  // polling for fetching metrics
  useEffect(() => {
    const fetchChartData = async () => {
      const metrics = await fetchMetrics(timeframe);

      setChartData(metrics);
    };

    const pollInterval = setInterval(() => {
      fetchChartData();
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [timeframe]);

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp />
          Metrics Data
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="ml-auto">
          <NativeSelect
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as TimeRange)}
          >
            <NativeSelectOption value="" disabled>
              Select Timeframe
            </NativeSelectOption>
            <NativeSelectOption value="hour">Hour</NativeSelectOption>
            <NativeSelectOption value="day">Day</NativeSelectOption>
            <NativeSelectOption value="week">Week</NativeSelectOption>
          </NativeSelect>
        </div>

        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                if (timeframe === "hour") return date.toLocaleTimeString();
                if (timeframe === "day") return date.toLocaleDateString();
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="value"
              type="linear"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default MetricsChart;
