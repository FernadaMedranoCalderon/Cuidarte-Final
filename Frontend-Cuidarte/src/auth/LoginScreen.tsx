import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { UserRole } from '@/types';
import { AppButton } from '@/common/components/AppButton';
import { AppModal } from '@/common/components/AppModal';
import { Card } from '@/common/components/Card';
import { FormInput } from '@/common/components/FormInput';
import { colors } from '@/common/styles/theme';

type LoginScreenProps = {
  onLogin: (email: string, password: string, role: UserRole, name: string) => void;
  onRegister: (name: string, email: string, password: string, role: UserRole) => void;
};

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<UserRole>('senior');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const submit = () => {
    if (!email || !password || (isRegister && !name)) {
      Alert.alert('Datos incompletos', 'Completa los campos requeridos.');
      return;
    }
    if (isRegister) {
      onRegister(name, email, password, role);
      return;
    }
    onLogin(email, password, role, name || email.split('@')[0]);
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.panel}>
        <View style={styles.brandCircle}>
          <Ionicons name="heart-outline" size={42} color="#fff" />
        </View>
        <Text style={styles.title}>Cuidarte</Text>
        <Text style={styles.subtitle}>{isRegister ? 'Crea tu cuenta' : 'Inicia sesión para continuar'}</Text>

        <View style={styles.form}>
          {isRegister ? (
            <>
              <FormInput label="Nombre completo" icon="person-outline" value={name} onChangeText={setName} placeholder="Tu nombre" />
              <View style={styles.roleGroup}>
                <Text style={styles.roleLabel}>¿Qué tipo de cuenta quieres crear?</Text>
                <View style={styles.roleRow}>
                  <RoleOption
                    title="Adulto Mayor"
                    icon="person-outline"
                    selected={role === 'senior'}
                    onPress={() => setRole('senior')}
                  />
                  <RoleOption
                    title="Familiar"
                    icon="people-outline"
                    selected={role === 'family'}
                    onPress={() => setRole('family')}
                  />
                </View>
              </View>
            </>
          ) : null}

          <FormInput
            label="Correo electrónico"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="tu@email.com"
          />
          <View>
            <FormInput
              label="Contraseña"
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="••••••••"
            />
            <Pressable onPress={() => setShowPassword(value => !value)} style={styles.eyeButton}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9ca3af" />
            </Pressable>
          </View>

          {!isRegister ? (
            <Pressable onPress={() => setShowRecovery(true)} style={styles.recoverButton}>
              <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
          ) : (
            <Pressable onPress={() => setAcceptPrivacy(value => !value)} style={styles.privacyRow}>
              <View style={[styles.checkbox, acceptPrivacy && styles.checkboxOn]}>
                {acceptPrivacy ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
              </View>
              <Text style={styles.privacyText}>Acepto el Aviso de Privacidad y los términos y condiciones</Text>
            </Pressable>
          )}

          <AppButton title={isRegister ? 'Crear cuenta' : 'Iniciar sesión'} onPress={submit} disabled={isRegister && !acceptPrivacy} />
        </View>

        <Pressable
          onPress={() => {
            setIsRegister(value => !value);
            setAcceptPrivacy(false);
            setRole('senior');
          }}
        >
          <Text style={styles.switchText}>{isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}</Text>
        </Pressable>
      </Card>

      <AppModal visible={showRecovery} onClose={() => setShowRecovery(false)}>
        <Card>
          <Text style={styles.modalTitle}>Recuperar contraseña</Text>
          <Text style={styles.modalText}>Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</Text>
          <View style={styles.form}>
            <FormInput
              label="Correo electrónico"
              icon="mail-outline"
              value={recoveryEmail}
              onChangeText={setRecoveryEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="tu@email.com"
            />
            <View style={styles.row}>
              <AppButton
                title="Enviar"
                onPress={() => {
                  Alert.alert('Recuperación', `Se ha enviado un enlace a ${recoveryEmail}`);
                  setRecoveryEmail('');
                  setShowRecovery(false);
                }}
                style={styles.flex}
              />
              <AppButton title="Cancelar" variant="outline" onPress={() => setShowRecovery(false)} style={styles.flex} />
            </View>
          </View>
        </Card>
      </AppModal>
    </View>
  );
}

function RoleOption({
  title,
  icon,
  selected,
  onPress,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.roleOption, selected && styles.roleOptionSelected]}>
      <Ionicons name={icon} size={22} color={selected ? colors.surface : colors.primary} />
      <Text style={[styles.roleOptionText, selected && styles.roleOptionTextSelected]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.primary,
  },
  panel: {
    gap: 12,
  },
  brandCircle: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  title: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  form: {
    gap: 12,
  },
  roleGroup: {
    gap: 8,
  },
  roleLabel: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '700',
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleOption: {
    flex: 1,
    minHeight: 70,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  roleOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleOptionText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  roleOptionTextSelected: {
    color: colors.surface,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  recoverButton: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  linkText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  privacyRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  privacyText: {
    flex: 1,
    color: '#374151',
    fontSize: 12,
    lineHeight: 17,
  },
  switchText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalText: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  flex: {
    flex: 1,
  },
});
