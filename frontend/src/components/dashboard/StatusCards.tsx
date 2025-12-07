import { Activity, Bug, TriangleAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function StatusCards({
  status,
  message,
  timestamp,
}: {
  status: string;
  message: string;
  timestamp: string;
}) {
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

  const config = statusConfig[status] || statusConfig.error;
  const Icon = config.icon;

  return (
    <Card className={`w-full sm:max-w-sm mx-auto ${config.border}`}>
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
}

export default StatusCards;
