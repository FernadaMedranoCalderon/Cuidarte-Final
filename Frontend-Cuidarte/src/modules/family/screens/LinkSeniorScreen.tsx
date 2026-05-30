import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/common/components/AppButton';
import { Card } from '@/common/components/Card';
import { FormInput } from '@/common/components/FormInput';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { useAppStore } from '@/store/AppStore';
import { fetchActivitiesByElderly } from '@/common/services/activitiesService';
import { createFamilyLink, getCachedLinkedSeniors, mergeLinkedSeniors, setCachedLinkedSeniors } from '@/common/services/familyLinkService';
import { resolveRoleEntityId, resolveVisibleSeniorCode } from '@/common/services/identityService';
import { localStorageService } from '@/common/services/storage';

type LinkSeniorScreenProps = {
  onDone?: () => void;
  onLink?: (value: { name: string; code: string; elderlyId?: number; familyLinkId?: number }) => void;
  onClose?: () => void;
  embedded?: boolean;
};

export function LinkSeniorScreen({ onDone, onLink, onClose, embedded = false }: LinkSeniorScreenProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const { addNotification, setActivities, user } = useAppStore();

  const finishLink = async (linked: { name: string; code: string; elderlyId?: number; familyLinkId?: number }) => {
    if (user?.id) {
      const cached = await getCachedLinkedSeniors(user.id);
      const nextAccounts = mergeLinkedSeniors(cached, [
        {
          id: linked.familyLinkId ? String(linked.familyLinkId) : linked.elderlyId ? `elderly-${linked.elderlyId}` : linked.code,
          name: linked.name,
          email: '',
          code: linked.code,
          elderlyId: linked.elderlyId,
          familyLinkId: linked.familyLinkId,
          isActive: true,
        },
      ]);
      await setCachedLinkedSeniors(user.id, nextAccounts);
    }

    if (linked.elderlyId) {
      const token = await localStorageService.getItem('accessToken');
      const activities = await fetchActivitiesByElderly(linked.elderlyId, token ?? undefined);
      setActivities(activities);
    }

    onLink?.(linked);
    onDone?.();
  };

  const content = (
    <View style={styles.wrapper}>
      <Pressable onPress={onClose ?? onDone} style={styles.closeButton} accessibilityRole="button" accessibilityLabel="Cerrar vinculación">
        <Ionicons name="close" size={22} color={colors.muted} />
      </Pressable>
      <Card style={styles.card}>
        <Text style={styles.title}>Vincular con adulto mayor</Text>
        <Text style={styles.text}>Ingresa el ID que aparece en la app del adulto mayor.</Text>
        <FormInput label="Nombre del adulto mayor" value={name} onChangeText={setName} placeholder="Ej: María García" />
        <FormInput label="Código ID único" value={code} onChangeText={setCode} placeholder="Ej: 1234567890" />
        <AppButton
          title="Vincular"
          disabled={!name || !code}
          onPress={async () => {
            try {
              const token = await localStorageService.getItem('accessToken');
              const familyId = user?.id ? await resolveRoleEntityId(user.id, 'FAMILY', token ?? undefined) : undefined;
              if (familyId) {
                const res = await createFamilyLink(familyId, code, token ?? undefined);
                addNotification(`Cuenta vinculada: ${name}`, 'success');
                await finishLink({
                  name,
                  code,
                  elderlyId: Number(res.createFamilyLink.elderlyId),
                  familyLinkId: Number(res.createFamilyLink.id),
                });
                return;
              }
              throw new Error('No se pudo determinar la cuenta familiar');
            } catch (err: any) {
              const token = await localStorageService.getItem('accessToken');
              const visibleSenior = await resolveVisibleSeniorCode(code, token ?? undefined);
              if (visibleSenior?.elderlyId) {
                addNotification(`Cuenta vinculada: ${name}`, 'success');
                await finishLink({
                  name: visibleSenior.name ?? name,
                  code,
                  elderlyId: visibleSenior.elderlyId,
                });
                return;
              }
              addNotification(err?.message ?? 'No se pudo vincular el adulto mayor', 'alert');
            }
          }}
        />
      </Card>
    </View>
  );

  if (embedded) {
    return <View style={styles.embedded}>{content}</View>;
  }

  return <Screen>{content}</Screen>;
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    padding: 20,
  },
  embedded: {
    padding: 0,
    margin: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 26,
    right: 26,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    zIndex: 3,
  },
  card: { gap: 12 },
  title: { color: colors.primary, fontSize: 20, fontWeight: '900' },
  text: { color: colors.muted, fontSize: 13 },
});
