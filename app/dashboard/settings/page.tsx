// app/dashboard/settings/page.tsx
// Store settings and operations dashboard.

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { StoreProfileForm } from "@/components/dashboard/settings/store-profile-form";
import { BusinessHoursConfig } from "@/components/dashboard/settings/business-hours-config";
import { BrandingForm } from "@/components/dashboard/settings/branding-form";
import { ThemeConfig } from "@/components/dashboard/settings/theme-config";
import { ContentManager } from "@/components/dashboard/settings/content-manager";
import { PaymentSettings } from "@/components/dashboard/settings/payment-settings";
import { NotificationSettings } from "@/components/dashboard/settings/notification-settings";
import { SocialLinksForm } from "@/components/dashboard/settings/social-links-form";
import { NotificationCenter } from "@/components/dashboard/notifications/notification-center";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Clock, 
  Bell, 
  Share2, 
  Image as ImageIcon, 
  Palette, 
  Layout, 
  CreditCard,
  MessageSquare
} from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();

  if (!session || session.user?.role !== UserRole.STORE_OWNER) {
    redirect("/auth/login");
  }

  const settings = await prisma.storeSettings.findFirst();
  const serializedSettings = settings ? JSON.parse(JSON.stringify(settings)) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings & Operations</h1>
        <p className="text-muted-foreground">Manage your store identity, look & feel, and business rules.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="profile" className="w-full">
            <div className="overflow-x-auto pb-2">
              <TabsList className="bg-muted/50 rounded-2xl p-1 inline-flex w-auto">
                <TabsTrigger value="profile" className="rounded-xl px-6 py-2 gap-2">
                  <Settings className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="branding" className="rounded-xl px-6 py-2 gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Branding
                </TabsTrigger>
                <TabsTrigger value="theme" className="rounded-xl px-6 py-2 gap-2">
                  <Palette className="h-4 w-4" />
                  Theme
                </TabsTrigger>
                <TabsTrigger value="content" className="rounded-xl px-6 py-2 gap-2">
                  <Layout className="h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="payments" className="rounded-xl px-6 py-2 gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payments
                </TabsTrigger>
                <TabsTrigger value="notifications" className="rounded-xl px-6 py-2 gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="hours" className="rounded-xl px-6 py-2 gap-2">
                  <Clock className="h-4 w-4" />
                  Hours
                </TabsTrigger>
                <TabsTrigger value="social" className="rounded-xl px-6 py-2 gap-2">
                  <Share2 className="h-4 w-4" />
                  Social
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="profile" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <StoreProfileForm initialData={serializedSettings} />
            </TabsContent>

            <TabsContent value="branding" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <BrandingForm initialData={serializedSettings} />
            </TabsContent>

            <TabsContent value="theme" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ThemeConfig initialData={serializedSettings} />
            </TabsContent>

            <TabsContent value="content" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ContentManager initialData={serializedSettings} />
            </TabsContent>

            <TabsContent value="payments" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <PaymentSettings initialData={serializedSettings} />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <NotificationSettings initialData={serializedSettings} />
            </TabsContent>

            <TabsContent value="hours" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <BusinessHoursConfig initialData={serializedSettings} />
            </TabsContent>

            <TabsContent value="social" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <SocialLinksForm initialData={serializedSettings} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6 lg:col-span-1">
           <NotificationCenter />
        </div>
      </div>
    </div>
  );
}
