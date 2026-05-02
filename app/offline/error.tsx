// file: app/offline/error.tsx
// purpose: Error boundary for offline page

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function OfflineError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Offline page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground text-sm">
          There was an error loading the offline page.
        </p>
        <Button onClick={() => reset()} variant="outline" className="rounded-full">
          Try again
        </Button>
      </div>
    </div>
  );
}
