import { User } from '../../_models/User';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}
