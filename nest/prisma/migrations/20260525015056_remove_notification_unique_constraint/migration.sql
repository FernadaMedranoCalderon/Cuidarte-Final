-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_activityEventId_fkey`;

-- DropIndex
DROP INDEX `Notification_activityEventId_userId_key` ON `Notification`;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_activityEventId_fkey` FOREIGN KEY (`activityEventId`) REFERENCES `ActivityEvent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
