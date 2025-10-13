import { IPermission, PermissionAction, PermissionResource } from '../types/role';

/**
 * Converte uma string de permissão (ex: 'user.create') para o formato IPermission
 * que o backend espera { action: 'CREATE', resource: 'USERS' }
 */
export const parsePermission = (permission: string): IPermission => {
  const [resource, action] = permission.split('.');
  
  // Mapeia o recurso para o formato do backend
  const resourceMap: Record<string, PermissionResource> = {
    user: 'USERS',
    role: 'ROLES',
    chat: 'CHAT',
    kanban: 'KANBAN_BOARDS',
    whatsapp: 'WHATSAPP',
  };

  // Mapeia a ação para o formato do backend
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

/**
 * Converte um array de strings de permissão para o formato IPermission[]
 */
export const parsePermissions = (permissions: string[]): IPermission[] => {
  return permissions.map(parsePermission);
};

