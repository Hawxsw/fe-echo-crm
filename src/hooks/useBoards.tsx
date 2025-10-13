import React, { useCallback, useContext } from 'react';
import { IBoard, ICreateBoard, IUpdateBoard } from '../types/kanban';
import { useApiService } from '@/contexts/ApiContext';

interface IBoardsProviderProps {
  children: React.ReactNode;
}

interface IBoardsContextProps {
  getAllBoards: () => Promise<IBoard[]>;
  getBoardById: (id: string) => Promise<IBoard>;
  createBoard: (data: ICreateBoard) => Promise<IBoard>;
  updateBoard: (id: string, data: IUpdateBoard) => Promise<IBoard>;
  deleteBoard: (id: string) => Promise<void>;
}

const BoardsContext = React.createContext<IBoardsContextProps | null>(null);

export const BoardsProvider = ({ children }: IBoardsProviderProps) => {
  const apiService = useApiService();
  const { board } = apiService;

  const getAllBoards = useCallback(() => board.getAllBoards(), [board]);
  const getBoardById = useCallback((id: string) => board.getBoardById(id), [board]);
  const createBoard = useCallback((data: ICreateBoard) => board.createBoard(data), [board]);
  const updateBoard = useCallback((id: string, data: IUpdateBoard) => board.updateBoard(id, data), [board]);
  const deleteBoard = useCallback((id: string) => board.deleteBoard(id), [board]);

  return (
    <BoardsContext.Provider
      value={{
        getAllBoards,
        getBoardById,
        createBoard,
        updateBoard,
        deleteBoard,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};

export const useBoards = () => {
  const ctx = useContext(BoardsContext);
  if (ctx == null) {
    throw new Error('useBoards() called outside of a BoardsProvider?');
  }
  return ctx;
};

