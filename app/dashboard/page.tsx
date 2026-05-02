// app/dashboard/page.tsx
// Seller dashboard home page

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, PackageOpen } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || "Store Owner";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [revenueResult, ordersToday, activeProducts, totalCustomers] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["CONFIRMED", "SHIPPED", "DELIVERED"] } }
    }),
    prisma.order.count({
      where: { createdAt: { gte: today } }
    }),
    prisma.product.count({
      where: { isActive: true }
    }),
    prisma.user.count({
      where: { role: "CUSTOMER" }
    })
  ]);

  const totalRevenue = Number(revenueResult._sum.total || 0);

  const statCards = [
    { title: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign },
    { title: "Orders Today", value: ordersToday.toString(), icon: ShoppingBag },
    { title: "Active Products", value: activeProducts.toString(), icon: PackageOpen },
    { title: "Total Customers", value: totalCustomers.toString(), icon: Users },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {userName}. Here is an overview of your store.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="rounded-3xl shadow-sm border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
