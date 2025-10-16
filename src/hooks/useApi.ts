import { useApiService } from '@/contexts/ApiContext';

export const useApi = () => {
  return useApiService();
};
