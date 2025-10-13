import { AxiosInstance } from 'axios';
import { IMessage, ISendMessage, IUpdateMessage } from '@/types/chat';

export class MessageService {
  constructor(private api: AxiosInstance) {}

  public async sendMessage(data: ISendMessage): Promise<IMessage> {
    const response = await this.api.post<IMessage>('/chat/messages', data);
    return response.data;
  }

  public async getChatMessages(chatId: string, page?: number, limit?: number): Promise<IMessage[]> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await this.api.get<IMessage[]>(`/chat/${chatId}/messages?${params.toString()}`);
    return response.data;
  }

  public async updateMessage(id: string, data: IUpdateMessage): Promise<IMessage> {
    const response = await this.api.patch<IMessage>(`/chat/messages/${id}`, data);
    return response.data;
  }

  public async deleteMessage(id: string): Promise<void> {
    await this.api.delete(`/chat/messages/${id}`);
  }
}

