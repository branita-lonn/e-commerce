// app/dashboard/analytics/page.tsx
// Analytics dashboard page.

import { Suspense } from "react";
import { getDashboardAnalytics, DashboardPeriod } from "@/lib/analytics";
import { SummaryCards } from "@/components/dashboard/analytics/summary-cards";
import { RevenueChart } from "@/components/dashboard/analytics/revenue-chart";
import { OrdersChart } from "@/components/dashboard/analytics/orders-chart";
import { TopProducts } from "@/components/dashboard/analytics/top-products";
import { ConversionFunnel } from "@/components/dashboard/analytics/conversion-funnel";
import { ProductPerformanceTable } from "@/components/dashboard/analytics/product-performance";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

interface AnalyticsPageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function AnalyticsPage({ searchParams }: AnalyticsPageProps) {
  const { period: periodRaw } = await searchParams;
  const period = (periodRaw as DashboardPeriod) || "30d";
  
  const data = await getDashboardAnalytics(period);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Monitor your store's performance and buyer behavior.</p>
        </div>

        <Tabs defaultValue={period} className="w-fit">
          <TabsList className="rounded-2xl bg-muted/50 p-1">
            <Link href="?period=7d" passHref>
              <TabsTrigger value="7d" className="rounded-xl">7 Days</TabsTrigger>
            </Link>
            <Link href="?period=30d" passHref>
              <TabsTrigger value="30d" className="rounded-xl">30 Days</TabsTrigger>
            </Link>
            <Link href="?period=90d" passHref>
              <TabsTrigger value="90d" className="rounded-xl">90 Days</TabsTrigger>
            </Link>
            <Link href="?period=12m" passHref>
              <TabsTrigger value="12m" className="rounded-xl">12 Months</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>

      <SummaryCards data={data.summary} />

      <div className="grid gap-8 md:grid-cols-2">
        <RevenueChart data={data.series.revenue} />
        <OrdersChart data={data.series.orders} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ConversionFunnel data={data.conversionFunnel} />
        </div>
        <div>
          <TopProducts 
            byRevenue={data.topProductsByRevenue} 
            byUnits={data.topProductsByUnits} 
          />
        </div>
      </div>

      <ProductPerformanceTable data={data.trafficByProduct} />
    </div>
  );
}
