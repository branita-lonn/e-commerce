import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CheckCircle2, Gift, CreditCard, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn, formatCurrency } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { GiftCardPoller } from "@/components/store/gift-card-poller";

export default async function GiftCardSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const giftCard = await prisma.giftCard.findUnique({
    where: { id },
  });

  if (!giftCard) return notFound();

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <div className="flex flex-col items-center text-center gap-6 mb-12">
        <div className={`flex h-24 w-24 items-center justify-center rounded-full ${
          giftCard.isActive 
            ? "bg-emerald-100 dark:bg-emerald-900/30" 
            : "bg-amber-100 dark:bg-amber-900/30"
        }`}>
          {giftCard.isActive ? (
            <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Gift className="h-12 w-12 text-amber-600 dark:text-amber-400 animate-pulse" />
          )}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold">
            {giftCard.isActive ? "Gift Card Active!" : "Processing Payment..."}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {giftCard.isActive 
              ? `Your ${formatCurrency(Number(giftCard.initialValue))} gift card has been sent to ${giftCard.recipientEmail || 'your email'}.`
              : "We've sent a payment request to your phone. Please enter your M-Pesa PIN to complete the purchase."}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-8 space-y-6 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" /> Purchase Summary
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold">{formatCurrency(Number(giftCard.initialValue))}</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Payment Status</span>
              <span className={`font-medium px-3 py-1 rounded-full text-xs ${
                giftCard.paymentStatus === "PAID" 
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : giftCard.paymentStatus === "FAILED"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              }`}>
                {giftCard.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-muted-foreground">Recipient</span>
              <span className="font-medium">{giftCard.recipientName || "Self"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{giftCard.recipientEmail || "Sent to your account"}</span>
            </div>
          </div>
        </div>

        {!giftCard.isActive && giftCard.paymentStatus === "PENDING" && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900 text-sm text-amber-800 dark:text-amber-300">
            <p className="font-semibold mb-2 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Waiting for Confirmation
            </p>
            <p className="opacity-80">
              Once you enter your PIN, this page will automatically update and the gift card will be sent.
            </p>
          </div>
        )}

        <div className="pt-4 flex flex-col gap-3">
          <Link 
            href="/" 
            className={cn(buttonVariants({ variant: "outline" }), "rounded-full h-12")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Store
          </Link>
        </div>
      </div>

      <GiftCardPoller id={giftCard.id} initialStatus={giftCard.paymentStatus} />
    </div>
  );
}
