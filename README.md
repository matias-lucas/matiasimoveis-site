# Matias Imóveis — site

Vitrine digital da **Matias Imóveis** (CJ-40079), imobiliária de
Itaberaí/GO. O site mostra os imóveis disponíveis para venda e locação,
com busca por filtros, e leva cada interesse direto para uma conversa no
WhatsApp já com o contexto (qual imóvel, comprar, alugar ou anunciar).
Não há formulário que guarda dados: os formulários montam a mensagem e
abrem o WhatsApp.

Os corretores cadastram e publicam os imóveis, com fotos e vídeos, num
painel administrativo próprio em `/admin`.

## Páginas

- **Início** (`/`): busca rápida e vitrines de imóveis para alugar e à venda
- **Buscar imóveis** (`/imoveis`): filtros por finalidade, tipo, bairro,
  quartos e preço
- **Ficha do imóvel** (`/imovel/[slug]`): fotos, vídeo, características
  e contato
- **Anuncie seu imóvel** (`/anuncie`), **Contato** (`/contato`) e
  **Empresa** (`/empresa`)
- **Painel admin** (`/admin`): login de corretor, cadastro de imóveis,
  fotos, vídeos e corretores

## Stack

- [Next.js 16](https://nextjs.org) (App Router) e React 19
- TypeScript
- Tailwind CSS v4
- [Supabase](https://supabase.com): Postgres, Auth (login do admin) e
  Storage (fotos e vídeos)
- Hospedagem na [Vercel](https://vercel.com)

## Rodando localmente

Requisitos: Node.js 20.9 ou mais recente e um projeto Supabase com o
schema do site.

```bash
npm install
cp .env.example .env.local   # preencha com a URL e a chave anon do Supabase
npm run dev                  # http://localhost:3000
```

As duas variáveis de `.env.example` ficam em **Project Settings → API**
no painel do Supabase. O `.env.local` está no `.gitignore`: nunca
versione credenciais.

Se usar outro projeto Supabase, ajuste também o host de imagens em
`images.remotePatterns` no `next.config.ts`, senão as fotos dos imóveis
não carregam.

Outros comandos:

| Comando         | O que faz                     |
| --------------- | ----------------------------- |
| `npm run build` | build de produção             |
| `npm run start` | serve o build de produção     |
| `npm run lint`  | ESLint                        |

O painel não tem cadastro público. As contas de corretor são criadas no
painel do Supabase (Authentication → Users); o passo a passo está em
`CLAUDE.md`.

## Estrutura

```
src/app/(site)/    páginas públicas
src/app/admin/     painel administrativo
src/components/    componentes (layout, imóvel, formulários, admin, ui)
src/lib/           consultas ao Supabase, WhatsApp, dados do site (site.ts)
docs/              planos de implementação, redesign e revisões
```

Contexto de produto e de design: [`PRODUCT.md`](PRODUCT.md),
[`DESIGN.md`](DESIGN.md) e [`CLAUDE.md`](CLAUDE.md).

## Status

**Em desenvolvimento.** O site público e o painel admin já funcionam, e a
branch `main` vai para produção na Vercel
([site-matiasimoveis.vercel.app](https://site-matiasimoveis.vercel.app)).
Em andamento: redesign visual mobile-first (branch `redesign/editorial`),
fotos e conteúdo reais dos imóveis e uma rodada de SEO. O domínio próprio
ainda não foi configurado.
