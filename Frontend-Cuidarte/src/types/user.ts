export type UserRole = 'senior' | 'family';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  linkedUserId?: string;
}
