"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, Bug, TriangleAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusCardSkeleton } from "@/src/components/ui/card-skeleton";

import { fetchStatus, StatusUpdate } from "@/api/mock-data";

function StatusCards() {
  const { data: statuses = [], isLoading } = useQuery<StatusUpdate[]>({
    queryKey: ["status"],
    queryFn: fetchStatus,
    refetchInterval: 5000,
    throwOnError: true,
  });

  const statusConfig = {
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
  };

  if (isLoading)
    return (
      <>
        <StatusCardSkeleton />
        <StatusCardSkeleton />
        <StatusCardSkeleton />
      </>
    );

  return statuses.map(({ id, status, message, timestamp }) => {
    const config = statusConfig[status] || statusConfig.error;
    const Icon = config.icon;

    return (
      <Card
        key={id}
        className={`bg-card text-card-foreground w-full mx-auto ${config.border} shadow-sm`}
      >
        <CardHeader>
          <CardTitle
            className={`flex items-center gap-2 uppercase ${config.color}`}
          >
            <Icon />
            {status}
          </CardTitle>
          <CardDescription>{timestamp}</CardDescription>
        </CardHeader>
        <CardContent>{message}</CardContent>
      </Card>
    );
  });
}

export default StatusCards;
