import React, { useCallback, useContext } from 'react';
import { IWhatsAppConversation, ICreateConversation, IUpdateConversation } from '../types/whatsapp';
import { useApiService } from '@/contexts/ApiContext';

interface IConversationsProviderProps {
  children: React.ReactNode;
}

interface IConversationsContextProps {
  getAllConversations: (page?: number, limit?: number) => Promise<IWhatsAppConversation[]>;
  getConversationById: (id: string) => Promise<IWhatsAppConversation>;
  createConversation: (data: ICreateConversation) => Promise<IWhatsAppConversation>;
  updateConversation: (id: string, data: IUpdateConversation) => Promise<IWhatsAppConversation>;
  deleteConversation: (id: string) => Promise<void>;
}

const ConversationsContext = React.createContext<IConversationsContextProps | null>(null);

export const ConversationsProvider = ({ children }: IConversationsProviderProps) => {
  const apiService = useApiService();
  const { conversation } = apiService;

  const getAllConversations = useCallback(
    (page?: number, limit?: number) => conversation.getAllConversations(page, limit),
    [conversation]
  );

  const getConversationById = useCallback(
    (id: string) => conversation.getConversationById(id),
    [conversation]
  );

  const createConversation = useCallback(
    (data: ICreateConversation) => conversation.createConversation(data),
    [conversation]
  );

  const updateConversation = useCallback(
    (id: string, data: IUpdateConversation) => conversation.updateConversation(id, data),
    [conversation]
  );

  const deleteConversation = useCallback(
    (id: string) => conversation.deleteConversation(id),
    [conversation]
  );

  return (
    <ConversationsContext.Provider
      value={{
        getAllConversations,
        getConversationById,
        createConversation,
        updateConversation,
        deleteConversation,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
};

export const useConversations = () => {
  const ctx = useContext(ConversationsContext);
  if (ctx == null) {
    throw new Error('useConversations() called outside of a ConversationsProvider?');
  }
  return ctx;
};

