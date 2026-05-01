// components/dashboard/settings/payment-settings.tsx
// Payment gateway settings: Enable Stripe and M-Pesa

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Save, CreditCard, PhoneCall } from "lucide-react";
import Image from "next/image";

const paymentSchema = z.object({
  enableStripe: z.boolean(),
  enableMpesa: z.boolean(),
});

type PaymentValues = z.infer<typeof paymentSchema>;

interface PaymentSettingsProps {
  initialData: any;
}

export function PaymentSettings({ initialData }: PaymentSettingsProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      enableStripe: initialData?.enableStripe ?? true,
      enableMpesa: initialData?.enableMpesa ?? true,
    },
  });

  const onSubmit = async (data: PaymentValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update settings");

      toast.success("Payment settings updated successfully.");
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stripe */}
            <Card className="rounded-3xl border-border/50 bg-card/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Stripe Payments
                </CardTitle>
                <CardDescription>Accept credit cards via Stripe.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="enableStripe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-2xl border p-4 bg-background/50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-bold">Enable Stripe</FormLabel>
                        <FormDescription>Allow customers to pay with card.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* M-Pesa */}
            <Card className="rounded-3xl border-border/50 bg-card/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PhoneCall className="h-4 w-4" />
                  M-Pesa (STK Push)
                </CardTitle>
                <CardDescription>Accept mobile money via M-Pesa.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="enableMpesa"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-2xl border p-4 bg-background/50">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-bold">Enable M-Pesa</FormLabel>
                        <FormDescription>Allow customers to pay via phone.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="rounded-full px-8 h-11 gap-2 shadow-lg shadow-primary/20">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Payment Settings
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
