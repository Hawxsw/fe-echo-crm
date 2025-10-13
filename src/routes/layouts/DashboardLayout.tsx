import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Sidebar } from '../../components/shared/Sidebar';
import { HeaderMenu } from '../../components/shared/HeaderMenu';

export const DashboardLayout = () => {
  const { currentUser, token } = useAuth();

  if (!currentUser && !token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderMenu />

        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

