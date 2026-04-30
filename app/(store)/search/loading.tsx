// app/(store)/search/loading.tsx
// Skeleton for the search results page

import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="container mx-auto px-4 py-10 flex flex-col gap-8">
      <Skeleton className="h-9 w-72 rounded-xl" />
      <div className="flex justify-end">
        <Skeleton className="h-9 w-44 rounded-2xl" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-[4/3] rounded-3xl" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
