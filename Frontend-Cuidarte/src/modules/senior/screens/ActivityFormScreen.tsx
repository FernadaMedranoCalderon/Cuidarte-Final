import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Activity, ActivityType, EvidenceType, RepeatType } from '@/types';
import { AppButton } from '@/common/components/AppButton';
import { FormInput } from '@/common/components/FormInput';
import { colors } from '@/common/styles/theme';
import { activityLabels } from '@/common/utils/constants';
import { parseLocalDate } from '@/common/utils/date';
import { getTextScale, useAppStore } from '@/store/AppStore';
import { useSeniorActivities } from '../hooks/useSeniorActivities';
import { OptionPicker } from './shared/OptionPicker';

const weekLabels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const customWeekDays = [
  { value: 'sunday', label: 'D' },
  { value: 'monday', label: 'L' },
  { value: 'tuesday', label: 'M' },
  { value: 'wednesday', label: 'M' },
  { value: 'thursday', label: 'J' },
  { value: 'friday', label: 'V' },
  { value: 'saturday', label: 'S' },
];

const padTime = (value: number) => value.toString().padStart(2, '0');
const parseTime = (value: string) => {
  const [hour = '09', minute = '00'] = value.split(':');
  return {
    hour: Number(hour),
    minute: Number(minute),
  };
};

