import { useState, useEffect, useCallback, useRef } from 'react';
import { useApiService } from '@/contexts/ApiContext';
import { useAuth } from './useAuth';
import { INotification } from '@/types/notification';
import { io, Socket } from 'socket.io-client';

const SOCKET_CONFIG = {
  transports: ['websocket', 'polling'] as ('websocket' | 'polling')[],
  timeout: 20000,
  forceNew: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { currentUser } = useAuth();
  const apiService = useApiService();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      setIsLoading(true);
      const data = await apiService.notifications.getAll();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiService.notifications, currentUser?.id]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!currentUser?.id) return;
    
    try {
      const count = await apiService.notifications.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [apiService.notifications, currentUser?.id]);

  // Mark as read
  const markAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      await apiService.notifications.markAsRead({ notificationIds });
      setNotifications(prev =>
        prev.map(n =>
          notificationIds.includes(n.id) ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
        )
      );
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  }, [apiService.notifications, fetchUnreadCount]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await apiService.notifications.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [apiService.notifications]);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await apiService.notifications.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [apiService.notifications, fetchUnreadCount]);

  // Delete all notifications
  const deleteAllNotifications = useCallback(async () => {
    try {
      await apiService.notifications.deleteAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  }, [apiService.notifications]);

  // WebSocket connection
  useEffect(() => {
    if (!currentUser?.id) return;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const socketUrl = API_URL.replace('/api/v1', '');

    try {
      const socket = io(socketUrl, {
        ...SOCKET_CONFIG,
        query: { userId: currentUser.id },
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('✅ Notificações WebSocket conectado');
        setIsConnected(true);
        socket.emit('joinNotifications', currentUser.id);
      });

      socket.on('disconnect', () => {
        console.log('❌ Notificações WebSocket desconectado');
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.warn('⚠️ Erro ao conectar WebSocket de notificações:', error.message);
        setIsConnected(false);
      });

      socket.on('newNotification', (notification: INotification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/vite.svg',
            badge: '/vite.svg',
          });
        }
      });

      socket.on('notificationCount', ({ count }: { count: number }) => {
        setUnreadCount(count);
      });

      return () => {
        if (socketRef.current?.connected) {
          socketRef.current.disconnect();
        }
        socketRef.current = null;
        setIsConnected(false);
      };
    } catch (error) {
      console.error('❌ Erro ao inicializar WebSocket de notificações:', error);
      setIsConnected(false);
    }
  }, [currentUser?.id]);

  // Initial load
  useEffect(() => {
    if (currentUser?.id) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [currentUser?.id, fetchNotifications, fetchUnreadCount]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    isConnected,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  };
};

