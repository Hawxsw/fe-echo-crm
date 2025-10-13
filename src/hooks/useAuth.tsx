import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IUser } from '@/types/user';
import { IPermission } from '@/types/role';
import { parsePermissions } from '@/utils/permissions';
import { clearAuthStorage, getToken, setToken, setPermissions, getPermissions } from '@/utils/storage';
import { loginSchema, registerSchema, LoginSchema, RegisterSchema } from '@/schemas';
import { useApiService } from '@/contexts/ApiContext';

interface IAuthProviderProps {
  children: React.ReactNode;
}

interface IAuthContextProps {
  currentUser: IUser | null;
  login: (payload: LoginSchema) => Promise<void>;
  register: (payload: RegisterSchema) => Promise<void>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
  token: string | null;
  checkPermissions: (permissions: string[]) => boolean;
}

const AuthContext = React.createContext<IAuthContextProps | null>(null);

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<IAuthContextProps['currentUser']>(null);
  const [loading, setLoading] = useState(true);
  const [tokenState, setTokenState] = useState<string | null>(getToken());

  const apiService = useApiService();
  const { auth, roles } = apiService;

  const logout = useCallback(async () => {
    setCurrentUser(null);
    setTokenState(null);
    clearAuthStorage();
    window.location.href = '/login';
  }, []);

  const clearUserState = useCallback(() => {
    setCurrentUser(null);
    setTokenState(null);
    clearAuthStorage();
  }, []);

  const getMe = useCallback(async () => {
    const storedToken = getToken();

    if (!storedToken) {
      clearUserState();
      return;
    }

    try {
      const [userData, userPermissions] = await Promise.all([
        auth.getProfile(),
        roles.getMyPermissions(),
      ]);

      setPermissions(userPermissions);
      setCurrentUser(userData);
    } catch (error) {
      clearUserState();
      throw error;
    }
  }, [auth, roles, clearUserState]);

  const setAuthData = useCallback(
    async (accessToken: string, user: IUser) => {
      setToken(accessToken);
      setTokenState(accessToken);
      setCurrentUser(user);

      try {
        const userPermissions = await roles.getMyPermissions();
        setPermissions(userPermissions);
      } catch {
        
      }
    },
    [roles]
  );

  const login = useCallback(
    async (payload: LoginSchema) => {
      const validatedData = loginSchema.parse(payload);
      const data = await auth.signIn(validatedData);
      await setAuthData(data.access_token, data.user as unknown as IUser);
    },
    [auth, setAuthData],
  );

  const register = useCallback(
    async (payload: RegisterSchema) => {
      const validatedData = registerSchema.parse(payload);
      const data = await auth.signUp(validatedData);
      await setAuthData(data.access_token, data.user as unknown as IUser);
    },
    [auth, setAuthData],
  );

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      
      if (storedToken && !currentUser) {
        try {
          await getMe();
        } catch (_error) {
          clearUserState();
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, [currentUser, getMe, clearUserState]);

  const checkPermissions = useCallback((permissions: string[]): boolean => {
    const userPermissions = getPermissions() as IPermission[] | null;
    if (!userPermissions?.length) return false;

    const isSuperAdmin = userPermissions.some(
      (perm) => perm.action === 'MANAGE' && perm.resource === 'ALL'
    );
    if (isSuperAdmin) return true;

    const parsedPermissions = parsePermissions(permissions);
    return userPermissions.some((userPerm) =>
      parsedPermissions.some(
        (perm) => perm.action === userPerm.action && perm.resource === userPerm.resource
      )
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        getMe,
        token: tokenState,
        checkPermissions,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx == null) {
    throw new Error('useAuth() called outside of a AuthProvider?');
  }
  return ctx;
};

