# Sistema de Rotas - CRM Echo

## 📁 Estrutura

```
src/routes/
├── layouts/
│   ├── DashboardLayout.tsx  # Layout administrativo
│   └── UserLayout.tsx       # Layout para usuários comuns
├── PrivateRoute.tsx         # Guard para rotas privadas
├── routes.tsx               # Definição de rotas
└── README.md
```

## 🎯 Como Usar

### Definindo Rotas

As rotas são definidas de forma hierárquica usando a função `createRoutes`:

```typescript
export const routes = createRoutes({
  dashboard: {
    path: '/dashboard',
    routes: {
      users: {
        path: '/users',
        routes: {
          user: { path: '/:id' },
        },
      },
    },
  },
});
```

Isso gera automaticamente os caminhos completos:
- `routes.dashboard.path` → `/dashboard`
- `routes.dashboard.routes.users.path` → `/dashboard/users`
- `routes.dashboard.routes.users.routes.user.path` → `/dashboard/users/:id`

### Navegação com Parâmetros

Use a função `generatePath` para criar URLs com parâmetros:

```typescript
import { generatePath, routes } from '@/routes/routes';

// Gera: /dashboard/users/123
const userUrl = generatePath(routes.dashboard.routes.users.routes.user.path, {
  id: '123'
});
```

### Proteção de Rotas

As rotas privadas são protegidas pelo componente `PrivateRoute`:

```tsx
<Route element={<PrivateRoute />}>
  <Route path={routes.dashboard.path} element={<DashboardLayout />}>
    {/* Suas rotas aqui */}
  </Route>
</Route>
```

### Permissões

Use o hook `useAuth` para verificar permissões:

```tsx
const { checkPermissions } = useAuth();

{checkPermissions([
  { action: 'READ', resource: 'USERS' },
  { action: 'MANAGE', resource: 'USERS' },
]) && (
  <Route path={routes.dashboard.routes.users.path} element={<Users />} />
)}
```

### Constantes de Permissões

Use as constantes definidas em `constants/permissions.ts`:

```typescript
import { PERMISSIONS } from '@/constants/permissions';

checkPermissions([
  PERMISSIONS.users.read,
  PERMISSIONS.users.manage,
])
```

## 📋 Layouts Disponíveis

### DashboardLayout

Layout para páginas administrativas com sidebar e header.

**Características:**
- Sidebar responsivo
- Header com informações do usuário
- Área de conteúdo principal
- Validação de autenticação

**Uso:**
```tsx
<Route path={routes.dashboard.path} element={<DashboardLayout />}>
  <Route index element={<Dashboard />} />
  {/* Outras rotas */}
</Route>
```

### UserLayout

Layout para páginas de usuários comuns.

**Características:**
- Header simples
- Área de conteúdo principal
- Footer
- Validação de autenticação

**Uso:**
```tsx
<Route element={<UserLayout />}>
  <Route path={routes.profile.path} element={<Profile />} />
  {/* Outras rotas */}
</Route>
```

## 🔒 Tipos de Permissões

Cada recurso possui 5 tipos de permissões:

- `CREATE` - Criar novos registros
- `READ` - Visualizar registros
- `UPDATE` - Atualizar registros existentes
- `DELETE` - Deletar registros
- `MANAGE` - Acesso total (todas as operações)

## 📚 Recursos Disponíveis

- `USERS` - Usuários
- `ROLES` - Funções e permissões
- `COMPANIES` - Empresas
- `DEPARTMENTS` - Departamentos
- `CHATS` - Chats internos
- `KANBAN` - Boards Kanban
- `WHATSAPP` - Conversas WhatsApp

## 🚀 Adicionando Novas Rotas

1. Adicione a rota no objeto `routes`:

```typescript
export const routes = createRoutes({
  // ... rotas existentes
  newModule: {
    path: '/new-module',
    routes: {
      item: { path: '/:id' },
    },
  },
});
```

2. Adicione a rota no componente `Router`:

```tsx
{checkPermissions([
  { action: 'READ', resource: 'NEW_MODULE' },
]) && (
  <Route
    path={routes.dashboard.routes.newModule.path}
    element={<NewModule />}
  />
)}
```

3. Se necessário, adicione as permissões em `constants/permissions.ts`:

```typescript
export const PERMISSIONS = {
  // ... permissões existentes
  newModule: {
    create: { action: 'CREATE', resource: 'NEW_MODULE' },
    read: { action: 'READ', resource: 'NEW_MODULE' },
    update: { action: 'UPDATE', resource: 'NEW_MODULE' },
    delete: { action: 'DELETE', resource: 'NEW_MODULE' },
    manage: { action: 'MANAGE', resource: 'NEW_MODULE' },
  },
};
```

## 💡 Dicas

1. **TypeScript**: As rotas são totalmente tipadas, use autocomplete!
2. **Organização**: Mantenha as rotas organizadas hierarquicamente
3. **Reutilização**: Use `generatePath` para evitar hardcoding de URLs
4. **Segurança**: Sempre valide permissões nas rotas sensíveis
5. **Consistência**: Siga o padrão estabelecido para facilitar manutenção

