import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { PERMISSIONS } from '../constants/permissions';


import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Dashboard from '../pages/private/Dashboard';
import Profile from '../pages/private/Profile';
import OrganizationalStructure from '../pages/private/OrganizationalStructure';
import DepartmentsList from '../pages/private/departments/DepartmentsList';
import DepartmentDetails from '../pages/private/departments/DepartmentDetails';
import DepartmentForm from '../pages/private/departments/DepartmentForm';
import { UsersList } from '../pages/private/users/UsersList';
import UserDetails from '../pages/private/users/UserDetails';
import { UserForm } from '../pages/private/users/UserForm';
import RolesList from '../pages/private/roles/RolesList';
import RoleDetails from '../pages/private/roles/RoleDetails';
import { RoleForm } from '../pages/private/roles/RoleForm';
import BoardsList from '../pages/private/kanban/BoardsList';
import BoardView from '../pages/private/kanban/BoardView';
import { BoardForm } from '../pages/private/kanban/BoardForm';
import SalesKanban from '../pages/private/kanban/SalesKanban';
import InternalChat from '../pages/private/chat/InternalChat';
import ConversationsList from '../pages/private/whatsapp/ConversationsList';
import ConversationView from '../pages/private/whatsapp/ConversationView';
import Settings from '../pages/private/settings/Settings';
import Reports from '../pages/private/reports/Reports';
import Support from '../pages/private/support/Support';
import Feedback from '../pages/private/feedback/Feedback';

interface IRouteInterface {
  path: string;
  routes?: Record<string, IRouteInterface>;
}

const createRoutes = <T extends Record<string, IRouteInterface>>(
  routes: T,
  parentPath = '',
): T => {
  return Object.entries(routes).reduce((acc, [key, route]) => {
    const fullPath = `${parentPath}/${route.path}`.replace(/\/+/g, '/');

    acc[key as keyof T] = {
      ...route,
      path: fullPath,
      routes: route.routes ? createRoutes(route.routes, fullPath) : undefined,
    } as T[typeof key];

    return acc;
  }, {} as T);
};

export const generatePath = (path: string, params: Record<string, string>) => {
  return Object.entries(params).reduce(
    (updatedPath, [key, value]) => updatedPath.replace(`:${key}`, value),
    path,
  );
};

export const routes = createRoutes({
  home: { path: '/' },
  login: { path: '/login' },
  register: { path: '/register' },
  dashboard: {
    path: '/dashboard',
    routes: {
      organizationalStructure: {
        path: '/organizational-structure',
      },
      departments: {
        path: '/departments',
        routes: {
          department: { path: '/:id' },
          new: { path: '/new' },
          edit: { path: '/edit/:id' },
        },
      },
      users: {
        path: '/users',
        routes: {
          user: { path: '/:id' },
          new: { path: '/new' },
          edit: { path: '/edit/:id' },
        },
      },
      roles: {
        path: '/roles',
        routes: {
          role: { path: '/:id' },
          new: { path: '/new' },
          edit: { path: '/edit/:id' },
        },
      },
      chats: {
        path: '/chats',
        routes: {
          chat: { path: '/:id' },
        },
      },
      kanban: {
        path: '/kanban',
        routes: {
          board: { path: '/:id' },
          new: { path: '/new' },
          edit: { path: '/edit/:id' },
          sales: { path: '/sales' },
        },
      },
      whatsapp: {
        path: '/whatsapp',
        routes: {
          conversation: { path: '/:id' },
        },
      },
      settings: {
        path: '/settings',
      },
      reports: {
        path: '/reports',
      },
      support: {
        path: '/support',
      },
      feedback: {
        path: '/feedback',
      },
    },
  },
  profile: {
    path: '/profile',
  },
});

