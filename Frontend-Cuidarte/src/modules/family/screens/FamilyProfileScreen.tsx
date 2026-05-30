import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/common/components/AppButton';
import { AppModal } from '@/common/components/AppModal';
import { Card } from '@/common/components/Card';
import { EmptyState } from '@/common/components/EmptyState';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { getTextScale, useAppStore } from '@/store/AppStore';
import { fetchActivitiesByElderly } from '@/common/services/activitiesService';
import {
  deactivateFamilyLink,
  getCachedLinkedSeniors,
  getFamilyLinks,
  mergeLinkedSeniors,
  setCachedLinkedSeniors,
  type LinkedSeniorAccount,
} from '@/common/services/familyLinkService';
import { resolveRoleEntityId } from '@/common/services/identityService';
import { localStorageService } from '@/common/services/storage';
import { OptionPicker } from '@/modules/senior/screens/shared/OptionPicker';
import { LinkSeniorScreen } from './LinkSeniorScreen';

type ProfileSection = 'validation' | 'alerts' | null;

export function FamilyProfileScreen() {
  const { user, appearance, setUser, setActivities } = useAppStore();
  const scale = getTextScale(appearance.textSize);
  const [activeSection, setActiveSection] = React.useState<ProfileSection>(null);
  const [validation, setValidation] = React.useState('photo');
  const [graceTime, setGraceTime] = React.useState('15');
  const [showLinkSenior, setShowLinkSenior] = React.useState(false);
  const [deleteAccountId, setDeleteAccountId] = React.useState<string | null>(null);
  const [linkedAccounts, setLinkedAccounts] = React.useState<LinkedSeniorAccount[]>([]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!user?.id) return;
        const token = await localStorageService.getItem('accessToken');
        const cached = await getCachedLinkedSeniors(user.id);
        if (mounted) setLinkedAccounts(cached);
        const familyId = await resolveRoleEntityId(user.id, 'FAMILY', token ?? undefined);
        const res = await getFamilyLinks(familyId ?? Number(user.id), token ?? undefined);
        if (!mounted) return;
        const accounts = mergeLinkedSeniors(
          cached,
          (res.familyLinks ?? []).map((f: any) => ({
            id: String(f.id),
            name: `Adulto ${f.elderlyId}`,
            email: '',
            code: String(f.elderlyId),
            elderlyId: Number(f.elderlyId),
            familyLinkId: Number(f.id),
            isActive: Boolean(f.isActive),
          })),
        );
        setLinkedAccounts(accounts);
        await setCachedLinkedSeniors(user.id, accounts);
        const firstLinked = accounts.find(account => account.elderlyId);
        if (firstLinked?.elderlyId) {
          const activities = await fetchActivitiesByElderly(firstLinked.elderlyId, token ?? undefined);
          if (mounted) setActivities(activities);
        }
      } catch (err) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  const toggleSection = (section: ProfileSection) => {
    setActiveSection(current => (current === section ? null : section));
  };

  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={[styles.title, { fontSize: 24 * scale }]}>Perfil</Text>
        <View style={styles.profileBlock}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={32} color="#fff" />
          </View>
          <View style={styles.profileText}>
            <Text style={[styles.name, { fontSize: 19 * scale }]}>{user?.name ?? 'Familiar'}</Text>
            <Text style={[styles.email, { fontSize: 13 * scale }]}>{user?.email}</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.linkedSectionCard}>
        <View style={styles.linkedHeader}>
          <View style={styles.linkedHeaderCopy}>
            <Text style={[styles.sectionTitle, { fontSize: 20 * scale }]}>Cuentas vinculadas</Text>
            <Text style={[styles.helperText, { fontSize: 13 * scale }]}>Adultos mayores asociados a tu cuenta.</Text>
          </View>
          <Pressable onPress={() => setShowLinkSenior(true)} style={styles.linkPlusButton} accessibilityRole="button" accessibilityLabel="Vincular adulto mayor">
            <Ionicons name="add-outline" size={24} color={colors.primary} />
          </Pressable>
        </View>
        <View style={styles.linkedList}>
          {linkedAccounts.length === 0 ? (
            <EmptyState text="Todavía no tienes cuentas de adulto mayor vinculadas" />
          ) : (
            linkedAccounts.map(account => (
              <Card key={account.id} style={styles.linkedAccountCard}>
                <Pressable
                  onPress={() => setDeleteAccountId(account.id)}
                  style={styles.deleteLinkedButton}
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar vínculo de ${account.name}`}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </Pressable>
                <View style={styles.linkedAccountRow}>
                  <View style={styles.linkedAvatar}>
                    <Ionicons name="person-outline" size={22} color="#fff" />
                  </View>
                  <View style={styles.linkedAccountText}>
                    <Text style={styles.linkedAccountName}>{account.name}</Text>
                    <Text style={styles.linkedAccountMeta}>{account.email || 'Sin correo registrado'}</Text>
                    <Text style={styles.linkedAccountMeta}>Código: {account.code}</Text>
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>
      </Card>

      <View style={styles.actions}>
        <ProfileAction
          title="Validación"
          description="Configura el tipo de validación"
          icon="checkmark-done-outline"
          active={activeSection === 'validation'}
          scale={scale}
          onPress={() => toggleSection('validation')}
        />
        {activeSection === 'validation' ? (
          <Card style={styles.detailCard}>
            <Text style={[styles.sectionTitle, { fontSize: 20 * scale }]}>Validación</Text>
            <OptionPicker
              label="Tipo de validación"
              value={validation}
              onChange={setValidation}
              options={[
                { value: 'photo', label: 'Foto' },
                { value: 'button', label: 'Botón' },
                { value: 'none', label: 'Ninguna' },
              ]}
            />
          </Card>
        ) : null}

        <ProfileAction title="Reglas de alerta" description="Ajusta tiempo de gracia para alertas" icon="alert-circle-outline" active={activeSection === 'alerts'} scale={scale} onPress={() => toggleSection('alerts')} />
        {activeSection === 'alerts' ? (
          <Card style={styles.detailCard}>
            <Text style={[styles.sectionTitle, { fontSize: 20 * scale }]}>Reglas de alerta</Text>
            <OptionPicker
              label="Tiempo de gracia"
              value={graceTime}
              onChange={setGraceTime}
              options={[
                { value: '0', label: 'Inmediato' },
                { value: '15', label: '15 min' },
                { value: '30', label: '30 min' },
                { value: '60', label: '1 hora' },
              ]}
            />
          </Card>
        ) : null}

        <AppButton
          title="Cerrar sesión"
          variant="outline"
          onPress={() => setUser(null)}
          leftIcon={<Ionicons name="log-out-outline" size={22} color={colors.danger} />}
          style={styles.logoutButton}
        />
      </View>

      <AppModal visible={showLinkSenior} onClose={() => setShowLinkSenior(false)}>
        <LinkSeniorScreen
          embedded
          onDone={() => setShowLinkSenior(false)}
          onLink={async ({ name, code, elderlyId, familyLinkId }) => {
            const nextAccount = {
              id: familyLinkId ? String(familyLinkId) : code,
              name,
              email: '',
              code,
              elderlyId,
              familyLinkId,
              isActive: true,
            };
            const nextAccounts = mergeLinkedSeniors(linkedAccounts, [nextAccount]);
            setLinkedAccounts(nextAccounts);
            if (user?.id) await setCachedLinkedSeniors(user.id, nextAccounts);
            if (elderlyId) {
              const token = await localStorageService.getItem('accessToken');
              const activities = await fetchActivitiesByElderly(elderlyId, token ?? undefined);
              setActivities(activities);
            }
          }}
        />
      </AppModal>

      <AppModal visible={Boolean(deleteAccountId)} onClose={() => setDeleteAccountId(null)}>
        <Card style={styles.deleteCard}>
          <View style={styles.deleteIcon}>
            <Ionicons name="trash-outline" size={36} color={colors.danger} />
          </View>
          <Text style={styles.deleteTitle}>¿Eliminar vínculo?</Text>
          <Text style={styles.deleteText}>Esta acción quitará el adulto mayor de tu lista vinculada.</Text>
          <View style={styles.deleteActions}>
            <AppButton
              title="Eliminar"
              variant="danger"
              onPress={async () => {
                const account = linkedAccounts.find(item => item.id === deleteAccountId);
                const nextAccounts = linkedAccounts.filter(item => item.id !== deleteAccountId);
                setLinkedAccounts(nextAccounts);
                if (user?.id) await setCachedLinkedSeniors(user.id, nextAccounts);
                if (account?.familyLinkId) {
                  const token = await localStorageService.getItem('accessToken');
                  await deactivateFamilyLink(account.familyLinkId, token ?? undefined).catch(() => undefined);
                }
                setDeleteAccountId(null);
              }}
              style={styles.deleteActionButton}
            />
            <AppButton title="Cancelar" variant="outline" onPress={() => setDeleteAccountId(null)} style={styles.deleteActionButton} />
          </View>
        </Card>
      </AppModal>
    </Screen>
  );
}

function ProfileAction({
  title,
  description,
  icon,
  active,
  scale,
  onPress,
  trailingIcon,
}: {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  scale: number;
  onPress: () => void;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
}) {
  const iconName = trailingIcon ?? (active ? 'chevron-up' : 'chevron-down');

  return (
    <Pressable onPress={onPress} style={[styles.actionButton, active && styles.actionButtonActive]}>
      <View style={[styles.actionIcon, active && styles.actionIconActive]}>
        <Ionicons name={icon} size={24} color={active ? colors.primary : '#fff'} />
      </View>
      <View style={styles.actionCopy}>
        <Text style={[styles.actionTitle, { fontSize: 17 * scale }, active && styles.actionTextActive]}>{title}</Text>
        <Text style={[styles.actionDescription, { fontSize: 12 * scale }, active && styles.actionDescriptionActive]}>{description}</Text>
      </View>
      <Ionicons name={iconName} size={22} color={active ? '#fff' : colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: 14, marginBottom: 12 },
  linkedSectionCard: {
    gap: 14,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: 20,
    backgroundColor: colors.surface,
    padding: 16,
  },
  linkedList: { gap: 10 },
  linkedAccountCard: {
    gap: 0,
    position: 'relative',
    padding: 16,
    backgroundColor: '#eef9f7',
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: 20,
  },
  linkedAccountRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  linkedHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  linkedHeaderCopy: { flex: 1 },
  linkPlusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(69,136,128,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(69,136,128,0.20)',
  },
  linkedAvatar: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  linkedAccountText: { flex: 1 },
  linkedAccountName: { color: colors.text, fontSize: 16, fontWeight: '900' },
  linkedAccountMeta: { color: colors.muted, fontSize: 12, marginTop: 2 },
  deleteLinkedButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    zIndex: 2,
  },
  helperText: { color: colors.muted, lineHeight: 18 },
  detailCard: {
    gap: 14,
    marginTop: -2,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: 'rgba(69,136,128,0.18)',
  },
  title: { color: colors.primary, fontSize: 24, fontWeight: '900' },
  sectionTitle: { color: colors.primary, fontSize: 20, fontWeight: '900' },
  profileBlock: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  profileText: { flex: 1 },
  name: { color: colors.text, fontSize: 19, fontWeight: '900' },
  email: { color: colors.muted, fontSize: 13, marginTop: 3 },
  actions: { gap: 10, marginBottom: 12 },
  actionButton: {
    minHeight: 76,
    borderWidth: 2,
    borderColor: 'rgba(69,136,128,0.24)',
    borderRadius: 16,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  actionButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  actionIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  actionIconActive: { backgroundColor: '#fff' },
  actionCopy: { flex: 1 },
  actionTitle: { color: colors.primary, fontSize: 17, fontWeight: '900' },
  actionDescription: { color: colors.muted, fontSize: 12, marginTop: 3 },
  actionTextActive: { color: '#fff' },
  actionDescriptionActive: { color: '#dff4f1' },
  logoutButton: { minHeight: 58, borderColor: '#fecaca' },
  deleteCard: { gap: 12, alignItems: 'stretch' },
  deleteIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  deleteTitle: { color: colors.primary, fontSize: 20, fontWeight: '900', textAlign: 'center' },
  deleteText: { color: colors.text, fontSize: 15, lineHeight: 21, textAlign: 'center' },
  deleteActions: { flexDirection: 'row', gap: 8 },
  deleteActionButton: { flex: 1 },
});
