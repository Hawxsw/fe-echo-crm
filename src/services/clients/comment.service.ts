import { AxiosInstance } from 'axios';
import { IComment, ICreateComment, IUpdateComment } from '@/types/kanban';

export class CommentService {
  constructor(private api: AxiosInstance) {}

  public async createComment(cardId: string, data: ICreateComment): Promise<IComment> {
    const response = await this.api.post<IComment>(`/kanban/cards/${cardId}/comments`, data);
    return response.data;
  }

  public async updateComment(id: string, data: IUpdateComment): Promise<IComment> {
    const response = await this.api.patch<IComment>(`/kanban/comments/${id}`, data);
    return response.data;
  }

  public async deleteComment(id: string): Promise<void> {
    await this.api.delete(`/kanban/comments/${id}`);
  }
}

