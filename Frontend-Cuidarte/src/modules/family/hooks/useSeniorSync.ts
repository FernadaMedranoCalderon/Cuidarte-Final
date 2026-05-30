import { useMemo } from 'react';
import { isToday } from 'date-fns';
import { useAppStore } from '@/store/AppStore';

export function useSeniorSync() {
  const { activities, medications } = useAppStore();

  return useMemo(() => {
    const todayActivities = activities.filter(activity => isToday(activity.date));
    const completed = todayActivities.filter(activity => activity.completed).length;
    const completionRate = todayActivities.length ? Math.round((completed / todayActivities.length) * 100) : 0;
    return {
      activities,
      medications,
      todayActivities,
      pendingToday: todayActivities.filter(activity => !activity.completed),
      completedToday: completed,
      totalToday: todayActivities.length,
      completionRate,
    };
  }, [activities, medications]);
}
