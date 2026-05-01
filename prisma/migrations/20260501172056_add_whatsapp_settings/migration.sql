-- AlterTable
ALTER TABLE "StoreSettings" ADD COLUMN     "whatsappNotificationNumber" TEXT,
ADD COLUMN     "whatsappOrderNotifications" BOOLEAN NOT NULL DEFAULT false;
