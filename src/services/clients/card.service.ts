import { AxiosInstance } from 'axios';
import { ICard, ICreateCard, IUpdateCard, IMoveCard } from '@/types/kanban';

export class CardService {
  constructor(private api: AxiosInstance) {}

  public async createCard(columnId: string, data: ICreateCard): Promise<ICard> {
    const response = await this.api.post<ICard>(`/kanban/columns/${columnId}/cards`, data);
    return response.data;
  }

  public async getCardById(id: string): Promise<ICard> {
    const response = await this.api.get<ICard>(`/kanban/cards/${id}`);
    return response.data;
  }

  public async updateCard(id: string, data: IUpdateCard): Promise<ICard> {
    const response = await this.api.patch<ICard>(`/kanban/cards/${id}`, data);
    return response.data;
  }

  public async moveCard(id: string, data: IMoveCard): Promise<ICard> {
    const response = await this.api.patch<ICard>(`/kanban/cards/${id}/move`, data);
    return response.data;
  }

  public async deleteCard(id: string): Promise<void> {
    await this.api.delete(`/kanban/cards/${id}`);
  }
}

