export interface IDepartment {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  level: number;
  position: number;
  isActive: boolean;
  color?: string | null;
  icon?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    children?: number;
    users?: number;
  };
  parent?: {
    id: string;
    name: string;
  };
  children?: IDepartment[];
  users?: IDepartmentUser[];
  managers?: IDepartmentUser[];
}

export interface IDepartmentUser {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatar?: string | null;
  position?: string | null;
  isManager?: boolean;
  isDepartmentHead?: boolean;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface ICreateDepartment {
  name: string;
  description?: string;
  parentId?: string;
  color?: string;
  icon?: string;
  position?: number;
}

export interface IUpdateDepartment {
  name?: string;
  description?: string;
  parentId?: string | null;
  color?: string;
  icon?: string;
  position?: number;
  isActive?: boolean;
}

export interface IMoveDepartment {
  newParentId: string | null;
  newPosition?: number;
}

export interface IAddUserToDepartment {
  userId: string;
  departmentId: string;
  position?: string;
  isManager?: boolean;
  isDepartmentHead?: boolean;
  managerId?: string;
}

export interface IDepartmentHierarchy {
  department: IDepartment;
  head: IDepartmentUser | null;
  usersWithoutManager: IDepartmentUser[];
}

