// app/(store)/categories/error.tsx
// Error boundary for the categories listing page

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CategoriesError({
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
    <div className="container mx-auto px-4 py-24 flex flex-col items-center gap-4 text-center">
      <h2 className="text-xl font-bold">Failed to load categories</h2>
      <p className="text-muted-foreground text-sm">Please try again.</p>
      <Button onClick={reset} className="rounded-full px-8">Retry</Button>
    </div>
  );
}
