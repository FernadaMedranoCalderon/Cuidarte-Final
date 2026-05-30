import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/common/components/AppButton';
import { Card } from '@/common/components/Card';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { getTextScale, useAppStore } from '@/store/AppStore';
import { OptionPicker } from './shared/OptionPicker';

type ProfileSection = 'reminders' | 'accessibility' | null;

type ProfileScreenProps = {
  onLogout: () => void;
};

export function AccessibilitySettingsScreen({ onLogout }: ProfileScreenProps) {
  const { user, appearance, setAppearance } = useAppStore();
  const scale = getTextScale(appearance.textSize);
  const [activeSection, setActiveSection] = React.useState<ProfileSection>(null);
  const [minutes, setMinutes] = React.useState('15');

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
            <Text style={[styles.name, { fontSize: 19 * scale }]}>{user?.name ?? 'Adulto mayor'}</Text>
            <Text style={[styles.email, { fontSize: 13 * scale }]}>{user?.email}</Text>
          </View>
        </View>
      </Card>

      <View style={styles.linkFrame}>
        <Text style={[styles.linkTitle, { fontSize: 20 * scale }]}>Código de vinculación</Text>
        <Text adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.7} style={styles.linkCode}>
          {user?.id ?? '1234567890'}
        </Text>
        <Text style={[styles.helpText, { fontSize: 15 * scale }]}>Comparte este código con tu familiar para que pueda acompañarte.</Text>
      </View>

      <View style={styles.actions}>
        <ProfileAction
          title="Recordatorios"
          description="Avisos antes de cada actividad"
          icon="notifications-outline"
          active={activeSection === 'reminders'}
          scale={scale}
          onPress={() => toggleSection('reminders')}
        />
        {activeSection === 'reminders' ? (
          <Card style={styles.detailCard}>
            <Text style={[styles.sectionTitle, { fontSize: 20 * scale }]}>Recordatorios</Text>
            <Text style={[styles.bodyText, { fontSize: 15 * scale }]}>Configura cuántos minutos antes quieres recibir avisos.</Text>
            <OptionPicker
              label="Tiempo"
              value={minutes}
              onChange={setMinutes}
              options={[
                { value: '5', label: '5 min' },
                { value: '15', label: '15 min' },
                { value: '30', label: '30 min' },
                { value: '60', label: '1 hora' },
              ]}
            />
            <View style={styles.preview}>
              <Text style={styles.previewText}>Aviso activo: {minutes} minutos antes</Text>
            </View>
          </Card>
        ) : null}

        <ProfileAction
          title="Accesibilidad"
          description="Texto grande y contraste"
          icon="text-outline"
          active={activeSection === 'accessibility'}
          scale={scale}
          onPress={() => toggleSection('accessibility')}
        />
        {activeSection === 'accessibility' ? (
          <Card style={styles.detailCard}>
            <Text style={[styles.sectionTitle, { fontSize: 20 * scale }]}>Accesibilidad</Text>
            <OptionPicker
              label="Tamaño de texto"
              value={appearance.textSize}
              onChange={value => setAppearance(current => ({ ...current, textSize: value as typeof current.textSize }))}
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'large', label: 'Grande' },
                { value: 'xlarge', label: 'Muy grande' },
              ]}
            />
            <OptionPicker
              label="Contraste"
              value={appearance.contrast}
              onChange={value => setAppearance(current => ({ ...current, contrast: value as typeof current.contrast }))}
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'high', label: 'Alto contraste' },
              ]}
            />
          </Card>
        ) : null}


        <AppButton
          title="Cerrar sesión"
          variant="outline"
          onPress={onLogout}
          leftIcon={<Ionicons name="log-out-outline" size={22} color={colors.danger} />}
          style={styles.logoutButton}
        />
      </View>
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
  card: {
    gap: 14,
    marginBottom: 12,
  },
  detailCard: {
    gap: 14,
    marginTop: -2,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: 'rgba(69,136,128,0.18)',
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '900',
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
  },
  profileBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  profileText: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '900',
  },
  email: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 3,
  },
  linkFrame: {
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: 20,
    backgroundColor: '#eef9f7',
    padding: 16,
    marginBottom: 12,
  },
  linkTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  linkCode: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginVertical: 10,
    includeFontPadding: false,
  },
  helpText: {
    color: '#315f59',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    textAlign: 'center',
  },
  actions: {
    gap: 10,
    marginBottom: 12,
  },
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
  actionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  actionIconActive: {
    backgroundColor: '#fff',
  },
  actionCopy: {
    flex: 1,
  },
  actionTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },
  actionDescription: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
  },
  actionTextActive: {
    color: '#fff',
  },
  actionDescriptionActive: {
    color: '#dff4f1',
  },
  bodyText: {
    color: colors.muted,
    fontSize: 15,
  },
  preview: {
    backgroundColor: 'rgba(69,136,128,0.10)',
    borderRadius: 12,
    padding: 12,
  },
  previewText: {
    color: colors.primary,
    fontWeight: '800',
  },
  logoutButton: {
    minHeight: 58,
    borderColor: '#fecaca',
  },
});
