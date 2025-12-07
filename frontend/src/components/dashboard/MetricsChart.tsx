"use client";

import { useState } from "react";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

import { TimeRange, TimeSeriesData } from "@/api/mock-data";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function MetricsChart({
  chartData,
  handleTimeframe,
}: {
  chartData: TimeSeriesData[];
  handleTimeframe: (timeframe: TimeRange) => void;
}) {
  const [timeframe, setTimeframe] = useState<TimeRange>("day");

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
            onChange={(e) => {
              setTimeframe(e.target.value as TimeRange);
              handleTimeframe(e.target.value as TimeRange);
            }}
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
