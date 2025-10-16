export type Theme = 'light' | 'dark' | 'auto';
export type Language = 'pt-BR' | 'en-US' | 'es-ES';
export type PasswordPolicy = 'low' | 'medium' | 'high' | 'strict';
export type BackupFrequency = 'daily' | 'weekly' | 'monthly';

export interface IUpdateSettings {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  marketingNotifications?: boolean;
  
  twoFactorAuth?: boolean;
  sessionTimeout?: number;
  passwordPolicy?: PasswordPolicy;
  
  theme?: Theme;
  language?: Language;
  timezone?: string;
  
  autoSave?: boolean;
  dataRetention?: number;
  backupFrequency?: BackupFrequency;
}

export interface ISettings {
  id: string;
  userId: string;
  
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingNotifications: boolean;
  
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: string;
  
  theme: string;
  language: string;
  timezone: string;
  
  autoSave: boolean;
  dataRetention: number;
  backupFrequency: string;
  
  createdAt: string;
  updatedAt: string;
}
