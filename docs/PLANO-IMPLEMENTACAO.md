# Matias Imóveis — Plano de implementação

Documento de execução para transformar o handoff do Claude Design
(`handoff/project/`) em um site de produção.

## 0. Decisões tomadas

| Tema | Decisão |
| --- | --- |
| Stack | Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 |
| Dados dos imóveis | Supabase (Postgres + Storage + Auth) com painel admin próprio |
| Formulários | Abrem o WhatsApp com a mensagem pré-preenchida (sem backend de e-mail) |
| Escopo de páginas | Home, Buscar imóveis, Detalhe do imóvel, Anuncie seu imóvel, Contato, Empresa/Quem somos, Painel admin |
| Fora de escopo (v1) | Página "Serviços", "Simule um financiamento", registro de leads em banco |
| Hospedagem | Vercel, domínio `matiasimoveisgo.com.br` |

Estimativa: **8 a 10 dias** de trabalho focado até o deploy.

---

## 1. O que o handoff já define (fonte da verdade)

O bundle não é um rascunho solto — ele traz um design system fechado. Nada
disso precisa ser inventado:

**Tokens** (`handoff/project/ds/tokens/`) — copiar **sem alterar**:

- `colors.css` — vermelho `#e6383d` (primário/CTA) e azul `#413e8c`
  (secundário/confiança), tirados do logo; rampa de cinzas fria; cores de
  status (`--status-venda-*`, `--status-locacao-*`, success, warning) e o
  verde do WhatsApp `#25d366`, reservado só para ações de WhatsApp.
- `typography.css` — Poppins (display/títulos/preços/CTAs) + Inter (corpo e
  formulários); escala pronta de `--text-display-xl` a `--text-caption`,
  mais `--text-price` (700 24px Poppins).
- `spacing.css` — base 4px, raios (6/10/16/24/pill), sombras
  (sm/md/lg/focus) e `--container-max: 1200px`.

**Componentes** (`handoff/project/ds/_ds_bundle.js`, 11 no total) — já
implementados em React, com medidas exatas: Badge, WhatsAppButton, Button,
Checkbox, Input, SegmentedControl, Select, Footer, Navbar, PropertyCard,
SearchFilterBar.

**Telas** — `Matias Imóveis - Site.dc.html` (arquivo primário, é o que vale
quando houver conflito) e as versões React em `handoff/project/screens/`.

**Conteúdo real**, extraído do site atual pelo próprio design system:
estrutura de navegação, filtros de busca, endereço, telefone, número CJ e o
tom de voz ("nós encontramos", "você", tudo em português, sem emoji).

**Assets**: `ds/assets/logo.png`, `logo-icon.png`, `logo-wordmark.png`.
As fotos de imóvel são todas placeholder — existe **uma** foto de banco de
imagens embutida em `.image-slots.state.json`, repetida em todos os slots.

---

## 2. Divergências no bundle que precisam de decisão

Encontradas ao ler os arquivos. Onde há conflito entre o `.dc.html` e os
demais, a regra é: **o `.dc.html` vence** (é o arquivo que estava aberto no
handoff). As que dependem de informação da imobiliária estão marcadas com ❓.

1. **Badge sólido × tonal.** Nos cards do `.dc.html` os selos são pílulas
   sólidas com texto branco (`--blue-500` para Locação, `--red-500` para
   Venda) — mas um card usa `--red-600` e outro usa `--brand-secondary` para
   o mesmo estado. Já o componente `Badge` do DS e a página de detalhe usam
   fundo tonal (`--status-venda-bg` + `--status-venda-fg`).
   **Proposta:** card = pílula sólida (Venda vermelho, Locação azul, sempre
   `-500`); página de detalhe = tonal. Padroniza o protótipo sem mudar a
   leitura visual.
2. **Semântica das cores de status.** O `colors.css` define
   Venda = vermelho e Locação = azul. O readme do design system e o
   `_ds_manifest.json` afirmam o contrário (Venda = azul). O `colors.css` e o
   protótipo concordam entre si → seguimos eles; o readme está desatualizado.
3. ❓ **Endereço.** O `.dc.html` diz "Rua Alfredo **Nasser**, nº 20-B"; o
   rodapé do design system diz "Rua Alfredo **Nascer**, 20-B". Qual é o certo?
