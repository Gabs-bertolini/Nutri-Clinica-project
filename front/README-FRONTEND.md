# NutriClínica Frontend

Frontend React para a clínica de nutrição online.

## 🚀 Começando

### Instalação

```bash
# Instalar dependências
npm install
```

### Desenvolvimento

```bash
# Inicia o servidor de desenvolvimento
npm run dev
```

O servidor rodará em `http://localhost:5173`

### Build

```bash
# Criar build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
├── pages/            # Páginas da aplicação
├── services/         # Serviços de API
├── contexts/         # Context API (autenticação)
├── hooks/            # Custom hooks
├── types/            # Tipos TypeScript
├── App.tsx           # Componente principal com rotas
└── main.tsx          # Ponto de entrada
```

## 🔐 Autenticação

A autenticação é feita através de JWT Token armazenado no localStorage. O token é automaticamente incluído nas requisições aos endpoints protegidos.

## 📡 API Endpoints

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registrar novo usuário

### Consultas
- `GET /consultations` - Listar todas as consultas
- `GET /consultations/:id` - Obter consulta específica
- `POST /consultations` - Criar nova consulta (Nutricionista)
- `PATCH /consultations/:id` - Atualizar consulta
- `DELETE /consultations/:id` - Deletar consulta

### Dúvidas
- `GET /doubts` - Listar todas as dúvidas
- `GET /doubts/:id` - Obter dúvida específica
- `POST /doubts` - Criar nova dúvida (Paciente)
- `PATCH /doubts/:id` - Atualizar dúvida (responder)
- `DELETE /doubts/:id` - Deletar dúvida

### Pacientes
- `GET /patients` - Listar todos os pacientes (Nutricionista)
- `GET /patients/:id` - Obter paciente específico
- `POST /patients` - Criar novo paciente
- `PATCH /patients/:id` - Atualizar dados do paciente
- `DELETE /patients/:id` - Deletar paciente

## 🎨 Componentes

### ProtectedRoute
Componente que protege rotas que requerem autenticação.

### Layout
Componente wrapper que inclui Header e estilos globais.

### Header
Navegação principal com logout.

### Card
Componente para exibir informações em cards.

### Button
Botão customizável com variantes (primary, secondary, danger).

### Input
Input customizado com validação e mensagens de erro.

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

## 🎯 Funcionalidades

### Para Pacientes
- ✅ Criar conta e fazer login
- ✅ Visualizar consultas agendadas
- ✅ Enviar dúvidas para nutricionistas
- ✅ Visualizar respostas de nutricionistas
- ✅ Dashboard com resumo de informações

### Para Nutricionistas
- ✅ Criar conta e fazer login
- ✅ Agendar consultas com pacientes
- ✅ Visualizar lista de pacientes
- ✅ Responder dúvidas de pacientes
- ✅ Gerenciar consultas (editar/deletar)

## 🛠️ Tecnologias

- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Roteamento
- **Axios** - HTTP Client
- **Tailwind CSS** - Styling
- **Context API** - State management

## 📝 Notas

- O token JWT é armazenado no localStorage
- Token é automaticamente incluído em todas as requisições aos endpoints protegidos
- Ao fazer logout, o token e dados do usuário são removidos do localStorage
- A aplicação redireciona para login se não estiver autenticado

## 🚀 Deploy

O projeto pode ser deployado em plataformas como:
- Vercel
- Netlify
- GitHub Pages
- Qualquer servidor que suporte aplicações React estáticas
