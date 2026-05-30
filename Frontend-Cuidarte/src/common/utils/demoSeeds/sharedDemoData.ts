import type { AppNotification, Activity, Contact, Medication } from '@/types';

const cloneDate = (date: Date) => new Date(date.getTime());

function buildDate(offsetDays: number) {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate() + offsetDays);
}

function addActivity(
  list: Activity[],
  {
    id,
    title,
    description,
    offsetDays,
    time,
    type,
    completed,
    evidenceRequired,
    repeat,
    evidencePhoto,
    justification,
  }: {
    id: string;
    title: string;
    description: string;
    offsetDays: number;
    time: string;
    type: Activity['type'];
    completed: boolean;
    evidenceRequired: Activity['evidenceRequired'];
    repeat: Activity['repeat'];
    evidencePhoto?: string;
    justification?: string;
  },
) {
  list.push({
    id,
    title,
    description,
    date: cloneDate(buildDate(offsetDays)),
    time,
    type,
    completed,
    evidenceRequired,
    repeat,
    ...(evidencePhoto ? { evidencePhoto } : {}),
    ...(justification ? { justification } : {}),
  });
}

export function buildSharedActivities() {
  const activities: Activity[] = [];

  addActivity(activities, {
    id: 'demo-s-1',
    title: 'Tomar medicamento',
    description: 'Losartán 50mg y vitamina D',
    offsetDays: -5,
    time: '08:00',
    type: 'medication',
    completed: true,
    evidenceRequired: 'button',
    repeat: 'daily',
    evidencePhoto: 'photo-simulated',
  });
  addActivity(activities, {
    id: 'demo-s-2',
    title: 'Caminar 15 minutos',
    description: 'Paseo ligero por la mañana',
    offsetDays: -5,
    time: '10:30',
    type: 'exercise',
    completed: false,
    evidenceRequired: 'location',
    repeat: 'daily',
  });
  addActivity(activities, {
    id: 'demo-s-3',
    title: 'Desayuno saludable',
    description: 'Avena, fruta y té sin azúcar',
    offsetDays: -4,
    time: '07:30',
    type: 'other',
    completed: true,
    evidenceRequired: 'photo',
    repeat: 'daily',
    evidencePhoto: 'photo-simulated',
  });
  addActivity(activities, {
    id: 'demo-s-4',
    title: 'Llamar a la familia',
    description: 'Seguimiento diario',
    offsetDays: -4,
    time: '18:00',
    type: 'social',
    completed: true,
    evidenceRequired: 'button',
    repeat: 'none',
  });
  addActivity(activities, {
    id: 'demo-s-5',
    title: 'Toma de presión',
    description: 'Control en casa',
    offsetDays: -3,
    time: '08:40',
    type: 'other',
    completed: true,
    evidenceRequired: 'button',
    repeat: 'weekly',
  });
  addActivity(activities, {
    id: 'demo-s-6',
    title: 'Llamada con el médico',
    description: 'Seguimiento por teléfono',
    offsetDays: -3,
    time: '12:15',
    type: 'appointment',
    completed: true,
    evidenceRequired: 'button',
    repeat: 'none',
  });
  addActivity(activities, {
    id: 'demo-s-7',
    title: 'Ejercicios de respiración',
    description: 'Rutina guiada de relajación',
    offsetDays: -3,
    time: '16:00',
    type: 'exercise',
    completed: true,
    evidenceRequired: 'location',
    repeat: 'daily',
  });
  addActivity(activities, {
    id: 'demo-s-8',
    title: 'Tomar medicamento',
    description: 'Losartán 50mg',
    offsetDays: -2,
    time: '08:00',
    type: 'medication',
    completed: true,
    evidenceRequired: 'button',
    repeat: 'daily',
    evidencePhoto: 'photo-simulated',
  });
  addActivity(activities, {
    id: 'demo-s-9',
    title: 'Caminar con la vecina',
    description: 'Paseo de media mañana',
    offsetDays: -2,
    time: '11:00',
    type: 'exercise',
    completed: true,
    evidenceRequired: 'location',
    repeat: 'daily',
  });
  addActivity(activities, {
    id: 'demo-s-10',
    title: 'Lectura y memoria',
    description: 'Actividad cognitiva de 20 minutos',
    offsetDays: -2,
    time: '17:30',
    type: 'social',
    completed: true,
    evidenceRequired: 'button',
    repeat: 'weekly',
  });
  addActivity(activities, {
    id: 'demo-s-11',
    title: 'Desayuno saludable',
    description: 'Avena, fruta y té sin azúcar',
    offsetDays: -1,
    time: '07:30',
    type: 'other',
    completed: true,
    evidenceRequired: 'photo',
    repeat: 'daily',
    evidencePhoto: 'photo-simulated',
  });
  addActivity(activities, {
    id: 'demo-s-12',
    title: 'Tomar medicamento',
    description: 'Vitamina D',
    offsetDays: -1,
    time: '20:00',
    type: 'medication',
    completed: true,
    evidenceRequired: 'button',
    repeat: 'daily',
    evidencePhoto: 'photo-simulated',
  });
  addActivity(activities, {
    id: 'demo-s-13',
    title: 'Tomar medicamento',
    description: 'Losartán 50mg y control de glucosa',
    offsetDays: 0,
    time: '08:00',
    type: 'medication',
    completed: true,
    evidenceRequired: 'button',
    repeat: 'daily',
    evidencePhoto: 'photo-simulated',
  });
  addActivity(activities, {
    id: 'demo-s-14',
    title: 'Desayuno saludable',
    description: 'Fruta, avena y café descafeinado',
    offsetDays: 0,
    time: '07:20',
    type: 'other',
    completed: true,
    evidenceRequired: 'photo',
    repeat: 'daily',
    evidencePhoto: 'photo-simulated',
  });
  addActivity(activities, {
    id: 'demo-s-15',
    title: 'Caminar 20 minutos',
    description: 'Rutina al aire libre',
    offsetDays: 0,
    time: '10:30',
    type: 'exercise',
    completed: true,
    evidenceRequired: 'location',
    repeat: 'daily',
  });
  addActivity(activities, {
    id: 'demo-s-16',
    title: 'Llamar a la familia',
    description: 'Puesta al día con la hija',
    offsetDays: 0,
    time: '18:00',
    type: 'social',
    completed: true,
    evidenceRequired: 'button',
    repeat: 'none',
  });
  addActivity(activities, {
    id: 'demo-s-17',
    title: 'Cita con cardiólogo',
    description: 'Consulta de seguimiento',
    offsetDays: 1,
    time: '11:00',
    type: 'appointment',
    completed: false,
    evidenceRequired: 'photo',
    repeat: 'none',
  });
  addActivity(activities, {
    id: 'demo-s-18',
    title: 'Llamada con el médico',
    description: 'Seguimiento por teléfono',
    offsetDays: 2,
    time: '12:15',
    type: 'appointment',
    completed: false,
    evidenceRequired: 'button',
    repeat: 'none',
  });
  addActivity(activities, {
    id: 'demo-s-19',
    title: 'Ejercicios de respiración',
    description: 'Rutina guiada de relajación',
    offsetDays: 3,
    time: '09:20',
    type: 'exercise',
    completed: false,
    evidenceRequired: 'location',
    repeat: 'weekly',
  });
  addActivity(activities, {
    id: 'demo-s-20',
    title: 'Revisión de presión',
    description: 'Control semanal en casa',
    offsetDays: 7,
    time: '08:40',
    type: 'other',
    completed: false,
    evidenceRequired: 'button',
    repeat: 'weekly',
  });

  return activities.sort((left, right) => {
    const dateDelta = left.date.getTime() - right.date.getTime();
    if (dateDelta !== 0) return dateDelta;
    return left.time.localeCompare(right.time);
  });
}

