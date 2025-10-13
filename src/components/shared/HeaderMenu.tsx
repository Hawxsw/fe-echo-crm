import { Menu, LogOut, User, Bell, Search, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { routes } from '../../routes/routes';
import { Avatar } from '../ui/avatar';
import { NotificationDropdown } from './NotificationDropdown';

export const HeaderMenu = () => {
  const { currentUser, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        const dropdown = document.querySelector('[data-notification-dropdown]');
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setIsNotificationOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="relative z-50 flex-shrink-0 h-16 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm flex">
      <div className="flex-1 flex justify-between items-center px-4 sm:px-6">
        {/* Left side - Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Abrir menu</span>
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md ml-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
              placeholder="Buscar..."
            />
          </div>
        </div>

        {/* Right side - Actions and User menu */}
        <div className="ml-4 flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <button
              ref={notificationRef}
              type="button"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className={`
                relative p-2 rounded-lg transition-all
                ${isNotificationOpen 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }
              `}
              title="Notificações"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                </>
              )}
            </button>
            
            <div data-notification-dropdown>
              <NotificationDropdown 
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                anchorRef={notificationRef as React.RefObject<HTMLButtonElement>}
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Avatar className="h-9 w-9 ring-2 ring-white shadow-md">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {currentUser?.firstName?.charAt(0)}
                  {currentUser?.lastName?.charAt(0)}
                </div>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-700 leading-tight">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="text-xs text-slate-500">{currentUser?.email}</p>
              </div>
              <ChevronDown 
                className={`hidden md:block h-4 w-4 text-slate-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Dropdown menu */}
            {isMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <p className="text-xs text-slate-600 truncate">{currentUser?.email}</p>
                </div>
                <div className="py-2" role="menu">
                  <Link
                    to={routes.profile.path}
                    className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="mr-3 h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <span className="group-hover:text-blue-600 transition-colors">Meu Perfil</span>
                  </Link>
                  <div className="my-1 border-t border-slate-100"></div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                  >
                    <LogOut className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-600 transition-colors" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

