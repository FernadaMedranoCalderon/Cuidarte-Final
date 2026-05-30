export type ActivityType = 'medication' | 'appointment' | 'exercise' | 'social' | 'other';
export type EvidenceType = 'photo' | 'button' | 'location' | 'none';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Activity {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time: string;
  type: ActivityType;
  completed: boolean;
  evidenceRequired: EvidenceType;
  evidencePhoto?: string;
  evidenceLocation?: {
    latitude: number;
    longitude: number;
    label?: string;
    accuracy?: number | null;
  };
  justification?: string;
  repeat: RepeatType;
  repeatDays?: string[];
}
