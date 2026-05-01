// app/dashboard/settings/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded-lg" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-12 w-[300px] rounded-2xl" />
          <Card className="rounded-3xl border-border/50 bg-card/50 shadow-sm">
            <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <Skeleton className="h-11 rounded-2xl" />
                    <Skeleton className="h-11 rounded-2xl" />
                    <Skeleton className="h-11 rounded-2xl" />
                    <Skeleton className="h-11 rounded-2xl" />
                </div>
                <Skeleton className="h-32 rounded-2xl" />
                <div className="flex justify-end">
                    <Skeleton className="h-11 w-32 rounded-full" />
                </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
           <Card className="rounded-3xl border-border/50 bg-card/50 shadow-sm h-[400px]">
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-1 flex-1">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-2/3" />
                            </div>
                        </div>
                    ))}
                </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
