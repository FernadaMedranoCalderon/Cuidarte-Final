import type { Activity, AppNotification, Contact, Medication, User } from '@/types';

export type DemoCredentials = {
  email: string;
  password: string;
};

export type DemoSeed = {
  credentials: DemoCredentials;
  user: User;
  activities: Activity[];
  contacts?: Contact[];
  medications: Medication[];
  notifications: AppNotification[];
};