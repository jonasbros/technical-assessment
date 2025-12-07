"use client";

import { useQuery } from "@tanstack/react-query";
import { TableProperties } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsCardSkeleton } from "@/src/components/ui/card-skeleton";
import { fetchMetrics, TimeRange, TimeSeriesData } from "@/api/mock-data";

function DataGrid({ timeframe }: { timeframe: TimeRange }) {
  const { data: chartData = [], isLoading } = useQuery<TimeSeriesData[]>({
    queryKey: ["metrics", timeframe],
    queryFn: () => fetchMetrics(timeframe),
    refetchInterval: 5000,
  });

  if (isLoading) return <MetricsCardSkeleton />;

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 uppercase">
          <TableProperties />
          Data Grid
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[350px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date / Time</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((metric) => (
                <TableRow key={metric.timestamp}>
                  <TableCell className="font-medium">
                    {metric.timestamp}
                  </TableCell>
                  <TableCell className="text-right">{metric.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default DataGrid;
