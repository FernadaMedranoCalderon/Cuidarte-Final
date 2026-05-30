import { isSameDay, isToday } from 'date-fns';
import type { Activity, EvidenceType } from '@/types';
import { useAppStore } from '@/store/AppStore';
import {
  createActivity,
  updateActivity,
  deleteActivity as apiDeleteActivity,
  createActivityLog,
  fetchActivitiesByElderly,
} from '@/common/services/activitiesService';
import { getCachedLinkedSeniors, getFamilyLinks, mergeLinkedSeniors, setCachedLinkedSeniors } from '@/common/services/familyLinkService';
import { resolveRoleEntityId, resolveVisibleSeniorCode } from '@/common/services/identityService';
import { setStoredEvidence } from '@/common/services/evidenceService';
import { localStorageService } from '@/common/services/storage';

export function useSeniorActivities() {
  const { activities, setActivities, addNotification, user } = useAppStore();

  const refreshTargetActivities = async (token?: string) => {
    const elderlyId = await resolveTargetElderlyId(token);
    if (!elderlyId) return;
    const refreshed = await fetchActivitiesByElderly(elderlyId, token);
    setActivities(refreshed);
  };

  const completeActivity = (
    activityId: string,
    evidenceType: EvidenceType = 'button',
    evidence?: { photoUri?: string; location?: Activity['evidenceLocation'] },
  ) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? {
              ...activity,
              completed: true,
              justification: undefined,
              evidencePhoto: evidence?.photoUri ?? activity.evidencePhoto,
              evidenceLocation: evidence?.location ?? activity.evidenceLocation,
            }
          : activity,
      ),
    );
    const activity = activities.find(item => item.id === activityId);
    (async () => {
      try {
        const token = await localStorageService.getItem('accessToken');
        await setStoredEvidence(activityId, {
          completed: true,
          evidencePhoto: evidence?.photoUri,
          evidenceLocation: evidence?.location,
        });
        const scheduled = new Date(activity?.date ?? new Date());
        const [hour = '09', minute = '00'] = (activity?.time ?? '09:00').split(':');
        scheduled.setHours(Number(hour), Number(minute), 0, 0);
        const type = evidenceType === 'photo' ? 'PHOTO' : evidenceType === 'location' ? 'LOCATION' : 'MARK';
        const dto: any = {
          scheduledAt: scheduled.toISOString(),
          status: 'COMPLETED',
          activityId: Number(activityId),
          type,
        };
        if (evidenceType === 'photo') {
          // The backend expects GraphQLUpload for photos; local URI is kept for viewing evidence.
          await refreshTargetActivities(token ?? undefined);
          return;
        }
        if (evidenceType === 'location') {
          dto.evidenceLocation = {
            latitude: evidence?.location?.latitude ?? 0,
            longitude: evidence?.location?.longitude ?? 0,
          };
        }
        await createActivityLog(dto, token ?? undefined);
        await refreshTargetActivities(token ?? undefined);
      } catch (err: any) {
        setActivities(prev => prev.map(item => (item.id === activityId ? { ...item, completed: false } : item)));
        addNotification(err?.message ?? 'No se pudo guardar la actividad como realizada', 'alert');
      }
    })();
    addNotification(`Actividad completada: ${activity?.title ?? 'actividad'}`, 'success');
  };

  const justifyActivity = (activityId: string, reason: string) => {
    setActivities(prev => prev.map(activity => (activity.id === activityId ? { ...activity, justification: reason } : activity)));
    const activity = activities.find(item => item.id === activityId);
    (async () => {
      try {
        const token = await localStorageService.getItem('accessToken');
        const scheduled = new Date(activity?.date ?? new Date());
        const [hour = '09', minute = '00'] = (activity?.time ?? '09:00').split(':');
        scheduled.setHours(Number(hour), Number(minute), 0, 0);
        await createActivityLog(
          {
            scheduledAt: scheduled.toISOString(),
            status: 'SKIPPED',
            activityId: Number(activityId),
            type: activity?.evidenceRequired === 'photo' ? 'PHOTO' : activity?.evidenceRequired === 'location' ? 'LOCATION' : 'MARK',
            skipReason: {
              reason: 'OTHER',
              customReason: reason,
            },
          },
          token ?? undefined,
        );
        await refreshTargetActivities(token ?? undefined);
      } catch (err: any) {
        addNotification(err?.message ?? 'No se pudo guardar como no realizada', 'alert');
      }
    })();
    addNotification(`No se pudo realizar: ${reason}`, 'alert');
  };

  const resolveTargetElderlyId = async (token?: string) => {
    if (!user?.id) return undefined;
    if (user.role === 'senior') return resolveRoleEntityId(user.id, 'ELDERLY', token);

    const cachedLinks = await getCachedLinkedSeniors(user.id);
    const cachedElderlyId = cachedLinks.find(account => account.elderlyId)?.elderlyId;
    if (cachedElderlyId) return cachedElderlyId;

    const linkWithVisibleCode = cachedLinks.find(account => account.code);
    if (linkWithVisibleCode?.code) {
      const visibleSenior = await resolveVisibleSeniorCode(linkWithVisibleCode.code, token);
      if (visibleSenior?.elderlyId) {
        const links = mergeLinkedSeniors(cachedLinks, [{ ...linkWithVisibleCode, elderlyId: visibleSenior.elderlyId }]);
        await setCachedLinkedSeniors(user.id, links);
        return visibleSenior.elderlyId;
      }
    }

    const familyId = await resolveRoleEntityId(user.id, 'FAMILY', token);
    if (!familyId) return undefined;

    const res = await getFamilyLinks(familyId, token);
    const links = mergeLinkedSeniors(
      cachedLinks,
      (res.familyLinks ?? []).map((link: any) => ({
        id: String(link.id),
        name: `Adulto ${link.elderlyId}`,
        email: '',
        code: String(link.elderlyId),
        elderlyId: Number(link.elderlyId),
        familyLinkId: Number(link.id),
        isActive: Boolean(link.isActive),
      })),
    );
    await setCachedLinkedSeniors(user.id, links);
    return links.find(account => account.elderlyId)?.elderlyId;
  };

  const saveActivity = async (activity: Activity) => {
    try {
      const token = await localStorageService.getItem('accessToken');
      const elderlyId = Number((activity as any).elderlyId) || (await resolveTargetElderlyId(token ?? undefined));
      // build DTO expected by backend
      const scheduledAt = new Date(activity.date);
      const [hour = '09', minute = '00'] = (activity.time ?? '09:00').split(':');
      scheduledAt.setHours(Number(hour), Number(minute), 0, 0);

      const mapType: Record<string, string> = {
        medication: 'MEDICATION',
        exercise: 'EXERCISE',
        appointment: 'MEDICAL_APPOINTMENT',
        social: 'OTHER',
        other: 'OTHER',
      };

      const repeat = activity.repeat === 'custom' ? 'DAILY' : activity.repeat.toUpperCase();
      const repeatDayMap: Record<string, string> = {
        monday: 'L',
        tuesday: 'M',
        wednesday: 'X',
        thursday: 'J',
        friday: 'V',
        saturday: 'S',
        sunday: 'D',
      };
      const repeatDays = activity.repeatDays?.map(day => repeatDayMap[day] ?? day).join(',') ?? null;

      const dto = {
        name: activity.title,
        type: mapType[activity.type] ?? 'OTHER',
        evidenceType: activity.evidenceRequired === 'button' ? 'MARK' : activity.evidenceRequired === 'photo' ? 'PHOTO' : 'LOCATION',
        repeat,
        repeatDays,
        date: scheduledAt.toISOString().slice(0, 10),
        time: `${String(scheduledAt.getHours()).padStart(2, '0')}:${String(scheduledAt.getMinutes()).padStart(2, '0')}`,
        elderlyId: elderlyId ?? undefined,
      };

      let next;
      const exists = activities.find(a => a.id === activity.id);
      if (!elderlyId) {
        addNotification('No se pudo determinar el adulto mayor para la actividad', 'alert');
        return false;
      }
      if (exists) {
        const updateDto = { id: Number(activity.id), ...dto, scheduledAt: scheduledAt.toISOString() };
        delete (updateDto as any).date;
        delete (updateDto as any).time;
        delete (updateDto as any).elderlyId;
        next = await updateActivity(updateDto, token ?? undefined);
      } else {
        next = await createActivity(dto as any, token ?? undefined);
      }
      const refreshed = await fetchActivitiesByElderly(elderlyId, token ?? undefined).catch(() => null);
      if (refreshed) {
        setActivities(refreshed);
      } else {
        setActivities(prev => (prev.find(a => a.id === String(next.id)) ? prev.map(item => (item.id === String(next.id) ? next : item)) : [...prev, next]));
      }
      addNotification(`Actividad guardada: ${next.title}`, 'success');
      return true;
    } catch (err: any) {
      addNotification(err?.message ?? 'No se pudo guardar la actividad', 'alert');
      return false;
    }
  };

  const deleteActivity = async (activityId: string) => {
    try {
      const token = await localStorageService.getItem('accessToken');
      await apiDeleteActivity(Number(activityId), token ?? undefined);
      setActivities(prev => prev.filter(a => a.id !== activityId));
    } catch (err) {
      // ignore
    }
  };

  return {
    activities,
    todayActivities: activities.filter(activity => isToday(activity.date)),
    activitiesForDate: (date: Date): Activity[] => activities.filter(activity => isSameDay(activity.date, date)),
    setActivities,
    completeActivity,
    justifyActivity,
    saveActivity,
    deleteActivity,
  };
}
