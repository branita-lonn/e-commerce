// file: app/(store)/account/layout.tsx
// purpose: Provide SEO metadata for the account route to prevent indexing

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | MiDuka",
  robots: {
    index: false,
    follow: false,
  },
};

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AccountSidebar from "@/components/store/account-sidebar";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/account");
  }

  const customer = {
    name: session.user.name ?? null,
    email: session.user.email ?? null,
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <AccountSidebar customer={customer} />
        </aside>
        <main className="lg:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}
