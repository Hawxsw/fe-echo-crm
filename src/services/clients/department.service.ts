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

  /**
   * Criar novo departamento
   */
  public async create(data: ICreateDepartment): Promise<IDepartment> {
    const response = await this.api.post<IDepartment>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Listar todos os departamentos
   */
  public async findAll(): Promise<IDepartment[]> {
    const response = await this.api.get<IDepartment[]>(this.baseUrl);
    return response.data;
  }

  /**
   * Obter estrutura organizacional completa (organograma)
   */
  public async getOrganizationalStructure(): Promise<IDepartment[]> {
    const response = await this.api.get<IDepartment[]>(`${this.baseUrl}/organizational-structure`);
    return response.data;
  }

  /**
   * Buscar departamento por ID
   */
  public async findOne(id: string): Promise<IDepartment> {
    const response = await this.api.get<IDepartment>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Obter hierarquia de usuários do departamento
   */
  public async getUserHierarchy(id: string): Promise<IDepartmentHierarchy> {
    const response = await this.api.get<IDepartmentHierarchy>(`${this.baseUrl}/${id}/hierarchy`);
    return response.data;
  }

  /**
   * Atualizar departamento
   */
  public async update(id: string, data: IUpdateDepartment): Promise<IDepartment> {
    const response = await this.api.patch<IDepartment>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Mover departamento na hierarquia
   */
  public async move(id: string, data: IMoveDepartment): Promise<IDepartment> {
    const response = await this.api.patch<IDepartment>(`${this.baseUrl}/${id}/move`, data);
    return response.data;
  }

  /**
   * Excluir departamento
   */
  public async delete(id: string): Promise<void> {
    await this.api.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Adicionar colaborador ao departamento
   */
  public async addUser(data: IAddUserToDepartment): Promise<any> {
    const response = await this.api.post(`${this.baseUrl}/add-user`, data);
    return response.data;
  }

  /**
   * Remover colaborador do departamento
   */
  public async removeUser(departmentId: string, userId: string): Promise<{ message: string }> {
    const response = await this.api.delete<{ message: string }>(
      `${this.baseUrl}/${departmentId}/users/${userId}`
    );
    return response.data;
  }

  /**
   * Definir chefe do departamento
   */
  public async setDepartmentHead(departmentId: string, userId: string): Promise<any> {
    const response = await this.api.post(`${this.baseUrl}/${departmentId}/set-head/${userId}`);
    return response.data;
  }
}

