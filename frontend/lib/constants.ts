import { Activity, Bug, TriangleAlert } from "lucide-react";

export const POLLING_INTERVAL = 30000; // 30 seconds
export const API_TIMEOUT = 5000;
export const DEFAULT_TIME_RANGE = "day";

export const STATUS_CONFIG = {
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
