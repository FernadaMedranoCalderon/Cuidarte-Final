import type { UserRole } from '@/types';
import type { DemoSeed } from './demoSeedTypes';
import { familyDemoSeed } from './demoSeeds/familySeed';
import { seniorDemoSeed } from './demoSeeds/seniorSeed';

export function getDemoProfile(role: UserRole): DemoSeed {
  return role === 'family' ? familyDemoSeed : seniorDemoSeed;
}