4. ❓ **Corretor responsável.** O `.dc.html` mostra "Divino Matias · CRECI - 9155"
   na ficha do imóvel; o `app.jsx` mostra "Matias Imóveis · CJ-40079"; o logo
   traz CJ-40079. Definir o que aparece na ficha e no rodapé.
5. ❓ **WhatsApp.** O componente usa `556284120892` → (62) 8412-0892, que tem
   só 8 dígitos. Celular em Goiás tem 9. Falta o dígito.
6. **Ano do rodapé.** Está fixo em "© 2023" → passar a calcular o ano.
7. **Copy inconsistente.** "Kitnet" (card) × "Kitnete" (select); "Kitnet
   1 quartos" → "1 quarto"; botão "Ver todos     >>" (com espaços e `>>`
   literais) → "Ver todos" + ícone.
8. **Dados fake do protótipo.** Três cards diferentes usam "Ref. 566" e o
   mesmo imóvel aparece com 100m² num lugar e 65m² noutro. É ruído de
   protótipo, some quando os dados vierem do banco.
9. **Hero.** `.dc.html`: hero dividido (texto à esquerda + foto à direita),
   título "O imóvel certo, no lugar certo", dois botões. `app.jsx`: hero
   centralizado, sem foto, título "Nós encontramos o imóvel perfeito para
   realizar seu sonho". **Proposta:** versão do `.dc.html`.
10. **Botão de favoritar (coração)** existe no `PropertyCard` do DS mas não
    aparece no `.dc.html`. Sem login de visitante ele não guarda nada.
    **Proposta:** remover na v1.
11. **Formulário "Anuncie".** O `.dc.html` removeu o checkbox "O imóvel está
    mobiliado" e trocou o botão "Enviar anúncio" por "Fale conosco" — o que
    combina com a decisão de mandar para o WhatsApp. **Proposta:** seguir o
    `.dc.html`, com o rótulo "Falar no WhatsApp".
12. ❓ **Links do rodapé fora de escopo:** "Trabalhe conosco", "Simule um
    financiamento", "Venda seu imóvel", "Comprar imóvel", "Alugar imóvel".
    Sugestão: "Comprar/Alugar imóvel" → `/imoveis` já filtrado;
    "Venda seu imóvel" → `/anuncie`; "Trabalhe conosco" e "Simule um
    financiamento" → remover da v1 (link morto é pior que link ausente).
13. **O protótipo é 100% desktop.** Grids fixos, cards de 280px, sem menu
    mobile. Como a maior parte do tráfego imobiliário no Brasil é celular, a
    responsividade será desenhada por mim seguindo os tokens (fase 4).
14. ❓ **Fontes.** Poppins + Inter foram uma substituição escolhida pelo
    design system, que pede confirmação. Se a Matias tiver fonte de marca,
    troca-se num arquivo só.

---

## 3. Arquitetura alvo

### Rotas

| Rota | Página | Renderização |
| --- | --- | --- |
| `/` | Home | Estática + ISR |
| `/imoveis` | Busca com filtros | Server, filtros em `searchParams` |
| `/imovel/[slug]` | Ficha do imóvel | SSG + ISR, `generateStaticParams` |
| `/anuncie` | Anuncie seu imóvel | Estática |
| `/contato` | Contato | Estática |
| `/empresa` | Quem somos | Estática |
| `/admin` | Login | Client |
| `/admin/imoveis` | Lista, publicar/despublicar | Server + auth |
| `/admin/imoveis/novo`, `/admin/imoveis/[id]` | Cadastro/edição + fotos | Client + auth |
| `/sitemap.xml`, `/robots.txt` | SEO | Dinâmico |

Filtros na URL (`/imoveis?finalidade=locacao&bairro=setor-sul&tipo=casa&quartos=3&preco=300-500`)
para que a busca seja compartilhável no WhatsApp e indexável.

### Estrutura de pastas

```
src/
  app/
    layout.tsx, page.tsx
    imoveis/page.tsx
    imovel/[slug]/page.tsx, imovel/[slug]/opengraph-image.tsx
    anuncie/page.tsx, contato/page.tsx, empresa/page.tsx
    (admin)/admin/...
    sitemap.ts, robots.ts
  components/
    ui/        Button, Input, Select, Checkbox, Badge, SegmentedControl, Field
    property/  PropertyCard, SearchFilterBar, PropertyGallery, PropertySpecs, EmptyState
    layout/    Navbar, MobileMenu, Footer, WhatsAppFab, Container
  lib/
    supabase/  client.ts, server.ts, admin.ts
    queries.ts   getFeatured, searchProperties, getPropertyBySlug
    whatsapp.ts  buildWhatsAppUrl
    format.ts    formatPrice, formatArea, slugify
    site.ts      telefone, whatsapp, endereço, CJ, e-mail, redes
  styles/
    tokens/{colors,typography,spacing}.css   (cópia intacta do handoff)
    globals.css                              (@import tokens + @theme)
public/  logo.png, logo-icon.png, logo-wordmark.png
```

