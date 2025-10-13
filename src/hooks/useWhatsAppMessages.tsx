import React, { useCallback, useContext } from 'react';
import { IWhatsAppMessage, ISendWhatsAppMessage } from '../types/whatsapp';
import { useApiService } from '@/contexts/ApiContext';

interface IWhatsAppMessagesProviderProps {
  children: React.ReactNode;
}

interface IWhatsAppMessagesContextProps {
  getConversationMessages: (conversationId: string, page?: number, limit?: number) => Promise<IWhatsAppMessage[]>;
  sendMessage: (data: ISendWhatsAppMessage) => Promise<IWhatsAppMessage>;
}

const WhatsAppMessagesContext = React.createContext<IWhatsAppMessagesContextProps | null>(null);

export const WhatsAppMessagesProvider = ({ children }: IWhatsAppMessagesProviderProps) => {
  const apiService = useApiService();
  const { whatsappMessage } = apiService;

  const getConversationMessages = useCallback(async (conversationId: string, page?: number, limit?: number): Promise<IWhatsAppMessage[]> => {
    try {
      return await whatsappMessage.getConversationMessages(conversationId, page, limit);
    } catch (error) {
      throw error;
    }
  }, [whatsappMessage]);

  const sendMessage = useCallback(async (data: ISendWhatsAppMessage): Promise<IWhatsAppMessage> => {
    try {
      return await whatsappMessage.sendMessage(data);
    } catch (error) {
      throw error;
    }
  }, [whatsappMessage]);

  return (
    <WhatsAppMessagesContext.Provider
      value={{
        getConversationMessages,
        sendMessage,
      }}
    >
      {children}
    </WhatsAppMessagesContext.Provider>
  );
};

export const useWhatsAppMessages = () => {
  const ctx = useContext(WhatsAppMessagesContext);
  if (ctx == null) {
    throw new Error('useWhatsAppMessages() called outside of a WhatsAppMessagesProvider?');
  }
  return ctx;
};

