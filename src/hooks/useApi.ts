import { useApiService } from '@/contexts/ApiContext';

/**
 * Hook para acessar a instância compartilhada da API.
 * 
 * DEPRECATED: Use useApiService() diretamente.
 * Este hook é mantido apenas para compatibilidade com código legado.
 */
export const useApi = () => {
  return useApiService();
};

