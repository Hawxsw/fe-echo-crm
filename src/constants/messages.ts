/**
 * Mensagens padronizadas da aplicação.
 * 
 * Centraliza mensagens para facilitar:
 * - Manutenção
 * - Internacionalização futura (i18n)
 * - Consistência
 */

export const MESSAGES = {

  SUCCESS: {
    DEPARTMENT_CREATED: 'Departamento criado com sucesso!',
    DEPARTMENT_UPDATED: 'Departamento atualizado com sucesso!',
    DEPARTMENT_DELETED: 'Departamento excluído com sucesso!',
    USER_CREATED: 'Usuário criado com sucesso!',
    USER_UPDATED: 'Usuário atualizado com sucesso!',
    USER_DELETED: 'Usuário excluído com sucesso!',
    LOGIN_SUCCESS: 'Login realizado com sucesso!',
    LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
    SAVED: 'Salvo com sucesso!',
  },


  ERROR: {
    GENERIC: 'Ocorreu um erro inesperado',
    DEPARTMENT_LOAD: 'Erro ao carregar departamentos',
    DEPARTMENT_CREATE: 'Erro ao criar departamento',
    DEPARTMENT_UPDATE: 'Erro ao atualizar departamento',
    DEPARTMENT_DELETE: 'Erro ao excluir departamento',
    USER_LOAD: 'Erro ao carregar usuários',
    USER_CREATE: 'Erro ao criar usuário',
    USER_UPDATE: 'Erro ao atualizar usuário',
    USER_DELETE: 'Erro ao excluir usuário',
    LOGIN_FAILED: 'Erro ao fazer login',
    PERMISSION_DENIED: 'Você não tem permissão para realizar esta ação',
    NOT_FOUND: 'Recurso não encontrado',
    NETWORK: 'Erro de conexão. Verifique sua internet.',
  },


  CONFIRM: {
    DELETE_DEPARTMENT: (name: string) =>
      `Tem certeza que deseja excluir o departamento "${name}"?`,
    DELETE_USER: (name: string) =>
      `Tem certeza que deseja excluir o usuário "${name}"?`,
    DELETE_ROLE: (name: string) =>
      `Tem certeza que deseja excluir o cargo "${name}"?`,
    UNSAVED_CHANGES: 'Você tem alterações não salvas. Deseja sair mesmo assim?',
  },


  INFO: {
    NO_DEPARTMENTS: 'Nenhum departamento encontrado',
    NO_USERS: 'Nenhum usuário encontrado',
    NO_RESULTS: 'Nenhum resultado encontrado',
    LOADING: 'Carregando...',
    EMPTY_STATE: 'Não há dados para exibir',
  },
} as const;

