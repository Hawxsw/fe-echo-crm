import { useEffect } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useAuth } from './useAuth';

export const usePresence = (isConnected: boolean) => {
  const { updateUserStatus } = useChatStore();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (isConnected && currentUser) {
      // Definir o usuário atual como online quando conectado
      updateUserStatus(currentUser.id, 'online');
    } else if (!isConnected && currentUser) {
      // Definir como offline quando desconectado
      updateUserStatus(currentUser.id, 'offline');
    }
  }, [isConnected, currentUser, updateUserStatus]);

  return {
    updateUserStatus,
  };
};
