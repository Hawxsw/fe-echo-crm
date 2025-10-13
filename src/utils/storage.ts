import { STORAGE_KEYS } from '@/constants/storageKeys';

/**
 * Limpa completamente todos os dados de autenticação do localStorage
 */
export const clearAuthStorage = (): void => {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
  localStorage.removeItem(STORAGE_KEYS.permissions);
};

/**
 * Verifica se existe um token válido no localStorage
 */
export const hasValidToken = (): boolean => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  return !!token && token.length > 0;
};

/**
 * Obtém o token do localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.token);
};

/**
 * Define o token no localStorage
 */
export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.token, token);
};

/**
 * Obtém as permissões do localStorage
 */
export const getPermissions = (): unknown => {
  const perms = localStorage.getItem(STORAGE_KEYS.permissions);
  return perms ? JSON.parse(perms) : null;
};

/**
 * Define as permissões no localStorage
 */
export const setPermissions = (permissions: unknown): void => {
  localStorage.setItem(STORAGE_KEYS.permissions, JSON.stringify(permissions));
};

