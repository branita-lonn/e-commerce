// app/dashboard/bundles/page.tsx
// Product Bundles dashboard page

import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BundlesClient } from "@/components/dashboard/bundles-client";

export const metadata: Metadata = {
  title: "Bundle Deals | MiDuka",
  description: "Create and manage product bundles",
};

export default async function BundlesPage() {
  const session = await auth();
  
  if (!session || session.user.role !== "STORE_OWNER") {
    redirect("/auth/login");
  }

  // Fetch all active products
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Fetch all bundles
  const bundles = await prisma.bundle.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize Decimals and map products
  const serializedBundles = bundles.map((b) => {
    const bundleProducts = products.filter(p => b.productIds.includes(p.id));
    return {
      ...b,
      products: bundleProducts.map((p) => ({
        ...p,
        price: Number(p.price),
      })),
    };
  });

  const serializedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BundlesClient 
        initialBundles={serializedBundles as any} 
        products={serializedProducts} 
      />
    </div>
  );
}
