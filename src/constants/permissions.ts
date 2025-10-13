export enum USER_PERMISSIONS {
  create = 'user.create',
  read = 'user.read',
  update = 'user.update',
  delete = 'user.delete',
  manage = 'user.manage',
}

export enum ROLE_PERMISSIONS {
  create = 'role.create',
  read = 'role.read',
  update = 'role.update',
  delete = 'role.delete',
  manage = 'role.manage',
}

export enum CHAT_PERMISSIONS {
  create = 'chat.create',
  read = 'chat.read',
  update = 'chat.update',
  delete = 'chat.delete',
  manage = 'chat.manage',
}

export enum KANBAN_PERMISSIONS {
  create = 'kanban.create',
  read = 'kanban.read',
  update = 'kanban.update',
  delete = 'kanban.delete',
  manage = 'kanban.manage',
}

export enum WHATSAPP_PERMISSIONS {
  create = 'whatsapp.create',
  read = 'whatsapp.read',
  update = 'whatsapp.update',
  delete = 'whatsapp.delete',
  manage = 'whatsapp.manage',
}

export const PERMISSIONS = {
  user: USER_PERMISSIONS,
  role: ROLE_PERMISSIONS,
  chat: CHAT_PERMISSIONS,
  kanban: KANBAN_PERMISSIONS,
  whatsapp: WHATSAPP_PERMISSIONS,
};

export const PERMISSION_TRANSLATIONS: Record<string, string> = {
  // User permissions
  [PERMISSIONS.user.create]: 'Criar usuário',
  [PERMISSIONS.user.read]: 'Visualizar usuário',
  [PERMISSIONS.user.update]: 'Atualizar usuário',
  [PERMISSIONS.user.delete]: 'Excluir usuário',
  [PERMISSIONS.user.manage]: 'Gerenciar usuários',

  // Role permissions
  [PERMISSIONS.role.create]: 'Criar função',
  [PERMISSIONS.role.read]: 'Visualizar função',
  [PERMISSIONS.role.update]: 'Atualizar função',
  [PERMISSIONS.role.delete]: 'Excluir função',
  [PERMISSIONS.role.manage]: 'Gerenciar funções',

  // Chat permissions
  [PERMISSIONS.chat.create]: 'Criar chat',
  [PERMISSIONS.chat.read]: 'Visualizar chat',
  [PERMISSIONS.chat.update]: 'Atualizar chat',
  [PERMISSIONS.chat.delete]: 'Excluir chat',
  [PERMISSIONS.chat.manage]: 'Gerenciar chats',

  // Kanban permissions
  [PERMISSIONS.kanban.create]: 'Criar board Kanban',
  [PERMISSIONS.kanban.read]: 'Visualizar board Kanban',
  [PERMISSIONS.kanban.update]: 'Atualizar board Kanban',
  [PERMISSIONS.kanban.delete]: 'Excluir board Kanban',
  [PERMISSIONS.kanban.manage]: 'Gerenciar boards Kanban',

  // WhatsApp permissions
  [PERMISSIONS.whatsapp.create]: 'Criar conversa WhatsApp',
  [PERMISSIONS.whatsapp.read]: 'Visualizar conversa WhatsApp',
  [PERMISSIONS.whatsapp.update]: 'Atualizar conversa WhatsApp',
  [PERMISSIONS.whatsapp.delete]: 'Excluir conversa WhatsApp',
  [PERMISSIONS.whatsapp.manage]: 'Gerenciar WhatsApp',
};

