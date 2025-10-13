import { AxiosInstance } from 'axios';
import { IBoard, ICreateBoard, IUpdateBoard } from '@/types/kanban';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

export class BoardService {
  constructor(private api: AxiosInstance) {}

  public async createBoard(data: ICreateBoard): Promise<IBoard> {
    const response = await this.api.post<IBoard>('/kanban/boards', data);
    return unwrapApiResponse<IBoard>(response.data);
  }

  public async getAllBoards(): Promise<IBoard[]> {
    const response = await this.api.get<IBoard[]>('/kanban/boards');
    return unwrapApiResponse<IBoard[]>(response.data);
  }

  public async getBoardById(id: string): Promise<IBoard> {
    const response = await this.api.get<IBoard>(`/kanban/boards/${id}`);
    return unwrapApiResponse<IBoard>(response.data);
  }

  public async updateBoard(id: string, data: IUpdateBoard): Promise<IBoard> {
    const response = await this.api.patch<IBoard>(`/kanban/boards/${id}`, data);
    return unwrapApiResponse<IBoard>(response.data);
  }

  public async deleteBoard(id: string): Promise<void> {
    await this.api.delete(`/kanban/boards/${id}`);
  }
}

