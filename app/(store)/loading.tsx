// app/(store)/loading.tsx
// Skeleton for the homepage while server data loads

import { Skeleton } from "@/components/ui/skeleton";

export default function StoreLoading() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero skeleton */}
      <Skeleton className="w-full h-[400px] md:h-[480px] rounded-none" />

      <div className="container mx-auto px-4 flex flex-col gap-12">
        {/* Product grid sections */}
        {[0, 1, 2].map((s) => (
          <section key={s} className="flex flex-col gap-4">
            <Skeleton className="h-8 w-48 rounded-xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="aspect-[4/3] rounded-3xl" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
