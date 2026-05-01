// app/api/cron/abandoned-cart/route.ts
// Cron job to trigger abandoned cart recovery emails

import { NextRequest, NextResponse } from "next/server";
import { sendRecoveryEmails } from "@/lib/cart-recovery";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  
  // Protect with a secret token (usually set in Vercel/Cron provider)
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const results = await sendRecoveryEmails();
    
    return NextResponse.json({
      success: true,
      message: `Processed ${results.processed} carts, sent ${results.sent} emails.`,
      errors: results.errors,
    });
  } catch (error: unknown) {
    console.error("[CRON_ABANDONED_CART_ERROR]", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
