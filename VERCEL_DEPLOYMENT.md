# Publicação do Blockwise na Vercel

O projeto contém uma função Express em `api/index.ts`, o build estático do Vite em `dist/public` e regras de rewrite em `vercel.json`. Isso preserva as rotas da SPA, mantém o tRPC no mesmo domínio e permite que as funções da Vercel atendam `/api/trpc/*` e, temporariamente, `/manus-storage/*`.

## Configuração necessária

Crie um projeto na Vercel a partir deste repositório. A Vercel deve detectar `pnpm`, executar `pnpm install --frozen-lockfile` e depois `pnpm build:client`. Em **Settings → Environment Variables**, crie as variáveis necessárias para a produção conforme a tabela abaixo.

| Variável | Obrigatória | Finalidade |
|---|---:|---|
| `DATABASE_URL` | Sim | Banco MySQL/TiDB acessível pela Vercel, com TLS quando suportado pelo provedor. |
| `JWT_SECRET` | Sim | Assinatura da sessão do painel; use um valor aleatório longo e exclusivo. |
| `ADMIN_EMAIL` | Sim | E-mail de acesso ao painel. |
| `ADMIN_PASSWORD` | Sim | Senha exclusiva e forte do painel. |
| `VITE_ASSET_BASE_URL` | Recomendado | URL sem barra final do CDN ou Vercel Blob que hospedará os PNGs Blockwise. |
| `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY` | Apenas alternativa temporária | Mantêm o proxy `/manus-storage`; não são substitutos de um CDN próprio na Vercel. |

## Imagens e domínio

Antes de publicar, mova os arquivos `blockwise-*.png` para um bucket/CDN público ou Vercel Blob e defina `VITE_ASSET_BASE_URL` com a origem desses arquivos. A versão atual ainda usa `/manus-storage` como fallback de desenvolvimento; essa rota depende das credenciais da infraestrutura Manus e não deve ser o plano permanente de assets em um domínio externo.

Depois de importar o repositório, faça primeiro um deploy de preview. Valide `/home/en`, `/home/pt`, `/en`, `/pt`, `/admin/painel`, a busca Roblox e a categoria Links. Só então conecte o domínio definitivo e promova o deploy para produção.

## Referências oficiais consultadas

Esta configuração segue a documentação da Vercel sobre exportação de aplicações Express como função e sobre rewrites de rotas: [Express on Vercel](https://vercel.com/docs/frameworks/backend/express), [Using Express.js with Vercel](https://vercel.com/kb/guide/using-express-with-vercel) e [Rewrites on Vercel](https://vercel.com/docs/routing/rewrites).
