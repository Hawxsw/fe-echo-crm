import { ILoginResponse, ILoginCredentials, IRegisterData } from '@/types/auth';
import { IUser } from '@/types/user';
import { AxiosInstance } from 'axios';
import { STORAGE_KEYS } from '@/constants/storageKeys';

export class AuthService {
  constructor(private api: AxiosInstance) {}

  public async signIn(credentials: ILoginCredentials): Promise<ILoginResponse> {
    const response = await this.api.post<{ data: ILoginResponse }>('/auth/login', credentials);
    return (response.data as any).data || response.data;
  }

  public async signUp(data: IRegisterData): Promise<ILoginResponse> {
    const response = await this.api.post<{ data: ILoginResponse }>('/auth/register', data);
    return (response.data as any).data || response.data;
  }

  public async getProfile(): Promise<IUser> {
    const response = await this.api.get<{ data: IUser }>('/auth/profile');
    return (response.data as any).data || response.data;
  }

  public getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.token);
  }

  public setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.token, token);
  }

  public clearToken(): void {
    localStorage.removeItem(STORAGE_KEYS.token);
  }
}