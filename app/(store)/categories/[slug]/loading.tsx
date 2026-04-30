// app/(store)/categories/[slug]/loading.tsx
// Skeleton for the category detail page

import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-10 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-40 rounded" />
        <Skeleton className="h-9 w-64 rounded-xl" />
        <Skeleton className="h-4 w-32 rounded" />
      </div>
      <div className="flex gap-8">
        <Skeleton className="hidden md:block w-56 h-96 rounded-3xl" />
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-end">
            <Skeleton className="h-9 w-44 rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-[4/3] rounded-3xl" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
