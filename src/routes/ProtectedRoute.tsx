import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  permissions?: string[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  permissions = [], 
  redirectTo = '/dashboard' 
}: ProtectedRouteProps) {
  const { checkPermissions } = useAuth();

  if (permissions.length > 0 && !checkPermissions(permissions)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
