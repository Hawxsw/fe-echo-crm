import React, { useCallback, useContext } from 'react';
import { IComment, ICreateComment, IUpdateComment } from '../types/kanban';
import { useApiService } from '@/contexts/ApiContext';

interface ICommentsProviderProps {
  children: React.ReactNode;
}

interface ICommentsContextProps {
  createComment: (cardId: string, data: ICreateComment) => Promise<IComment>;
  updateComment: (id: string, data: IUpdateComment) => Promise<IComment>;
  deleteComment: (id: string) => Promise<void>;
}

const CommentsContext = React.createContext<ICommentsContextProps | null>(null);

export const CommentsProvider = ({ children }: ICommentsProviderProps) => {
  const apiService = useApiService();
  const { comment } = apiService;

  const createComment = useCallback(async (cardId: string, data: ICreateComment): Promise<IComment> => {
    try {
      return await comment.createComment(cardId, data);
    } catch (error) {
      throw error;
    }
  }, [comment]);

  const updateComment = useCallback(async (id: string, data: IUpdateComment): Promise<IComment> => {
    try {
      return await comment.updateComment(id, data);
    } catch (error) {
      throw error;
    }
  }, [comment]);

  const deleteComment = useCallback(async (id: string): Promise<void> => {
    try {
      await comment.deleteComment(id);
    } catch (error) {
      throw error;
    }
  }, [comment]);

  return (
    <CommentsContext.Provider
      value={{
        createComment,
        updateComment,
        deleteComment,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => {
  const ctx = useContext(CommentsContext);
  if (ctx == null) {
    throw new Error('useComments() called outside of a CommentsProvider?');
  }
  return ctx;
};

