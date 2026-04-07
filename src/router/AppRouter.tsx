import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleGuard } from '../components/auth/RoleGuard';
import { Spinner } from '../components/ui/Spinner';
import LoginPage    from '../pages/LoginPage';
import SignUpPage   from '../pages/SignUpPage';
import ChatbotPage  from '../pages/ChatbotPage';
import TicketingPage from '../pages/TicketingPage';

/** Redirects authenticated users to their role's home page, or to /login. */
function AuthRedirect() {
  const { token, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;
  if (role === 'customer') return <Navigate to="/chat"    replace />;
  if (role === 'agent')    return <Navigate to="/tickets" replace />;
  return <Navigate to="/login" replace />;
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"  element={<LoginPage />}  />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Customer only */}
      <Route
        path="/chat"
        element={
          <RoleGuard role="customer">
            <ChatbotPage />
          </RoleGuard>
        }
      />

      {/* Agent only */}
      <Route
        path="/tickets"
        element={
          <RoleGuard role="agent">
            <TicketingPage />
          </RoleGuard>
        }
      />

      {/* Root + catch-all */}
      <Route path="/"  element={<AuthRedirect />} />
      <Route path="*"  element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
