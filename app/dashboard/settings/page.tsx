// app/dashboard/settings/page.tsx
// Store settings and operations dashboard.

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { StoreProfileForm } from "@/components/dashboard/settings/store-profile-form";
import { BusinessHoursConfig } from "@/components/dashboard/settings/business-hours-config";
import { NotificationCenter } from "@/components/dashboard/notifications/notification-center";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Clock, Bell, Share2 } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();

  if (!session || session.user?.role !== UserRole.STORE_OWNER) {
    redirect("/auth/login");
  }

  const settings = await prisma.storeSettings.findFirst();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings & Operations</h1>
        <p className="text-muted-foreground">Manage your store identity, hours, and notifications.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-muted/50 rounded-2xl p-1 mb-6">
              <TabsTrigger value="profile" className="rounded-xl px-6 py-2 gap-2">
                <Settings className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="hours" className="rounded-xl px-6 py-2 gap-2">
                <Clock className="h-4 w-4" />
                Business Hours
              </TabsTrigger>
              <TabsTrigger value="social" className="rounded-xl px-6 py-2 gap-2" disabled>
                <Share2 className="h-4 w-4" />
                Social Links
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <StoreProfileForm initialData={JSON.parse(JSON.stringify(settings))} />
            </TabsContent>

            <TabsContent value="hours" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <BusinessHoursConfig initialData={JSON.parse(JSON.stringify(settings))} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
           <NotificationCenter />
        </div>
      </div>
    </div>
  );
}
