interface IRouteInterface {
  path: string;
  routes?: Record<string, IRouteInterface>;
}

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

export const generatePath = (path: string, params: Record<string, string>) => {
  return Object.entries(params).reduce(
    (updatedPath, [key, value]) => updatedPath.replace(`:${key}`, value),
    path,
  );
};

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
