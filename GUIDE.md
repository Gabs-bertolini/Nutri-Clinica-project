# NutriClínica - Guia Completo

## 📋 Descrição

Projeto completo de clínica de nutrição online com backend NestJS e frontend React.

## 🏗️ Estrutura do Projeto

```
Nutri_clinica_project/
├── src/                    # Backend NestJS
│   ├── auth/              # Autenticação
│   ├── consultations/     # Gerenciamento de consultas
│   ├── doubts/            # Sistema de dúvidas
│   ├── patients/          # Gerenciamento de pacientes
│   └── ...
├── front/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Serviços de API
│   │   ├── contexts/      # Context API
│   │   ├── hooks/         # Custom hooks
│   │   └── types/         # Tipos TypeScript
│   └── ...
├── prisma/                # Schema do banco de dados
└── README.md
```

## 🚀 Quick Start

### Backend

```bash
# Entrar na pasta raiz do projeto
cd /path/to/Nutri_clinica_project

# Instalar dependências
npm install

# Configurar banco de dados
npm run prisma:generate
npm run prisma:migrate

# Iniciar servidor de desenvolvimento
npm run start:dev
```

O backend rodará em `http://localhost:3000`

### Frontend

```bash
# Entrar na pasta do frontend
cd front

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend rodará em `http://localhost:5173`

## 🔐 Autenticação

### Login/Registro

A aplicação suporta dois tipos de usuários:

1. **Paciente** - Pode:
   - Visualizar suas consultas agendadas
   - Enviar dúvidas para nutricionistas
   - Visualizar respostas

2. **Nutricionista** - Pode:
   - Agendar consultas com pacientes
   - Gerenciar sua lista de pacientes
   - Responder dúvidas de pacientes

### Fluxo de Autenticação

1. Usuário faz login ou registro em `/login` ou `/register`
2. Backend retorna JWT token e dados do usuário
3. Token é armazenado no localStorage
4. Token é automaticamente incluído em todas as requisições aos endpoints protegidos

## 📱 Páginas e Funcionalidades

### Login (`/login`)
- Email e senha obrigatórios
- Validação em tempo real
- Redirecionamento automático para dashboard ao fazer login

### Registro (`/register`)
- Nome, email, senha obrigatórios
- Seleção de tipo de conta (Paciente/Nutricionista)
- Criação automática de conta com JWT

### Dashboard (`/dashboard`)
- Bem-vindo personalizado
- Estatísticas de consultas e dúvidas
- Resumo de atividades recentes
- Acessível por ambos os tipos de usuário

### Consultas (`/consultations`)
- **Pacientes**: Visualizam suas consultas agendadas
- **Nutricionistas**: 
  - Listam todas as consultas
  - Podem agendar novas consultas
  - Atualizam status e notas
  - Deletam consultas conforme necessário

### Dúvidas (`/doubts`)
- **Pacientes**:
  - Enviam dúvidas para nutricionistas
  - Controlam se dúvida é pública ou privada
  - Visualizam respostas dos nutricionistas
  - Deletam dúvidas

- **Nutricionistas**:
  - Visualizam todas as dúvidas
  - Respondem dúvidas dos pacientes
  - Gerenciam respostas

### Pacientes (`/patients`)
- **Nutricionista only**
- Visualizam lista de pacientes
- Informações pessoais e de contato
- Histórico de consultas

## 🔌 API Endpoints

### Autenticação

```
POST /auth/register
{
  "name": "string",
  "email": "string",
  "password": "string (min: 6)",
  "role": "PATIENT | NUTRITIONIST"
}

POST /auth/login
{
  "email": "string",
  "password": "string"
}
```

### Consultas

```
GET    /consultations           # Listar todas
GET    /consultations/:id       # Obter uma
POST   /consultations           # Criar nova
PATCH  /consultations/:id       # Atualizar
DELETE /consultations/:id       # Deletar
```

### Dúvidas

```
GET    /doubts                  # Listar todas
GET    /doubts/:id              # Obter uma
POST   /doubts                  # Criar nova
PATCH  /doubts/:id              # Atualizar (responder)
DELETE /doubts/:id              # Deletar
```

### Pacientes

```
GET    /patients                # Listar todos
GET    /patients/:id            # Obter um
POST   /patients                # Criar novo
PATCH  /patients/:id            # Atualizar
DELETE /patients/:id            # Deletar
```

## 🎨 Componentes React

### ProtectedRoute
Protege rotas que requerem autenticação. Redireciona para login se não autenticado.

```tsx
<ProtectedRoute requiredRole="NUTRITIONIST">
  <PatientsPage />
</ProtectedRoute>
```

### Layout
Wrapper que inclui header e estilos globais.

### Card
Componente para exibir informações em cards com ícones.

```tsx
<Card title="Meu Título" icon="📅">
  Conteúdo aqui
</Card>
```

### Button
Botão com variantes e estados de loading.

```tsx
<Button variant="primary" isLoading={loading}>
  Clique-me
</Button>
```

### Input
Input com validação e mensagens de erro.

```tsx
<Input
  label="Email"
  type="email"
  error={errors.email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

## 🛠️ Configuração de Ambiente

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:3000
```

### Backend (.env)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta-aqui"
```

## 📊 Banco de Dados

O projeto usa SQLite com Prisma ORM.

### Models

- **User**: Usuários do sistema (pacientes e nutricionistas)
- **Patient**: Dados adicionais de pacientes
- **Consultation**: Consultas agendadas
- **Doubt**: Dúvidas dos pacientes

### Migrations

```bash
# Gerar novas migrações
npm run prisma:migrate

# Visualizar banco de dados
npm run prisma:studio
```

## 🎯 Fluxos de Uso

### Fluxo de Paciente

1. Registra conta como PATIENT
2. Acessa dashboard
3. Visualiza consultas agendadas (agendadas pelo nutricionista)
4. Envia dúvidas para nutricionistas
5. Recebe respostas nas dúvidas

### Fluxo de Nutricionista

1. Registra conta como NUTRITIONIST
2. Acessa dashboard
3. Visualiza pacientes
4. Agenda consultas com pacientes
5. Responde dúvidas dos pacientes
6. Gerencia status de consultas

## 📦 Dependências Principais

### Backend
- NestJS
- Prisma
- JWT (Passport)
- bcrypt
- class-validator

### Frontend
- React 19
- React Router
- Axios
- Tailwind CSS
- TypeScript

## 🚀 Deploy

### Frontend

Pode ser deployado em:
- Vercel (recomendado)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

```bash
npm run build
# Arquivos em dist/
```

### Backend

Pode ser deployado em:
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

## 📝 Notas Importantes

1. **Token JWT**: Armazenado no localStorage do navegador
2. **CORS**: Configure CORS no backend para aceitar requisições do frontend
3. **Variáveis de Ambiente**: Sempre use .env files, nunca commite dados sensíveis
4. **SSL**: Use HTTPS em produção
5. **Backup**: Configure backup do banco de dados

## 🐛 Troubleshooting

### "Cannot find module 'axios'"
```bash
npm install axios
```

### "Cannot GET /api/..."
Certifique-se de que o backend está rodando em http://localhost:3000

### "CORS error"
Configure CORS no backend:
```typescript
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true,
});
```

### "Token expirado"
Implemente refresh token ou reautenticação

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação do:
- [NestJS](https://docs.nestjs.com)
- [React](https://react.dev)
- [Prisma](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Desenvolvido com ❤️ para educação em programação web**
