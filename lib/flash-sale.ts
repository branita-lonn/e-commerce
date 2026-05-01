// lib/flash-sale.ts
// Utility functions for checking and retrieving active flash sales

import { prisma } from "@/lib/prisma";
import { FlashSale } from "@prisma/client";

/**
 * Retrieves the currently active flash sale for a specific product.
 * A flash sale is active if the current time is between its start and end times.
 */
export async function getActiveFlashSale(productId: string): Promise<FlashSale | null> {
  const now = new Date();
  
  const flashSale = await prisma.flashSale.findUnique({
    where: {
      productId,
    },
  });

  if (!flashSale) return null;

  if (flashSale.startTime <= now && flashSale.endTime >= now) {
    return flashSale;
  }

  return null;
}

/**
 * Checks if a given flash sale record is currently active based on the system time.
 */
export function isFlashSaleActive(flashSale: FlashSale): boolean {
  const now = new Date();
  return flashSale.startTime <= now && flashSale.endTime >= now;
}
