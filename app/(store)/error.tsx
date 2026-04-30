// app/(store)/error.tsx
// Error boundary for the public store — catches server rendering errors

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function StoreError({
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
    <div className="container mx-auto px-4 py-24 flex flex-col items-center gap-6 text-center">
      <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
      <p className="text-muted-foreground max-w-md">
        We couldn&apos;t load this page. Please try again.
      </p>
      <Button onClick={reset} className="rounded-full px-8">
        Try again
      </Button>
    </div>
  );
}