export function ActivityFormScreen({ activity, onDone }: { activity?: Activity; onDone: () => void }) {
  const { appearance } = useAppStore();
  const scale = getTextScale(appearance.textSize);
  const { setActivities, saveActivity } = useSeniorActivities();
  const [title, setTitle] = useState(activity?.title ?? '');
  const [description, setDescription] = useState(activity?.description ?? '');
  const [date, setDate] = useState(format(activity?.date ?? new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(activity?.time ?? '09:00');
  const [openPicker, setOpenPicker] = useState<'date' | 'time' | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(parseLocalDate(date));
  const [type, setType] = useState<ActivityType>(activity?.type ?? 'medication');
  const [repeat, setRepeat] = useState<RepeatType>(activity?.repeat ?? 'none');
  const [repeatDays, setRepeatDays] = useState<string[]>(activity?.repeatDays ?? []);
  const initialEvidence = activity?.evidenceRequired === 'none' ? 'button' : activity?.evidenceRequired ?? 'button';
  const [evidenceRequired, setEvidenceRequired] = useState<EvidenceType>(initialEvidence);

  const toggleRepeatDay = (day: string) => {
    setRepeatDays(current => (current.includes(day) ? current.filter(item => item !== day) : [...current, day]));
  };

  const save = () => {
    const next: Activity = {
      id: activity?.id ?? Date.now().toString(),
      title,
      description,
      date: parseLocalDate(date),
      time,
      type,
      completed: activity?.completed ?? false,
      repeat,
      repeatDays: repeat === 'custom' ? repeatDays : undefined,
      evidenceRequired,
    };
    // save to backend
    (async () => {
      const saved = await saveActivity(next);
      if (saved) onDone();
    })();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={onDone} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={colors.primary} />
          <Text style={[styles.backText, { fontSize: 16 * scale }]}>Actividades</Text>
        </Pressable>

        <View style={styles.formContainer}>
          <Text style={[styles.title, { fontSize: 24 * scale }]}>{activity ? 'Editar actividad' : 'Nueva actividad'}</Text>

          <View style={styles.form}>
            <FormInput label="Nombre" value={title} onChangeText={setTitle} placeholder="Ej: Tomar medicamento" />
            <FormInput label="Descripción" value={description} onChangeText={setDescription} placeholder="Detalle opcional" />
            <View style={styles.row}>
              <DateTimeSelectButton
                label="Fecha"
                value={format(parseLocalDate(date), "d 'de' MMM", { locale: es })}
                icon="calendar-outline"
                active={openPicker === 'date'}
                onPress={() => setOpenPicker(current => (current === 'date' ? null : 'date'))}
              />
              <DateTimeSelectButton
                label="Hora"
                value={time}
                icon="time-outline"
                active={openPicker === 'time'}
                onPress={() => setOpenPicker(current => (current === 'time' ? null : 'time'))}
              />
            </View>
            {openPicker === 'date' ? (
              <MiniCalendar
                month={calendarMonth}
                selectedDate={parseLocalDate(date)}
                onPrevious={() => setCalendarMonth(current => subMonths(current, 1))}
                onNext={() => setCalendarMonth(current => addMonths(current, 1))}
                onSelect={selectedDate => {
                  setDate(format(selectedDate, 'yyyy-MM-dd'));
                  setCalendarMonth(selectedDate);
                  setOpenPicker(null);
                }}
              />
            ) : null}
            {openPicker === 'time' ? <TimePicker selectedTime={time} onChange={setTime} onDone={() => setOpenPicker(null)} /> : null}
            <OptionPicker
              label="Tipo"
              value={type}
              onChange={value => setType(value as ActivityType)}
              options={Object.entries(activityLabels).map(([value, label]) => ({ value, label }))}
            />
            <OptionPicker
              label="Evidencia"
              value={evidenceRequired}
              onChange={value => setEvidenceRequired(value as EvidenceType)}
              options={[
                { value: 'button', label: 'Botón' },
                { value: 'photo', label: 'Foto' },
                { value: 'location', label: 'Ubicación' },
              ]}
            />
            <OptionPicker
              label="Repetir"
              value={repeat}
              onChange={value => {
                setRepeat(value as RepeatType);
                if (value !== 'custom') setRepeatDays([]);
              }}
              options={[
                { value: 'none', label: 'No' },
                { value: 'daily', label: 'Diario' },
                { value: 'monthly', label: 'Mensual' },
                { value: 'custom', label: 'Personalizado' },
              ]}
            />
            {repeat === 'custom' ? <WeekdayPicker selectedDays={repeatDays} onToggle={toggleRepeatDay} /> : null}
          </View>

          <View style={styles.actions}>
            <AppButton
              title={activity ? 'Actualizar' : 'Crear'}
              disabled={!title}
              onPress={save}
              style={styles.flex}
              textStyle={[styles.primaryButtonText, { fontSize: 20 * scale }]}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DateTimeSelectButton({
  label,
  value,
  icon,
  active,
  onPress,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}) {
  const { appearance } = useAppStore();
  const scale = getTextScale(appearance.textSize);

  return (
    <Pressable onPress={onPress} style={[styles.dateTimeButton, active && styles.dateTimeButtonActive]}>
      <View style={styles.dateTimeLabelRow}>
        <Ionicons name={icon} size={22 * scale} color={active ? '#fff' : colors.primary} />
        <Text style={[styles.dateTimeLabel, { fontSize: 16 * scale }, active && styles.dateTimeTextActive]}>{label}</Text>
      </View>
      <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.dateTimeValue, { fontSize: 20 * scale }, active && styles.dateTimeTextActive]}>
        {value}
      </Text>
    </Pressable>
  );
}

function MiniCalendar({
  month,
  selectedDate,
  onPrevious,
  onNext,
  onSelect,
}: {
  month: Date;
  selectedDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (date: Date) => void;
}) {
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  const emptyDays = Array.from({ length: startOfMonth(month).getDay() });

  return (
    <View style={styles.pickerPanel}>
      <View style={styles.pickerHeader}>
        <Pressable onPress={onPrevious} style={styles.pickerArrow}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </Pressable>
        <Text style={styles.pickerTitle}>{format(month, 'MMMM yyyy', { locale: es })}</Text>
        <Pressable onPress={onNext} style={styles.pickerArrow}>
          <Ionicons name="chevron-forward" size={26} color="#fff" />
        </Pressable>
      </View>
      <View style={styles.weekRow}>
        {weekLabels.map((label, index) => (
          <Text key={`${label}-${index}`} style={styles.weekLabel}>{label}</Text>
        ))}
      </View>
      <View style={styles.calendarGrid}>
        {emptyDays.map((_, index) => <View key={`empty-${index}`} style={styles.calendarDay} />)}
        {days.map(day => {
          const selected = isSameDay(day, selectedDate);
          return (
            <Pressable key={day.toISOString()} onPress={() => onSelect(day)} style={[styles.calendarDay, selected && styles.calendarDaySelected]}>
              <Text style={[styles.calendarDayText, selected && styles.calendarDayTextSelected]}>{format(day, 'd')}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function TimePicker({ selectedTime, onChange, onDone }: { selectedTime: string; onChange: (time: string) => void; onDone: () => void }) {
  const { hour, minute } = parseTime(selectedTime);
  const setHour = (nextHour: number) => onChange(`${padTime((nextHour + 24) % 24)}:${padTime(minute)}`);
  const setMinute = (nextMinute: number) => onChange(`${padTime(hour)}:${padTime((nextMinute + 60) % 60)}`);

  return (
    <View style={styles.pickerPanel}>
      <Text style={styles.pickerTitle}>Selecciona una hora</Text>
      <View style={styles.spinnerRow}>
        <TimeSpinnerColumn label="Hora" value={padTime(hour)} onUp={() => setHour(hour + 1)} onDown={() => setHour(hour - 1)} />
        <Text style={styles.timeSeparator}>:</Text>
        <TimeSpinnerColumn label="Minutos" value={padTime(minute)} onUp={() => setMinute(minute + 5)} onDown={() => setMinute(minute - 5)} />
      </View>
      <AppButton title="Listo" onPress={onDone} variant="outline" textStyle={{ fontSize: 20 }} />
    </View>
  );
}

function TimeSpinnerColumn({ label, value, onUp, onDown }: { label: string; value: string; onUp: () => void; onDown: () => void }) {
  return (
    <View style={styles.spinnerColumn}>
      <Text style={styles.spinnerLabel}>{label}</Text>
      <Pressable onPress={onUp} style={styles.spinnerArrow}>
        <Ionicons name="chevron-up" size={34} color="#fff" />
      </Pressable>
      <View style={styles.spinnerValueBox}>
        <Text style={styles.spinnerValue}>{value}</Text>
      </View>
      <Pressable onPress={onDown} style={styles.spinnerArrow}>
        <Ionicons name="chevron-down" size={34} color="#fff" />
      </Pressable>
    </View>
  );
}

function WeekdayPicker({ selectedDays, onToggle }: { selectedDays: string[]; onToggle: (day: string) => void }) {
  return (
    <View style={styles.weekdayPanel}>
      <Text style={styles.weekdayTitle}>Elige los días</Text>
      <View style={styles.weekdayRow}>
        {customWeekDays.map(day => {
          const selected = selectedDays.includes(day.value);
          return (
            <Pressable key={day.value} onPress={() => onToggle(day.value)} style={[styles.weekdayButton, selected && styles.weekdayButtonSelected]}>
              <Text style={[styles.weekdayText, selected && styles.weekdayTextSelected]}>{day.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 16,
    paddingTop: 72,
    paddingBottom: 24,
  },
  backButton: {
    position: 'absolute',
    top: 14,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  backText: {
    color: '#fff',
    fontWeight: '900',
  },
  formContainer: {
    flex: 1,
    width: '100%',
    gap: 18,
    padding: 20,
  },
  title: {
    color: colors.text,
    fontWeight: '900',
    textAlign: 'left',
    width: '100%',
    fontSize: 28,
  },
  subtitle: {
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 18,
  },
  form: {
    gap: 14,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  dateTimeButton: {
    flex: 1,
    minHeight: 88,
    borderWidth: 2,
    borderColor: 'rgba(69,136,128,0.18)',
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  dateTimeButtonActive: {
    backgroundColor: '#fff',
    borderColor: colors.primary,
  },
  dateTimeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dateTimeLabel: {
    color: colors.primary,
    fontWeight: '900',
  },
  dateTimeValue: {
    color: colors.text,
    fontWeight: '900',
  },
  dateTimeTextActive: {
    color: colors.text,
  },
  pickerPanel: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 18,
    backgroundColor: colors.primary,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerArrow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  pickerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekLabel: {
    flex: 1,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 5,
  },
  calendarDay: {
    width: `${100 / 7}%`,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  calendarDaySelected: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  calendarDayText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  calendarDayTextSelected: {
    color: '#fff',
  },
  spinnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  spinnerColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  spinnerLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
  spinnerArrow: {
    width: 68,
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  spinnerValueBox: {
    minWidth: 96,
    minHeight: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  spinnerValue: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
  },
  timeSeparator: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    marginTop: 26,
  },
  weekdayPanel: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 18,
    backgroundColor: colors.primary,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  weekdayTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  weekdayRow: {
    flexDirection: 'row',
    gap: 10,
  },
  weekdayButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  weekdayButtonSelected: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderColor: 'rgba(255,255,255,0.42)',
  },
  weekdayText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
  },
  weekdayTextSelected: {
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 'auto',
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '900',
  },
});
