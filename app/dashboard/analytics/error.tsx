// app/dashboard/analytics/error.tsx
// Error boundary for analytics dashboard.

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function AnalyticsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 p-8 text-center animate-in zoom-in-95 duration-300">
      <div className="mb-4 rounded-full bg-destructive/10 p-4 text-destructive">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
      <p className="mt-2 mb-6 text-muted-foreground max-w-md">
        We encountered an error while loading the analytics data. This might be a temporary connection issue.
      </p>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="rounded-full"
        >
          Reload Page
        </Button>
        <Button 
          onClick={() => reset()}
          className="rounded-full gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
