import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { OrderNotificationListener } from "@/components/dashboard/order-notification-listener";
import { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export const metadata: Metadata = {
  title: {
    template: "%s | Dashboard",
    default: "Seller Dashboard",
  },
  robots: {
    index: false,
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user.role !== "STORE_OWNER") {
    redirect("/auth/login");
  }

  const storeSettings = await prisma.storeSettings.findFirst();
  const storeName = storeSettings?.storeName || "MiDuka";
  const userName = session.user.name || session.user.email || "Admin";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <OrderNotificationListener />
      
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden w-64 border-r border-border bg-card md:flex flex-col shrink-0 h-full z-20">
        <DashboardSidebar storeName={storeName} />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Unified Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-8 z-10">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger className="md:hidden flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted hover:text-foreground transition-colors">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Dashboard Navigation</SheetDescription>
                <DashboardSidebar storeName={storeName} />
              </SheetContent>
            </Sheet>
            <span className="text-xl font-bold text-primary md:hidden">{storeName}</span>
          </div>

          <div className="ml-auto flex items-center">
            <DashboardHeader userName={userName} />
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
