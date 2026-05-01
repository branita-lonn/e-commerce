// app/dashboard/gift-cards/page.tsx
// Gift Cards dashboard page

import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GiftCardsClient } from "@/components/dashboard/gift-cards-client";

export const metadata: Metadata = {
  title: "Gift Cards | MiDuka",
  description: "Create and manage store gift cards",
};

export default async function GiftCardsPage() {
  const session = await auth();
  
  if (!session || session.user.role !== "STORE_OWNER") {
    redirect("/auth/login");
  }

  const giftCards = await prisma.giftCard.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize Decimals
  const serializedGiftCards = giftCards.map((gc) => ({
    ...gc,
    initialValue: Number(gc.initialValue),
    remainingValue: Number(gc.remainingValue),
    createdAt: gc.createdAt.toISOString(),
    updatedAt: gc.updatedAt.toISOString(),
    expiresAt: gc.expiresAt?.toISOString() || null,
  }));

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <GiftCardsClient initialGiftCards={serializedGiftCards} />
    </div>
  );
}
