// lib/cart-recovery.ts
// Logic for identifying and recovering abandoned carts

import { prisma } from "@/lib/prisma";
import { sendAbandonedCart } from "@/lib/mail";

/**
 * Finds carts that haven't been updated for 24 hours, belong to a customer,
 * and haven't had a recovery email sent yet.
 */
export async function sendRecoveryEmails() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  // 1. Find Carts with users that were last updated between 24 and 48 hours ago
  const abandonedCarts = await prisma.cart.findMany({
    where: {
      customerId: { not: null },
      updatedAt: {
        lte: twentyFourHoursAgo,
        gte: fortyEightHoursAgo,
      },
      items: { some: {} }, // Must have items
      abandonedCart: {
        is: null,
      }
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        }
      }
    }
  });

  // Also find carts that have a record but reminderSentAt is null
  const pendingRecords = await prisma.abandonedCartRecord.findMany({
    where: {
      reminderSentAt: null,
      createdAt: {
        lte: twentyFourHoursAgo,
      }
    },
    include: {
      cart: {
        include: {
          customer: true,
          items: {
            include: {
              product: true,
            }
          }
        }
      }
    }
  });

  const results = {
    processed: 0,
    sent: 0,
    errors: 0,
  };

  const processCart = async (cart: any, recordId?: string) => {
    if (!cart.customer?.email) return;

    try {
      results.processed++;
      
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://miduka.com";
      const recoveryUrl = `${baseUrl}/cart?recovered=${cart.id}`;
      
      const items = cart.items.map((item: any) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: Number(item.product.price),
      }));

      await sendAbandonedCart({
        email: cart.customer.email,
        customerName: cart.customer.name || "Customer",
        recoveryUrl,
        items,
      });

      if (recordId) {
        await prisma.abandonedCartRecord.update({
          where: { id: recordId },
          data: { reminderSentAt: new Date() }
        });
      } else {
        await prisma.abandonedCartRecord.create({
          data: {
            cartId: cart.id,
            customerId: cart.customerId!,
            reminderSentAt: new Date(),
          }
        });
      }

      results.sent++;
    } catch (error) {
      console.error(`[CART_RECOVERY_ERROR] Cart ${cart.id}:`, error);
      results.errors++;
    }
  };

  // Process fresh abandoned carts
  for (const cart of abandonedCarts) {
    await processCart(cart);
  }

  // Process pending records
  for (const record of pendingRecords) {
    await processCart(record.cart, record.id);
  }

  return results;
}
