export type NotificationKind = 'success' | 'alert' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationKind;
  message: string;
  time: string;
  read: boolean;
}
