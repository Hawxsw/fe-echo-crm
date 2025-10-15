// Settings Types
export type Theme = 'light' | 'dark' | 'auto';
export type Language = 'pt-BR' | 'en-US' | 'es-ES';
export type PasswordPolicy = 'low' | 'medium' | 'high' | 'strict';
export type BackupFrequency = 'daily' | 'weekly' | 'monthly';

export interface IUpdateSettings {
  // Notification settings
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  marketingNotifications?: boolean;
  
  // Security settings
  twoFactorAuth?: boolean;
  sessionTimeout?: number;
  passwordPolicy?: PasswordPolicy;
  
  // Appearance settings
  theme?: Theme;
  language?: Language;
  timezone?: string;
  
  // System settings
  autoSave?: boolean;
  dataRetention?: number;
  backupFrequency?: BackupFrequency;
}

export interface ISettings {
  id: string;
  userId: string;
  
  // Notification settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingNotifications: boolean;
  
  // Security settings
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: string;
  
  // Appearance settings
  theme: string;
  language: string;
  timezone: string;
  
  // System settings
  autoSave: boolean;
  dataRetention: number;
  backupFrequency: string;
  
  createdAt: string;
  updatedAt: string;
}

