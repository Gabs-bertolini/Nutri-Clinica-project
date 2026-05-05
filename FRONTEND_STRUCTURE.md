# 📁 Estrutura do Frontend React - NutriClínica

## 📂 Arquivos Criados

### Raiz do Frontend (`front/`)
```
front/
├── .env.example              # Variáveis de ambiente (exemplo)
├── .env.local                # Variáveis de ambiente (local)
├── .gitignore                # Configuração do Git
├── index.html                # HTML principal
├── package.json              # Dependências do projeto
├── postcss.config.js         # Configuração PostCSS
├── tailwind.config.ts        # Configuração Tailwind CSS
├── tsconfig.json             # Configuração TypeScript
├── vite.config.ts            # Configuração Vite
├── README.md                 # README padrão
├── README-FRONTEND.md        # README do frontend
├── node_modules/             # Dependências instaladas
├── public/                   # Arquivos estáticos
└── src/                      # Código-fonte
```

### Código-Fonte (`front/src/`)

```
src/
├── main.tsx                  # Ponto de entrada da aplicação
├── App.tsx                   # Componente raiz com rotas
├── index.css                 # Estilos globais com Tailwind
│
├── components/               # Componentes reutilizáveis
│   ├── Button.tsx            # Botão com variantes
│   ├── Card.tsx              # Card para exibir informações
│   ├── Header.tsx            # Barra de navegação
│   ├── Input.tsx             # Input com validação
│   ├── Layout.tsx            # Wrapper com header
│   └── ProtectedRoute.tsx     # Proteção de rotas autenticadas
│
├── pages/                    # Páginas da aplicação
│   ├── LoginPage.tsx         # Página de login
│   ├── RegisterPage.tsx      # Página de registro
│   ├── DashboardPage.tsx     # Dashboard principal
│   ├── ConsultationsPage.tsx # Gerenciamento de consultas
│   ├── DoubtsPage.tsx        # Sistema de dúvidas
│   └── PatientsPage.tsx      # Lista de pacientes (nutricionista)
│
├── services/                 # Serviços de API
│   ├── api.ts                # Configuração do Axios + interceptadores
│   ├── authService.ts        # Serviço de autenticação
│   ├── consultationService.ts # Serviço de consultas
│   ├── doubtService.ts       # Serviço de dúvidas
│   └── patientService.ts     # Serviço de pacientes
│
├── contexts/                 # Context API
│   └── AuthContext.tsx       # Contexto de autenticação
│
├── hooks/                    # Custom hooks
│   └── useAuthRedirect.ts    # Hook para redirecionamento de autenticação
│
└── types/                    # Tipos TypeScript
    └── index.ts              # Interfaces e tipos compartilhados
```

## 🔧 Dependências Instaladas

### Principais
- `react@19.2.5` - Framework UI
- `react-dom@19.2.5` - Renderização DOM
- `react-router-dom@7.14.2` - Roteamento
- `axios@1.16.0` - HTTP Client
- `typescript@5.7.2` - Type safety
- `tailwindcss@4.2.4` - Utility-first CSS
- `postcss@8.5.14` - CSS transformations
- `autoprefixer@10.5.0` - CSS prefixes

### Dev
- `@vitejs/plugin-react@6.0.1` - Plugin Vite para React
- `vite@8.0.10` - Build tool
- `eslint` - Linter
- Tipos TypeScript (`@types/react`, etc.)

## 🔐 Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────────┐
│                   Usuário não autenticado               │
└──────────────────────────┬────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
           ┌────▼──────┐      ┌──────▼──────┐
           │   Login   │      │   Register  │
           └────┬──────┘      └──────┬──────┘
                │                    │
                └────────┬───────────┘
                         │
            ┌────────────▼────────────┐
            │  POST /auth/login/reg   │
            │  Retorna: JWT + User    │
            └────────────┬────────────┘
                         │
            ┌────────────▼────────────┐
            │ Salva no localStorage   │
            │ - access_token          │
            │ - user                  │
            └────────────┬────────────┘
                         │
            ┌────────────▼────────────┐
            │   Redireciona para      │
            │   /dashboard            │
            └────────────┬────────────┘
                         │
         ┌───────────────▼───────────────┐
         │    Usuário Autenticado        │
         │ Pode acessar rotas protegidas │
         └───────────────────────────────┘
