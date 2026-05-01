// app/dashboard/analytics/loading.tsx
// Skeleton loader for analytics dashboard.

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-80 rounded-2xl" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="rounded-3xl border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-8 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="rounded-3xl border-border/50 bg-card/50 h-[450px]">
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full rounded-2xl" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-[400px] w-full rounded-3xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>

      <Skeleton className="h-[300px] w-full rounded-3xl" />
    </div>
  );
}
