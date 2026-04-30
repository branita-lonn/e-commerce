// app/(store)/layout.tsx
// Public store layout — wraps all buyer-facing pages with header, footer, and mobile nav

import StoreHeader from "@/components/store/store-header";
import StoreFooter from "@/components/store/store-footer";
import MobileBottomNav from "@/components/store/mobile-bottom-nav";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StoreHeader />
      {/* pb-16 on mobile reserves space for the fixed bottom nav */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <StoreFooter />
      <MobileBottomNav />
    </div>
  );
}
