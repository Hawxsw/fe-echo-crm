import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useApi } from './useApi';
import {
  IDepartment,
  ICreateDepartment,
  IUpdateDepartment,
  IMoveDepartment,
  IAddUserToDepartment,
  IDepartmentHierarchy,
} from '../types/department';
import { unwrapApiResponse } from '../utils/unwrapApiResponse';

interface IDepartmentsContext {
  departments: IDepartment[];
  organizationalStructure: IDepartment[];
  loading: boolean;
  error: string | null;
  fetchDepartments: () => Promise<void>;
  fetchOrganizationalStructure: () => Promise<void>;
  getDepartment: (id: string) => Promise<IDepartment>;
  getDepartmentHierarchy: (id: string) => Promise<IDepartmentHierarchy>;
  createDepartment: (data: ICreateDepartment) => Promise<IDepartment>;
  updateDepartment: (id: string, data: IUpdateDepartment) => Promise<IDepartment>;
  moveDepartment: (id: string, data: IMoveDepartment) => Promise<IDepartment>;
  deleteDepartment: (id: string) => Promise<void>;
  addUserToDepartment: (data: IAddUserToDepartment) => Promise<any>;
  removeUserFromDepartment: (departmentId: string, userId: string) => Promise<void>;
  setDepartmentHead: (departmentId: string, userId: string) => Promise<any>;
}

const DepartmentsContext = createContext<IDepartmentsContext | undefined>(undefined);

export const DepartmentsProvider = ({ children }: { children: ReactNode }) => {
  const api = useApi();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [organizationalStructure, setOrganizationalStructure] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.department.findAll();
      setDepartments(unwrapApiResponse(data));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar departamentos');
    } finally {
      setLoading(false);
    }
  }, [api]);

  const fetchOrganizationalStructure = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.department.getOrganizationalStructure();
      setOrganizationalStructure(unwrapApiResponse(data));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar estrutura organizacional');
    } finally {
      setLoading(false);
    }
  }, [api]);

  const getDepartment = useCallback(async (id: string): Promise<IDepartment> => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.department.findOne(id);
      return unwrapApiResponse(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar departamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const getDepartmentHierarchy = useCallback(async (id: string): Promise<IDepartmentHierarchy> => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.department.getUserHierarchy(id);
      return unwrapApiResponse(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar hierarquia');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const createDepartment = useCallback(async (data: ICreateDepartment): Promise<IDepartment> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.department.create(data);
      const newDepartment = unwrapApiResponse(response) as IDepartment;
      setDepartments((prev) => [...prev, newDepartment]);
      return newDepartment;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar departamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const updateDepartment = useCallback(async (id: string, data: IUpdateDepartment): Promise<IDepartment> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.department.update(id, data);
      const updated = unwrapApiResponse(response) as IDepartment;
      setDepartments((prev) =>
        prev.map((dept) => (dept.id === id ? updated : dept))
      );
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar departamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const moveDepartment = useCallback(async (id: string, data: IMoveDepartment): Promise<IDepartment> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.department.move(id, data);
      const moved = unwrapApiResponse(response) as IDepartment;
      await Promise.all([fetchDepartments(), fetchOrganizationalStructure()]);
      return moved;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao mover departamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api, fetchDepartments, fetchOrganizationalStructure]);

  const deleteDepartment = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await api.department.delete(id);
      setDepartments((prev) => prev.filter((dept) => dept.id !== id));
      setOrganizationalStructure((prev) => prev.filter((dept) => dept.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir departamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const addUserToDepartment = useCallback(async (data: IAddUserToDepartment): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.department.addUser(data);
      const unwrapped = unwrapApiResponse(response);
      return unwrapped;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao adicionar usuário ao departamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const removeUserFromDepartment = useCallback(async (departmentId: string, userId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await api.department.removeUser(departmentId, userId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao remover usuário do departamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  const setDepartmentHead = useCallback(async (departmentId: string, userId: string): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.department.setDepartmentHead(departmentId, userId);
      return unwrapApiResponse(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao definir chefe do departamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api]);

  return (
    <DepartmentsContext.Provider
      value={{
        departments,
        organizationalStructure,
        loading,
        error,
        fetchDepartments,
        fetchOrganizationalStructure,
        getDepartment,
        getDepartmentHierarchy,
        createDepartment,
        updateDepartment,
        moveDepartment,
        deleteDepartment,
        addUserToDepartment,
        removeUserFromDepartment,
        setDepartmentHead,
      }}
    >
      {children}
    </DepartmentsContext.Provider>
  );
};

export const useDepartments = () => {
  const context = useContext(DepartmentsContext);
  if (context === undefined) {
    throw new Error('useDepartments must be used within a DepartmentsProvider');
  }
  return context;
};

