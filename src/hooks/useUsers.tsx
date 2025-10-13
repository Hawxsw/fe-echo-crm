import React, { useCallback, useContext, useState } from 'react';
import { IUser, ICreateUser, IUpdateUser } from '../types/user';
import { useApiService } from '@/contexts/ApiContext';

interface IUsersProviderProps {
  children: React.ReactNode;
}

interface IUsersContextProps {
  users: IUser[];
  loading: boolean;
  getAllUsers: (page?: number, limit?: number) => Promise<IUser[]>;
  getUserById: (id: string) => Promise<IUser>;
  createUser: (data: ICreateUser) => Promise<IUser>;
  updateUser: (id: string, data: IUpdateUser) => Promise<IUser>;
  deleteUser: (id: string) => Promise<void>;
}

const UsersContext = React.createContext<IUsersContextProps | null>(null);

export const UsersProvider = ({ children }: IUsersProviderProps) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  
  const apiService = useApiService();
  const { users: usersApi } = apiService;

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const usersData = await usersApi.getAllUsers();
      setUsers(usersData);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [usersApi]);

  const getAllUsers = useCallback(async (page?: number, limit?: number): Promise<IUser[]> => {
    const usersData = await usersApi.getAllUsers(page, limit);
    setUsers(usersData);
    return usersData;
  }, [usersApi]);

  const getUserById = useCallback((id: string) => usersApi.getUserById(id), [usersApi]);

  const createUser = useCallback(async (data: ICreateUser): Promise<IUser> => {
    const newUser = await usersApi.createUser(data);
    await loadUsers();
    return newUser;
  }, [usersApi, loadUsers]);

  const updateUser = useCallback(async (id: string, data: IUpdateUser): Promise<IUser> => {
    const updatedUser = await usersApi.updateUser(id, data);
    await loadUsers();
    return updatedUser;
  }, [usersApi, loadUsers]);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    await usersApi.deleteUser(id);
    await loadUsers();
  }, [usersApi, loadUsers]);

  return (
    <UsersContext.Provider
      value={{
        users,
        loading,
        getAllUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const ctx = useContext(UsersContext);
  if (ctx == null) {
    throw new Error('useUsers() called outside of a UsersProvider?');
  }
  return ctx;
};

