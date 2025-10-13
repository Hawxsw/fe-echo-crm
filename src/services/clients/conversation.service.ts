import { AxiosInstance } from 'axios';
import { IWhatsAppConversation, ICreateConversation, IUpdateConversation } from '@/types/whatsapp';

export class ConversationService {
  constructor(private api: AxiosInstance) {}

  public async createConversation(data: ICreateConversation): Promise<IWhatsAppConversation> {
    const response = await this.api.post<IWhatsAppConversation>('/whatsapp/conversations', data);
    return response.data;
  }

  public async getAllConversations(page?: number, limit?: number): Promise<IWhatsAppConversation[]> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await this.api.get<IWhatsAppConversation[]>(`/whatsapp/conversations?${params.toString()}`);
    return response.data;
  }

  public async getConversationById(id: string): Promise<IWhatsAppConversation> {
    const response = await this.api.get<IWhatsAppConversation>(`/whatsapp/conversations/${id}`);
    return response.data;
  }

  public async updateConversation(id: string, data: IUpdateConversation): Promise<IWhatsAppConversation> {
    const response = await this.api.patch<IWhatsAppConversation>(`/whatsapp/conversations/${id}`, data);
    return response.data;
  }

  public async deleteConversation(id: string): Promise<void> {
    await this.api.delete(`/whatsapp/conversations/${id}`);
  }
}

