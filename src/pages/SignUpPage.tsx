import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ZENI_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDJQ397LjRKMGaMUiYF5NhbKF5RRij3D4vYRoqu1Hu9jChnfMlP5OStuItdEshDHu3Ts6Qi6R6ApYNboHM9T0w7dbEGJBdWJP-sqWNxZT063f3nl2pLFMxQqX-C3PmEkpXINYLxLHBnsJgJDTdlwhl98Hq6u1Ru_NNbRZVs_pVrkqmEFnPdkXJ0atH6NEPgKTUz-hcALimDdyZyJob1FwW3laObOe8RMNXnYvHewn7hx1Lz1VeRCT0gLD9RCil9BIgn3cGf6AsQWxG9';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirm?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');

  function validate(): boolean {
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = 'Enter a valid email.';
    if (!password) next.password = 'Password is required.';
    else if (password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (password !== confirm) next.confirm = 'Passwords do not match.';
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
      const msg: string = err?.message ?? 'Sign up failed.';
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
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      {/* ── TopNavBar ── */}
      <header className="bg-[#f7f9fb]/90 backdrop-blur-md sticky top-0 z-50 header-bar relative">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-5xl mx-auto gap-3">
          <div className="flex items-center gap-4">
            <img
              alt="Rivr Bank Logo"
              className="h-12 md:h-14 w-auto max-w-[min(100%,14rem)] object-contain object-left"
              src="/rivr-bank-logo.png"
            />
            <div className="hidden md:flex flex-col border-l border-outline-variant/40 pl-4 -mt-0.5">
              <span className="font-bold text-sm leading-tight text-[#1e3a8a] tracking-tight">
                Chat with Zeni
              </span>
              <span className="text-slate-400 font-medium text-[0.65rem] tracking-widest uppercase">
                Customer Portal
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main: centered sign-up card ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden bg-grid">
        {/* Decorative blobs */}
        <div className="blob w-96 h-96 bg-[#1e3a8a] -top-24 -left-24" />
        <div className="blob w-80 h-80 bg-[#2dd4bf] bottom-0 right-0" />

        {/* Card */}
        <div className="card-animate relative z-10 w-full max-w-md bg-white rounded-2xl shadow-[0px_20px_60px_rgba(25,28,30,0.10)] border border-outline-variant/20 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#1e3a8a] to-[#2dd4bf]" />

          <div className="px-8 pt-8 pb-9 flex flex-col gap-6">
            {/* Card header */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5 mb-3">
                <img
                  alt="Zeni AI Assistant"
                  className="w-10 h-10 rounded-full object-cover border border-outline-variant/30 shadow-sm"
                  src={ZENI_AVATAR_URL}
                />
                <span className="text-sm font-semibold text-on-surface">Zeni</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[0.6rem] font-bold tracking-widest uppercase bg-[#d5e3fc] text-[#1e3a8a]">
                  AI
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#1e3a8a] leading-tight">
                Create your account
              </h1>
              <p className="text-sm text-on-surface-variant">
                Join the support portal and start chatting with Zeni.
              </p>
            </div>

            {info ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#ccfbf1]">
                  <span className="material-symbols-outlined text-[#0d9488] text-2xl">
                    check_circle
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant">{info}</p>
                <Link
                  to="/login"
                  className="text-[#1e3a8a] font-medium text-sm hover:underline underline-offset-2 transition-all inline-flex items-center gap-1"
                >
                  Back to sign in
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                {errors.form && (
                  <div className="bg-error-container/60 border border-error/30 rounded-xl px-4 py-3 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-error text-[1.1rem] mt-0.5">
                      error
                    </span>
                    <p className="text-sm text-on-error-container">{errors.form}</p>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
                      htmlFor="signup-email"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] text-[1.1rem] select-none">
                        mail
                      </span>
                      <input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={loading}
                        className="portal-input w-full pl-9 pr-4 py-3 rounded-xl border border-outline-variant bg-[#eceef0] text-on-surface text-sm placeholder:text-outline transition-all duration-200 disabled:opacity-60"
                      />
                    </div>
                    {errors.email && (
                      <span className="text-xs text-error mt-0.5">{errors.email}</span>
                    )}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
                      htmlFor="signup-password"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] text-[1.1rem] select-none">
                        lock
                      </span>
                      <input
                        id="signup-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={loading}
                        className="portal-input w-full pl-9 pr-4 py-3 rounded-xl border border-outline-variant bg-[#eceef0] text-on-surface text-sm placeholder:text-outline transition-all duration-200 disabled:opacity-60"
                      />
                    </div>
                    {errors.password && (
                      <span className="text-xs text-error mt-0.5">{errors.password}</span>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider"
                      htmlFor="signup-confirm-password"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737686] text-[1.1rem] select-none">
                        lock
                      </span>
                      <input
                        id="signup-confirm-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        disabled={loading}
                        className="portal-input w-full pl-9 pr-4 py-3 rounded-xl border border-outline-variant bg-[#eceef0] text-on-surface text-sm placeholder:text-outline transition-all duration-200 disabled:opacity-60"
                      />
                    </div>
                    {errors.confirm && (
                      <span className="text-xs text-error mt-0.5">{errors.confirm}</span>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  id="signup-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full h-12 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#2dd4bf] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all duration-150 shadow-md shadow-[#1e3a8a]/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create Account
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {!info && (
              <p className="text-center text-sm text-on-surface-variant">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-[#1e3a8a] font-medium hover:underline underline-offset-2 transition-all"
                >
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
