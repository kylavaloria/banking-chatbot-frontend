import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/env';

interface SupabaseTokenResponse {
  access_token: string;
  token_type:   string;
  expires_in:   number;
  refresh_token: string;
  user: {
    id:    string;
    email: string;
  };
}

interface MeResponse {
  customerId: string;
  email:      string;
  fullName:   string | null;
  segment:    string | null;
}

export async function loginWithSupabase(
  email: string,
  password: string
): Promise<SupabaseTokenResponse> {
  const res = await fetch(
    `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ email, password }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error_description: 'Login failed' }));
    throw new Error(err.error_description ?? err.error ?? 'Login failed');
  }

  return res.json();
}

export async function signUpWithSupabase(
  email: string,
  password: string
): Promise<SupabaseTokenResponse> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error_description: 'Sign up failed' }));
    throw new Error(err.error_description ?? err.error ?? 'Sign up failed');
  }

  return res.json();
}

export async function getMe(token: string): Promise<MeResponse> {
  const res = await fetch('/api/me', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = new Error('Not a customer') as Error & { status: number };
    error.status = res.status;
    throw error;
  }

  return res.json();
}
