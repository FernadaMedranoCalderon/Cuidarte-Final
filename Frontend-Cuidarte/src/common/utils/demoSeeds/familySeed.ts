import type { DemoSeed } from '../demoSeedTypes';
import { seniorDemoSeed } from './seniorSeed';
import { buildFamilyNotifications } from './sharedDemoData';

const cloneActivities = () => seniorDemoSeed.activities.map(activity => ({ ...activity }));
const cloneMedications = () => seniorDemoSeed.medications.map(medication => ({ ...medication }));

export const familyDemoSeed: DemoSeed = {
  credentials: {
    email: 'familiar.demo@cuidarte.app',
    password: 'CuidarteFamily123',
  },
  user: {
    id: 'demo-family',
    email: 'familiar.demo@cuidarte.app',
    name: 'Luis García',
    role: 'family',
    linkedUserId: 'demo-senior',
  },
  activities: cloneActivities(),
  medications: cloneMedications(),
  notifications: buildFamilyNotifications(),
};