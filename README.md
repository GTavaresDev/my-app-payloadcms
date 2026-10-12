# Payload CMS central

CMS multi-tenant para múltiplos clientes (Localize, Rastrear e novos clientes), com PostgreSQL, painel administrativo em português e gerenciamento de conteúdo dinâmico por componentes.

## Ambiente e execução

Configure `DATABASE_URL` e `PAYLOAD_SECRET` na `.env` privada do `admin`.

```sh
npm install
npm run dev
```

O painel local fica em `http://localhost:3000/admin`.

## Coleções e permissões

As coleções registradas são `companies`, `users`, `media` e `site-components`:

- **Empresas (`companies`)**: Cadastro de empresas clientes. Cada empresa possui um token de acesso (`COMPANY_TOKEN`) gerado automaticamente de 256 bits (`cmp_...`), visível apenas pelo Super Admin.
- **Componentes do Site (`site-components`)**: Componentes editoriais do site com `slug`, `pageSlug`, `company`, `title`, `subtitle`, `content`, `image` e campos adicionais.
  - **Super Admin**: Cria novos componentes, define os slugs e empresas, e pode excluir.
  - **Usuários da Empresa**: Só visualizam e editam os componentes da sua empresa. Não podem criar componentes, alterar slugs nem mudar a empresa associada.
- **Usuários (`users`)**: Super Admin gerencia todos os usuários. Usuários de empresas só criam e gerenciam colaboradores da própria empresa com nível de usuário comum.
- **Mídias (`media`)**: Imagens e arquivos com isolamento de tenant.

## Consumo da API

Os frontends realizam chamadas autenticadas via Server Components usando o token da empresa:

```http
GET /api/site-components?where[pageSlug][equals]=home&depth=1&limit=100
Authorization: Bearer <COMPANY_TOKEN>
```

A API identifica a empresa pelo token no servidor e devolve apenas os documentos autorizados, garantindo isolamento total entre empresas.

## Scripts

```sh
npm run seed:components    # Semeia componentes iniciais das empresas no banco
npm run configure:tokens   # Configura tokens gerados nas .env.local dos sites locais
npm run test:content       # Executa testes automatizados de controle de acesso e consumo
npm run build              # Compila o projeto em modo produção
npm run lint               # Validação de linter e regras de código
```
