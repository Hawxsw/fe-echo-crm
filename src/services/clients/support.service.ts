import { AxiosInstance } from 'axios';
import {
  ITicket,
  ICreateTicket,
  IUpdateTicket,
  ITicketListResponse,
  IFAQ,
  ICreateFAQ,
  IUpdateFAQ,
  IFAQListResponse,
  IFAQCategories,
} from '@/types/support';

export class SupportService {
  private readonly baseUrl = '/support';

  constructor(private api: AxiosInstance) {}

  // ==================== Ticket Methods ====================

  /**
   * Create new support ticket
   */
  public async createTicket(data: ICreateTicket): Promise<ITicket> {
    const response = await this.api.post<ITicket>(`${this.baseUrl}/tickets`, data);
    return response.data;
  }

  /**
   * List my support tickets
   */
  public async findAllTickets(page: number = 1, limit: number = 10): Promise<ITicketListResponse> {
    const response = await this.api.get<ITicketListResponse>(`${this.baseUrl}/tickets`, {
      params: { page, limit }
    });
    return response.data;
  }

  /**
   * Find ticket by ID
   */
  public async findOneTicket(id: string): Promise<ITicket> {
    const response = await this.api.get<ITicket>(`${this.baseUrl}/tickets/${id}`);
    return response.data;
  }

  /**
   * Update ticket
   */
  public async updateTicket(id: string, data: IUpdateTicket): Promise<ITicket> {
    const response = await this.api.patch<ITicket>(`${this.baseUrl}/tickets/${id}`, data);
    return response.data;
  }

  /**
   * Delete ticket
   */
  public async deleteTicket(id: string): Promise<void> {
    await this.api.delete(`${this.baseUrl}/tickets/${id}`);
  }

  // ==================== FAQ Methods ====================

  /**
   * Create new FAQ (Admin only)
   */
  public async createFAQ(data: ICreateFAQ): Promise<IFAQ> {
    const response = await this.api.post<IFAQ>(`${this.baseUrl}/faqs`, data);
    return response.data;
  }

  /**
   * List all FAQs
   */
  public async findAllFAQs(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string
  ): Promise<IFAQListResponse> {
    const response = await this.api.get<IFAQListResponse>(`${this.baseUrl}/faqs`, {
      params: { page, limit, category, search }
    });
    return response.data;
  }

  /**
   * Get all FAQ categories
   */
  public async getFAQCategories(): Promise<IFAQCategories> {
    const response = await this.api.get<IFAQCategories>(`${this.baseUrl}/faqs/categories`);
    return response.data;
  }

  /**
   * Find FAQ by ID
   */
  public async findOneFAQ(id: string): Promise<IFAQ> {
    const response = await this.api.get<IFAQ>(`${this.baseUrl}/faqs/${id}`);
    return response.data;
  }

  /**
   * Update FAQ (Admin only)
   */
  public async updateFAQ(id: string, data: IUpdateFAQ): Promise<IFAQ> {
    const response = await this.api.patch<IFAQ>(`${this.baseUrl}/faqs/${id}`, data);
    return response.data;
  }

  /**
   * Delete FAQ (Admin only)
   */
  public async deleteFAQ(id: string): Promise<void> {
    await this.api.delete(`${this.baseUrl}/faqs/${id}`);
  }
}

