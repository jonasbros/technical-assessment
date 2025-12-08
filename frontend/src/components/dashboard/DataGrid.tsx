"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { TableProperties } from "lucide-react";
import { SearchInput } from "@/src/components/ui/search-input";
import { MetricsTable } from "@/src/components/ui/metrics-table";
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
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search"
        />

        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {debouncedSearchTerm
            ? `${filteredData.length} results found for "${debouncedSearchTerm}"`
            : `${filteredData.length} total results`}
        </div>

        <MetricsTable data={filteredData} />
      </CardContent>
    </Card>
  );
}