export function buildSharedMedications() {
  return [
    {
      id: 'demo-med-1',
      name: 'Losartán',
      dosage: '50mg',
      frequency: 'Diario',
      timing: 'before',
      times: ['08:00', '20:00'],
      stock: 12,
      minStock: 5,
    },
    {
      id: 'demo-med-2',
      name: 'Vitamina D',
      dosage: '1000 UI',
      frequency: 'Semanal',
      timing: 'after',
      times: ['09:00'],
      stock: 4,
      minStock: 3,
    },
  ] as Medication[];
}

export function buildSharedContacts() {
  return [
    {
      id: 'demo-contact-1',
      name: 'María García',
      phone: '+52 664 123 4567',
      relationship: 'Hija',
    },
    {
      id: 'demo-contact-2',
      name: 'Carlos García',
      phone: '+52 664 234 5678',
      relationship: 'Hijo',
    },
    {
      id: 'demo-contact-3',
      name: 'Ana Torres',
      phone: '+52 664 345 6789',
      relationship: 'Nieta',
    },
    {
      id: 'demo-contact-4',
      name: 'Dr. José Ramírez',
      phone: '+52 664 456 7890',
      relationship: 'Médico',
    },
    {
      id: 'demo-contact-5',
      name: 'Lucía Hernández',
      phone: '+52 664 567 8901',
      relationship: 'Vecina',
    },
    {
      id: 'demo-contact-6',
      name: 'Pedro Sánchez',
      phone: '+52 664 678 9012',
      relationship: 'Hermano',
    },
  ] as Contact[];
}

export function buildSeniorNotifications(): AppNotification[] {
  return [
    {
      id: 'demo-sn-1',
      type: 'success',
      message: 'Tu familiar recibió la evidencia de la actividad de hoy',
      time: 'Hace 3 min',
      read: false,
    },
    {
      id: 'demo-sn-2',
      type: 'alert',
      message: 'Actividad pendiente: Cita con cardiólogo',
      time: 'Hace 20 min',
      read: false,
    },
    {
      id: 'demo-sn-3',
      type: 'info',
      message: 'Se compartió tu ubicación con la familia',
      time: 'Hace 1 hora',
      read: true,
    },
  ];
}

export function buildFamilyNotifications(): AppNotification[] {
  return [
    {
      id: 'demo-fn-1',
      type: 'success',
      message: 'Doña Carmen completó: Tomar medicamento',
      time: 'Hace 3 min',
      read: false,
    },
    {
      id: 'demo-fn-2',
      type: 'alert',
      message: 'Actividad pendiente: Cita con cardiólogo',
      time: 'Hace 20 min',
      read: false,
    },
    {
      id: 'demo-fn-3',
      type: 'info',
      message: 'Se compartió la ubicación del adulto mayor',
      time: 'Hace 1 hora',
      read: true,
    },
  ];
}
