import React from 'react';
import { LoginScreen } from '@/auth/LoginScreen';
import { useAppStore } from '@/store/AppStore';
import { SeniorNavigator } from '@/modules/senior/navigation/SeniorNavigator';
import { FamilyNavigator } from '@/modules/family/navigation/FamilyNavigator';
import { Alert } from 'react-native';
import { loginRequest, registerRequest } from '@/common/services/api';
import { fetchActivitiesByElderly } from '@/common/services/activitiesService';
import { getCachedLinkedSeniors, getFamilyLinks, mergeLinkedSeniors, setCachedLinkedSeniors } from '@/common/services/familyLinkService';
import { resolveRoleEntityId } from '@/common/services/identityService';
import { localStorageService } from '@/common/services/storage';

export function RootNavigator() {
  const { user, setUser, setActivities } = useAppStore();

  const hydrateActivities = async (authUser: any, accessToken: string) => {
    const role = authUser.role === 'ELDERLY' ? 'senior' : 'family';
    if (role === 'senior') {
      const elderlyId = await resolveRoleEntityId(authUser.id, 'ELDERLY', accessToken);
      const activities = elderlyId ? await fetchActivitiesByElderly(elderlyId, accessToken) : [];
      setActivities(activities);
      return;
    }

    const cachedLinks = await getCachedLinkedSeniors(String(authUser.id));
    let links = cachedLinks;
    try {
      const familyId = await resolveRoleEntityId(authUser.id, 'FAMILY', accessToken);
      const res = await getFamilyLinks(familyId ?? Number(authUser.id), accessToken);
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
      await setCachedLinkedSeniors(String(authUser.id), links);
    } catch {
      links = cachedLinks;
    }

    const firstLinked = links.find(link => link.elderlyId);
    if (firstLinked?.elderlyId) {
      const activities = await fetchActivitiesByElderly(firstLinked.elderlyId, accessToken);
      setActivities(activities);
    } else {
      setActivities([]);
    }
  };

  if (!user) {
    return (
      <LoginScreen
        onLogin={async (email, password, _role, name) => {
          try {
            const data = await loginRequest(email, password);
            const auth = data.login;
            await localStorageService.setItem('accessToken', auth.accessToken);
            await localStorageService.setItem('refreshToken', auth.refreshToken);
            const role = auth.user.role === 'ELDERLY' ? 'senior' : 'family';
            setUser({ id: String(auth.user.id), email: auth.user.email, name: auth.user.name, role });
            await hydrateActivities(auth.user, auth.accessToken);
          } catch (err: any) {
            Alert.alert('Error de inicio de sesión', err?.message ?? 'No se pudo iniciar sesión');
          }
        }}
        onRegister={async (name, email, password, role) => {
          try {
            const backendRole = role === 'family' ? 'FAMILY' : 'ELDERLY';
            await registerRequest({ name, email, password, role: backendRole });
            const data = await loginRequest(email, password);
            const auth = data.login;
            await localStorageService.setItem('accessToken', auth.accessToken);
            await localStorageService.setItem('refreshToken', auth.refreshToken);
            const mappedRole = auth.user.role === 'ELDERLY' ? 'senior' : 'family';
            setUser({ id: String(auth.user.id), email: auth.user.email, name: auth.user.name, role: mappedRole });
            await hydrateActivities(auth.user, auth.accessToken);
          } catch (err: any) {
            Alert.alert('Error de registro', err?.message ?? 'No se pudo crear la cuenta');
          }
        }}
      />
    );
  }

  if (user?.role === 'senior') return <SeniorNavigator />;
  return <FamilyNavigator />;
}
