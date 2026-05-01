// app/api/checkout/shipping-cost/route.ts
// Calculates shipping cost based on the buyer's county

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  county: z.string().min(1),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "County is required" }, { status: 400 });
    }

    const { county } = parsed.data;

    // First try exact match
    const zones = await prisma.deliveryZone.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    let matchedZone = zones.find((z) =>
      z.counties.map((c) => c.toLowerCase()).includes(county.toLowerCase())
    );

    // If no exact match, try to find a catch-all "Rest of Kenya" zone
    if (!matchedZone) {
      matchedZone = zones.find((z) => z.name === "Rest of Kenya");
    }

    const shippingCost = matchedZone ? Number(matchedZone.shippingCost) : 500; // default fallback

    return NextResponse.json({ shippingCost });
  } catch (error: unknown) {
    console.error("[POST /api/checkout/shipping-cost]", error);
    return NextResponse.json(
      { error: "Failed to calculate shipping cost" },
      { status: 500 }
    );
  }
}
