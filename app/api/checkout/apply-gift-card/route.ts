// app/api/checkout/apply-gift-card/route.ts
// API route for validating and calculating gift card discount during checkout

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, total } = body;

    if (!code) {
      return NextResponse.json({ error: "Gift card code is required" }, { status: 400 });
    }

    const giftCard = await prisma.giftCard.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!giftCard || !giftCard.isActive) {
      return NextResponse.json({ error: "Invalid or inactive gift card" }, { status: 404 });
    }

    if (giftCard.expiresAt && new Date(giftCard.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Gift card has expired" }, { status: 400 });
    }

    if (Number(giftCard.remainingValue) <= 0) {
      return NextResponse.json({ error: "Gift card has no remaining balance" }, { status: 400 });
    }

    // The discount is the minimum of (remaining balance) and (current total)
    const discount = Math.min(Number(giftCard.remainingValue), Number(total));

    return NextResponse.json({
      code: giftCard.code,
      balance: Number(giftCard.remainingValue),
      discount: discount,
    });
  } catch (error) {
    console.error("[APPLY_GIFT_CARD]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
