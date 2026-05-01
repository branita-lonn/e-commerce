// app/(store)/checkout/error.tsx
// Error boundary for the checkout page

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[CheckoutPage] Error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center gap-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <div>
        <h2 className="text-xl font-bold">Checkout Error</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          There was a problem loading the checkout process.
        </p>
      </div>
      <div className="flex gap-3">
        <button 
          className="inline-flex items-center justify-center h-9 px-4 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/80 font-medium transition-colors"
          onClick={reset}
        >
          Try Again
        </button>
        <Link 
          href="/cart"
          className="inline-flex items-center justify-center h-9 px-4 rounded-2xl border border-border hover:bg-muted font-medium transition-colors"
        >
          Return to Cart
        </Link>
      </div>
    </div>
  );
}
