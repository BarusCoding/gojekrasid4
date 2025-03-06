
export type UserRole = 'admin' | 'driver' | 'consumer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
