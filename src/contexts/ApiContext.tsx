import React, { createContext, useContext, useMemo } from 'react';
import { ApiService } from '@/services/api';
import { clearAuthStorage } from '@/utils/storage';

interface IApiContextProps {
  apiService: ApiService;
}

const ApiContext = createContext<IApiContextProps | null>(null);

interface IApiProviderProps {
  children: React.ReactNode;
}

export const ApiProvider = ({ children }: IApiProviderProps) => {

  const apiService = useMemo(() => {
    const logout = () => {
      clearAuthStorage();
      window.location.href = '/login';
    };
    
    return new ApiService(logout);
  }, []);

  return (
    <ApiContext.Provider value={{ apiService }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApiService = () => {
  const ctx = useContext(ApiContext);
  if (ctx == null) {
    throw new Error('useApiService() called outside of ApiProvider');
  }
  return ctx.apiService;
};

