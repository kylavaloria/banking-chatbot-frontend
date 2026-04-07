import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate   = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [errors,   setErrors]   = useState<{
    email?: string; password?: string; confirm?: string; form?: string
  }>({});
  const [loading,  setLoading]  = useState(false);
  const [info,     setInfo]     = useState('');

  function validate(): boolean {
    const next: typeof errors = {};
    if (!email.trim())    next.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = 'Enter a valid email.';
    if (!password)        next.password = 'Password is required.';
    else if (password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (password !== confirm)  next.confirm  = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setInfo('');
    try {
      await signUp(email.trim(), password);
      navigate('/', { replace: true });
    } catch (err: any) {
      // Supabase email confirmation case — show as info, not error
      const msg: string = err.message ?? 'Sign up failed.';
      if (msg.toLowerCase().includes('confirm')) {
        setInfo(msg);
      } else {
        setErrors({ form: msg });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur rounded-2xl mb-4 ring-1 ring-white/20">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1 text-brand-200 text-sm">Join the BFSI Support Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {info ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <p className="text-sm text-gray-700">{info}</p>
              <Link
                to="/login"
                className="font-medium text-brand-600 hover:text-brand-700 text-sm transition-colors"
              >
                Back to sign in →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              {errors.form && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3">
                  <span className="text-red-500 text-sm mt-0.5">⚠</span>
                  <p className="text-sm text-red-700">{errors.form}</p>
                </div>
              )}

              <Input
                id="signup-email"
                label="Email address"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={errors.email}
                disabled={loading}
              />

              <Input
                id="signup-password"
                label="Password"
                type="password"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={errors.password}
                disabled={loading}
              />

              <Input
                id="signup-confirm-password"
                label="Confirm password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                error={errors.confirm}
                disabled={loading}
              />

              <Button
                id="signup-submit-btn"
                type="submit"
                isLoading={loading}
                size="lg"
                className="w-full mt-1"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
          )}

          {!info && (
            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
