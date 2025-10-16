import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { UserLayout } from './layouts/UserLayout';
import { routes } from './helpers';
import { dashboardRoutes, IRouteConfig } from './config/routes.config';

import Landing from '@/pages/public/Landing';
import Login from '@/pages/public/Login';
import Register from '@/pages/public/Register';
import Profile from '@/pages/private/Profile';

const RouteLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <p className="ml-3 text-slate-600">Carregando...</p>
  </div>
);

function renderRoute(route: IRouteConfig, parentPath = '') {
  const fullPath = parentPath ? `${parentPath}/${route.path}` : route.path;

  if (route.children) {
    return (
      <Route
        key={fullPath}
        path={route.path}
        element={
          route.permissions ? (
            <ProtectedRoute permissions={route.permissions} />
          ) : (
            <></>
          )
        }
      >
        {route.element && <Route index element={route.element} />}
        {route.children.map((child) => renderRoute(child, route.path))}
      </Route>
    );
  }

  if (route.index) {
    return <Route key="index" index element={route.element} />;
  }

  return <Route key={fullPath} path={route.path} element={route.element} />;
}

export const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path={routes.home.path} element={<Landing />} />
          <Route path={routes.login.path} element={<Login />} />
          <Route path={routes.register.path} element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route element={<UserLayout />}>
              <Route path={routes.profile.path} element={<Profile />} />
            </Route>

            <Route path={routes.dashboard.path} element={<DashboardLayout />}>
              {dashboardRoutes.map((route) => renderRoute(route))}
            </Route>
          </Route>

          <Route path="*" element={<Navigate to={routes.home.path} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
