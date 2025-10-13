import React, { useCallback, useContext } from 'react';
import { IColumn, ICreateColumn, IUpdateColumn, IMoveColumn } from '../types/kanban';
import { useApiService } from '@/contexts/ApiContext';

interface IColumnsProviderProps {
  children: React.ReactNode;
}

interface IColumnsContextProps {
  createColumn: (boardId: string, data: ICreateColumn) => Promise<IColumn>;
  updateColumn: (id: string, data: IUpdateColumn) => Promise<IColumn>;
  moveColumn: (id: string, data: IMoveColumn) => Promise<IColumn>;
  deleteColumn: (id: string) => Promise<void>;
}

const ColumnsContext = React.createContext<IColumnsContextProps | null>(null);

export const ColumnsProvider = ({ children }: IColumnsProviderProps) => {
  const apiService = useApiService();
  const { column } = apiService;

  const createColumn = useCallback((boardId: string, data: ICreateColumn) => column.createColumn(boardId, data), [column]);
  const updateColumn = useCallback((id: string, data: IUpdateColumn) => column.updateColumn(id, data), [column]);
  const moveColumn = useCallback((id: string, data: IMoveColumn) => column.moveColumn(id, data), [column]);
  const deleteColumn = useCallback((id: string) => column.deleteColumn(id), [column]);

  return (
    <ColumnsContext.Provider
      value={{
        createColumn,
        updateColumn,
        moveColumn,
        deleteColumn,
      }}
    >
      {children}
    </ColumnsContext.Provider>
  );
};

export const useColumns = () => {
  const ctx = useContext(ColumnsContext);
  if (ctx == null) {
    throw new Error('useColumns() called outside of a ColumnsProvider?');
  }
  return ctx;
};