export const Router = () => {
  const { checkPermissions, currentUser } = useAuth();

  const hasPermission = (permissions?: string[]) => {
    if (!permissions || permissions.length === 0) return true;
    if (currentUser?.email === 'admin@echotech.com') return true;
    return checkPermissions(permissions);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.home.path} element={<Landing />} />
        <Route path={routes.login.path} element={<Login />} />
        <Route path={routes.register.path} element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path={routes.profile.path} element={<DashboardLayout />}>
            <Route index element={<Profile />} />
          </Route>

          <Route path={routes.dashboard.path} element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />

            <Route
              path={routes.dashboard.routes.organizationalStructure.path}
              element={<OrganizationalStructure />}
            />

            <Route
              path={routes.dashboard.routes.departments.path}
              element={<DepartmentsList />}
            />
            <Route
              path={routes.dashboard.routes.departments.routes.new.path}
              element={<DepartmentForm />}
            />
            <Route
              path={routes.dashboard.routes.departments.routes.department.path}
              element={<DepartmentDetails />}
            />
            <Route
              path={routes.dashboard.routes.departments.routes.edit.path}
              element={<DepartmentForm />}
            />

            {hasPermission([
              PERMISSIONS.user.read,
              PERMISSIONS.user.manage,
            ]) && (
              <>
                <Route
                  path={routes.dashboard.routes.users.path}
                  element={<UsersList />}
                />
                <Route
                  path={routes.dashboard.routes.users.routes.new.path}
                  element={<UserForm mode="create" />}
                />
                <Route
                  path={routes.dashboard.routes.users.routes.edit.path}
                  element={<UserForm mode="edit" />}
                />
                <Route
                  path={routes.dashboard.routes.users.routes.user.path}
                  element={<UserDetails />}
                />
              </>
            )}

            {hasPermission([
              PERMISSIONS.role.read,
              PERMISSIONS.role.manage,
            ]) && (
              <>
                <Route
                  path={routes.dashboard.routes.roles.path}
                  element={<RolesList />}
                />
                <Route
                  path={routes.dashboard.routes.roles.routes.new.path}
                  element={<RoleForm mode="create" />}
                />
                <Route
                  path={routes.dashboard.routes.roles.routes.edit.path}
                  element={<RoleForm mode="edit" />}
                />
                <Route
                  path={routes.dashboard.routes.roles.routes.role.path}
                  element={<RoleDetails />}
                />
              </>
            )}

            <Route
              path={routes.dashboard.routes.chats.path}
              element={<InternalChat />}
            />

            {hasPermission([
              PERMISSIONS.kanban.read,
              PERMISSIONS.kanban.manage,
            ]) && (
              <>
                <Route
                  path={routes.dashboard.routes.kanban.path}
                  element={<BoardsList />}
                />
                <Route
                  path={routes.dashboard.routes.kanban.routes.new.path}
                  element={<BoardForm mode="create" />}
                />
                <Route
                  path={routes.dashboard.routes.kanban.routes.edit.path}
                  element={<BoardForm mode="edit" />}
                />
                <Route
                  path={routes.dashboard.routes.kanban.routes.board.path}
                  element={<BoardView />}
                />
                <Route
                  path={routes.dashboard.routes.kanban.routes.sales.path}
                  element={<SalesKanban />}
                />
              </>
            )}

            {hasPermission([
              PERMISSIONS.whatsapp.read,
              PERMISSIONS.whatsapp.manage,
            ]) && (
              <>
                <Route
                  path={routes.dashboard.routes.whatsapp.path}
                  element={<ConversationsList />}
                />
                <Route
                  path={routes.dashboard.routes.whatsapp.routes.conversation.path}
                  element={<ConversationView />}
                />
              </>
            )}

            <Route
              path={routes.dashboard.routes.settings.path}
              element={<Settings />}
            />

            <Route
              path={routes.dashboard.routes.reports.path}
              element={<Reports />}
            />

            <Route
              path={routes.dashboard.routes.support.path}
              element={<Support />}
            />

            <Route
              path={routes.dashboard.routes.feedback.path}
              element={<Feedback />}
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={routes.home.path} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

