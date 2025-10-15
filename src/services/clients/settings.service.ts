import { AxiosInstance } from 'axios';
import { ISettings, IUpdateSettings } from '@/types/settings';

export class SettingsService {
  private readonly baseUrl = '/settings';

  constructor(private api: AxiosInstance) {}

  /**
   * Get user settings
   */
  public async getSettings(): Promise<ISettings> {
    const response = await this.api.get<ISettings>(this.baseUrl);
    return response.data;
  }

  /**
   * Update user settings
   */
  public async updateSettings(data: IUpdateSettings): Promise<ISettings> {
    const response = await this.api.patch<ISettings>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Reset settings to default
   */
  public async resetSettings(): Promise<ISettings> {
    const response = await this.api.post<ISettings>(`${this.baseUrl}/reset`);
    return response.data;
  }
}

