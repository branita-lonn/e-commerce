// app/api/dashboard/analytics/route.ts
// Analytics API — computes business metrics for the seller dashboard.
// STORE_OWNER only. Supports 7d, 30d, 90d, 12m periods.

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { getDashboardAnalytics, DashboardPeriod } from "@/lib/analytics";

export interface AnalyticsResponse {
  summary: {
    revenue: { current: number; previous: number; change: number };
    orders: { current: number; previous: number; change: number };
    aov: { current: number; previous: number; change: number };
    customers: { current: number; previous: number; change: number };
  };
  series: {
    revenue: { date: string; value: number }[];
    orders: { date: string; count: number }[];
  };
  orderStatusBreakdown: {
    placed: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  topProductsByRevenue: {
    productId: string;
    name: string;
    slug: string;
    revenue: number;
    unitsSold: number;
    image?: string;
  }[];
  topProductsByUnits: {
    productId: string;
    name: string;
    slug: string;
    unitsSold: number;
    image?: string;
  }[];
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    repeatPurchaseRate: number;
  };
  conversionFunnel: {
    views: number;
    addedToCart: number;
    checkoutStarted: number; // For now, we'll use orders count as proxy or if we have a CHECKOUT engagement type
    ordered: number;
  };
  trafficByProduct: {
    productId: string;
    name: string;
    views: number;
    cartAdds: number;
    purchases: number;
    conversionRate: number;
  }[];
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session || session.user?.role !== UserRole.STORE_OWNER) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = (searchParams.get("period") as DashboardPeriod) || "30d";

    const data = await getDashboardAnalytics(period);

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("[GET /api/dashboard/analytics]", error);
    return NextResponse.json({ error: "Failed to compute analytics" }, { status: 500 });
  }
}
