import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { TicketTable } from '../features/ticketing/TicketTable';

function firstNameFromEmail(email: string | null): string {
  if (!email) return 'there';
  const local = email.split('@')[0] ?? '';
  const token = local.split(/[._-]/)[0] ?? local;
  if (!token) return 'there';
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

export default function TicketingPage() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = firstNameFromEmail(email);

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col bg-dots">
      {/* ── Top Nav ── */}
      <header className="bg-[#f7f9fb]/90 backdrop-blur-md sticky top-0 z-50 header-bar relative">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-[1600px] mx-auto gap-3">
          {/* Logo + page label */}
          <div className="flex items-center gap-4">
            <img
              alt="Rivr Bank Logo"
              className="h-12 md:h-14 w-auto max-w-[min(100%,14rem)] object-contain object-left"
              src="/rivr-bank-logo.png"
            />
            <div className="hidden md:flex flex-col border-l border-outline-variant/40 pl-4 -mt-0.5">
              <span className="font-bold text-sm leading-tight text-[#1e3a8a] tracking-tight">
                Chat Support
              </span>
              <span className="text-slate-400 font-medium text-[0.65rem] tracking-widest uppercase">
                Agent Dashboard
              </span>
            </div>
          </div>

          {/* Nav links + user */}
          <div className="flex items-center gap-3">
            {/* Analytics link */}
            <Link
              to="/analytics"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-[#1e3a8a] transition-all duration-150 text-sm font-medium"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>analytics</span>
              <span className="hidden sm:inline">Analytics</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 bg-[#f2f4f6] rounded-full px-3 py-1.5 border border-outline-variant/30">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
              <span className="text-xs font-medium text-on-surface-variant">
                Hi, {displayName}
              </span>
            </div>
            <button
              id="navbar-logout-btn"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#1e3a8a] hover:bg-[#1e3a8a]/10 transition-all duration-150 active:scale-95 text-sm font-medium"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '1.1rem' }}
              >
                logout
              </span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Page header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#2dd4bf] flex items-center justify-center shadow-md shadow-[#1e3a8a]/20 flex-shrink-0">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontSize: '1.2rem' }}
              >
                confirmation_number
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-on-surface tracking-tight">
                Support Queue
              </h1>
              <p className="text-xs text-on-surface-variant">
                Active tickets sorted by priority and wait time
              </p>
            </div>
          </div>

          {/* Priority legend */}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[0.7rem] text-on-surface-variant font-medium">
                P1 Critical — Immediate action
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[0.7rem] text-on-surface-variant font-medium">
                P2 Urgent — High priority
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#1e3a8a]" />
              <span className="text-[0.7rem] text-on-surface-variant font-medium">
                P3 Standard — Normal queue
              </span>
            </div>
          </div>
        </div>

        <TicketTable />
      </main>
    </div>
  );
}
