export interface AuthState {
  token:     string | null;
  role:      'customer' | 'agent' | null;
  email:     string | null;
  isLoading: boolean;
}

export interface LoginCredentials {
  email:    string;
  password: string;
}

export interface SignUpCredentials {
  email:    string;
  password: string;
}
