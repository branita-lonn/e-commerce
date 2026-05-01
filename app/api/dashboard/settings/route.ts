// app/api/dashboard/settings/route.ts
// API route to manage store-wide settings.
// STORE_OWNER only.

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session || session.user?.role !== UserRole.STORE_OWNER) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.storeSettings.findFirst();

    return NextResponse.json(settings || {});
  } catch (error: unknown) {
    console.error("[GET /api/dashboard/settings]", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session || session.user?.role !== UserRole.STORE_OWNER) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const settings = await prisma.storeSettings.findFirst();

    let updatedSettings;

    if (settings) {
      updatedSettings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data: body,
      });
    } else {
      updatedSettings = await prisma.storeSettings.create({
        data: body,
      });
    }

    return NextResponse.json(updatedSettings);
  } catch (error: unknown) {
    console.error("[PATCH /api/dashboard/settings]", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
