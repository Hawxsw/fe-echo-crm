import React, { useCallback, useContext } from 'react';
import { ICard, ICreateCard, IUpdateCard, IMoveCard } from '../types/kanban';
import { useApiService } from '@/contexts/ApiContext';

interface ICardsProviderProps {
  children: React.ReactNode;
}

interface ICardsContextProps {
  getCardById: (id: string) => Promise<ICard>;
  createCard: (columnId: string, data: ICreateCard) => Promise<ICard>;
  updateCard: (id: string, data: IUpdateCard) => Promise<ICard>;
  moveCard: (id: string, data: IMoveCard) => Promise<ICard>;
  deleteCard: (id: string) => Promise<void>;
}

const CardsContext = React.createContext<ICardsContextProps | null>(null);

export const CardsProvider = ({ children }: ICardsProviderProps) => {
  const apiService = useApiService();
  const { card } = apiService;

  const getCardById = useCallback((id: string) => card.getCardById(id), [card]);
  const createCard = useCallback((columnId: string, data: ICreateCard) => card.createCard(columnId, data), [card]);
  const updateCard = useCallback((id: string, data: IUpdateCard) => card.updateCard(id, data), [card]);
  const moveCard = useCallback((id: string, data: IMoveCard) => card.moveCard(id, data), [card]);
  const deleteCard = useCallback((id: string) => card.deleteCard(id), [card]);

  return (
    <CardsContext.Provider
      value={{
        getCardById,
        createCard,
        updateCard,
        moveCard,
        deleteCard,
      }}
    >
      {children}
    </CardsContext.Provider>
  );
};

export const useCards = () => {
  const ctx = useContext(CardsContext);
  if (ctx == null) {
    throw new Error('useCards() called outside of a CardsProvider?');
  }
  return ctx;
};

