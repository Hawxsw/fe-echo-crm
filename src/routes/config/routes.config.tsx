import { lazy } from 'react';
import { PERMISSIONS } from '@/constants/permissions';


const Dashboard = lazy(() => import('@/pages/private/Dashboard'));
const OrganizationalStructure = lazy(() => import('@/pages/private/OrganizationalStructure'));
const DepartmentsList = lazy(() => import('@/pages/private/departments/DepartmentsList'));
const DepartmentDetails = lazy(() => import('@/pages/private/departments/DepartmentDetails'));
const DepartmentForm = lazy(() => import('@/pages/private/departments/DepartmentForm'));
const UsersList = lazy(() => import('@/pages/private/users/UsersList'));
const UserDetails = lazy(() => import('@/pages/private/users/UserDetails'));
const UserForm = lazy(() => import('@/pages/private/users/UserForm'));
const RolesList = lazy(() => import('@/pages/private/roles/RolesList'));
const RoleDetails = lazy(() => import('@/pages/private/roles/RoleDetails'));
const RoleForm = lazy(() => import('@/pages/private/roles/RoleForm'));
const BoardsList = lazy(() => import('@/pages/private/kanban/BoardsList'));
const BoardView = lazy(() => import('@/pages/private/kanban/BoardView'));
const BoardForm = lazy(() => import('@/pages/private/kanban/BoardForm'));
const Settings = lazy(() => import('@/pages/private/settings/Settings'));
const Reports = lazy(() => import('@/pages/private/reports/Reports'));
const Support = lazy(() => import('@/pages/private/support/Support'));
const Feedback = lazy(() => import('@/pages/private/feedback/Feedback'));

/**
 * Configuração de rotas da aplicação.
 * 
 * Separação de responsabilidades:
 * - Este arquivo define apenas a estrutura de rotas e suas permissões
 * - O componente Router monta as rotas baseado nesta configuração
 * - Facilita manutenção e testes
 */

export interface IRouteConfig {
  path: string;
  element?: React.ReactNode;
  permissions?: string[];
  children?: IRouteConfig[];
  index?: boolean;
}

export const dashboardRoutes: IRouteConfig[] = [
  {
    path: '',
    element: <Dashboard />,
    index: true,
  },
  {
    path: 'organizational-structure',
    element: <OrganizationalStructure />,
  },
  {
    path: 'departments',
    children: [
      {
        path: '',
        element: <DepartmentsList />,
        index: true,
      },
      {
        path: 'new',
        element: <DepartmentForm />,
      },
      {
        path: ':id',
        element: <DepartmentDetails />,
      },
      {
        path: 'edit/:id',
        element: <DepartmentForm />,
      },
    ],
  },
  {
    path: 'users',
    permissions: [PERMISSIONS.user.read, PERMISSIONS.user.manage],
    children: [
      {
        path: '',
        element: <UsersList />,
        index: true,
      },
      {
        path: ':id',
        element: <UserDetails />,
      },
      {
        path: 'new',
        element: <UserForm mode="create" />,
      },
      {
        path: 'edit/:id',
        element: <UserForm mode="edit" />,
      },
    ],
  },
  {
    path: 'roles',
    permissions: [PERMISSIONS.role.read, PERMISSIONS.role.manage],
    children: [
      {
        path: '',
        element: <RolesList />,
        index: true,
      },
      {
        path: ':id',
        element: <RoleDetails />,
      },
      {
        path: 'new',
        element: <RoleForm mode="create" />,
      },
      {
        path: 'edit/:id',
        element: <RoleForm mode="edit" />,
      },
    ],
  },
  {
    path: 'chats',
    permissions: [PERMISSIONS.chat.read, PERMISSIONS.chat.manage],
    children: [
      {
        path: '',
        element: <div>Chats List</div>,
        index: true,
      },
      {
        path: ':id',
        element: <div>Chat Details</div>,
      },
    ],
  },
  {
    path: 'kanban',
    permissions: [PERMISSIONS.kanban.read, PERMISSIONS.kanban.manage],
    children: [
      {
        path: '',
        element: <BoardsList />,
        index: true,
      },
      {
        path: ':id',
        element: <BoardView />,
      },
      {
        path: 'new',
        element: <BoardForm mode="create" />,
      },
      {
        path: 'edit/:id',
        element: <BoardForm mode="edit" />,
      },
    ],
  },
  {
    path: 'whatsapp',
    permissions: [PERMISSIONS.whatsapp.read, PERMISSIONS.whatsapp.manage],
    children: [
      {
        path: '',
        element: <div>WhatsApp Conversations</div>,
        index: true,
      },
      {
        path: ':id',
        element: <div>WhatsApp Conversation</div>,
      },
    ],
  },
  {
    path: 'settings',
    element: <Settings />,
  },
  {
    path: 'reports',
    element: <Reports />,
  },
  {
    path: 'support',
    element: <Support />,
  },
  {
    path: 'feedback',
    element: <Feedback />,
  },
];

