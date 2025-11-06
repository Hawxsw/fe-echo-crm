import { toast } from '@/components/ui/toaster';

export interface ApiError {
  message: string;
  statusCode: number;
  errorCode?: string;
  errors?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

const ERROR_MESSAGES: Record<number, string> = {
  401: 'Sessão expirada. Faça login novamente.',
  403: 'Você não tem permissão para realizar esta ação.',
  404: 'Recurso não encontrado.',
  409: 'Conflito: Este recurso já existe.',
  422: 'Dados inválidos. Verifique os campos.',
  500: 'Erro interno do servidor. Tente novamente.',
};

const getValidationErrorMessage = (errors: ApiError['errors']): string => {
  if (!errors?.length) return '';
  const firstError = errors[0];
  return `${firstError.field}: ${firstError.message}`;
};

interface ErrorResponse {
  response?: {
    data?: ApiError;
  };
  message?: string;
}

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (!error || typeof error !== 'object') {
    return defaultMessage;
  }

  const errorResponse = error as ErrorResponse;

  if (!errorResponse.response?.data) {
    return errorResponse.message || defaultMessage;
  }

  const apiError: ApiError = errorResponse.response.data;
  
  if (apiError.errorCode === 'VALIDATION_ERROR' && apiError.errors) {
    return getValidationErrorMessage(apiError.errors);
  }

  if (apiError.message) {
    return apiError.message;
  }

  return ERROR_MESSAGES[apiError.statusCode] || defaultMessage;
};

export const handleApiError = (error: unknown, defaultMessage = 'Ocorreu um erro inesperado'): string => {
  const message = getErrorMessage(error, defaultMessage);
  toast.error(message);
  return message;
};

export const handleApiSuccess = (message: string) => {
  toast.success(message);
};

export const handleApiWarning = (message: string) => {
  toast.warning(message);
};

export const handleApiInfo = (message: string) => {
  toast.info(message);
};

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
  }
): Promise<T | null> => {
  try {
    const result = await operation();
    
    if (options?.showSuccessToast !== false && options?.successMessage) {
      toast.success(options.successMessage);
    }
    
    return result;
  } catch (error) {
    if (options?.showErrorToast !== false) {
      handleApiError(error, options?.errorMessage);
    }
    return null;
  }
};

export const withPromiseHandling = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => toast.promise(promise, messages);
