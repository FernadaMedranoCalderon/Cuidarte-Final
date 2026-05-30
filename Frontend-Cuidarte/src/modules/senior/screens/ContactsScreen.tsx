import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Contact } from '@/types';
import { AppButton } from '@/common/components/AppButton';
import { AppModal } from '@/common/components/AppModal';
import { Card } from '@/common/components/Card';
import { EmptyState } from '@/common/components/EmptyState';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { getTextScale, useAppStore } from '@/store/AppStore';

type ContactsScreenProps = {
  contacts: Contact[];
  onCreate: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
};

export function ContactsScreen({ contacts, onCreate, onEdit, onDelete }: ContactsScreenProps) {
  const { appearance } = useAppStore();
  const scale = getTextScale(appearance.textSize);
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null);
  const [query, setQuery] = useState('');

  const callContact = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openWhatsApp = (phoneNumber: string) => {
    const digits = phoneNumber.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${digits}`);
  };

  return (
    <Screen scroll={false}>
      <View style={styles.page}>
        <View>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { fontSize: 24 * scale }]}>Contactos</Text>
            <Text style={[styles.headerText, { fontSize: 15 * scale }]}>Personas de confianza para pedir ayuda rápidamente.</Text>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color={colors.muted} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Buscar contactos"
                placeholderTextColor={colors.muted}
                value={query}
                onChangeText={setQuery}
                style={[styles.searchInput, { fontSize: 16 * scale }]}
              />
            </View>
          </View>

          <AppButton
            title="Agregar contacto"
            onPress={onCreate}
            leftIcon={<Ionicons name="person-add-outline" size={22} color="#fff" />}
            style={styles.addButton}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Card style={styles.listCard}>
            <Text style={[styles.sectionTitle, { fontSize: 20 * scale }]}>Mis contactos</Text>
            {contacts.length === 0 ? (
              <EmptyState text="Aún no tienes contactos guardados" />
            ) : (
              contacts
                .filter(c => {
                  const q = query.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    c.name.toLowerCase().includes(q) ||
                    (c.relationship || '').toLowerCase().includes(q) ||
                    c.phone.toLowerCase().includes(q)
                  );
                })
                .map(contact => (
                <View key={contact.id} style={styles.contactCard}>
                  <View style={styles.contactTop}>
                    <View style={styles.contactIcon}>
                      <Ionicons name="person-outline" size={28} color={colors.primary} />
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={[styles.contactName, { fontSize: 18 * scale }]}>{contact.name}</Text>
                      <Text style={[styles.contactMeta, { fontSize: 13 * scale }]}>{contact.relationship || 'Contacto de apoyo'}</Text>
                      <Text style={[styles.contactPhone, { fontSize: 13 * scale }]}>{contact.phone}</Text>
                    </View>
                    <View style={styles.rowActions}>
                      <Pressable onPress={() => onEdit(contact)} style={styles.iconButton}>
                        <Ionicons name="create-outline" size={26} color={colors.surface} />
                      </Pressable>
                      <Pressable onPress={() => setDeleteContact(contact)} style={[styles.iconButton, { backgroundColor: '#fee2e2' }]}>
                        <Ionicons name="trash-outline" size={26} color={colors.danger} />
                      </Pressable>
                    </View>
                  </View>
                  <View style={styles.contactActions}>
                    <AppButton
                      title="Llamar"
                      onPress={() => callContact(contact.phone)}
                      leftIcon={<Ionicons name="call-outline" size={20} color="#fff" />}
                      style={styles.flex}
                    />
                    <AppButton
                      title="WhatsApp"
                      onPress={() => openWhatsApp(contact.phone)}
                      variant="outline"
                      leftIcon={<Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />}
                      style={styles.flex}
                    />
                  </View>
                </View>
              ))
            )}
          </Card>

          <AppModal visible={Boolean(deleteContact)} onClose={() => setDeleteContact(null)}>
        <Card style={styles.deleteCard}>
          <View style={styles.deleteIcon}>
            <Ionicons name="trash-outline" size={36} color={colors.danger} />
          </View>
          <Text style={styles.deleteTitle}>¿Eliminar contacto?</Text>
          <Text style={styles.deleteText}>Esta acción no se puede deshacer.</Text>
          <View style={styles.deleteActions}>
            <AppButton
              title="Eliminar"
              variant="danger"
              onPress={() => {
                if (deleteContact) {
                  onDelete(deleteContact.id);
                }
                setDeleteContact(null);
              }}
              style={styles.deleteActionButton}
            />
            <AppButton title="Cancelar" variant="outline" onPress={() => setDeleteContact(null)} style={styles.deleteActionButton} />
          </View>
        </Card>
          </AppModal>
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    marginHorizontal: -12,
    marginTop: -12,
    marginBottom: 12,
    padding: 16,
  },
  headerTitle: {
    color: colors.primary,
    fontWeight: '900',
  },
  headerText: {
    color: colors.muted,
    marginTop: 4,
  },
  page: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  addButton: {
    minHeight: 58,
    borderRadius: 18,
    marginBottom: 12,
  },
  listCard: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.primary,
    fontWeight: '900',
  },
  flex: {
    flex: 1,
  },
  contactCard: {
    borderWidth: 2,
    borderColor: 'rgba(69,136,128,0.18)',
    borderRadius: 16,
    padding: 12,
    gap: 12,
    backgroundColor: '#fff',
  },
  contactTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(69,136,128,0.12)',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: colors.text,
    fontWeight: '900',
  },
  contactMeta: {
    color: colors.primary,
    fontWeight: '800',
    marginTop: 2,
  },
  contactPhone: {
    color: colors.muted,
    marginTop: 3,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 2,
  },
  smallIconButton: {
    padding: 6,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginLeft: 6,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    padding: 0,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteCard: {
    alignItems: 'center',
    gap: 12,
  },
  deleteIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteTitle: {
    color: colors.danger,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  deleteText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  deleteActions: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  deleteActionButton: {
    flex: 1,
  },
});
