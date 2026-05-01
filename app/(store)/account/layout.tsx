// app/(store)/account/layout.tsx
// Account layout — session protection and shared navigation for customer dashboard

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AccountSidebar from "@/components/store/account-sidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?redirect=/account/orders");
  }

  const customer = {
    name: session.user.name || null,
    email: session.user.email || null,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar / Mobile Nav Header */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <AccountSidebar customer={customer} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm min-h-[500px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
