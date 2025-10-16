import { STORAGE_KEYS } from '@/constants/storageKeys';

export const clearAuthStorage = (): void => {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.permissions);
};

export const hasValidToken = (): boolean => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  return !!token && token.length > 0;
};

export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.token);
};

export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.token, token);
};

export const getPermissions = (): unknown => {
  const perms = localStorage.getItem(STORAGE_KEYS.permissions);
  return perms ? JSON.parse(perms) : null;
};

export const setPermissions = (permissions: unknown): void => {
  localStorage.setItem(STORAGE_KEYS.permissions, JSON.stringify(permissions));
};