```

## 📡 Fluxo de Requisições

```
Componente React
       │
       ▼
   useAuth Hook / Service
       │
       ▼
   axios (api.ts)
       │
       ├─ Adiciona token JWT no header ──┐
       │                                  │
       ▼                                  │
   Backend NestJS ◄──────────────────────┘
       │
       ▼
  Validação/Processamento
       │
       ▼
  Resposta JSON
       │
       ▼
   axios (api.ts)
       │
       ├─ Se 401: Logout automático ──┐
       │                              │
       ▼                              │
   Componente React ◄────────────────┘
       │
       ▼
   Atualiza Estado
       │
       ▼
   Re-renderiza
```

## 🎨 Padrões de Design

### Layout Pattern
```tsx
<Layout>
  <YourPageContent />
</Layout>
```

### Protected Route Pattern
```tsx
<ProtectedRoute requiredRole="NUTRITIONIST">
  <AdminOnlyComponent />
</ProtectedRoute>
```

### Form Pattern
```tsx
const [formData, setFormData] = useState({...});
const [errors, setErrors] = useState({});

// Validação
// Chamada de API via service
// Tratamento de erro
```

## 🔄 Estado e Contexto

### AuthContext
Gerencia:
- Usuário autenticado
- Token JWT
- Funções de login/logout/register
- Estado de loading
- Mensagens de erro

### Local State
Componentes gerenciam:
- Dados de formulários
- Listas de items (consultas, dúvidas)
- Estados de loading/erro

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Login com email/senha
- [x] Registro com seleção de role
- [x] Persistência de token
- [x] Logout com limpeza de dados
- [x] Redirecionamento automático

### ✅ Dashboard
- [x] Bem-vindo personalizado
- [x] Estatísticas
- [x] Atividades recentes
- [x] Responsivo

### ✅ Consultas
- [x] Listar consultas
- [x] Visualizar detalhes
- [x] Agendar nova (nutricionista)
- [x] Atualizar status
- [x] Deletar consulta

### ✅ Dúvidas
- [x] Enviar dúvida
- [x] Visualizar dúvidas
- [x] Responder dúvida (nutricionista)
- [x] Controle de privacidade
- [x] Deletar dúvida

### ✅ Pacientes
- [x] Listar pacientes (nutricionista)
- [x] Visualizar detalhes
- [x] Informações pessoais

### ✅ UI/UX
- [x] Design responsivo
- [x] Validação de formulários
- [x] Mensagens de erro
- [x] Loading states
- [x] Tailwind CSS

## 🚀 Como Executar

### 1. Instalar dependências
```bash
cd front
npm install
```

### 2. Configurar variáveis de ambiente
Criar `.env.local`:
```
VITE_API_URL=http://localhost:3000
```

### 3. Iniciar servidor de desenvolvimento
```bash
npm run dev
```

Acessar em: http://localhost:5173

### 4. Build para produção
```bash
npm run build
# Gera arquivos otimizados em dist/
```

## 📊 Estatísticas do Projeto

- **Arquivos TypeScript/React**: 22
- **Componentes**: 6
- **Páginas**: 6
- **Serviços**: 5
- **Tipos**: 1 arquivo com 11 interfaces
- **Context**: 1 (AuthContext)
- **Custom Hooks**: 1
- **Linhas de código**: ~2000+

## 🎓 Conceitos Aprendidos

✅ React Hooks (useState, useEffect, useContext)  
✅ React Router (rotas, proteção)  
✅ Context API (estado global)  
✅ TypeScript (tipos, interfaces)  
✅ Axios (requisições HTTP)  
✅ Tailwind CSS (styling)  
✅ Formulários e Validação  
✅ Autenticação JWT  
✅ Interceptadores (API)  
✅ Componentes Reutilizáveis  
✅ Responsividade  
✅ Tratamento de Erros  

## 📝 Próximos Passos (Opcional)

- [ ] Adicionar testes unitários (Jest/React Testing Library)
- [ ] Implementar paginação nas listas
- [ ] Adicionar filtros e busca
- [ ] Melhorar UX com notificações toast
- [ ] Adicionar theme escuro
- [ ] Otimizar imagens e assets
- [ ] Implementar offline mode
- [ ] Adicionar analytics
- [ ] Implementar PWA
- [ ] Melhorar acessibilidade (a11y)

---

**Projeto completado com sucesso! 🎉**
