"use client";

import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MetricsCardSkeleton } from "@/src/components/ui/card-skeleton";

import { fetchMetrics, TimeRange, TimeSeriesData } from "@/api/mock-data";

const chartConfig = {
  value: {
    label: "Value",
    color: "rgb(14 165 233)",
  },
} satisfies ChartConfig;

function MetricsChart({ timeframe }: { timeframe: TimeRange }) {
  const { data: chartData = [], isLoading } = useQuery<TimeSeriesData[]>({
    queryKey: ["metrics", timeframe],
    queryFn: () => fetchMetrics(timeframe),
    refetchInterval: 5000,
    throwOnError: true,
  });

  if (isLoading) return <MetricsCardSkeleton />;

  return (
    <Card className="bg-card text-card-foreground gap-4 shadow-sm lg:h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp />
          Metrics Data
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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
              fill="var(--color-value)"
              fillOpacity={0.4}
              stroke="var(--color-value)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default MetricsChart;
