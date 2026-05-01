// app/(store)/account/orders/[orderId]/loading.tsx
// Skeleton loader for order details

import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderDetailLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" disabled className="w-fit -ml-2 rounded-xl">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
