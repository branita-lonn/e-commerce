// app/page.tsx
// Public homepage placeholder

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function HomePage() {
  const storeSettings = await prisma.storeSettings.findFirst();
  const storeName = storeSettings?.storeName || "MiDuka";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            {storeName}
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Account
            </Link>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Coming Soon
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          Products launching shortly. We are working hard to bring you the best selection of items.
        </p>
        <Link href="/products" className={buttonVariants({ size: "lg" }) + " rounded-4xl px-8"}>Browse Catalogue</Link>
      </main>
    </div>
  );
}
