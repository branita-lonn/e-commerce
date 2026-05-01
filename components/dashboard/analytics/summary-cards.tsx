// components/dashboard/analytics/summary-cards.tsx
// Summary cards for analytics dashboard showing key KPIs and trend indicators.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, TrendingUp, ShoppingBag, Users, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  data: {
    revenue: { current: number; previous: number; change: number };
    orders: { current: number; previous: number; change: number };
    aov: { current: number; previous: number; change: number };
    customers: { current: number; previous: number; change: number };
  };
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(data.revenue.current),
      change: data.revenue.change,
      icon: DollarSign,
      description: "Paid orders in period"
    },
    {
      title: "Total Orders",
      value: data.orders.current.toLocaleString(),
      change: data.orders.change,
      icon: ShoppingBag,
      description: "Successful transactions"
    },
    {
      title: "Average Order Value",
      value: formatCurrency(data.aov.current),
      change: data.aov.change,
      icon: TrendingUp,
      description: "Revenue per order"
    },
    {
      title: "New Customers",
      value: data.customers.current.toLocaleString(),
      change: data.customers.change,
      icon: Users,
      description: "First-time buyers"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="rounded-3xl border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center pt-1 text-xs">
              <span className={cn(
                "flex items-center font-medium",
                card.change >= 0 ? "text-emerald-500" : "text-rose-500"
              )}>
                {card.change >= 0 ? (
                  <ArrowUpIcon className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-3 w-3" />
                )}
                {Math.abs(card.change).toFixed(1)}%
              </span>
              <span className="ml-2 text-muted-foreground">vs prev. period</span>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground opacity-60">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
