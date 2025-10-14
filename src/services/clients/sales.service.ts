import { AxiosInstance } from 'axios';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';
import {
  ISalesPipeline,
  ISalesStage,
  ISalesOpportunity,
  ISalesComment,
  ISalesActivity,
  ICreatePipeline,
  IUpdatePipeline,
  ICreateStage,
  IUpdateStage,
  IMoveStage,
  ICreateOpportunity,
  IUpdateOpportunity,
  IMoveOpportunity,
  ICreateComment,
  IUpdateComment,
  ICreateActivity,
  IUpdateActivity,
} from '@/types/sales';

export class SalesService {
  constructor(private api: AxiosInstance) {}



  public async createPipeline(data: ICreatePipeline): Promise<ISalesPipeline> {
    const response = await this.api.post<ISalesPipeline>('/sales/pipelines', data);
    return unwrapApiResponse<ISalesPipeline>(response.data);
  }

  public async getAllPipelines(): Promise<ISalesPipeline[]> {
    const response = await this.api.get<ISalesPipeline[]>('/sales/pipelines');
    return unwrapApiResponse<ISalesPipeline[]>(response.data);
  }

  public async getPipelineById(id: string): Promise<ISalesPipeline> {
    const response = await this.api.get<ISalesPipeline>(`/sales/pipelines/${id}`);
    return unwrapApiResponse<ISalesPipeline>(response.data);
  }

  public async updatePipeline(id: string, data: IUpdatePipeline): Promise<ISalesPipeline> {
    const response = await this.api.patch<ISalesPipeline>(`/sales/pipelines/${id}`, data);
    return unwrapApiResponse<ISalesPipeline>(response.data);
  }

  public async deletePipeline(id: string): Promise<void> {
    await this.api.delete(`/sales/pipelines/${id}`);
  }



  public async createStage(pipelineId: string, data: ICreateStage): Promise<ISalesStage> {
    const response = await this.api.post<ISalesStage>(`/sales/pipelines/${pipelineId}/stages`, data);
    return unwrapApiResponse<ISalesStage>(response.data);
  }

  public async updateStage(id: string, data: IUpdateStage): Promise<ISalesStage> {
    const response = await this.api.patch<ISalesStage>(`/sales/stages/${id}`, data);
    return unwrapApiResponse<ISalesStage>(response.data);
  }

  public async moveStage(id: string, data: IMoveStage): Promise<ISalesStage> {
    const response = await this.api.patch<ISalesStage>(`/sales/stages/${id}/move`, data);
    return unwrapApiResponse<ISalesStage>(response.data);
  }

  public async deleteStage(id: string): Promise<void> {
    await this.api.delete(`/sales/stages/${id}`);
  }



  public async createOpportunity(data: ICreateOpportunity): Promise<ISalesOpportunity> {
    const response = await this.api.post<ISalesOpportunity>('/sales/opportunities', data);
    return unwrapApiResponse<ISalesOpportunity>(response.data);
  }

  public async getOpportunityById(id: string): Promise<ISalesOpportunity> {
    const response = await this.api.get<ISalesOpportunity>(`/sales/opportunities/${id}`);
    return unwrapApiResponse<ISalesOpportunity>(response.data);
  }

  public async updateOpportunity(id: string, data: IUpdateOpportunity): Promise<ISalesOpportunity> {
    const response = await this.api.patch<ISalesOpportunity>(`/sales/opportunities/${id}`, data);
    return unwrapApiResponse<ISalesOpportunity>(response.data);
  }

  public async moveOpportunity(id: string, data: IMoveOpportunity): Promise<ISalesOpportunity> {
    const response = await this.api.patch<ISalesOpportunity>(`/sales/opportunities/${id}/move`, data);
    return unwrapApiResponse<ISalesOpportunity>(response.data);
  }

  public async deleteOpportunity(id: string): Promise<void> {
    await this.api.delete(`/sales/opportunities/${id}`);
  }



  public async createComment(opportunityId: string, data: ICreateComment): Promise<ISalesComment> {
    const response = await this.api.post<ISalesComment>(`/sales/opportunities/${opportunityId}/comments`, data);
    return unwrapApiResponse<ISalesComment>(response.data);
  }

  public async updateComment(id: string, data: IUpdateComment): Promise<ISalesComment> {
    const response = await this.api.patch<ISalesComment>(`/sales/comments/${id}`, data);
    return unwrapApiResponse<ISalesComment>(response.data);
  }

  public async deleteComment(id: string): Promise<void> {
    await this.api.delete(`/sales/comments/${id}`);
  }



  public async createActivity(opportunityId: string, data: ICreateActivity): Promise<ISalesActivity> {
    const response = await this.api.post<ISalesActivity>(`/sales/opportunities/${opportunityId}/activities`, data);
    return unwrapApiResponse<ISalesActivity>(response.data);
  }

  public async updateActivity(id: string, data: IUpdateActivity): Promise<ISalesActivity> {
    const response = await this.api.patch<ISalesActivity>(`/sales/activities/${id}`, data);
    return unwrapApiResponse<ISalesActivity>(response.data);
  }

  public async completeActivity(id: string): Promise<ISalesActivity> {
    const response = await this.api.patch<ISalesActivity>(`/sales/activities/${id}/complete`);
    return unwrapApiResponse<ISalesActivity>(response.data);
  }

  public async deleteActivity(id: string): Promise<void> {
    await this.api.delete(`/sales/activities/${id}`);
  }
}
