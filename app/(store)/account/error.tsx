// app/(store)/account/error.tsx
// Error boundary for account pages

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Account error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          We encountered an error while loading your account information. Please try again or contact support if the problem persists.
        </p>
      </div>
      <Button onClick={() => reset()} className="gap-2 rounded-2xl shadow-md">
        <RefreshCcw className="w-4 h-4" />
        Try again
      </Button>
    </div>
  );
}
