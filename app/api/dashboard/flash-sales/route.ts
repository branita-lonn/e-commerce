// app/api/dashboard/flash-sales/route.ts
// API route for managing flash sales (GET list, POST create)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/dashboard/flash-sales
 * Lists all flash sales (past and present) with product names joined.
 * Ordered by startTime descending.
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "STORE_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const flashSales = await prisma.flashSale.findMany({
      include: {
        product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });

    return NextResponse.json(flashSales);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`[FLASH_SALES_GET] ${error.message}`);
    } else {
      console.error(`[FLASH_SALES_GET] Unknown error`);
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * POST /api/dashboard/flash-sales
 * Creates a new flash sale with validation.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "STORE_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, salePrice, startTime, endTime } = body;

    // Basic validation
    if (!productId || !salePrice || !startTime || !endTime) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const parsedSalePrice = Number(salePrice);
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    // Fetch product to validate price
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Business logic validation
    if (parsedSalePrice <= 0) {
      return NextResponse.json({ error: "Sale price must be greater than 0" }, { status: 400 });
    }

    if (parsedSalePrice >= Number(product.price)) {
      return NextResponse.json({ error: "Sale price must be lower than original price" }, { status: 400 });
    }

    if (start >= end) {
      return NextResponse.json({ error: "Start time must be before end time" }, { status: 400 });
    }

    if (end <= now) {
      return NextResponse.json({ error: "End time must be in the future" }, { status: 400 });
    }

    // Check if a flash sale already exists for this product
    // (The schema has a unique constraint, but we want a nice error message)
    const existing = await prisma.flashSale.findUnique({
      where: { productId },
    });

    if (existing) {
      return NextResponse.json({ error: "A flash sale already exists for this product" }, { status: 400 });
    }

    const flashSale = await prisma.flashSale.create({
      data: {
        productId,
        salePrice: parsedSalePrice,
        startTime: start,
        endTime: end,
      },
    });

    return NextResponse.json(flashSale);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`[FLASH_SALES_POST] ${error.message}`);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error(`[FLASH_SALES_POST] Unknown error`);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  }
}
