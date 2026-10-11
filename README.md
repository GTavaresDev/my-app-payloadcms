This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Configurações do site por página

Cada registro de `site-settings` representa uma página da empresa, com grupos
fixos para seus componentes. O usuário edita somente os textos e imagens desses
grupos, sem criar, reordenar ou mover componentes entre páginas.

- Localize → Página inicial (`/`): apresentação principal, contato, benefícios,
  recursos em destaque, indicadores, cartões de funcionalidades e chamada para ação.
- Rastrear → Página inicial (`/`): apresentação principal, funcionalidades,
  depoimento e perguntas frequentes.
- Rastrear → Logística (`/logistica`): torre de controle e galeria operacional.

O mapeamento de páginas, rotas e componentes fica em `src/companys/`.
Novas páginas ou empresas devem ter seus componentes mapeados pelo desenvolvedor.

### Migração do banco existente

Configure `DATABASE_URL` e `PAYLOAD_SECRET` no admin e execute, nesta ordem:

```sh
npm run migrate:pages
npm run seed:pages
```

`migrate:pages` adiciona a estrutura de páginas de forma transacional e registra
seu histórico. Também aceita ambientes em que o modo de desenvolvimento já
criou a tabela via schema push, verificando colunas e o índice único antes de
registrar a migração. Não remove tabelas ou conteúdo existentes. A migração
padrão equivalente está em `src/migrations` para ambientes que já usam o CLI.
Esta transição pressupõe o banco existente com as coleções anteriores.

`seed:pages` copia os 13 componentes existentes para as três páginas,
preservando textos, referências de mídia, valores vazios e nulos. Reexecutar não
sobrescreve edições feitas nas páginas. Para uma instalação sem conteúdo legado,
usam-se os textos iniciais e as imagens de `src/companys/assets`. `seed:home`
permanece como alias do mesmo importador. Não são criados usuários.

Os documentos antigos de `site-sections` permanecem ocultos e acessíveis apenas
ao administrador geral, para recuperação e conferência da transição. Os sites
consomem exclusivamente os novos documentos de página em `site-settings`.

### Frontends

Configure `PAYLOAD_URL` e o `COMPANY_SLUG` correspondente em cada projeto.
A página inicial chama `getHomeData()` uma vez; a rota `/logistica` do Rastrear
chama `getLogisticsData()` uma vez. Cada busca filtra empresa e página, carrega
um único registro com suas mídias e distribui os componentes por props.
O cache revalida a cada 60 segundos. Não há textos ou imagens locais de fallback.
Campos vazios permanecem vazios; imagens sem URL e componentes ausentes não são
renderizados. Uma falha na API resulta em um mapa vazio para a página.

Após alterações no schema, `npm run generate:types` gera os tipos do admin e os
sincroniza nos dois sites. `npm run test:content` verifica isolamento por empresa,
proteção da estrutura, associação de mídia, preservação da migração, idempotência,
filtros e busca única por rota, além das permissões de gerenciamento de usuários.

### Painel e permissões

Usuários das empresas veem **Configurações do site** e **Usuários**. Mídias são
selecionadas ou enviadas dentro do próprio componente; o armazenamento técnico
permanece oculto. Pastas, notícias e componentes legados não aparecem no painel
das empresas. Empresas e permissões são administradas pelo administrador geral.
Novos usuários criados por uma empresa recebem automaticamente a mesma empresa
e a permissão padrão, sem poder atribuir níveis de acesso.

O painel usa português do Brasil. Os identificadores internos da API permanecem
estáveis; nomes de páginas, componentes e campos são apresentados em português.
