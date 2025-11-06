import { useState, useCallback } from 'react';
import { handleApiError, handleApiSuccess } from '@/utils/error-handler';

interface ErrorWithResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface UseAsyncOperationOptions<T> {
  onSuccess?: (data?: T) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export function useAsyncOperation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      options?: UseAsyncOperationOptions<T>
    ): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await operation();
        
        if (options?.successMessage && options?.showSuccessToast !== false) {
          handleApiSuccess(options.successMessage);
        }
        
        options?.onSuccess?.(result);
        
        return result;
      } catch (err: unknown) {
        const errorWithResponse = err as ErrorWithResponse;
        const errorMessage = 
          errorWithResponse.response?.data?.message || 
          errorWithResponse.message || 
          options?.errorMessage || 
          'Erro ao executar operação';
        
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
