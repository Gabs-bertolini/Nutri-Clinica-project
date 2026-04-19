# NutriClinic API

Backend em NestJS para plataforma de nutricionistas e pacientes.

Entrega contemplada:
- Conexao com banco local via Prisma (SQLite)
- Autenticacao JWT (registro e login)
- Endpoints CRUD protegidos para usuarios, pacientes, consultas e duvidas

## Tecnologias

- NestJS
- TypeScript
- Prisma ORM
- SQLite
- Passport JWT
- class-validator

## Requisitos

- Node.js 20+

Nao precisa instalar PostgreSQL nem Docker para testar.

## Configuracao

1. Copie o arquivo de exemplo para .env:

```bash
copy .env.example .env
```

No Linux/macOS, use:

```bash
cp .env.example .env
```

2. Instale dependencias:

```bash
npm install
```

3. Gere o client do Prisma:

```bash
npx prisma generate
```

4. Crie e aplique a migracao inicial:

```bash
npx prisma migrate dev --name init
```

5. Rode em desenvolvimento:

```bash
npm run start:dev
```

## Variaveis de ambiente

Arquivo `.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="troque-esta-chave"
JWT_EXPIRES_IN="1d"
```

Com esse valor, o banco SQLite e criado automaticamente no arquivo dev.db.

## Autenticacao

### Registro

`POST /auth/register`

Exemplo de body:

```json
{
	"name": "Dr. Carlos",
	"email": "carlos@nutri.com",
	"password": "123456",
	"role": "NUTRITIONIST"
}
```

### Login

`POST /auth/login`

Exemplo de body:

```json
{
	"email": "carlos@nutri.com",
	"password": "123456"
}
```

Retorno contem `accessToken`.

Para endpoints protegidos, enviar header:

```http
Authorization: Bearer <accessToken>
```

## Endpoints CRUD

Todos abaixo exigem JWT:

- Usuarios
	- `POST /users`
	- `GET /users`
	- `GET /users/:id`
	- `PATCH /users/:id`
	- `DELETE /users/:id`

- Pacientes
	- `POST /patients`
	- `GET /patients`
	- `GET /patients/:id`
	- `PATCH /patients/:id`
	- `DELETE /patients/:id`

- Consultas
	- `POST /consultations`
	- `GET /consultations`
	- `GET /consultations/:id`
	- `PATCH /consultations/:id`
	- `DELETE /consultations/:id`

- Duvidas
	- `POST /doubts`
	- `GET /doubts`
	- `GET /doubts/:id`
	- `PATCH /doubts/:id`
	- `DELETE /doubts/:id`

## Scripts uteis

- `npm run start:dev` - inicia em desenvolvimento
- `npm run build` - compila TypeScript
- `npm run prisma:generate` - gera Prisma Client
- `npm run prisma:migrate` - executa migracoes
- `npm run prisma:studio` - abre Prisma Studio