import { AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InlineErrorProps {
  error: Error;
  onRetry: () => void;
  title?: string;
}

export function InlineError({
  error,
  onRetry,
  title = "Failed to load data"
}: InlineErrorProps) {
  return (
    <Card className="bg-card text-card-foreground w-full border-destructive/50 shadow-sm" role="alert">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-destructive text-base">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <p className="text-sm text-muted-foreground">
          {error.message || "An error occurred while loading the data"}
        </p>
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="w-full"
          aria-label="Retry loading data"
        >
          <RefreshCw className="h-3 w-3 mr-2" aria-hidden="true" />
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}