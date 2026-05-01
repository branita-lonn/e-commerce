-- CreateEnum
CREATE TYPE "EngagementType" AS ENUM ('VIEW', 'ADD_TO_CART', 'PURCHASE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "lowStockThreshold" INTEGER NOT NULL DEFAULT 5;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "lowStockThreshold" INTEGER NOT NULL DEFAULT 5;

-- CreateTable
CREATE TABLE "Engagement" (
    "id" TEXT NOT NULL,
    "type" "EngagementType" NOT NULL,
    "productId" TEXT NOT NULL,
    "sessionId" TEXT,
    "customerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Engagement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Engagement_productId_type_idx" ON "Engagement"("productId", "type");

-- CreateIndex
CREATE INDEX "Engagement_createdAt_idx" ON "Engagement"("createdAt");

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
