import { AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <Card className="bg-card text-card-foreground w-full max-w-sm mt-16 mx-auto border-destructive shadow-sm" role="alert">
      <div aria-live="assertive" className="sr-only">
        Error occurred: {error.message || "An unexpected error occurred"}
      </div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred"}
        </p>
        <Button
          onClick={resetErrorBoundary}
          variant="outline"
          className="w-full cursor-pointer"
          aria-label="Try again to reload the content"
        >
          <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
          Try again
        </Button>
      </CardContent>
    </Card>
  );
}
