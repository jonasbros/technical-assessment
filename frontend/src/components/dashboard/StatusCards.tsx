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
  });

  const statusConfig = {
    healthy: {
      color: "text-green-600",
      border: "border-green-600",
      icon: Activity,
    },
    warning: {
      color: "text-yellow-500",
      border: "border-yellow-500",
      icon: TriangleAlert,
    },
    error: { color: "text-red-700", border: "border-red-700", icon: Bug },
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
      <Card key={id} className={`w-full mx-auto ${config.border}`}>
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
