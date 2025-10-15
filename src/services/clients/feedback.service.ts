import { AxiosInstance } from 'axios';
import {
  IFeedback,
  ICreateFeedback,
  IUpdateFeedback,
  IFeedbackStats,
  IFeedbackListResponse,
  IVoteResponse,
} from '@/types/feedback';

export class FeedbackService {
  private readonly baseUrl = '/feedback';

  constructor(private api: AxiosInstance) {}

  /**
   * Create new feedback
   */
  public async create(data: ICreateFeedback): Promise<IFeedback> {
    const response = await this.api.post<IFeedback>(this.baseUrl, data);
    return response.data;
  }

  /**
   * List all feedbacks with pagination
   */
  public async findAll(page: number = 1, limit: number = 10): Promise<IFeedbackListResponse> {
    const response = await this.api.get<IFeedbackListResponse>(this.baseUrl, {
      params: { page, limit }
    });
    return response.data;
  }

  /**
   * List my feedbacks
   */
  public async findMyFeedbacks(page: number = 1, limit: number = 10): Promise<IFeedbackListResponse> {
    const response = await this.api.get<IFeedbackListResponse>(`${this.baseUrl}/my`, {
      params: { page, limit }
    });
    return response.data;
  }

  /**
   * Get feedback statistics
   */
  public async getStats(): Promise<IFeedbackStats> {
    const response = await this.api.get<IFeedbackStats>(`${this.baseUrl}/stats`);
    return response.data;
  }

  /**
   * Get top voted suggestions
   */
  public async getTopSuggestions(limit: number = 10): Promise<IFeedback[]> {
    const response = await this.api.get<IFeedback[]>(`${this.baseUrl}/top-suggestions`, {
      params: { limit }
    });
    return response.data;
  }

  /**
   * Find feedback by ID
   */
  public async findOne(id: string): Promise<IFeedback> {
    const response = await this.api.get<IFeedback>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Update feedback
   */
  public async update(id: string, data: IUpdateFeedback): Promise<IFeedback> {
    const response = await this.api.patch<IFeedback>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete feedback
   */
  public async delete(id: string): Promise<void> {
    await this.api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Toggle vote on feedback
   */
  public async toggleVote(id: string): Promise<IVoteResponse> {
    const response = await this.api.post<IVoteResponse>(`${this.baseUrl}/${id}/vote`);
    return response.data;
  }
}

