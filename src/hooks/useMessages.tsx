import React, { useCallback, useContext } from 'react';
import { IMessage, ISendMessage, IUpdateMessage } from '../types/chat';
import { useApiService } from '@/contexts/ApiContext';

interface IMessagesProviderProps {
  children: React.ReactNode;
}

interface IMessagesContextProps {
  getChatMessages: (chatId: string, page?: number, limit?: number) => Promise<IMessage[]>;
  sendMessage: (data: ISendMessage) => Promise<IMessage>;
  updateMessage: (id: string, data: IUpdateMessage) => Promise<IMessage>;
  deleteMessage: (id: string) => Promise<void>;
}

const MessagesContext = React.createContext<IMessagesContextProps | null>(null);

export const MessagesProvider = ({ children }: IMessagesProviderProps) => {
  const apiService = useApiService();
  const { message } = apiService;

  const getChatMessages = useCallback(async (chatId: string, page?: number, limit?: number): Promise<IMessage[]> => {
    try {
      return await message.getChatMessages(chatId, page, limit);
    } catch (error) {
      throw error;
    }
  }, [message]);

  const sendMessage = useCallback(async (data: ISendMessage): Promise<IMessage> => {
    try {
      return await message.sendMessage(data);
    } catch (error) {
      throw error;
    }
  }, [message]);

  const updateMessage = useCallback(async (id: string, data: IUpdateMessage): Promise<IMessage> => {
    try {
      return await message.updateMessage(id, data);
    } catch (error) {
      throw error;
    }
  }, [message]);

  const deleteMessage = useCallback(async (id: string): Promise<void> => {
    try {
      await message.deleteMessage(id);
    } catch (error) {
      throw error;
    }
  }, [message]);

  return (
    <MessagesContext.Provider
      value={{
        getChatMessages,
        sendMessage,
        updateMessage,
        deleteMessage,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const ctx = useContext(MessagesContext);
  if (ctx == null) {
    throw new Error('useMessages() called outside of a MessagesProvider?');
  }
  return ctx;
};

