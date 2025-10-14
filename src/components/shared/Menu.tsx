import { Link, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import {
  Building2,
  Users,
  MessageSquare,
  LayoutDashboard,
  UserCog,
  MessageCircle,
  FolderKanban,
  ChevronRight,
  Building,
  TrendingUp,
  User,
  Settings,
  BarChart3,
  HelpCircle,
  MessageSquareText,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { PERMISSIONS } from '../../constants/permissions';

interface IMenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  permissions?: string[];
  submenu?: IMenuItem[];
  badge?: string;
  badgeColor?: string;
  isNew?: boolean;
  isMocked?: boolean;
}

export const menuItems: IMenuItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    title: 'Estrutura Organizacional',
    path: '/dashboard/organizational-structure',
    icon: <Building2 size={20} />,
  },
  {
    title: 'Departamentos',
    path: '/dashboard/departments',
    icon: <Building size={20} />,
  },
  {
    title: 'Usuários',
    path: '/dashboard/users',
    icon: <Users size={20} />,
    permissions: [PERMISSIONS.user.read, PERMISSIONS.user.manage],
  },
  {
    title: 'Funções',
    path: '/dashboard/roles',
    icon: <UserCog size={20} />,
    permissions: [PERMISSIONS.role.read, PERMISSIONS.role.manage],
  },
  {
    title: 'Kanban',
    path: '/dashboard/kanban',
    icon: <FolderKanban size={20} />,
    permissions: [PERMISSIONS.kanban.read, PERMISSIONS.kanban.manage],
    submenu: [
      {
        title: 'Projetos',
        path: '/dashboard/kanban',
        icon: <FolderKanban size={16} />,
        permissions: [PERMISSIONS.kanban.read, PERMISSIONS.kanban.manage],
      },
      {
        title: 'Vendas',
        path: '/dashboard/kanban/sales',
        icon: <TrendingUp size={16} />,
        permissions: [PERMISSIONS.kanban.read, PERMISSIONS.kanban.manage],
      },
    ],
  },
  {
    title: 'Chat Interno',
    path: '/dashboard/chats',
    icon: <MessageCircle size={20} />,
    isNew: true,
  },
  {
    title: 'WhatsApp',
    path: '/dashboard/whatsapp',
    icon: <MessageSquare size={20} />,
    permissions: [PERMISSIONS.whatsapp.read, PERMISSIONS.whatsapp.manage],
  },
  {
    title: 'Configurações',
    path: '/dashboard/settings',
    icon: <Settings size={20} />,
  },
  {
    title: 'Relatórios',
    path: '/dashboard/reports',
    icon: <BarChart3 size={20} />,
  },
  {
    title: 'Suporte',
    path: '/dashboard/support',
    icon: <HelpCircle size={20} />,
  },
  {
    title: 'Feedback',
    path: '/dashboard/feedback',
    icon: <MessageSquareText size={20} />,
  },
  {
    title: 'Meu Perfil',
    path: '/profile',
    icon: <User size={20} />,
  },
];

export const Menu = () => {
  const location = useLocation();
  const { checkPermissions, currentUser } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  React.useEffect(() => {
    if (location.pathname.startsWith('/dashboard/kanban') && !expandedItems.includes('/dashboard/kanban')) {
      setExpandedItems(prev => [...prev, '/dashboard/kanban']);
    }
  }, [location.pathname, expandedItems]);

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/dashboard/kanban/sales') return location.pathname === '/dashboard/kanban/sales';
    if (path === '/dashboard/kanban') return location.pathname === '/dashboard/kanban';
    if (path === '/dashboard/settings') return location.pathname === '/dashboard/settings';
    if (path === '/dashboard/reports') return location.pathname === '/dashboard/reports';
    if (path === '/dashboard/support') return location.pathname === '/dashboard/support';
    if (path === '/dashboard/feedback') return location.pathname === '/dashboard/feedback';
    if (path === '/profile') return location.pathname === '/profile';
    return location.pathname.startsWith(path);
  };

  const isParentActive = (path: string) => {
    if (path === '/dashboard/kanban') {
      return location.pathname === '/dashboard/kanban' || 
             location.pathname.startsWith('/dashboard/kanban/');
    }
    return isActive(path);
  };

  const hasPermission = (permissions?: string[]) => {
    if (!permissions || permissions.length === 0) return true;
    if (currentUser?.email === 'admin@echotech.com') return true;
    return checkPermissions(permissions);
  };

  const handleMockedClick = (e: React.MouseEvent, isMocked?: boolean) => {
    if (isMocked) e.preventDefault();
  };

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  const renderMenuItem = (item: IMenuItem) => {
    if (!hasPermission(item.permissions)) return null;
    
    const active = isParentActive(item.path);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedItems.includes(item.path);

    return (
      <div key={item.path}>
        {hasSubmenu ? (
          <button
            onClick={() => toggleExpanded(item.path)}
            className={`
              group relative flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg
              transition-all duration-200 ease-in-out
              ${
                active
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }
            `}
          >
            <div className="flex items-center flex-1 min-w-0">
              <span
                className={`
                  mr-3 flex-shrink-0 transition-transform duration-200
                  ${active ? 'text-white scale-110' : 'text-slate-500 group-hover:text-blue-600 group-hover:scale-105'}
                `}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.title}</span>
            </div>
            <ChevronRight 
              size={16} 
              className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
                isExpanded ? 'rotate-90' : ''
              }`}
            />
          </button>
        ) : (
          <Link
            to={item.path}
            onClick={(e) => handleMockedClick(e, item.isMocked)}
            className={`
              group relative flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg
              transition-all duration-200 ease-in-out
              ${
                active
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }
              ${item.isMocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center flex-1 min-w-0">
              <span
                className={`
                  mr-3 flex-shrink-0 transition-transform duration-200
                  ${active ? 'text-white scale-110' : 'text-slate-500 group-hover:text-blue-600 group-hover:scale-105'}
                `}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.title}</span>
            </div>

            {/* Badges */}
            {item.badge && (
              <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-md ${item.badgeColor || 'bg-blue-100 text-blue-700'}`}>
                {item.badge}
              </span>
            )}

            {/* New indicator */}
            {item.isNew && !item.badge && (
              <span className="ml-2 relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}

            {/* Active indicator */}
            {active && (
              <ChevronRight 
                size={16} 
                className="ml-2 flex-shrink-0 animate-pulse" 
              />
            )}
          </Link>
        )}

        {/* Submenu */}
        {hasSubmenu && isExpanded && (
          <div className="ml-4 mt-1 space-y-1">
            {item.submenu?.map((subItem) => {
              if (!hasPermission(subItem.permissions)) return null;
              const subActive = isActive(subItem.path);

              return (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  onClick={(e) => handleMockedClick(e, subItem.isMocked)}
                  className={`
                    group relative flex items-center px-3 py-2 text-sm font-medium rounded-lg
                    transition-all duration-200 ease-in-out
                    ${
                      subActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                    ${subItem.isMocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  `}
                >
                  <span
                    className={`
                      mr-3 flex-shrink-0 transition-transform duration-200
                      ${subActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-blue-500 group-hover:scale-105'}
                    `}
                  >
                    {subItem.icon}
                  </span>
                  <span className="truncate">{subItem.title}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="space-y-1">
      {menuItems.map(renderMenuItem)}
    </nav>
  );
};

