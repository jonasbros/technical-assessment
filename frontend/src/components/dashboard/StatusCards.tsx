"use client";

import { useMemo } from "react";
import { Activity, Bug, TriangleAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusCardSkeleton } from "@/src/components/ui/card-skeleton";
import { InlineError } from "@/src/components/ui/inline-error";

import { fetchStatus, StatusUpdate } from "@/api/mock-data";

export default function StatusCards() {
  const { data: statuses = [], isLoading, error, isError, refetch } = useQuery<StatusUpdate[]>({
    queryKey: ["status"],
    queryFn: fetchStatus,
    select: (res) => res ?? [],
  });

  const STATUS_CONFIG = useMemo(
    () => ({
      healthy: {
        color: "text-green-600 dark:text-green-500",
        border: "border-green-600 dark:border-green-500",
        icon: Activity,
      },
      warning: {
        color: "text-yellow-500 dark:text-yellow-600",
        border: "border-yellow-500 dark:border-yellow-600",
        icon: TriangleAlert,
      },
      error: {
        color: "text-red-600 dark:text-red-500",
        border: "border-red-600 dark:border-red-500",
        icon: Bug,
      },
    }),
    []
  );

  if (isLoading)
    return (
      <>
        <StatusCardSkeleton />
        <StatusCardSkeleton />
        <StatusCardSkeleton />
      </>
    );

  if (isError) {
    return <InlineError error={error} onRetry={() => refetch()} title="Failed to load status" />;
  }

  return statuses.map(({ id, status, message, timestamp }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.error;
    const Icon = config.icon;
    return (
      <Card
        role="status"
        aria-label={`${status} status: ${message}`}
        key={id}
        className={`bg-card text-card-foreground w-full mx-auto ${config.border} shadow-sm`}
      >
        <CardHeader>
          <CardTitle
            className={`flex items-center gap-2 uppercase ${config.color}`}
          >
            <Icon aria-hidden="true" />
            {status}
          </CardTitle>
          <CardDescription>{timestamp}</CardDescription>
        </CardHeader>
        <CardContent>{message}</CardContent>
      </Card>
    );
  });
}
