import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    const giftCard = await prisma.giftCard.findUnique({
      where: { id },
      select: { paymentStatus: true, isActive: true },
    });

    if (!giftCard) {
      return NextResponse.json({ error: "Gift card not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      paymentStatus: giftCard.paymentStatus,
      isActive: giftCard.isActive 
    });
  } catch (error) {
    console.error("[GET /api/gift-cards/status]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
