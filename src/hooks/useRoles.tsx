import React, { useCallback, useContext, useState } from 'react';
import { IRole, ICreateRole, IUpdateRole, IAssignRole, ICheckPermission, ICheckPermissionResponse, IPermission } from '../types/role';
import { useApiService } from '@/contexts/ApiContext';

interface IRolesProviderProps {
  children: React.ReactNode;
}

interface IRolesContextProps {
  roles: IRole[];
  loading: boolean;
  getAllRoles: () => Promise<IRole[]>;
  getRoleById: (id: string) => Promise<IRole>;
  createRole: (data: ICreateRole) => Promise<IRole>;
  updateRole: (id: string, data: IUpdateRole) => Promise<IRole>;
  deleteRole: (id: string) => Promise<void>;
  assignRole: (data: IAssignRole) => Promise<{ message: string }>;
  checkPermission: (data: ICheckPermission) => Promise<ICheckPermissionResponse>;
  getMyPermissions: () => Promise<IPermission[]>;
  createDefaultRoles: () => Promise<{ message: string }>;
}

const RolesContext = React.createContext<IRolesContextProps | null>(null);

export const RolesProvider = ({ children }: IRolesProviderProps) => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState(false);
  
  const apiService = useApiService();
  const { roles: rolesApi } = apiService;

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      const rolesData = await rolesApi.getAllRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error('Erro ao carregar roles:', error);
    } finally {
      setLoading(false);
    }
  }, [rolesApi]);

  const getAllRoles = useCallback(async (): Promise<IRole[]> => {
    const rolesData = await rolesApi.getAllRoles();
    setRoles(rolesData);
    return rolesData;
  }, [rolesApi]);

  const getRoleById = useCallback((id: string) => rolesApi.getRoleById(id), [rolesApi]);

  const createRole = useCallback(async (data: ICreateRole): Promise<IRole> => {
    const newRole = await rolesApi.createRole(data);
    await loadRoles();
    return newRole;
  }, [rolesApi, loadRoles]);

  const updateRole = useCallback(async (id: string, data: IUpdateRole): Promise<IRole> => {
    const updatedRole = await rolesApi.updateRole(id, data);
    await loadRoles();
    return updatedRole;
  }, [rolesApi, loadRoles]);

  const deleteRole = useCallback(async (id: string): Promise<void> => {
    await rolesApi.deleteRole(id);
    await loadRoles();
  }, [rolesApi, loadRoles]);

  const assignRole = useCallback((data: IAssignRole) => rolesApi.assignRole(data), [rolesApi]);
  const checkPermission = useCallback((data: ICheckPermission) => rolesApi.checkPermission(data), [rolesApi]);
  const getMyPermissions = useCallback(() => rolesApi.getMyPermissions(), [rolesApi]);
  const createDefaultRoles = useCallback(() => rolesApi.createDefaultRoles(), [rolesApi]);

  return (
    <RolesContext.Provider
      value={{
        roles,
        loading,
        getAllRoles,
        getRoleById,
        createRole,
        updateRole,
        deleteRole,
        assignRole,
        checkPermission,
        getMyPermissions,
        createDefaultRoles,
      }}
    >
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = () => {
  const ctx = useContext(RolesContext);
  if (ctx == null) {
    throw new Error('useRoles() called outside of a RolesProvider?');
  }
  return ctx;
};

