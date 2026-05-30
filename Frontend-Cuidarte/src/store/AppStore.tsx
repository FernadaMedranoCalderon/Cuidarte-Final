import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { refreshRequest } from '@/common/services/api';
import { localStorageService } from '@/common/services/storage';
import { fetchActivitiesByElderly } from '@/common/services/activitiesService';
import { getCachedLinkedSeniors, getFamilyLinks, mergeLinkedSeniors, setCachedLinkedSeniors } from '@/common/services/familyLinkService';
import { resolveRoleEntityId } from '@/common/services/identityService';
import type { Activity, AppNotification, Medication, User } from '@/types';

type AppContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  appearance: AppearanceSettings;
  setAppearance: React.Dispatch<React.SetStateAction<AppearanceSettings>>;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  medications: Medication[];
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  addNotification: (message: string, type?: AppNotification['type']) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export type AppearanceSettings = {
  textSize: 'normal' | 'large' | 'xlarge';
  contrast: 'normal' | 'high';
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    textSize: 'normal',
    contrast: 'normal',
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const refreshToken = await localStorageService.getItem('refreshToken');
        if (!refreshToken) return;
        const data = await refreshRequest(refreshToken);
        const auth = data.refreshToken;
        if (!auth) return;
        const role = auth.user.role === 'ELDERLY' ? 'senior' : 'family';
        if (!mounted) return;
        setUser({ id: String(auth.user.id), email: auth.user.email, name: auth.user.name, role });
        await localStorageService.setItem('accessToken', auth.accessToken);
        await localStorageService.setItem('refreshToken', auth.refreshToken);
        const backendUser = { id: String(auth.user.id), email: auth.user.email, name: auth.user.name, role };
        if (role === 'senior') {
          const elderlyId = await resolveRoleEntityId(auth.user.id, 'ELDERLY', auth.accessToken);
          const activitiesFromApi = elderlyId ? await fetchActivitiesByElderly(elderlyId, auth.accessToken) : [];
          if (mounted) setActivities(activitiesFromApi);
        } else {
          const cachedLinks = await getCachedLinkedSeniors(backendUser.id);
          let links = cachedLinks;
          try {
            const familyId = await resolveRoleEntityId(backendUser.id, 'FAMILY', auth.accessToken);
            const res = await getFamilyLinks(familyId ?? Number(backendUser.id), auth.accessToken);
            const apiLinks = (res.familyLinks ?? []).map((link: any) => ({
              id: String(link.id),
              name: `Adulto ${link.elderlyId}`,
              email: '',
              code: String(link.elderlyId),
              elderlyId: Number(link.elderlyId),
              familyLinkId: Number(link.id),
              isActive: Boolean(link.isActive),
            }));
            links = mergeLinkedSeniors(cachedLinks, apiLinks);
            await setCachedLinkedSeniors(backendUser.id, links);
          } catch {
            links = cachedLinks;
          }
          const firstLinked = links.find(link => link.elderlyId);
          if (firstLinked?.elderlyId) {
            const activitiesFromApi = await fetchActivitiesByElderly(firstLinked.elderlyId, auth.accessToken);
            if (mounted) setActivities(activitiesFromApi);
          }
        }
      } catch (err) {
        // ignore - user will stay logged out
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    let mounted = true;
    const refreshActivities = async () => {
      try {
        const token = await localStorageService.getItem('accessToken');
        if (user.role === 'senior') {
          const elderlyId = await resolveRoleEntityId(user.id, 'ELDERLY', token ?? undefined);
          if (!elderlyId) return;
          const nextActivities = await fetchActivitiesByElderly(elderlyId, token ?? undefined);
          if (mounted) setActivities(nextActivities);
          return;
        }

        const cachedLinks = await getCachedLinkedSeniors(user.id);
        const familyId = await resolveRoleEntityId(user.id, 'FAMILY', token ?? undefined);
        let links = cachedLinks;
        try {
          const res = await getFamilyLinks(familyId ?? Number(user.id), token ?? undefined);
          links = mergeLinkedSeniors(
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
        } catch {
          links = cachedLinks;
        }

        const firstLinked = links.find(link => link.elderlyId);
        if (!firstLinked?.elderlyId) return;
        const nextActivities = await fetchActivitiesByElderly(firstLinked.elderlyId, token ?? undefined);
        if (mounted) setActivities(nextActivities);
      } catch {
        // Keep the last loaded state if sync is temporarily unavailable.
      }
    };

    refreshActivities();
    const intervalId = setInterval(refreshActivities, 15000);
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [user?.id, user?.role]);

  const addNotification = (message: string, type: AppNotification['type'] = 'info') => {
    setNotifications(prev => [
      {
        id: Date.now().toString(),
        type,
        message,
        time: 'Ahora',
        read: false,
      },
      ...prev,
    ]);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      appearance,
      setAppearance,
      activities,
      setActivities,
      medications,
      setMedications,
      notifications,
      setNotifications,
      addNotification,
      markNotificationRead: (id: string) =>
        setNotifications(prev => prev.map(item => (item.id === id ? { ...item, read: true } : item))),
      markAllNotificationsRead: () => setNotifications(prev => prev.map(item => ({ ...item, read: true }))),
      deleteNotification: (id: string) => setNotifications(prev => prev.filter(item => item.id !== id)),
    }),
    [activities, appearance, medications, notifications, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function getTextScale(textSize: AppearanceSettings['textSize']) {
  if (textSize === 'xlarge') return 1.22;
  if (textSize === 'large') return 1.12;
  return 1;
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
}
