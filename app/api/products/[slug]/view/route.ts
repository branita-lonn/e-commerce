// app/api/products/[slug]/view/route.ts
// API route to record product view engagement for analytics.
// Fire-and-forget endpoint called from product detail pages.

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { EngagementType } from "@prisma/client";

const SESSION_COOKIE = "miduka_session_id";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  try {
    const { slug } = await params;
    const session = await auth();
    const cookieStore = await cookies();

    const customerId = session?.user?.id;
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

    // Find the product by slug to get the ID
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Record the view engagement
    await prisma.engagement.create({
      data: {
        type: EngagementType.VIEW,
        productId: product.id,
        customerId: customerId,
        sessionId: sessionId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    // We log but don't want to break the user experience for analytics failures
    console.error(`[POST /api/products/view] Error tracking view:`, error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
