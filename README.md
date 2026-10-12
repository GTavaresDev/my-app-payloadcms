# Payload CMS central

CMS multi-tenant para Localize e Rastrear, com PostgreSQL, painel em português e conteúdo organizado por empresa → página/rota → componentes → textos e imagens.

## Ambiente e execução

Configure `DATABASE_URL` e `PAYLOAD_SECRET` na `.env` privada; não versionar valores reais.

```sh
npm install
npm run dev
```

O painel local fica em `http://localhost:3000/admin`. Esse endereço é apenas de desenvolvimento.

## Coleções e permissões

As coleções registradas são `companies`, `users`, `media` e `site-settings`. Mídias ficam ocultas no menu e são utilizadas pelos campos de upload. Notícias, pastas e `site-sections` não estão registrados no schema atual; tabelas antigas eventualmente preservadas no banco não são fonte de conteúdo.

Usuários de empresa editam apenas suas páginas e gerenciam usuários comuns da mesma empresa. Não veem nem atribuem níveis de permissão. Empresa e permissões dos usuários criados são impostas pelo servidor. Apenas o administrador geral cria/exclui páginas, escolhe empresas e níveis de usuários e consulta os tokens das empresas.

`site-settings` exige sessão autorizada ou token de empresa para leitura. O token restringe a consulta à empresa no servidor. As mídias publicadas continuam públicas para exibição no navegador.

## Páginas

- Localize `/`: sete componentes da Página inicial.
- Rastrear `/`: apresentação, funcionalidades, depoimento e FAQ.
- Rastrear `/logistica`: Torre de controle e Galeria operacional.

A lista de rotas usa pastas para todas as empresas; a navegação interna por pastas de componentes está implementada para a Localize. O manifesto fica em `src/companys/<empresa>/`, com agregadores em `src/companys/`. Novas rotas precisam ser implementadas também no Next.


### Fonte única das definições

Altere campos e rótulos somente em `src/companys/localize/home-sections.json` ou `src/companys/rastrear/home-sections.json`, conforme a empresa. `src/companys/home-sections.ts` apenas reúne esses manifestos e não contém cópias das definições. Painel, navegação e seed consomem esse agregador. O administrador geral continua acessando todas as empresas, independentemente da organização dos arquivos.

As definições no código determinam os campos e rótulos do painel após recompilar/reiniciar o CMS. Os valores editados no painel ficam no banco. Alterar `defaultValue` não sobrescreve valores existentes: o seed preenche somente campos ausentes. Mudanças de estrutura exigem revisar migrações e regenerar os tipos; mudanças apenas de rótulo não exigem migrar conteúdo.

## Tokens

Ao criar uma empresa, o servidor gera `cmp_` + 32 bytes aleatórios em hexadecimal (256 bits), com `node:crypto`. Não é MD5 nem um hash do slug. O token possui índice único, é imutável pela edição normal e só é exposto ao administrador geral. Fica armazenado em texto para permitir sua consulta posterior.

Cada site configura `PAYLOAD_URL` e `COMPANY_TOKEN` privados e envia o token em `Authorization: Bearer …`. Não há filtro por `COMPANY_SLUG` nas consultas dos sites.

## Banco existente e seed

A transição pressupõe as tabelas de base já existentes. Execute explicitamente no ambiente apropriado:

```sh
npm run migrate:pages
npm run seed:pages
npm run configure:tokens
```

`migrate:pages` prepara a estrutura de páginas de forma aditiva e verifica ambientes com schema push. `seed:pages` inicializa campos ausentes a partir do manifesto e das imagens de `src/companys/assets`, preservando valores existentes, inclusive vazios e nulos. Não cria usuários. `seed:home` é um alias.

A cópia de conteúdo legado foi feita na transição anterior; o seed atual não consulta `site-sections`. Não usar o seed como recuperação automática dessas tabelas.

`configure:tokens` preenche tokens ausentes, registra a migração e atualiza `.env.local` dos dois sites neste workspace, sem imprimir segredos ou rotacionar tokens existentes. Em deploys separados, configure os tokens nas envs privadas do provedor. As migrações também estão em `src/migrations` para instalações que utilizam o CLI padrão; revise o histórico antes de escolher o fluxo.

## Integração e produção

Cada rota busca uma vez e distribui dados por props, com mídias populadas e revalidação de 60 segundos. Não existem textos ou imagens editoriais locais de fallback. Conteúdo ausente não implica necessariamente ocultar toda a seção; depende do componente.

Os sites exigem URL do CMS em produção, centralizam sua resolução e corrigem mídias locais quando configurados para um CMS remoto. Configure envs antes do build e faça novo deploy após mudanças. Os uploads ficam em `public/media`; a persistência de arquivos no provedor precisa ser garantida pela infraestrutura.

## Tipos e validação

```sh
npm run generate:types
npm run test:content
npx tsc --noEmit
npm run build -- --webpack
```

A geração sincroniza interfaces para os dois frontends. A suíte cobre isolamento, campos protegidos, mídia, seed idempotente, busca única, campos vazios, tokens e URLs de produção. Confira também o painel e as rotas no navegador.
