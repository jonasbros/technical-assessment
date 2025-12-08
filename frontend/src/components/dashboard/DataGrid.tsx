"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsCardSkeleton } from "@/src/components/ui/card-skeleton";

import { fetchMetrics, TimeRange, TimeSeriesData } from "@/api/mock-data";

import { POLLING_INTERVAL } from "@/lib/constants";
import { dateTimeFormatter } from "@/lib/utils";

import { useDebounce } from "@/src/hooks/useDebounce";

export default function DataGrid({ timeframe }: { timeframe: TimeRange }) {
  const { data: chartData = [], isLoading } = useQuery<TimeSeriesData[]>({
    queryKey: ["metrics", timeframe],
    queryFn: () => fetchMetrics(timeframe),
    refetchInterval: POLLING_INTERVAL,
    throwOnError: true,
  });

  const DEBOUNCE_DELAY = 500;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);

  if (isLoading) return <MetricsCardSkeleton />;

  const filteredData = chartData.filter(
    (metric) =>
      debouncedSearchTerm === "" ||
      dateTimeFormatter(new Date(metric.timestamp))
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      metric.value.toString().includes(debouncedSearchTerm)
  );

  return (
    <Card className="bg-card text-card-foreground w-full mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TableProperties aria-hidden="true" />
          Data Grid
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          aria-label="Search Input"
          type="text"
          placeholder="Search"
          className="w-1/2 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {debouncedSearchTerm
            ? `${filteredData.length} results found for "${debouncedSearchTerm}"`
            : `${filteredData.length} total results`}
        </div>

        <div
          className="max-h-[350px] overflow-y-auto"
          role="region"
          aria-label="Data table"
        >
          <Table aria-label="Metrics data table">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]" scope="col">
                  Date / Time
                </TableHead>
                <TableHead className="text-right" scope="col">
                  Value
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!filteredData.length ? (
                <TableRow className="data-grid__data-row">
                  <TableCell className="font-medium">
                    No Results Found.
                  </TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
              ) : (
                filteredData.map((metric) => (
                  <TableRow
                    key={metric.timestamp}
                    className="data-grid__data-row"
                  >
                    <TableCell className="font-medium">
                      {dateTimeFormatter(new Date(metric.timestamp))}
                    </TableCell>
                    <TableCell className="text-right">{metric.value}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
