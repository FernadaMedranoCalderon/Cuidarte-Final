/*
  Warnings:

  - The values [ACTIVITY_PENDING] on the enum `Notification_type` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `message` on table `NotificationTarget` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Notification` MODIFY `type` ENUM('ACTIVITY_REMINDER', 'ACTIVITY_COMPLETED', 'ACTIVITY_SKIPPED', 'LOCATION_SHARED') NOT NULL;

-- AlterTable
ALTER TABLE `NotificationTarget` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `message` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `DeviceToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastSeen` DATETIME(3) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `DeviceToken_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DeviceToken` ADD CONSTRAINT `DeviceToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
