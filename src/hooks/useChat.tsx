import React, { useCallback, useContext } from 'react';
import { IChat, ICreateChat, IMessage } from '../types/chat';
import { useApiService } from '@/contexts/ApiContext';

interface IChatProviderProps {
  children: React.ReactNode;
}

interface IChatContextProps {
  getAllChats: () => Promise<IChat[]>;
  getChatById: (id: string) => Promise<IChat>;
  createChat: (data: ICreateChat) => Promise<IChat>;
  sendMessage: (chatId: string, content: string) => Promise<IMessage>;
  markAsRead: (chatId: string) => Promise<void>;
}

const ChatContext = React.createContext<IChatContextProps | null>(null);

export const ChatProvider = ({ children }: IChatProviderProps) => {
  const apiService = useApiService();
  const { chat } = apiService;

  const getAllChats = useCallback(() => chat.getAllChats(), [chat]);
  const getChatById = useCallback((id: string) => chat.getChatById(id), [chat]);
  const createChat = useCallback((data: ICreateChat) => chat.createChat(data), [chat]);
  const sendMessage = useCallback((chatId: string, content: string) => chat.sendMessage(chatId, content), [chat]);
  const markAsRead = useCallback((chatId: string) => chat.markAsRead(chatId), [chat]);

  return (
    <ChatContext.Provider
      value={{
        getAllChats,
        getChatById,
        createChat,
        sendMessage,
        markAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (ctx == null) {
    throw new Error('useChat() called outside of a ChatProvider?');
  }
  return ctx;
};

