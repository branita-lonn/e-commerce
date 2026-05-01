// app/api/checkout/apply-coupon/route.ts
// Validates a coupon code and returns the discount amount

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().min(0),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { code, subtotal } = parsed.data;

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    if (coupon.minimumOrderAmount && subtotal < Number(coupon.minimumOrderAmount)) {
      return NextResponse.json(
        { error: `Minimum order amount for this coupon is ${Number(coupon.minimumOrderAmount)}` },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    const value = Number(coupon.value);

    if (coupon.type === "PERCENTAGE") {
      discount = (subtotal * value) / 100;
    } else if (coupon.type === "FIXED_AMOUNT") {
      discount = value;
    } else if (coupon.type === "FREE_SHIPPING") {
      // Handled at the checkout total stage (returns 0 discount for subtotal, but flag for free shipping)
      discount = 0; 
      return NextResponse.json({ 
        discount: 0, 
        message: "Free shipping applied",
        freeShipping: true 
      });
    }

    // Never discount more than the subtotal
    discount = Math.min(discount, subtotal);

    return NextResponse.json({ 
      discount, 
      message: "Coupon applied successfully" 
    });
  } catch (error: unknown) {
    console.error("[POST /api/checkout/apply-coupon]", error);
    return NextResponse.json(
      { error: "Failed to apply coupon" },
      { status: 500 }
    );
  }
}
