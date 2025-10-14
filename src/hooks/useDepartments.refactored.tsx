import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useApi } from './useApi';
import { useAsyncOperation } from './useAsyncOperation';
import {
  IDepartment,
  ICreateDepartment,
  IUpdateDepartment,
  IMoveDepartment,
  IAddUserToDepartment,
  IDepartmentHierarchy,
} from '@/types/department';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';
import { MESSAGES } from '@/constants/messages';

interface IDepartmentsContext {
  departments: IDepartment[];
  organizationalStructure: IDepartment[];
  loading: boolean;
  error: string | null;
  fetchDepartments: () => Promise<void>;
  fetchOrganizationalStructure: () => Promise<void>;
  getDepartment: (id: string) => Promise<IDepartment | null>;
  getDepartmentHierarchy: (id: string) => Promise<IDepartmentHierarchy | null>;
  createDepartment: (data: ICreateDepartment) => Promise<IDepartment | null>;
  updateDepartment: (id: string, data: IUpdateDepartment) => Promise<IDepartment | null>;
  moveDepartment: (id: string, data: IMoveDepartment) => Promise<IDepartment | null>;
  deleteDepartment: (id: string) => Promise<void>;
  addUserToDepartment: (data: IAddUserToDepartment) => Promise<any>;
  removeUserFromDepartment: (departmentId: string, userId: string) => Promise<void>;
  setDepartmentHead: (departmentId: string, userId: string) => Promise<any>;
}

const DepartmentsContext = createContext<IDepartmentsContext | undefined>(undefined);

export const DepartmentsProvider = ({ children }: { children: ReactNode }) => {
  const api = useApi();
  const { execute, loading, error } = useAsyncOperation();
  
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [organizationalStructure, setOrganizationalStructure] = useState<IDepartment[]>([]);

  const fetchDepartments = useCallback(async () => {
    const result = await execute(
      async () => {
        const data = await api.department.findAll();
        return unwrapApiResponse(data);
      },
      {
        errorMessage: MESSAGES.ERROR.DEPARTMENT_LOAD,
        showSuccessToast: false,
      }
    );
    
    if (result) {
      setDepartments(result as IDepartment[]);
    }
  }, [api, execute]);

  const fetchOrganizationalStructure = useCallback(async () => {
    const result = await execute(
      async () => {
        const data = await api.department.getOrganizationalStructure();
        return unwrapApiResponse(data);
      },
      {
        errorMessage: MESSAGES.ERROR.DEPARTMENT_LOAD,
        showSuccessToast: false,
      }
    );
    
    if (result) {
      setOrganizationalStructure(result as IDepartment[]);
    }
  }, [api, execute]);

  const getDepartment = useCallback(async (id: string): Promise<IDepartment | null> => {
    return execute(
      async () => {
        const data = await api.department.findOne(id);
        return unwrapApiResponse(data) as IDepartment;
      },
      {
        errorMessage: MESSAGES.ERROR.DEPARTMENT_LOAD,
        showSuccessToast: false,
      }
    );
  }, [api, execute]);

  const getDepartmentHierarchy = useCallback(async (id: string): Promise<IDepartmentHierarchy | null> => {
    return execute(
      async () => {
        const data = await api.department.getUserHierarchy(id);
        return unwrapApiResponse(data) as IDepartmentHierarchy;
      },
      {
        errorMessage: MESSAGES.ERROR.DEPARTMENT_LOAD,
        showSuccessToast: false,
      }
    );
  }, [api, execute]);

  const createDepartment = useCallback(async (data: ICreateDepartment) => {
    return execute(
      async () => {
        const response = await api.department.create(data);
        const newDepartment = unwrapApiResponse(response) as IDepartment;
        setDepartments((prev) => [...prev, newDepartment]);
        return newDepartment;
      },
      {
        successMessage: MESSAGES.SUCCESS.DEPARTMENT_CREATED,
        errorMessage: MESSAGES.ERROR.DEPARTMENT_CREATE,
      }
    );
  }, [api, execute]);

  const updateDepartment = useCallback(async (id: string, data: IUpdateDepartment) => {
    return execute(
      async () => {
        const response = await api.department.update(id, data);
        const updated = unwrapApiResponse(response) as IDepartment;
        setDepartments((prev) =>
          prev.map((dept) => (dept.id === id ? updated : dept))
        );
        return updated;
      },
      {
        successMessage: MESSAGES.SUCCESS.DEPARTMENT_UPDATED,
        errorMessage: MESSAGES.ERROR.DEPARTMENT_UPDATE,
      }
    );
  }, [api, execute]);

  const moveDepartment = useCallback(async (id: string, data: IMoveDepartment) => {
    return execute(
      async () => {
        const response = await api.department.move(id, data);
        const moved = unwrapApiResponse(response) as IDepartment;
        await Promise.all([fetchDepartments(), fetchOrganizationalStructure()]);
        return moved;
      },
      {
        successMessage: 'Departamento movido com sucesso!',
        errorMessage: 'Erro ao mover departamento',
      }
    );
  }, [api, execute, fetchDepartments, fetchOrganizationalStructure]);

  const deleteDepartment = useCallback(async (id: string) => {
    await execute(
      async () => {
        await api.department.delete(id);
        setDepartments((prev) => prev.filter((dept) => dept.id !== id));
        setOrganizationalStructure((prev) => prev.filter((dept) => dept.id !== id));
      },
      {
        successMessage: MESSAGES.SUCCESS.DEPARTMENT_DELETED,
        errorMessage: MESSAGES.ERROR.DEPARTMENT_DELETE,
      }
    );
  }, [api, execute]);

  const addUserToDepartment = useCallback(async (data: IAddUserToDepartment) => {
    return execute(
      async () => {
        const response = await api.department.addUser(data);
        return unwrapApiResponse(response);
      },
      {
        successMessage: 'Usuário adicionado ao departamento com sucesso!',
        errorMessage: 'Erro ao adicionar usuário ao departamento',
      }
    );
  }, [api, execute]);

  const removeUserFromDepartment = useCallback(async (departmentId: string, userId: string) => {
    await execute(
      async () => {
        await api.department.removeUser(departmentId, userId);
      },
      {
        successMessage: 'Usuário removido do departamento com sucesso!',
        errorMessage: 'Erro ao remover usuário do departamento',
      }
    );
  }, [api, execute]);

  const setDepartmentHead = useCallback(async (departmentId: string, userId: string) => {
    return execute(
      async () => {
        const response = await api.department.setDepartmentHead(departmentId, userId);
        return unwrapApiResponse(response);
      },
      {
        successMessage: 'Chefe do departamento definido com sucesso!',
        errorMessage: 'Erro ao definir chefe do departamento',
      }
    );
  }, [api, execute]);

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

