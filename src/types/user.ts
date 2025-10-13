export interface IUserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  phone?: string | null;
  role: IUserRole | string;
  roleId?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  isActive?: boolean;
  departmentId?: string | null;
  department?: { id: string; name: string } | null;
  managerId?: string | null;
  position?: string | null;
  isManager?: boolean;
  isDepartmentHead?: boolean;
  managedDepartmentId?: string | null;
  sortOrder?: number | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
}

export interface ICreateUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  roleId?: string;
  departmentId?: string;
  position?: string;
  isActive?: boolean;
  isManager?: boolean;
  isDepartmentHead?: boolean;
}

export interface IUpdateUser {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  roleId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  departmentId?: string;
  position?: string;
  managerId?: string;
  isManager?: boolean;
  isDepartmentHead?: boolean;
  isActive?: boolean;
}

export interface IPaginationParams {
  page?: number;
  limit?: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