### Modelo de dados (Supabase)

`properties`
- `id` uuid pk · `ref` text unique · `slug` text unique
- `purpose` enum `venda | locacao`
- `kind` enum `casa | apartamento | lote | galpao | kitnete | comercial`
- `title`, `description`, `neighborhood`, `city` (default `Itaberaí`), `state` (default `GO`)
- `address` (privado, não exposto na API pública)
- `price_cents` bigint · `condo_cents`, `iptu_cents` (opcionais)
- `bedrooms`, `bathrooms`, `suites`, `parking` int · `area_m2`, `lot_area_m2` numeric
- `features` text[] (mobiliado, piscina, murado…)
- `status` enum `disponivel | em_negociacao | vendido | alugado`
- `featured` bool · `published` bool · `published_at`, `created_at`, `updated_at`

`property_photos` — `id`, `property_id` (fk cascade), `storage_path`, `alt`, `position`, `is_cover`

`profiles` — usuários do admin (`role`), ligado a `auth.users`

**RLS**
- `properties`: SELECT público apenas onde `published = true`; ALL para
  usuários autenticados com role admin.
- `property_photos`: SELECT público apenas se o imóvel pai estiver publicado.
- Storage bucket `property-photos`: leitura pública, escrita só autenticada.
- Sem signup público — usuários criados manualmente no painel do Supabase.

Índices: `(published, featured)`, `(published, purpose, neighborhood)`,
`(published, price_cents)`, e `slug`/`ref` únicos.

---

## 4. Passo a passo

### Fase 0 — Fundação · ~0,5 dia

1. `create-next-app` com TypeScript, Tailwind v4, App Router, `src/`, alias `@/*`.
2. Copiar os três CSS de tokens do handoff **sem editar**; criar
   `globals.css` que os importa e expõe as variáveis como utilitários
   Tailwind via `@theme inline` (`--color-brand-primary`, `--color-text-1`,
   `--radius-lg`, `--shadow-md`…). Assim o design system continua sendo a
   fonte da verdade e o Tailwind só o consome.
3. Trocar o `@import` do Google Fonts por `next/font/google` (Poppins
   500/600/700/800 + Inter 400/500/600/700), publicando nas mesmas variáveis
   `--font-display` / `--font-body` — os tokens de tipografia seguem valendo
   e some o render-blocking.
4. Trocar o CDN `unpkg.com/lucide@latest` por `lucide-react`: ícones viram
   componentes, sem `lucide.createIcons()` a cada render e sem flash.
5. Copiar os logos para `public/`.
6. Criar `src/lib/site.ts` com telefone, WhatsApp, endereço, CJ-40079,
   e-mail e horário — um lugar só para dados que mudam.

**Pronto quando:** uma página em branco renderiza em Poppins/Inter e as
variáveis de token respondem no DevTools.

### Fase 1 — Componentes do design system · ~1 dia

Portar os 11 componentes para TSX, mantendo as medidas exatas lidas do
bundle:

- **Button** — `sm` 8/16px + body-sm · `md` 11/22px + label · `lg` 15/28px +
  display-sm; variantes primary, secondary, outline, ghost, whatsapp;
  `--radius-md`, Poppins, transição de 150ms; hover escurece um passo.
- **Input** — altura 44, padding lateral 14, gap 8, borda 1px `--border-1`
  que vira `--border-focus` + halo `--shadow-focus` no foco.
- **Select** — altura 44, `appearance: none`, chevron 16px absoluto a 12px
  da direita.
- **Checkbox** — caixa 20×20, raio 6, preenche com `--brand-secondary`.
- **SegmentedControl** — pílula sobre `--bg-sunken`, padding 4, item ativo
  em `--brand-primary`.
- **Badge** — pílula 6/14px, tons venda/locacao/success/warning.
- **PropertyCard** — foto 180px, selo no canto superior esquerdo, conteúdo
  com padding 16 e gap 8, preço em `--text-price`, linha de specs com
  borda superior e a referência alinhada à direita.
