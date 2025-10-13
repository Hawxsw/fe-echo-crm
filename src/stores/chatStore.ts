import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserStatus = 'online' | 'away' | 'busy' | 'offline';

export interface UserPresence {
  userId: string;
  status: UserStatus;
  lastSeen?: Date;
  customStatus?: string;
}

interface ChatStoreState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  userPresences: Record<string, UserPresence>;
  setUserPresence: (userId: string, presence: Partial<UserPresence>) => void;
  updateUserStatus: (userId: string, status: UserStatus) => void;
  typingUsers: Record<string, string[]>;
  setUserTyping: (chatId: string, userId: string, isTyping: boolean) => void;
  isConnected: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'reconnecting';
  setConnectionStatus: (status: 'connected' | 'connecting' | 'disconnected' | 'reconnecting') => void;
}

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      userPresences: {},
      setUserPresence: (userId, presence) => {
        set((state) => ({
          userPresences: {
            ...state.userPresences,
            [userId]: {
              ...state.userPresences[userId],
              userId,
              ...presence,
            },
          },
        }));
      },
      updateUserStatus: (userId, status) => {
        set((state) => ({
          userPresences: {
            ...state.userPresences,
            [userId]: {
              ...state.userPresences[userId],
              userId,
              status,
              lastSeen: status === 'online' ? new Date() : state.userPresences[userId]?.lastSeen,
            },
          },
        }));
      },
      typingUsers: {},
      setUserTyping: (chatId, userId, isTyping) => {
        set((state) => {
          const currentTyping = state.typingUsers[chatId] || [];
          
          if (isTyping) {
            if (!currentTyping.includes(userId)) {
              return {
                typingUsers: {
                  ...state.typingUsers,
                  [chatId]: [...currentTyping, userId],
                },
              };
            }
          } else {
            return {
              typingUsers: {
                ...state.typingUsers,
                [chatId]: currentTyping.filter(id => id !== userId),
              },
            };
          }
          
          return state;
        });
      },
      isConnected: false,
      connectionStatus: 'disconnected',
      setConnectionStatus: (status) => {
        set({ 
          connectionStatus: status,
          isConnected: status === 'connected'
        });
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ 
        theme: state.theme,
      }),
    }
  )
);

export const initializeTheme = () => {
  const theme = useChatStore.getState().theme;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

