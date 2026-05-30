import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Contact } from '@/types';
import { AppButton } from '@/common/components/AppButton';
import { Card } from '@/common/components/Card';
import { FormInput } from '@/common/components/FormInput';
import { colors } from '@/common/styles/theme';
import { getTextScale, useAppStore } from '@/store/AppStore';
import { OptionPicker } from './shared/OptionPicker';

const relationshipOptions = [
  { value: 'Hija', label: 'Hija' },
  { value: 'Hijo', label: 'Hijo' },
  { value: 'Esposa', label: 'Esposa' },
  { value: 'Esposo', label: 'Esposo' },
  { value: 'Hermana', label: 'Hermana' },
  { value: 'Hermano', label: 'Hermano' },
  { value: 'Cuidador', label: 'Cuidador' },
  { value: 'Amiga', label: 'Amiga' },
  { value: 'Amigo', label: 'Amigo' },
  { value: 'Otro', label: 'Otro' },
];

type ContactFormScreenProps = {
  contact?: Contact;
  onCancel: () => void;
  onSave: (contact: Contact) => void;
};

export function ContactFormScreen({ contact, onCancel, onSave }: ContactFormScreenProps) {
  const { appearance } = useAppStore();
  const scale = getTextScale(appearance.textSize);
  const [name, setName] = useState(contact?.name ?? '');
  const [phone, setPhone] = useState(contact?.phone ?? '');
  const [relationship, setRelationship] = useState(contact?.relationship ?? 'Hija');

  const saveContact = () => {
    onSave({
      id: contact?.id ?? Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
      relationship,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onCancel} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
          <Text style={[styles.backText, { fontSize: 16 * scale }]}>Contactos</Text>
        </Pressable>

        <Card style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-add-outline" size={34} color="#fff" />
          </View>
          <Text style={[styles.title, { fontSize: 24 * scale }]}>{contact ? 'Editar contacto' : 'Nuevo contacto'}</Text>
          <Text style={[styles.subtitle, { fontSize: 14 * scale }]}>Guarda una persona de confianza para pedir ayuda rápido.</Text>

          <View style={styles.form}>
            <FormInput label="Nombre" icon="person-outline" value={name} onChangeText={setName} placeholder="Ej: María García" />
            <OptionPicker label="Parentesco" value={relationship} onChange={setRelationship} options={relationshipOptions} />
            <FormInput
              label="Teléfono"
              icon="call-outline"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="Ej: +52 664 123 4567"
            />
          </View>

          <View style={styles.actions}>
            <AppButton title={contact ? 'Actualizar' : 'Guardar'} disabled={!name || !phone} onPress={saveContact} style={styles.flex} />
            <AppButton title="Cancelar" variant="outline" onPress={onCancel} style={styles.flex} />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  backButton: {
    position: 'absolute',
    top: 14,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  backText: {
    color: '#fff',
    fontWeight: '900',
  },
  card: {
    gap: 14,
    padding: 18,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  title: {
    color: colors.primary,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    gap: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  flex: {
    flex: 1,
  },
});
