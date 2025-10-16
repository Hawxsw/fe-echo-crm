import { AxiosInstance } from 'axios';
import {
  IDepartment,
  ICreateDepartment,
  IUpdateDepartment,
  IMoveDepartment,
  IAddUserToDepartment,
  IDepartmentHierarchy,
} from '../../types/department';

export class DepartmentService {
  private readonly baseUrl = '/departments';

  constructor(private api: AxiosInstance) {}

  public async create(data: ICreateDepartment): Promise<IDepartment> {
    const response = await this.api.post<IDepartment>(this.baseUrl, data);
    return response.data;
  }

  public async findAll(): Promise<IDepartment[]> {
    const response = await this.api.get<IDepartment[]>(this.baseUrl);
    return response.data;
  }

  public async getOrganizationalStructure(): Promise<IDepartment[]> {
    const response = await this.api.get<IDepartment[]>(`${this.baseUrl}/organizational-structure`);
    return response.data;
  }

  public async findOne(id: string): Promise<IDepartment> {
    const response = await this.api.get<IDepartment>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  public async getUserHierarchy(id: string): Promise<IDepartmentHierarchy> {
    const response = await this.api.get<IDepartmentHierarchy>(`${this.baseUrl}/${id}/hierarchy`);
    return response.data;
  }

  public async update(id: string, data: IUpdateDepartment): Promise<IDepartment> {
    const response = await this.api.patch<IDepartment>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  public async move(id: string, data: IMoveDepartment): Promise<IDepartment> {
    const response = await this.api.patch<IDepartment>(`${this.baseUrl}/${id}/move`, data);
    return response.data;
  }

  public async delete(id: string): Promise<void> {
    await this.api.delete(`${this.baseUrl}/${id}`);
  }

  public async addUser(data: IAddUserToDepartment): Promise<any> {
    const response = await this.api.post(`${this.baseUrl}/add-user`, data);
    return response.data;
  }

  public async removeUser(departmentId: string, userId: string): Promise<{ message: string }> {
    const response = await this.api.delete<{ message: string }>(
      `${this.baseUrl}/${departmentId}/users/${userId}`
    );
    return response.data;
  }

  public async setDepartmentHead(departmentId: string, userId: string): Promise<any> {
    const response = await this.api.post(`${this.baseUrl}/${departmentId}/set-head/${userId}`);
    return response.data;
  }
}
