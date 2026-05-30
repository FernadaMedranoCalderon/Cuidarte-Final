import { useAppStore } from '@/store/AppStore';

export function useFamilyNotifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useAppStore();
  return {
    notifications,
    unreadCount: notifications.filter(item => !item.read).length,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  };
}
