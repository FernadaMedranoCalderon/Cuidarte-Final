import React, { useState } from 'react';
import type { Activity } from '@/types';
import { StyleSheet } from 'react-native';
import { BottomTabs, type TabItem } from '@/common/components/BottomTabs';
import { useAppStore } from '@/store/AppStore';
import { AlertRulesScreen } from '../screens/AlertRulesScreen';
import { ActivityFormScreen } from '@/modules/senior/screens/ActivityFormScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { HealthSectionScreen } from '../screens/HealthSectionScreen';
import { LinkSeniorScreen } from '../screens/LinkSeniorScreen';
import { LocationTrackingScreen } from '../screens/LocationTrackingScreen';
import { MedicationsScreen } from '../screens/MedicationsScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { SeniorActivityListScreen } from '../screens/SeniorActivityListScreen';
import { SeniorCalendarScreen } from '../screens/SeniorCalendarScreen';
import { ValidationConfigScreen } from '../screens/ValidationConfigScreen';
import { FamilyProfileScreen } from '../screens/FamilyProfileScreen';

type FamilyTab = 'home' | 'calendar' | 'reports' | 'profile';

const tabs: TabItem<FamilyTab>[] = [
  { key: 'home', label: 'Inicio', icon: 'home-outline' },
  { key: 'calendar', label: 'Calendario', icon: 'calendar-outline' },
  { key: 'reports', label: 'Análisis', icon: 'bar-chart-outline' },
  { key: 'profile', label: 'Perfil', icon: 'person-outline' },
];

type ExtraView = 'notifications' | 'link' | 'activities' | 'location' | 'health' | 'medications' | 'validation' | 'alerts' | null;

export function FamilyNavigator() {
  const { setUser } = useAppStore();
  const [tab, setTab] = useState<FamilyTab>('home');
  const [extra, setExtra] = useState<ExtraView>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>();
  const [showForm, setShowForm] = useState(false);
  const footer = <BottomTabs items={tabs} active={tab} onChange={value => { setExtra(null); setTab(value); }} />;

  if (showForm) {
    return <ActivityFormScreen activity={editingActivity} onDone={() => setShowForm(false)} />;
  }

  if (extra === 'notifications') return <><NotificationsScreen onBack={() => setExtra(null)} />{footer}</>;
  if (extra === 'link') return <><LinkSeniorScreen onDone={() => setExtra(null)} />{footer}</>;
  if (extra === 'activities') return <><SeniorActivityListScreen />{footer}</>;
  if (extra === 'location') return <><LocationTrackingScreen />{footer}</>;
  if (extra === 'health') return <><HealthSectionScreen />{footer}</>;
  if (extra === 'medications') return <><MedicationsScreen />{footer}</>;
  if (extra === 'validation') return <><ValidationConfigScreen />{footer}</>;
  if (extra === 'alerts') return <><AlertRulesScreen />{footer}</>;

  if (tab === 'home') {
    return (
      <>
        <DashboardScreen
          onNotifications={() => setExtra('notifications')}
          onCreate={activity => {
            setEditingActivity(activity);
            setShowForm(true);
          }}
        />
        {footer}
      </>
    );
  }
  if (tab === 'calendar') return <><SeniorCalendarScreen />{footer}</>;
  if (tab === 'reports') return <><ReportsScreen />{footer}</>;
  if (tab === 'profile') return <><FamilyProfileScreen />{footer}</>;

  return <>{footer}</>;
}

const styles = StyleSheet.create({
});
