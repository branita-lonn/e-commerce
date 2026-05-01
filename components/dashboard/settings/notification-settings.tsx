// components/dashboard/settings/notification-settings.tsx
// Communication settings: WhatsApp notifications

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
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Save, MessageSquare } from "lucide-react";

const notificationSchema = z.object({
  whatsappOrderNotifications: z.boolean(),
  whatsappNotificationNumber: z.string().optional(),
});

type NotificationValues = z.infer<typeof notificationSchema>;

interface NotificationSettingsProps {
  initialData: any;
}

export function NotificationSettings({ initialData }: NotificationSettingsProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<NotificationValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      whatsappOrderNotifications: initialData?.whatsappOrderNotifications ?? false,
      whatsappNotificationNumber: initialData?.whatsappNotificationNumber || "",
    },
  });

  const onSubmit = async (data: NotificationValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update settings");

      toast.success("Notification settings updated.");
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
          <Card className="rounded-3xl border-border/50 bg-card/50 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                WhatsApp Notifications
              </CardTitle>
              <CardDescription>Automate customer updates via WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="whatsappOrderNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-2xl border p-4 bg-background/50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-bold">Order Confirmations</FormLabel>
                      <FormDescription>Send automated WhatsApp message on new orders.</FormDescription>
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

              <FormField
                control={form.control}
                name="whatsappNotificationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Sending Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+254..." className="rounded-2xl border-border/50 bg-background/50 h-11" />
                    </FormControl>
                    <FormDescription>The number used to send notifications (if different from contact number).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="rounded-full px-8 h-11 gap-2 shadow-lg shadow-primary/20">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Notifications
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