- **SearchFilterBar** — superfície com `--shadow-lg`, padding 24; alternador
  Alugar (azul) / Comprar (vermelho); grid `1.4fr 1fr 1fr 1fr auto` com
  Bairro, Tipo, Quartos, Faixa de preço e o botão Buscar de 44px.
- **Navbar** — 14/32px, `--shadow-sm`, logo ícone 44px + wordmark 24px,
  links com gap 28, telefone clicável à direita.
- **Footer** — fundo `--bg-inverse`, logo invertido para branco, três
  colunas de links, linha de copyright.
- **WhatsAppButton** — FAB 60px fixo a 24px do canto, ou pílula com rótulo.

Acessibilidade desde já: `focus-visible` com o halo do token, `label`
associado a cada campo, `aria-label` no FAB, alvo mínimo de 44px no toque.

**Pronto quando:** uma rota interna `/dev/ui` (bloqueada em produção) exibe
todos os componentes em todas as variantes e estados.

### Fase 2 — Layout e navegação · ~0,5 dia

Navbar (com o menu mobile que o protótipo não tem: hambúrguer + drawer),
Footer, FAB do WhatsApp, `layout.tsx` raiz e container de 1200px.
Navegação: Início · Buscar imóveis · Anuncie seu imóvel · Contato · Empresa.

### Fase 3 — Páginas com dados mock · ~1,5 dia

Construir as 6 páginas lendo de `src/lib/mock-properties.ts` (os 6 imóveis do
protótipo). Primeiro fiel ao desktop 1280px, depois responsivo. Fazer isso
**antes** do banco permite revisar e ajustar o visual sem retrabalho de dados.

- **Home** — hero em degradê 135° (`--bg-inverse` → `--blue-700`), grid
  1.1fr/1fr, título 40px, dois CTAs, foto à direita; barra de busca sobrepondo
  o hero em −72px; "Imóveis em destaque" com 4 cards; faixa de 3 serviços.
- **Busca** — barra de filtros, contagem "N imóveis encontrados", grade de cards.
- **Detalhe** — galeria (foto 380px + tira de 4 miniaturas de 96px), selo,
  título, linha "bairro · Itaberaí/GO · Ref.", faixa de specs entre filetes,
  descrição, e a coluna lateral fixa (sticky) com preço 32px, botão de
  WhatsApp, telefone e o corretor responsável.
- **Anuncie** — coluna de 720px, formulário em cartão.
- **Contato** — duas colunas: dados + WhatsApp + mapa à esquerda,
  formulário à direita.
- **Empresa** — página nova, montada com os componentes do DS (história,
  atuação em Itaberaí e região, CJ-40079, equipe, CTA para o WhatsApp).
  Depende do texto da imobiliária.

### Fase 4 — Responsividade · ~0,5 dia

Breakpoints: `<640px` uma coluna · `640–1024px` duas · `≥1024px` o layout do
protótipo.

- Hero empilha, foto acima do texto (ou oculta no celular para o CTA subir).
- Barra de busca vira coluna única, botão Buscar de largura total.
- Cards passam de 280px fixos para largura fluida em grid.
- Ficha do imóvel: a coluna lateral vira uma barra fixa no rodapé da tela
  com preço + "Falar no WhatsApp" — o padrão que mais converte no celular.
- Navbar vira drawer; rodapé empilha as colunas.

### Fase 5 — Supabase · ~1 dia

Criar projeto, aplicar o schema e as políticas de RLS da seção 3, criar o
bucket de fotos, semear os 6 imóveis, gerar os tipos TypeScript
(`supabase gen types`) e escrever `lib/queries.ts`. Trocar o mock pelas
queries reais. Revalidação: ISR nas páginas públicas + `revalidatePath` ao
publicar/editar no admin, para o site atualizar na hora.

### Fase 6 — Busca com filtros reais · ~0,5 dia

Filtros lidos de `searchParams` e aplicados na query (finalidade, bairro,
tipo, quartos mínimos, faixa de preço), ordenação, paginação, contagem real e
estado vazio com saída pelo WhatsApp — no tom do site atual: "Descreva o
imóvel que você procura e nós avisaremos quando encontrá-lo."

### Fase 7 — Formulários para o WhatsApp · ~0,5 dia

