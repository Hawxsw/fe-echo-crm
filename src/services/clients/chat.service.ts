import { AxiosInstance } from 'axios';
import { IChat, ICreateChat, IMessage } from '@/types/chat';

export class ChatService {
  constructor(private api: AxiosInstance) {}

  public async createChat(data: ICreateChat): Promise<IChat> {
    const response = await this.api.post<IChat>('/chat', data);
    return response.data;
  }

  public async getAllChats(): Promise<IChat[]> {
    const response = await this.api.get<IChat[]>('/chat');
    return response.data;
  }

  public async getChatById(id: string): Promise<IChat> {
    try {
      const response = await this.api.get<IChat>(`/chat/${id}`);
      return response.data;
    } catch (error) {
      console.error('ChatService - erro:', error);
      throw error;
    }
  }

  public async sendMessage(chatId: string, content: string): Promise<IMessage> {
    try {
      const response = await this.api.post<IMessage>('/chat/messages', {
        chatId,
        content,
      });
      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('ChatService - erro sendMessage:', error);
      }
      throw error;
    }
  }

  public async markAsRead(chatId: string): Promise<void> {
    await this.api.post(`/chat/${chatId}/mark-as-read`);
  }
}
