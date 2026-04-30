// app/(store)/categories/[slug]/error.tsx
// Error boundary for the category detail page

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CategoryError({
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
      <h2 className="text-xl font-bold">Failed to load category</h2>
      <p className="text-muted-foreground text-sm">Please try again or browse all categories.</p>
      <div className="flex gap-3">
        <Button onClick={reset} className="rounded-full px-6">Retry</Button>
        <Button variant="outline" asChild className="rounded-full px-6">
          <Link href="/categories">All Categories</Link>
        </Button>
      </div>
    </div>
  );
}
