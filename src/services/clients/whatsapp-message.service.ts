import { AxiosInstance } from 'axios';
import { IWhatsAppMessage, ISendWhatsAppMessage } from '@/types/whatsapp';

export class WhatsAppMessageService {
  constructor(private api: AxiosInstance) {}

  public async sendMessage(data: ISendWhatsAppMessage): Promise<IWhatsAppMessage> {
    const response = await this.api.post<IWhatsAppMessage>('/whatsapp/messages', data);
    return response.data;
  }

  public async getConversationMessages(conversationId: string, page?: number, limit?: number): Promise<IWhatsAppMessage[]> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await this.api.get<IWhatsAppMessage[]>(`/whatsapp/conversations/${conversationId}/messages?${params.toString()}`);
    return response.data;
  }
}

