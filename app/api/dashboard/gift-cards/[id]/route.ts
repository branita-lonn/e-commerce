// app/api/dashboard/gift-cards/[id]/route.ts
// API route for managing specific gift cards

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "STORE_OWNER") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { isActive } = body;

    const giftCard = await prisma.giftCard.update({
      where: { id },
      data: { isActive }
    });

    return NextResponse.json(giftCard);
  } catch (error) {
    console.error("[GIFT_CARD_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "STORE_OWNER") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    await prisma.giftCard.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[GIFT_CARD_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
