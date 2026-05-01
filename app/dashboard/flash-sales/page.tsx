// app/dashboard/flash-sales/page.tsx
// Flash Sales dashboard page

import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FlashSalesClient } from "@/components/dashboard/flash-sales-client";

export const metadata: Metadata = {
  title: "Flash Sales | MiDuka",
  description: "Manage limited-time product discounts",
};

export default async function FlashSalesPage() {
  const session = await auth();
  
  if (!session || session.user.role !== "STORE_OWNER") {
    redirect("/auth/login");
  }

  // Fetch all flash sales
  const flashSales = await prisma.flashSale.findMany({
    include: {
      product: {
        select: {
          name: true,
          price: true,
        },
      },
    },
    orderBy: {
      startTime: "desc",
    },
  });

  // Fetch all active products for the selector
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

  // Serialize Decimal to Number for the client
  const serializedFlashSales = flashSales.map((fs) => ({
    ...fs,
    salePrice: Number(fs.salePrice),
    product: {
      ...fs.product,
      price: Number(fs.product.price),
    },
  }));

  const serializedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <FlashSalesClient 
        initialFlashSales={serializedFlashSales} 
        products={serializedProducts} 
      />
    </div>
  );
}
