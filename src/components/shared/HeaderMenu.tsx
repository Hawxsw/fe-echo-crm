import { Menu, Bell, Search, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { Avatar } from '@/components/ui/avatar';
import { NotificationDropdown } from './NotificationDropdown';
import { UserDropdownMenu } from './UserDropdownMenu';
import { UI_CONSTANTS } from '@/constants/ui';

export const HeaderMenu = () => {
  const { currentUser, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLButtonElement>(null);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error during logout:', error);
      }
    }
  }, [logout]);

  const handleToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleToggleNotification = useCallback(() => {
    setIsNotificationOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleCloseNotification = useCallback(() => {
    setIsNotificationOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }

      if (notificationRef.current && !notificationRef.current.contains(target)) {
        const dropdown = document.querySelector('[data-notification-dropdown]');
        if (dropdown && !dropdown.contains(target)) {
          setIsNotificationOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitials = useMemo(() => {
    if (!currentUser) return '';
    const first = currentUser.firstName?.charAt(0) || '';
    const last = currentUser.lastName?.charAt(0) || '';
    return `${first}${last}`;
  }, [currentUser]);

  const userFullName = useMemo(() => {
    if (!currentUser) return '';
    return `${currentUser.firstName} ${currentUser.lastName}`;
  }, [currentUser]);

  const notificationBadgeCount = useMemo(() => {
    return unreadCount > 99 ? '99+' : unreadCount;
  }, [unreadCount]);

  const hasUnreadNotifications = useMemo(() => unreadCount > 0, [unreadCount]);

  return (
    <header className="relative z-50 flex-shrink-0 h-16 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm flex">
      <div className="flex-1 flex justify-between items-center px-4 sm:px-6">
        <div className="flex items-center md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            onClick={handleToggleMenu}
          >
            <span className="sr-only">{UI_CONSTANTS.HEADER.MENU_OPEN}</span>
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="hidden md:flex flex-1 max-w-md ml-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-all"
              placeholder={UI_CONSTANTS.HEADER.SEARCH_PLACEHOLDER}
            />
          </div>
        </div>

        <div className="ml-4 flex items-center space-x-3">
          <div className="relative">
            <button
              ref={notificationRef}
              type="button"
              onClick={handleToggleNotification}
              className={`
                relative p-2 rounded-lg transition-all
                ${isNotificationOpen 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }
              `}
              title={UI_CONSTANTS.HEADER.NOTIFICATIONS_TITLE}
            >
              <Bell className="h-5 w-5" />
              {hasUnreadNotifications && (
                <>
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white">
                    {notificationBadgeCount}
                  </span>
                </>
              )}
            </button>
            
            <div data-notification-dropdown>
              <NotificationDropdown 
                isOpen={isNotificationOpen}
                onClose={handleCloseNotification}
                anchorRef={notificationRef as React.RefObject<HTMLButtonElement>}
              />
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onClick={handleToggleMenu}
            >
              <Avatar className="h-9 w-9 ring-2 ring-white shadow-md">
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={userFullName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                    {userInitials}
                  </div>
                )}
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-700 leading-tight">
                  {userFullName}
                </p>
                <p className="text-xs text-slate-500">{currentUser?.email}</p>
              </div>
              <ChevronDown 
                className={`hidden md:block h-4 w-4 text-slate-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            <UserDropdownMenu
              isOpen={isMenuOpen}
              onClose={handleCloseMenu}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

