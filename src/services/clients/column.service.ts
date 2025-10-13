import { AxiosInstance } from 'axios';
import { IColumn, ICreateColumn, IUpdateColumn, IMoveColumn } from '@/types/kanban';

export class ColumnService {
  constructor(private api: AxiosInstance) {}

  public async createColumn(boardId: string, data: ICreateColumn): Promise<IColumn> {
    const response = await this.api.post<IColumn>(`/kanban/boards/${boardId}/columns`, data);
    return response.data;
  }

  public async updateColumn(id: string, data: IUpdateColumn): Promise<IColumn> {
    const response = await this.api.patch<IColumn>(`/kanban/columns/${id}`, data);
    return response.data;
  }

  public async moveColumn(id: string, data: IMoveColumn): Promise<IColumn> {
    const response = await this.api.patch<IColumn>(`/kanban/columns/${id}/move`, data);
    return response.data;
  }

  public async deleteColumn(id: string): Promise<void> {
    await this.api.delete(`/kanban/columns/${id}`);
  }
}

