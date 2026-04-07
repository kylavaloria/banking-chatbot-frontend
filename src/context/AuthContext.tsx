import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { AuthState } from '../types/auth.types';
import { loginWithSupabase, signUpWithSupabase, getMe } from '../api/auth.api';

const TOKEN_KEY = 'bfsi_token';

interface AuthContextValue extends AuthState {
  login:  (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token:     null,
    role:      null,
    email:     null,
    isLoading: true,
  });

  // Derive role from /api/me response.
  // 200 → customer, 403 → agent, anything else → throw (clear auth)
  const deriveRoleFromToken = useCallback(async (token: string) => {
    try {
      const me = await getMe(token);
      return { role: 'customer' as const, email: me.email };
    } catch (err: any) {
      if (err?.status === 403) {
        // Valid token but not in customers table → agent
        return { role: 'agent' as const, email: null };
      }
      // Token invalid, network down, or unexpected error → clear auth
      throw err;
    }
  }, []);

  // On mount: rehydrate from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setState({ token: null, role: null, email: null, isLoading: false });
      return;
    }

    deriveRoleFromToken(stored)
      .then(({ role, email }) => {
        setState({ token: stored, role, email, isLoading: false });
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setState({ token: null, role: null, email: null, isLoading: false });
      });
  }, [deriveRoleFromToken]);

  const login = useCallback(async (email: string, password: string) => {
    const { access_token } = await loginWithSupabase(email, password);
    localStorage.setItem(TOKEN_KEY, access_token);
    const { role, email: resolvedEmail } = await deriveRoleFromToken(access_token);
    setState({
      token:     access_token,
      role,
      email:     resolvedEmail ?? email,
      isLoading: false,
    });
  }, [deriveRoleFromToken]);

  const signUp = useCallback(async (email: string, password: string) => {
    const { access_token } = await signUpWithSupabase(email, password);
    if (!access_token) {
      // Supabase may require email confirmation — surface a clear error
      throw new Error(
        'Account created! Please check your email to confirm your account before logging in.'
      );
    }
    localStorage.setItem(TOKEN_KEY, access_token);
    const { role, email: resolvedEmail } = await deriveRoleFromToken(access_token);
    setState({
      token:     access_token,
      role,
      email:     resolvedEmail ?? email,
      isLoading: false,
    });
  }, [deriveRoleFromToken]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ token: null, role: null, email: null, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}