Validação com `react-hook-form` + `zod`, máscara de telefone, e
`buildWhatsAppUrl()` montando `https://wa.me/55<numero>?text=…`:

- **Anuncie:** nome, telefone, finalidade, tipo, bairro e valor pretendido
  viram uma mensagem estruturada.
- **Contato:** nome, e-mail e mensagem.
- **Ficha do imóvel:** a mensagem já vai com referência, título, bairro,
  preço e o link da página — o corretor abre o WhatsApp sabendo exatamente
  de qual imóvel se trata. É o maior ganho isolado de conversão do site.

Observação registrada: como não há backend de leads, **nenhum contato fica
armazenado**. Se um dia quiserem histórico, é uma tabela `leads` e uma
server action — o código já fica organizado para isso.

### Fase 8 — Painel admin · ~2 dias

- Supabase Auth por e-mail/senha, sem cadastro público; middleware protegendo
  `/admin`.
- Lista de imóveis com filtro por status e alternadores de "publicado" e
  "destaque".
- Formulário de cadastro/edição com upload múltiplo de fotos (arrastar,
  reordenar, definir capa), com compressão no navegador antes de subir —
  fotos de celular têm 5 MB e destroem o carregamento se forem cruas.
- `slug` e `ref` gerados automaticamente, com possibilidade de editar.
- Botão de pré-visualizar antes de publicar.
- Interface em português e simples o bastante para o corretor usar sozinho:
  esse é o critério de sucesso da fase.

### Fase 9 — SEO, performance e LGPD · ~0,5 dia

- `generateMetadata` por página; na ficha, título no formato
  "Casa 3 quartos no Setor Sul, Itaberaí/GO — R$ 320.000 | Matias Imóveis".
- Imagem Open Graph dinâmica (foto de capa + preço + selo) para o link ficar
  bonito quando compartilhado no WhatsApp.
- JSON-LD: `RealEstateListing` na ficha, `RealEstateAgent` no site,
  `BreadcrumbList` na navegação.
- `sitemap.xml` dinâmico com todos os imóveis publicados; `robots.txt`.
- `next/image` com `sizes` corretos, `priority` no hero, `placeholder="blur"`.
- Texto alternativo nas fotos.
- Política de privacidade curta (LGPD) e aviso, junto ao formulário, de que
  os dados serão enviados por WhatsApp.
- Meta: Lighthouse ≥ 90 em mobile nas quatro métricas.

### Fase 10 — Deploy · ~0,5 dia

Vercel conectado ao repositório, variáveis de ambiente, domínio
`matiasimoveisgo.com.br` apontado, redirecionamentos 301 das URLs antigas que
tiverem tráfego, Vercel Analytics, e teste final em celular real.

---

## 5. O que preciso da imobiliária

Sem isso o site fica bonito e vazio. Em ordem de urgência:

1. **Fotos reais dos imóveis** — pelo menos 6 a 10 imóveis completos para
   lançar. Hoje tudo é uma foto de banco de imagens repetida.
2. **Foto do hero** — fachada de destaque ou da loja.
3. **Número de WhatsApp completo** (com o 9º dígito).
4. **Confirmar o endereço**: Alfredo Nasser ou Alfredo Nascer?
5. **Confirmar o corretor responsável** e o que exibir: CRECI-9155,
   CJ-40079, ou ambos.
6. **E-mail institucional.**
7. **Texto de "Quem somos"** — história, ano de fundação, equipe, diferencial.
8. **Redes sociais** (Instagram / Facebook), se houver.
9. **Acesso ao DNS do domínio** e ao site antigo.
10. **Confirmação das fontes** Poppins + Inter, ou os arquivos da fonte de marca.

---

## 6. Referências do handoff

| Arquivo | Para quê |
| --- | --- |
| `handoff/project/Matias Imóveis - Site.dc.html` | Design primário — vence em caso de conflito |
| `handoff/project/ds/tokens/*.css` | Tokens, copiar sem alterar |
| `handoff/project/ds/_ds_bundle.js` | Implementação de referência dos 11 componentes |
| `handoff/project/screens/*.jsx` | Versões React das telas (variante mais antiga do hero) |
| `handoff/project/_ds/.../readme.md` | Racional de marca, voz, tom e caveats |
| `handoff/project/ds/assets/` | Logos (completo, ícone, wordmark) |
| `handoff/project/.image-slots.state.json` | Única foto real embutida (placeholder de banco de imagens) |
