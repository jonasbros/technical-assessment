"use client";
import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";

import { ErrorBoundary } from "react-error-boundary";

import { ErrorFallback } from "@/src/components/ui/error-fallback";
import { ThemeProvider } from "@/src/components/ui/theme-provider";

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ error, resetErrorBoundary }) => (
              <ErrorFallback
                error={error}
                resetErrorBoundary={resetErrorBoundary}
              />
            )}
          >
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </ThemeProvider>
  );
}
