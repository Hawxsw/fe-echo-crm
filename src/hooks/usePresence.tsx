import { useEffect } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useAuth } from './useAuth';

export const usePresence = (isConnected: boolean) => {
  const { updateUserStatus } = useChatStore();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (isConnected && currentUser) {
      updateUserStatus(currentUser.id, 'online');
    } else if (!isConnected && currentUser) {
      updateUserStatus(currentUser.id, 'offline');
    }
  }, [isConnected, currentUser, updateUserStatus]);

  return {
    updateUserStatus,
  };
};
