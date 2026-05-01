// app/dashboard/flash-sales/error.tsx
// Error boundary for flash sales page

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function FlashSalesError({
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 p-8 text-center">
      <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
        <AlertCircle className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground max-w-md">
          We encountered an error while loading the flash sales. This might be a temporary connection issue.
        </p>
      </div>
      <Button onClick={() => reset()} className="gap-2">
        <RefreshCcw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
