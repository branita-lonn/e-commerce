// app/api/dashboard/flash-sales/[id]/route.ts
// API route for deleting (immediately expiring) a flash sale

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/dashboard/flash-sales/[id]
 * Deletes a flash sale record.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "STORE_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.flashSale.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`[FLASH_SALE_DELETE] ${error.message}`);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error(`[FLASH_SALE_DELETE] Unknown error`);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  }
}
