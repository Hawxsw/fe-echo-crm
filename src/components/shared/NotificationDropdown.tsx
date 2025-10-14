import { Bell, Check, CheckCheck, MessageSquare, ListTodo, ShoppingCart, Megaphone, Trash2, X } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { INotification, NotificationType } from '@/types/notification';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.MESSAGE:
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case NotificationType.TASK_ASSIGNED:
    case NotificationType.TASK_COMMENT:
    case NotificationType.TASK_DUE_SOON:
      return <ListTodo className="h-5 w-5 text-purple-500" />;
    case NotificationType.WHATSAPP_MESSAGE:
      return <MessageSquare className="h-5 w-5 text-green-500" />;
    case NotificationType.SALES_ASSIGNED:
    case NotificationType.SALES_COMMENT:
      return <ShoppingCart className="h-5 w-5 text-orange-500" />;
    case NotificationType.MENTION:
      return <Megaphone className="h-5 w-5 text-pink-500" />;
    default:
      return <Bell className="h-5 w-5 text-slate-500" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.MESSAGE:
      return 'bg-blue-50 border-blue-200';
    case NotificationType.TASK_ASSIGNED:
    case NotificationType.TASK_COMMENT:
    case NotificationType.TASK_DUE_SOON:
      return 'bg-purple-50 border-purple-200';
    case NotificationType.WHATSAPP_MESSAGE:
      return 'bg-green-50 border-green-200';
    case NotificationType.SALES_ASSIGNED:
    case NotificationType.SALES_COMMENT:
      return 'bg-orange-50 border-orange-200';
    case NotificationType.MENTION:
      return 'bg-pink-50 border-pink-200';
    default:
      return 'bg-slate-50 border-slate-200';
  }
};

export const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
  const { 
    notifications, 
    unreadCount, 
    isLoading,
    isConnected,
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    deleteAllNotifications 
  } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = async (notification: INotification) => {
    if (!notification.isRead) {
      await markAsRead([notification.id]);
    }
    
    if (notification.actionUrl) {
      try {
        navigate(notification.actionUrl);
        onClose();
      } catch (error) {
        console.error('Erro ao navegar para:', notification.actionUrl, error);
        navigate('/dashboard');
        onClose();
      }
    } else {
      navigate('/dashboard');
      onClose();
    }
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAllAsRead();
  };

  const handleDeleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  const handleClearAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Deseja limpar todas as notificações?')) {
      await deleteAllNotifications();
    }
  };


  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />

      <div 
        className="absolute right-0 mt-2 w-96 max-h-[600px] rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 flex flex-col"
      >
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Notificações</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-white/20 rounded-full">
                  {unreadCount}
                </span>
              )}
              {!isConnected && (
                <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-100 rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-yellow-300 rounded-full"></span>
                  Offline
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {notifications.length > 0 && (
            <div className="flex items-center justify-between mt-3 text-sm">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <CheckCheck className="h-4 w-4" />
                  <span>Marcar todas como lidas</span>
                </button>
              )}
              <button
                onClick={handleClearAll}
                className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors ml-auto"
              >
                <Trash2 className="h-4 w-4" />
                <span>Limpar tudo</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-500">
              <Bell className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">Nenhuma notificação</p>
              <p className="text-xs mt-1">Você está em dia!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    relative p-4 cursor-pointer transition-all hover:bg-slate-50 group
                    ${!notification.isRead ? 'bg-blue-50/30' : ''}
                  `}
                >
                  {!notification.isRead && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full" />
                  )}

                  <div className="flex items-start space-x-3 ml-4">
                    <div className={`
                      flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border
                      ${getNotificationColor(notification.type)}
                    `}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                          {notification.title}
                        </p>
                        <button
                          onClick={(e) => handleDeleteNotification(e, notification.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-600" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-slate-400">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>
                          {!notification.actionUrl && (
                            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                              Sem link
                            </span>
                          )}
                        </div>
                        {!notification.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead([notification.id]);
                            }}
                            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            <Check className="h-3 w-3" />
                            <span>Marcar como lida</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 5 && (
          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-3 text-center">
            <button
              onClick={onClose}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todas as notificações
            </button>
          </div>
        )}
      </div>
    </>
  );
};

