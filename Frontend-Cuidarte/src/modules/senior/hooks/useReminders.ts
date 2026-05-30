import { useState } from 'react';

export function useReminders() {
  const [activeReminderId, setActiveReminderId] = useState<string | null>(null);
  return {
    activeReminderId,
    showReminder: setActiveReminderId,
    dismissReminder: () => setActiveReminderId(null),
  };
}
