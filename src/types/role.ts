export type PermissionAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'MANAGE';

export type PermissionResource = 
  | 'USERS'
  | 'ROLES'
  | 'KANBAN_BOARDS'
  | 'KANBAN_CARDS'
  | 'CHAT'
  | 'WHATSAPP'
  | 'REPORTS'
  | 'ALL';

export interface IPermission {
  action: PermissionAction;
  resource: PermissionResource;
  conditions?: Record<string, any>;
}

export interface IRole {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: IPermission[];
  userCount?: number;
}

export interface ICreateRole {
  name: string;
  description?: string;
  permissions: IPermission[];
}

export interface IUpdateRole {
  name?: string;
  description?: string;
  permissions?: IPermission[];
}

export interface IAssignRole {
  userId: string;
  roleId: string;
}

export interface ICheckPermission {
  action: PermissionAction;
  resource: PermissionResource;
}

export interface ICheckPermissionResponse {
  hasPermission: boolean;
}

