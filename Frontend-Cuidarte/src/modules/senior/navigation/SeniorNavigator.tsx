import React, { useState } from 'react';
import type { Activity, Contact } from '@/types';
import { BottomTabs, type TabItem } from '@/common/components/BottomTabs';
import { useAppStore } from '@/store/AppStore';
import { AccessibilitySettingsScreen } from '../screens/AccessibilitySettingsScreen';
import { ActivityFormScreen } from '../screens/ActivityFormScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { ContactFormScreen } from '../screens/ContactFormScreen';
import { ContactsScreen } from '../screens/ContactsScreen';
import { HomeScreen } from '../screens/HomeScreen';
// Tutorial screen removed from profile; guide handling disabled

type SeniorTab = 'home' | 'calendar' | 'contacts' | 'profile';

const tabs: TabItem<SeniorTab>[] = [
  { key: 'home', label: 'Inicio', icon: 'home-outline' },
  { key: 'calendar', label: 'Calendario', icon: 'calendar-outline' },
  { key: 'contacts', label: 'Contactos', icon: 'people-outline' },
  { key: 'profile', label: 'Perfil', icon: 'person-outline' },
];

export function SeniorNavigator() {
  const { user, setUser } = useAppStore();
  const [tab, setTab] = useState<SeniorTab>('home');
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>();
  const [showForm, setShowForm] = useState(false);
  
  const [evidenceVisible, setEvidenceVisible] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const [showContactForm, setShowContactForm] = useState(false);

  if (showForm) {
    return <ActivityFormScreen activity={editingActivity} onDone={() => setShowForm(false)} />;
  }

  

  if (showContactForm) {
    return (
      <ContactFormScreen
        contact={editingContact}
        onCancel={() => {
          setEditingContact(undefined);
          setShowContactForm(false);
        }}
        onSave={contact => {
          setContacts(current =>
            editingContact ? current.map(item => (item.id === contact.id ? contact : item)) : [...current, contact],
          );
          setEditingContact(undefined);
          setShowContactForm(false);
        }}
      />
    );
  }

  const footer = <BottomTabs items={tabs} active={tab} onChange={setTab} />;

  if (tab === 'home') {
    return (
      <>
        <HomeScreen
          contacts={contacts}
          onCreate={activity => {
            setEditingActivity(activity);
            setShowForm(true);
          }}
          onEvidenceVisibleChange={v => setEvidenceVisible(v)}
        />
        {!evidenceVisible && footer}
      </>
    );
  }

  if (tab === 'calendar') {
    return (
      <>
        <CalendarScreen
          onCreate={activity => {
            setEditingActivity(activity);
            setShowForm(true);
          }}
        />
        {footer}
      </>
    );
  }

  if (tab === 'contacts') {
    return (
      <>
        <ContactsScreen
          contacts={contacts}
          onCreate={() => {
            setEditingContact(undefined);
            setShowContactForm(true);
          }}
          onEdit={contact => {
            setEditingContact(contact);
            setShowContactForm(true);
          }}
          onDelete={contactId => setContacts(current => current.filter(contact => contact.id !== contactId))}
        />
        {footer}
      </>
    );
  }

  return (
    <>
      <AccessibilitySettingsScreen onLogout={() => setUser(null)} />
      {footer}
    </>
  );
}
