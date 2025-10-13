/**
 * Utilitário para construção de paths dinâmicos.
 * 
 * Melhora a legibilidade e previne erros em rotas dinâmicas.
 */

interface IRouteInterface {
  path: string;
  routes?: Record<string, IRouteInterface>;
}

/**
 * Cria rotas com paths completos de forma recursiva
 */
export const createRoutes = <T extends Record<string, IRouteInterface>>(
  routes: T,
  parentPath = '',
): T => {
  return Object.entries(routes).reduce((acc, [key, route]) => {
    const fullPath = `${parentPath}/${route.path}`.replace(/\/+/g, '/');

    acc[key as keyof T] = {
      ...route,
      path: fullPath,
      routes: route.routes ? createRoutes(route.routes, fullPath) : undefined,
    } as T[typeof key];

    return acc;
  }, {} as T);
};

/**
 * Gera um path substituindo parâmetros dinâmicos
 * 
 * @example
 * ```ts
 * generatePath('/users/:id', { id: '123' }) // => '/users/123'
 * generatePath('/posts/:id/comments/:commentId', { id: '1', commentId: '2' }) 
 * // => '/posts/1/comments/2'
 * ```
 */
export const generatePath = (path: string, params: Record<string, string>) => {
  return Object.entries(params).reduce(
    (updatedPath, [key, value]) => updatedPath.replace(`:${key}`, value),
    path,
  );
};

/**
 * Definição das rotas da aplicação com type-safety
 */
export const routes = createRoutes({
  home: { path: '/' },
  login: { path: '/login' },
  register: { path: '/register' },
  dashboard: {
    path: '/dashboard',
    routes: {
      organizationalStructure: {
        path: '/organizational-structure',
      },
      departments: {
        path: '/departments',
        routes: {
          department: { path: '/:id' },
          new: { path: '/new' },
          edit: { path: '/edit/:id' },
        },
      },
      users: {
        path: '/users',
        routes: {
          user: { path: '/:id' },
        },
      },
      roles: {
        path: '/roles',
        routes: {
          role: { path: '/:id' },
        },
      },
      chats: {
        path: '/chats',
        routes: {
          chat: { path: '/:id' },
        },
      },
      kanban: {
        path: '/kanban',
        routes: {
          board: { path: '/:id' },
        },
      },
      whatsapp: {
        path: '/whatsapp',
        routes: {
          conversation: { path: '/:id' },
        },
      },
    },
  },
  profile: {
    path: '/profile',
  },
});

