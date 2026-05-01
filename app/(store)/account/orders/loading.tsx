// app/(store)/account/orders/loading.tsx
// Skeleton loader for order list

import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-40 rounded-lg" />
        <Skeleton className="h-4 w-64 rounded-lg" />
      </div>

      <div className="grid gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
