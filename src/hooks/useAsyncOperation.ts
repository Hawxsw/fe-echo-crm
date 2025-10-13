import { useState, useCallback } from 'react';
import { handleApiError } from '@/utils/error-handler';

interface UseAsyncOperationOptions {
  onSuccess?: (data?: any) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

/**
 * Hook genérico para operações assíncronas com tratamento de erro padronizado.
 * 
 * Elimina duplicação de código try/catch em todos os hooks.
 * 
 * @example
 * ```tsx
 * const { execute, loading, error } = useAsyncOperation();
 * 
 * const handleSubmit = async (data) => {
 *   await execute(
 *     () => api.department.create(data),
 *     {
 *       successMessage: 'Departamento criado!',
 *       onSuccess: () => navigate('/departments')
 *     }
 *   );
 * };
 * ```
 */
export function useAsyncOperation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      options?: UseAsyncOperationOptions
    ): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await operation();
        
        if (options?.successMessage && options?.showSuccessToast !== false) {
          const { handleApiSuccess } = await import('@/utils/error-handler');
          handleApiSuccess(options.successMessage);
        }
        
        options?.onSuccess?.(result);
        
        return result;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || options?.errorMessage || 'Erro ao executar operação';
        setError(errorMessage);
        
        if (options?.showErrorToast !== false) {
          handleApiError(err, options?.errorMessage);
        }
        
        options?.onError?.(err);
        
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    execute,
    loading,
    error,
    reset,
  };
}

