// lib/bundles.ts
// Utility functions for calculating bundle deals and discounts

import { prisma } from "@/lib/prisma";

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

/**
 * Calculates the total savings from bundle deals in a cart.
 * A bundle is applied when all its products are present in the cart.
 * The discount is (Sum of individual prices) - (Bundle discountPrice).
 */
/**
 * Calculates the total savings from bundle deals in a cart.
 */
export async function calculateBundleSavings(items: CartItem[]) {
  if (items.length === 0) return 0;

  // Fetch all active bundles
  const bundles = await prisma.bundle.findMany({
    where: { isActive: true }
  });

  let totalSavings = 0;
  const cartProductMap = new Map(items.map(item => [item.productId, item]));

  for (const bundle of bundles) {
    // Check if all bundle products are in the cart
    const bundleProductsInCart = bundle.productIds
      .map(id => cartProductMap.get(id))
      .filter((item): item is CartItem => !!item);

    if (bundleProductsInCart.length === bundle.productIds.length) {
      // Find the minimum quantity among bundle products to see how many times the bundle applies
      const minQty = Math.min(...bundleProductsInCart.map(item => item.quantity));
      
      if (minQty >= bundle.buyQuantity) {
        if (bundle.type === "BUY_X_GET_Y_FREE" && bundle.getQuantity) {
          // For simplicity, we assume the cheapest item is free or just use the price of the first item
          // More advanced logic would find the cheapest item among the set
          const cheapestPrice = Math.min(...bundleProductsInCart.map(item => item.price));
          totalSavings += cheapestPrice * bundle.getQuantity * Math.floor(minQty / bundle.buyQuantity);
        } else if (bundle.type === "BUY_X_GET_PERCENT_OFF" && bundle.discountPercent) {
          const totalBundleValue = bundleProductsInCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          totalSavings += (totalBundleValue * bundle.discountPercent) / 100;
        }
      }
    }
  }

  return totalSavings;
}

/**
 * Finds bundles that include a specific product to show as suggestions.
 */
export async function getBundlesForProduct(productId: string) {
  const bundles = await prisma.bundle.findMany({
    where: {
      isActive: true,
      productIds: {
        has: productId
      }
    }
  });

  // Fetch product details for each bundle manually
  return await Promise.all(bundles.map(async (bundle) => {
    const products = await prisma.product.findMany({
      where: {
        id: { in: bundle.productIds }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: {
          take: 1,
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    return {
      ...bundle,
      products: products.map(p => ({
        ...p,
        price: Number(p.price)
      }))
    };
  }));
}
