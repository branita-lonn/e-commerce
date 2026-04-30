// app/(store)/categories/loading.tsx
// Skeleton for the categories listing page

import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
  return (
    <div className="container mx-auto px-4 py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-60 rounded-xl" />
        <Skeleton className="h-4 w-32 rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3 p-5 rounded-4xl bg-card border border-border/40">
            <Skeleton className="w-20 h-20 rounded-3xl" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
