import React from 'react';
import { OptionPicker } from '@/modules/senior/screens/shared/OptionPicker';

export function ActivityFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <OptionPicker
      label="Filtro"
      value={value}
      onChange={onChange}
      options={[
        { value: 'all', label: 'Todas' },
        { value: 'pending', label: 'Pendientes' },
        { value: 'completed', label: 'Completadas' },
      ]}
    />
  );
}
