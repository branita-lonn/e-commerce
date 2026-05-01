// app/api/dashboard/gift-cards/route.ts
// API route for managing gift cards in the dashboard

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { crypto } from "crypto";

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "STORE_OWNER") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const giftCards = await prisma.giftCard.findMany({
      orderBy: {
        createdAt: "desc",
      }
    });

    return NextResponse.json(giftCards);
  } catch (error) {
    console.error("[GIFT_CARDS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "STORE_OWNER") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { initialValue, code, expiresAt } = body;

    if (!initialValue) {
      return new NextResponse("Initial value is required", { status: 400 });
    }

    // Generate a code if not provided
    const finalCode = code || generateGiftCardCode();

    const giftCard = await prisma.giftCard.create({
      data: {
        code: finalCode.toUpperCase(),
        initialValue: initialValue,
        remainingValue: initialValue,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });

    return NextResponse.json(giftCard);
  } catch (error) {
    console.error("[GIFT_CARDS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function generateGiftCardCode() {
  // Format: XXXX-XXXX-XXXX
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const pick = () => chars.charAt(Math.floor(Math.random() * chars.length));
  const part = () => Array.from({ length: 4 }, pick).join("");
  return `${part()}-${part()}-${part()}`;
}
