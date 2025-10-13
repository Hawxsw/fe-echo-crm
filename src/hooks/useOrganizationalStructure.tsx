import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import { IDepartment, ICreateDepartment, IUpdateDepartment, IAddUserToDepartment } from '../types/department';
import { unwrapApiResponse } from '../utils/unwrapApiResponse';

export const useOrganizationalStructure = () => {
  const api = useApi();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar estrutura organizacional completa
  const getOrganizationalStructure = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.department.getOrganizationalStructure();
      setDepartments(unwrapApiResponse(data));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar estrutura organizacional');
      console.error('Error fetching organizational structure:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Criar departamento
  const createDepartment = useCallback(async (departmentData: ICreateDepartment) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.department.create(departmentData);
      const newDepartment = unwrapApiResponse(response);
      
      // Recarregar estrutura organizacional para refletir mudanças
      await getOrganizationalStructure();
      
      return newDepartment;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar departamento');
      console.error('Error creating department:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api, getOrganizationalStructure]);

  // Atualizar departamento
  const updateDepartment = useCallback(async (id: string, departmentData: IUpdateDepartment) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.department.update(id, departmentData);
      const updated = unwrapApiResponse(response);
      
      // Recarregar estrutura organizacional
      await getOrganizationalStructure();
      
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar departamento');
      console.error('Error updating department:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api, getOrganizationalStructure]);

  // Excluir departamento
  const deleteDepartment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.department.delete(id);
      
      // Recarregar estrutura organizacional
      await getOrganizationalStructure();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir departamento');
      console.error('Error deleting department:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api, getOrganizationalStructure]);

  // Adicionar usuário ao departamento
  const addUserToDepartment = useCallback(async (data: IAddUserToDepartment) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.department.addUser(data);
      const result = unwrapApiResponse(response);
      
      // Recarregar estrutura organizacional
      await getOrganizationalStructure();
      
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao adicionar usuário');
      console.error('Error adding user to department:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api, getOrganizationalStructure]);

  // Remover usuário do departamento
  const removeUserFromDepartment = useCallback(async (departmentId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.department.removeUser(departmentId, userId);
      
      // Recarregar estrutura organizacional
      await getOrganizationalStructure();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao remover usuário');
      console.error('Error removing user from department:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api, getOrganizationalStructure]);

  // Definir chefe do departamento
  const setDepartmentHead = useCallback(async (departmentId: string, userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.department.setDepartmentHead(departmentId, userId);
      const result = unwrapApiResponse(response);
      
      // Recarregar estrutura organizacional
      await getOrganizationalStructure();
      
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao definir chefe do departamento');
      console.error('Error setting department head:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api, getOrganizationalStructure]);

  // Mover departamento
  const moveDepartment = useCallback(async (id: string, newParentId: string | null, newPosition?: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.department.move(id, { newParentId, newPosition });
      const moved = unwrapApiResponse(response);
      
      // Recarregar estrutura organizacional
      await getOrganizationalStructure();
      
      return moved;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao mover departamento');
      console.error('Error moving department:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api, getOrganizationalStructure]);

  // Manter compatibilidade com código antigo
  const updateUser = useCallback(async (_userId: string, _userData: any) => {
    console.warn('updateUser is deprecated - use users service directly');
    // Implementação vazia para compatibilidade
  }, []);

  const deleteUser = useCallback(async (_userId: string) => {
    console.warn('deleteUser is deprecated - use users service directly');
    // Implementação vazia para compatibilidade
  }, []);

  return {
    departments,
    loading,
    error,
    getOrganizationalStructure,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    addUserToDepartment,
    removeUserFromDepartment,
    setDepartmentHead,
    moveDepartment,
    // Deprecated - mantidos para compatibilidade
    updateUser,
    deleteUser,
  };
};
