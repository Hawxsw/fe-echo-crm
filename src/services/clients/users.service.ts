import { AxiosInstance } from 'axios';
import { IUser, ICreateUser, IUpdateUser } from '@/types/user';

export class UsersService {
  constructor(private api: AxiosInstance) {}

  public async getAllUsers(page?: number, limit?: number): Promise<IUser[]> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    const response = await this.api.get<{ data: IUser[] }>(`/users?${params.toString()}`);
    return response.data.data;
  }

  public async getUserById(id: string): Promise<IUser> {
    const response = await this.api.get<IUser>(`/users/${id}`);
    return response.data;
  }

  public async createUser(data: ICreateUser): Promise<IUser> {
    const response = await this.api.post<IUser>('/users', data);
    return response.data;
  }

  public async updateUser(id: string, data: IUpdateUser): Promise<IUser> {
    const response = await this.api.patch<IUser>(`/users/${id}`, data);
    return response.data;
  }

  public async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }
}
