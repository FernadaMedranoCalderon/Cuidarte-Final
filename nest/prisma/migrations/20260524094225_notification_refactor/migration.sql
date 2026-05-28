/*
  Warnings:

  - You are about to drop the column `activityId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(7))`.
  - You are about to drop the `NotificationTarget` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[activityEventId,userId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `activityEventId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_activityId_fkey`;

-- DropForeignKey
ALTER TABLE `NotificationTarget` DROP FOREIGN KEY `NotificationTarget_notificationId_fkey`;

-- DropForeignKey
ALTER TABLE `NotificationTarget` DROP FOREIGN KEY `NotificationTarget_userId_fkey`;

-- DropIndex
DROP INDEX `Notification_activityId_fkey` ON `Notification`;

-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `activityId`,
    DROP COLUMN `type`,
    ADD COLUMN `activityEventId` INTEGER NOT NULL,
    ADD COLUMN `deliveredAt` DATETIME(3) NULL,
    ADD COLUMN `isRead` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `message` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `status` ENUM('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE `NotificationTarget`;

-- CreateTable
CREATE TABLE `ActivityEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('ACTIVITY_REMINDER', 'ACTIVITY_COMPLETED', 'ACTIVITY_SKIPPED', 'LOCATION_SHARED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `activityId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Notification_activityEventId_userId_key` ON `Notification`(`activityEventId`, `userId`);

-- AddForeignKey
ALTER TABLE `ActivityEvent` ADD CONSTRAINT `ActivityEvent_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_activityEventId_fkey` FOREIGN KEY (`activityEventId`) REFERENCES `ActivityEvent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
