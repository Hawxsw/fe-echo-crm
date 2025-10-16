import { IPermission, PermissionAction, PermissionResource } from '../types/role';

export const parsePermission = (permission: string): IPermission => {
  const [resource, action] = permission.split('.');
  
  const resourceMap: Record<string, PermissionResource> = {
    user: 'USERS',
    role: 'ROLES',
    chat: 'CHAT',
    kanban: 'KANBAN_BOARDS',
    whatsapp: 'WHATSAPP',
  };

  const actionMap: Record<string, PermissionAction> = {
    create: 'CREATE',
    read: 'READ',
    update: 'UPDATE',
    delete: 'DELETE',
    manage: 'MANAGE',
  };

  return {
    action: actionMap[action] || 'READ',
    resource: resourceMap[resource] || 'USERS',
  };
};

export const parsePermissions = (permissions: string[]): IPermission[] => {
  return permissions.map(parsePermission);
};
