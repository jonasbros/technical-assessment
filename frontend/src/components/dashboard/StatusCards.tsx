"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusCardSkeleton } from "@/src/components/ui/card-skeleton";

import { fetchStatus, StatusUpdate } from "@/api/mock-data";

import { STATUS_CONFIG } from "@/lib/constants";

function StatusCards() {
  const { data: statuses = [], isLoading } = useQuery<StatusUpdate[]>({
    queryKey: ["status"],
    queryFn: fetchStatus,
    throwOnError: true,
  });

  if (isLoading)
    return (
      <>
        <StatusCardSkeleton />
        <StatusCardSkeleton />
        <StatusCardSkeleton />
      </>
    );

  return statuses.map(({ id, status, message, timestamp }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.error;
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
