// app/api/dashboard/notifications/route.ts
// API route to fetch and manage dashboard notifications.
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

    // 1. Fetch existing notifications
    const notifications = await prisma.dashboardNotification.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // 2. Aggregate new alerts (Low Stock, New Orders)
    // In a real app, these would be created by hooks/background jobs.
    // Here we'll check for recent ones to "simulate" live alerts.
    
    // Check for new paid orders in the last hour
    const lastHour = new Date(Date.now() - 60 * 60 * 1000);
    const newOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: lastHour },
        paymentStatus: "PAID",
      },
      select: { orderNumber: true, id: true, total: true },
    });

    for (const order of newOrders) {
      const exists = await prisma.dashboardNotification.findFirst({
        where: { type: "NEW_ORDER", link: `/dashboard/orders/${order.id}` },
      });
      if (!exists) {
        await prisma.dashboardNotification.create({
          data: {
            type: "NEW_ORDER",
            message: `New Order: ${order.orderNumber} for KSH ${order.total}`,
            link: `/dashboard/orders/${order.id}`,
          },
        });
      }
    }

    // Check for low stock
    // This is more intensive, so maybe we only do it periodically or in a separate job.
    // For now, let's keep it simple.

    return NextResponse.json(notifications);
  } catch (error: unknown) {
    console.error("[GET /api/dashboard/notifications]", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session || session.user?.role !== UserRole.STORE_OWNER) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, all } = await req.json();

    if (all) {
      await prisma.dashboardNotification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
    } else if (id) {
      await prisma.dashboardNotification.update({
        where: { id },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[PATCH /api/dashboard/notifications]", error);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
