// lib/analytics.ts
// Shared logic for computing dashboard analytics.

import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus, EngagementType } from "@prisma/client";
import { startOfDay, subDays, subMonths, format, eachDayOfInterval, isSameDay } from "date-fns";

export type DashboardPeriod = "7d" | "30d" | "90d" | "12m";

export async function getDashboardAnalytics(period: DashboardPeriod = "30d") {
  const now = new Date();
  let startDate: Date;
  let prevStartDate: Date;

  switch (period) {
    case "7d":
      startDate = subDays(startOfDay(now), 7);
      prevStartDate = subDays(startDate, 7);
      break;
    case "90d":
      startDate = subDays(startOfDay(now), 90);
      prevStartDate = subDays(startDate, 90);
      break;
    case "12m":
      startDate = subMonths(startOfDay(now), 12);
      prevStartDate = subMonths(startDate, 12);
      break;
    case "30d":
    default:
      startDate = subDays(startOfDay(now), 30);
      prevStartDate = subDays(startDate, 30);
      break;
  }

  // 1. Fetch data in parallel
  const [
    currentOrders,
    prevOrders,
    currentEngagements,
    prevEngagements,
    currentCustomersCount,
    prevCustomersCount,
    orderItems,
    allProducts
  ] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: startDate }, paymentStatus: PaymentStatus.PAID },
      select: { total: true, createdAt: true, customerId: true }
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: prevStartDate, lt: startDate }, paymentStatus: PaymentStatus.PAID },
      select: { total: true }
    }),
    prisma.engagement.findMany({
      where: { createdAt: { gte: startDate } },
      select: { type: true, productId: true, createdAt: true }
    }),
    prisma.engagement.findMany({
      where: { createdAt: { gte: prevStartDate, lt: startDate } },
      select: { type: true }
    }),
    prisma.user.count({ where: { createdAt: { gte: startDate }, role: "CUSTOMER" } }),
    prisma.user.count({ where: { createdAt: { gte: prevStartDate, lt: startDate }, role: "CUSTOMER" } }),
    prisma.orderItem.findMany({
      where: { order: { createdAt: { gte: startDate }, paymentStatus: PaymentStatus.PAID } },
      include: { product: { select: { slug: true, images: { take: 1, orderBy: { sortOrder: 'asc' } } } } }
    }),
    prisma.product.findMany({ select: { id: true, name: true } })
  ]);

  // 2. Summary Calculations
  const currentRevenue = currentOrders.reduce((acc, o) => acc + Number(o.total), 0);
  const prevRevenue = prevOrders.reduce((acc, o) => acc + Number(o.total), 0);
  
  const currentOrderCount = currentOrders.length;
  const prevOrderCount = prevOrders.length;

  const currentAov = currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0;
  const prevAov = prevOrderCount > 0 ? prevRevenue / prevOrderCount : 0;

  const calcChange = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  // 3. Series Generation
  const days = eachDayOfInterval({ start: startDate, end: now });
  const revenueSeries = days.map(day => ({
    date: format(day, "MMM dd"),
    value: currentOrders.filter(o => isSameDay(o.createdAt, day)).reduce((acc, o) => acc + Number(o.total), 0)
  }));

  const ordersSeries = days.map(day => ({
    date: format(day, "MMM dd"),
    count: currentOrders.filter(o => isSameDay(o.createdAt, day)).length
  }));

  // 4. Order Status Breakdown
  const statusCounts = await prisma.order.groupBy({
    by: ['status'],
    where: { createdAt: { gte: startDate } },
    _count: { id: true }
  });

  const breakdown = {
    placed: statusCounts.find(s => s.status === OrderStatus.PLACED)?._count.id || 0,
    confirmed: statusCounts.find(s => s.status === OrderStatus.CONFIRMED)?._count.id || 0,
    shipped: statusCounts.find(s => s.status === OrderStatus.SHIPPED)?._count.id || 0,
    delivered: statusCounts.find(s => s.status === OrderStatus.DELIVERED)?._count.id || 0,
    cancelled: statusCounts.find(s => s.status === OrderStatus.CANCELLED)?._count.id || 0,
  };

  // 5. Top Products
  const productStats: Record<string, { name: string; slug: string; revenue: number; units: number; image?: string }> = {};
  orderItems.forEach(item => {
    if (!productStats[item.productId]) {
      productStats[item.productId] = {
        name: item.productName,
        slug: item.product?.slug || "",
        revenue: 0,
        units: 0,
        image: item.product?.images[0]?.url
      };
    }
    productStats[item.productId].revenue += Number(item.total);
    productStats[item.productId].units += item.quantity;
  });

  const topProductsByRevenue = Object.entries(productStats)
    .map(([id, stats]) => ({ productId: id, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const topProductsByUnits = Object.entries(productStats)
    .map(([id, stats]) => ({ productId: id, ...stats }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  // 6. Conversion Funnel
  const views = currentEngagements.filter(e => e.type === EngagementType.VIEW).length;
  const addedToCart = currentEngagements.filter(e => e.type === EngagementType.ADD_TO_CART).length;
  const ordered = currentOrders.length;

  // 7. Traffic by Product
  const trafficStats: Record<string, { name: string; views: number; cartAdds: number; purchases: number }> = {};
  currentEngagements.forEach(e => {
    if (!trafficStats[e.productId]) {
      const p = allProducts.find(prod => prod.id === e.productId);
      trafficStats[e.productId] = { name: p?.name || "Unknown", views: 0, cartAdds: 0, purchases: 0 };
    }
    if (e.type === EngagementType.VIEW) trafficStats[e.productId].views++;
    if (e.type === EngagementType.ADD_TO_CART) trafficStats[e.productId].cartAdds++;
  });
  
  orderItems.forEach(item => {
    if (trafficStats[item.productId]) trafficStats[item.productId].purchases += item.quantity;
  });

  const trafficByProduct = Object.entries(trafficStats)
    .map(([id, stats]) => ({
      productId: id,
      ...stats,
      conversionRate: stats.views > 0 ? (stats.purchases / stats.views) * 100 : 0
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // 8. Customer Metrics
  const totalCustomersWithOrders = new Set(currentOrders.filter(o => o.customerId).map(o => o.customerId)).size;

  return {
    summary: {
      revenue: { current: currentRevenue, previous: prevRevenue, change: calcChange(currentRevenue, prevRevenue) },
      orders: { current: currentOrderCount, previous: prevOrderCount, change: calcChange(currentOrderCount, prevOrderCount) },
      aov: { current: currentAov, previous: prevAov, change: calcChange(currentAov, prevAov) },
      customers: { current: currentCustomersCount, previous: prevCustomersCount, change: calcChange(currentCustomersCount, prevCustomersCount) },
    },
    series: {
      revenue: revenueSeries,
      orders: ordersSeries,
    },
    orderStatusBreakdown: breakdown,
    topProductsByRevenue,
    topProductsByUnits,
    customerMetrics: {
      newCustomers: currentCustomersCount,
      returningCustomers: Math.max(0, totalCustomersWithOrders - currentCustomersCount),
      repeatPurchaseRate: totalCustomersWithOrders > 0 ? (Math.max(0, totalCustomersWithOrders - currentCustomersCount) / totalCustomersWithOrders) * 100 : 0, // Simplified repeat rate
    },
    conversionFunnel: {
      views,
      addedToCart,
      checkoutStarted: addedToCart,
      ordered,
    },
    trafficByProduct,
  };
}
