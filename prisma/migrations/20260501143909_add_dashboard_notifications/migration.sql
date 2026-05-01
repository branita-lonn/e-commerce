-- CreateTable
CREATE TABLE "DashboardNotification" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DashboardNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DashboardNotification_isRead_idx" ON "DashboardNotification"("isRead");

-- CreateIndex
CREATE INDEX "DashboardNotification_createdAt_idx" ON "DashboardNotification"("createdAt");
