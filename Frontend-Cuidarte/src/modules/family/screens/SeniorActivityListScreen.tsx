import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from '@/common/components/Card';
import { EmptyState } from '@/common/components/EmptyState';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { SimpleActivityCard } from '@/modules/senior/components/SimpleActivityCard';
import { ActivityFilter } from '../components/ActivityFilter';
import { useSeniorSync } from '../hooks/useSeniorSync';

export function SeniorActivityListScreen() {
  const [filter, setFilter] = useState('all');
  const { activities } = useSeniorSync();
  const filtered = activities.filter(activity => {
    if (filter === 'pending') return !activity.completed;
    if (filter === 'completed') return activity.completed;
    return true;
  });

  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Lista de actividades</Text>
        <ActivityFilter value={filter} onChange={setFilter} />
        {filtered.length === 0 ? <EmptyState text="No hay actividades con este filtro" /> : filtered.map(activity => <SimpleActivityCard key={activity.id} activity={activity} />)}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  title: { color: colors.primary, fontSize: 20, fontWeight: '900' },
});
