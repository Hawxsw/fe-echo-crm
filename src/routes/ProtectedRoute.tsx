import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  permissions?: string[];
  redirectTo?: string;
}

/**
 * Componente wrapper para rotas que requerem permissões específicas.
 * 
 * Benefícios:
 * - Centraliza lógica de verificação de permissões
 * - Facilita a manutenção e testes
 * - Torna as rotas mais declarativas
 * 
 * @example
 * ```tsx
 * <Route element={<ProtectedRoute permissions={[PERMISSIONS.user.read]} />}>
 *   <Route path="users" element={<UsersList />} />
 * </Route>
 * ```
 */
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

