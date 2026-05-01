// components/dashboard/analytics/conversion-funnel.tsx
// Visual breakdown of the path from view to purchase.

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, ShoppingCart, CreditCard, CheckCircle, ArrowRight } from "lucide-react";

interface ConversionFunnelProps {
  data: {
    views: number;
    addedToCart: number;
    checkoutStarted: number;
    ordered: number;
  };
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  const steps = [
    { label: "Views", value: data.views, icon: Eye, color: "bg-blue-500/10 text-blue-500" },
    { label: "Added to Cart", value: data.addedToCart, icon: ShoppingCart, color: "bg-amber-500/10 text-amber-500" },
    { label: "Checkouts", value: data.checkoutStarted, icon: CreditCard, color: "bg-indigo-500/10 text-indigo-500" },
    { label: "Orders", value: data.ordered, icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-500" },
  ];

  return (
    <Card className="rounded-3xl border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Conversion Funnel</CardTitle>
        <CardDescription>Buyer journey from discovery to purchase</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {steps.map((step, index) => {
            const nextStep = steps[index + 1];
            const dropoff = nextStep ? (nextStep.value / (step.value || 1)) * 100 : 0;

            return (
              <div key={step.label} className="relative flex flex-col items-center p-4 rounded-3xl bg-muted/30 border border-border/50 group">
                <div className={`p-3 rounded-2xl mb-3 ${step.color}`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="text-xl font-bold">{step.value.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{step.label}</div>
                
                {nextStep && (
                  <div className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-background border border-border px-2 py-1 rounded-full text-[10px] font-bold shadow-sm">
                    {dropoff.toFixed(1)}%
                  </div>
                )}
                {nextStep && (
                  <div className="md:hidden flex items-center justify-center my-2 text-[10px] font-bold text-muted-foreground">
                    <ArrowRight className="h-3 w-3 rotate-90 mr-1" /> {dropoff.toFixed(1)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
          <p className="text-sm font-medium">
            Overall Conversion Rate: <span className="text-primary font-bold">{data.views > 0 ? ((data.ordered / data.views) * 100).toFixed(2) : 0}%</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
