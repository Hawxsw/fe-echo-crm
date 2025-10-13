import { AxiosInstance } from 'axios';
import { IRole, ICreateRole, IUpdateRole, IAssignRole, ICheckPermission, ICheckPermissionResponse, IPermission } from '@/types/role';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

export class RolesService {
  constructor(private api: AxiosInstance) {}

  public async createRole(data: ICreateRole): Promise<IRole> {
    const response = await this.api.post<{ data: IRole }>('/roles', data);
    return unwrapApiResponse(response);
  }

  public async getAllRoles(): Promise<IRole[]> {
    const response = await this.api.get<{ data: IRole[] }>('/roles');
    return unwrapApiResponse(response);
  }

  public async getRoleById(id: string): Promise<IRole> {
    const response = await this.api.get<{ data: IRole }>(`/roles/${id}`);
    return unwrapApiResponse(response);
  }

  public async updateRole(id: string, data: IUpdateRole): Promise<IRole> {
    const response = await this.api.patch<{ data: IRole }>(`/roles/${id}`, data);
    return unwrapApiResponse(response);
  }

  public async deleteRole(id: string): Promise<void> {
    await this.api.delete(`/roles/${id}`);
  }

  public async assignRole(data: IAssignRole): Promise<{ message: string }> {
    const response = await this.api.post<{ data: { message: string } }>('/roles/assign', data);
    return unwrapApiResponse(response);
  }

  public async checkPermission(data: ICheckPermission): Promise<ICheckPermissionResponse> {
    const response = await this.api.post<{ data: ICheckPermissionResponse }>('/roles/check-permission', data);
    return unwrapApiResponse(response);
  }

  public async getMyPermissions(): Promise<IPermission[]> {
    const response = await this.api.get<{ data: IPermission[] }>('/roles/me/permissions');
    return unwrapApiResponse<IPermission[]>(response);
  }

  public async createDefaultRoles(): Promise<{ message: string }> {
    const response = await this.api.post<{ data: { message: string } }>('/roles/create-defaults');
    return unwrapApiResponse(response);
  }
}

