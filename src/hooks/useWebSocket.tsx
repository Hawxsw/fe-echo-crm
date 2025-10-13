import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { IMessage } from '@/types/chat';

interface UseWebSocketProps {
  onNewMessage?: (message: IMessage) => void;
  onUserTyping?: (userId: string, isTyping: boolean) => void;
  onMessageRead?: (chatId: string, userId: string) => void;
}

const SOCKET_CONFIG = {
  transports: ['websocket', 'polling'] as ('websocket' | 'polling')[],
  timeout: 20000,
  forceNew: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
};

const CONNECTION_DELAY = 1000;

export const useWebSocket = ({
  onNewMessage,
  onUserTyping,
  onMessageRead,
}: UseWebSocketProps = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { currentUser } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  
  const onNewMessageRef = useRef(onNewMessage);
  const onUserTypingRef = useRef(onUserTyping);
  const onMessageReadRef = useRef(onMessageRead);

  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
    onUserTypingRef.current = onUserTyping;
    onMessageReadRef.current = onMessageRead;
  }, [onNewMessage, onUserTyping, onMessageRead]);

  useEffect(() => {
    if (!currentUser?.id) return;

    const connectTimeout = setTimeout(() => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const socketUrl = API_URL.replace('/api/v1', '');

      const newSocket = io(socketUrl, {
        ...SOCKET_CONFIG,
        query: { userId: currentUser.id },
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.on('connect', () => setIsConnected(true));
      newSocket.on('disconnect', () => setIsConnected(false));
      newSocket.on('connect_error', () => setIsConnected(false));
      newSocket.on('newMessage', (data: { message: IMessage }) => onNewMessageRef.current?.(data.message));
      newSocket.on('userTyping', (data: { userId: string; isTyping: boolean }) => onUserTypingRef.current?.(data.userId, data.isTyping));
      newSocket.on('messageRead', (data: { chatId: string; userId: string }) => onMessageReadRef.current?.(data.chatId, data.userId));
    }, CONNECTION_DELAY);

    return () => {
      clearTimeout(connectTimeout);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [currentUser?.id]);

  const joinChat = useCallback((chatId: string) => {
    socketRef.current?.emit('joinChat', { chatId, userId: currentUser?.id });
  }, [currentUser?.id]);

  const leaveChat = useCallback((chatId: string) => {
    socketRef.current?.emit('leaveChat', { chatId });
  }, []);

  const sendMessage = useCallback((message: { chatId: string; content: string }) => {
    socketRef.current?.emit('sendMessage', { message, userId: currentUser?.id });
  }, [currentUser?.id]);

  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    socketRef.current?.emit('typing', { chatId, userId: currentUser?.id, isTyping });
  }, [currentUser?.id]);

  const markAsRead = useCallback((chatId: string) => {
    socketRef.current?.emit('markAsRead', { chatId, userId: currentUser?.id });
  }, [currentUser?.id]);

  return {
    socket,
    isConnected,
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    markAsRead,
  };
};
