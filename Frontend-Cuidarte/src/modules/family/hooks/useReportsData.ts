import { useMemo } from 'react';
import { endOfMonth, endOfWeek, format, isSameDay, startOfDay, startOfMonth, startOfWeek, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ActivityType } from '@/types';
import { useAppStore } from '@/store/AppStore';

function lastNDays(n: number) {
  const days = [] as Date[];
  for (let i = n - 1; i >= 0; i--) days.push(subDays(new Date(), i));
  return days;
}

export function useReportsData() {
  const { activities } = useAppStore();

  return useMemo(() => {
    // Weekly counts (last 7 days) of completed activities
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    const days = [] as Date[];
    for (let current = weekStart; current <= weekEnd; current = subDays(new Date(current), -1)) {
      days.push(current);
    }
    const weekly = days.map(d => {
      const label = format(d, 'EEE', { locale: es }).slice(0, 2).toUpperCase();
      const dayActivities = activities.filter(a => isSameDay(startOfDay(a.date), startOfDay(d)));
      const completed = dayActivities.filter(a => a.completed).length;
      const total = dayActivities.length;
      const pct = total ? Math.round((completed / total) * 100) : 0;
      return { date: d, label, completed, total, pct };
    });

    const startMonth = startOfMonth(new Date());
    const endMonth = endOfMonth(new Date());
    const monthActivities = activities.filter(activity => activity.date >= startMonth && activity.date <= endMonth);

    // Activity type breakdown (last 7 days and current month)
    const typeBreakdown = (items: typeof activities) =>
      items.reduce<Record<ActivityType, number>>((acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + (activity.completed ? 1 : 0);
        return acc;
      }, {} as Record<ActivityType, number>);

    const weeklyTypes = typeBreakdown(activities.filter(activity => activity.date >= startOfDay(weekStart) && activity.date <= weekEnd));
    const monthlyTypes = typeBreakdown(monthActivities);

    // Streaks: consecutive days ending today with 100% completion
    const daysToCheck = lastNDays(90);
    let currentStreak = 0;
    for (let i = daysToCheck.length - 1; i >= 0; i--) {
      const d = daysToCheck[i];
      const dayActivities = activities.filter(a => isSameDay(startOfDay(a.date), startOfDay(d)));
      const total = dayActivities.length;
      const completed = dayActivities.filter(a => a.completed).length;
      if (total === 0 || completed < total) break;
      currentStreak += 1;
    }

    // Best streak in window
    let bestStreak = 0;
    let run = 0;
    for (let i = 0; i < daysToCheck.length; i++) {
      const d = daysToCheck[i];
      const dayActivities = activities.filter(a => isSameDay(startOfDay(a.date), startOfDay(d)));
      const total = dayActivities.length;
      const completed = dayActivities.filter(a => a.completed).length;
      if (total > 0 && completed === total) {
        run += 1;
        bestStreak = Math.max(bestStreak, run);
      } else {
        run = 0;
      }
    }

    // Overall completion for today (for donut)
    const today = startOfDay(new Date());
    const todayActivities = activities.filter(a => isSameDay(startOfDay(a.date), today));
    const todayCompleted = todayActivities.filter(a => a.completed).length;
    const todayPct = todayActivities.length ? Math.round((todayCompleted / todayActivities.length) * 100) : 0;

    const monthCompleted = monthActivities.filter(activity => activity.completed).length;
    const monthPending = monthActivities.filter(activity => !activity.completed).length;
    const monthPct = monthActivities.length ? Math.round((monthCompleted / monthActivities.length) * 100) : 0;

    return {
      weekly,
      weeklyTypes,
      monthlyTypes,
      currentStreak,
      bestStreak,
      todayPct,
      monthActivities,
      monthCompleted,
      monthPending,
      monthPct,
    };
  }, [activities]);
}
