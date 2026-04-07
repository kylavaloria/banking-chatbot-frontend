import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../ui/Spinner';

interface RoleGuardProps {
  role:     'customer' | 'agent';
  children: React.ReactNode;
}

export function RoleGuard({ role, children }: RoleGuardProps) {
  const { token, role: userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  // Not authenticated at all → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to correct home for their role
  if (userRole !== role) {
    if (userRole === 'customer') return <Navigate to="/chat"    replace />;
    if (userRole === 'agent')    return <Navigate to="/tickets" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
