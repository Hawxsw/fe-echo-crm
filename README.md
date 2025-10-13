# Echo CRM - Frontend

Sistema de CRM moderno e completo desenvolvido com React, TypeScript, Tailwind CSS e shadcn/ui.

## 🚀 Tecnologias

- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI modernos
- **React Router DOM** - Gerenciamento de rotas
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Framer Motion** - Animações
- **Lucide React** - Ícones
- **Sonner** - Toast notifications

## 📁 Estrutura do Projeto

```
fe-echo-crm/
├── src/
│   ├── clients/          # Services para comunicação com API
│   │   ├── auth.service.ts
│   │   ├── users.service.ts
│   │   └── company.service.ts
│   ├── components/       # Componentes reutilizáveis
│   │   ├── ui/          # Componentes shadcn/ui
│   │   └── PrivateRoute.tsx
│   ├── lib/             # Utilitários
│   │   └── utils.ts
│   ├── pages/           # Páginas da aplicação
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   └── Dashboard.tsx
│   ├── services/        # Configuração de serviços
│   │   └── api.ts       # Instância do Axios
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Entry point
│   └── index.css        # Estilos globais
├── .eslintrc.cjs        # Configuração ESLint
├── .prettierrc          # Configuração Prettier
├── tailwind.config.js   # Configuração Tailwind
├── tsconfig.json        # Configuração TypeScript
└── package.json
```

## 🛠️ Instalação

1. Instalar dependências:
```bash
pnpm install
```

2. Configurar variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=http://localhost:3333
```

3. Iniciar servidor de desenvolvimento:
```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 📝 Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Cria build de produção
- `pnpm preview` - Preview do build de produção
- `pnpm lint` - Verifica problemas no código
- `pnpm lint:fix` - Corrige problemas automaticamente
- `pnpm format` - Formata o código com Prettier

## 🔐 Autenticação

O sistema usa JWT para autenticação. O token é armazenado no localStorage e automaticamente incluído em todas as requisições através do interceptor do Axios.

### Fluxo de Autenticação:

1. Usuário faz login na página `/login`
2. API retorna token JWT e dados do usuário
3. Token é armazenado no localStorage
4. Todas as requisições incluem o token no header Authorization
5. Se token expirar (401), usuário é redirecionado para login

## 🎨 Componentes UI

Os componentes UI são baseados no shadcn/ui e incluem:

- Button
- Input
- Label
- Card
- Avatar
- E mais...

Todos são totalmente customizáveis via Tailwind CSS.

## 🌐 Rotas

- `/` - Landing page pública
- `/login` - Página de login
- `/dashboard` - Dashboard principal (protegida)

Rotas protegidas usam o componente `PrivateRoute` que verifica autenticação.

## 📡 API Services

### Estrutura de Services

Seguindo o padrão do projeto Tiramisu, os services são organizados em:

- **services/api.ts** - Configuração base do Axios
- **clients/** - Services específicos para cada recurso

### Exemplo de Uso:

```typescript
import authService from '@/clients/auth.service';

// Login
await authService.login({ email, password });

// Verificar autenticação
const isAuth = authService.isAuthenticated();

// Obter usuário atual
const user = authService.getCurrentUser();

// Logout
await authService.logout();
```

## 🎯 Funcionalidades

- ✅ Landing page moderna e responsiva
- ✅ Sistema de autenticação completo
- ✅ Dashboard com métricas e estatísticas
- ✅ Navegação protegida por autenticação
- ✅ Toast notifications
- ✅ Animações suaves com Framer Motion
- ✅ Design responsivo
- ✅ Tema customizável
- ✅ Validação de formulários
- ✅ Interceptors para tratamento de erros

## 🔧 Configuração do Editor

### VS Code

O projeto inclui configurações do VS Code para:

- Formatação automática ao salvar
- ESLint auto-fix ao salvar
- Organização de imports
- Prettier como formatador padrão

Extensões recomendadas:
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense

## 📦 Build para Produção

```bash
pnpm build
```

Os arquivos otimizados serão gerados na pasta `dist/`

## 🤝 Contribuindo

1. Mantenha o código limpo e bem documentado
2. Siga os padrões do ESLint e Prettier
3. Use commits semânticos
4. Teste suas alterações antes de commitar

## 📄 Licença

Este projeto é privado e confidencial.
