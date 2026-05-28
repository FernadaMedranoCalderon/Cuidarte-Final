/*
  Warnings:

  - You are about to drop the column `message` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `message`;

-- AlterTable
ALTER TABLE `NotificationTarget` ADD COLUMN `message` VARCHAR(191) NULL;
