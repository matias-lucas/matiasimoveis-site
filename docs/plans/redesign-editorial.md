# Redesign Editorial (Matias Imóveis) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reestilizar o site público da Matias Imóveis (tipografia, cor, layout, responsivo e motion) de um template imobiliário genérico para uma identidade editorial tradicional-moderna, sem tocar `/admin`, Supabase, roteamento ou o fluxo de leads via WhatsApp.

**Architecture:** Mudança incremental camada-por-camada: primeiro os tokens/fontes que tudo herda (Etapa 1), depois o chrome global (Etapa 2), depois cada página pública em ordem de tráfego (Etapas 3–6), depois motion (Etapa 7) e por fim auditoria/QA (Etapa 8). Cada etapa termina com o site buildando e visualmente coerente — dá pra parar em qualquer ponto entre etapas.

**Tech Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 (`@theme inline`) + `next/font/google` + `lucide-react` + shadcn/ui (Drawer, Dialog, Carousel — a instalar) + `motion` (Motion for React — a instalar). Supabase inalterado.

**Spec:** `docs/REDESIGN-BRIEF.md` (fonte da verdade do sistema visual; leia antes de cada etapa).

## Global Constraints

- Tipografia: display/preço/números = `Fraunces`; corpo/labels/nav = `Instrument Sans`. Proibido Inter, Poppins, Roboto, Open Sans, Lato, Space Grotesk, system-ui como fonte principal.
- Cor de marca fixa: `--red-500 #e6383d` (acento cirúrgico: CTA primário, preço, selo Venda — nunca área grande) e `--blue-500 #413e8c` (secundário: links, selo Locação). `--blue-900 #161430` = superfície escura. Fundo de página = novo off-white quente `#faf7f2` (não mais `--gray-50`). `--whatsapp #25d366` exclusivo de ações de WhatsApp.
- Corpo de texto nunca < 16px, line-height ≥ 1.6, alvos de toque ≥ 44px (público inclui muita gente mais velha). WCAG AA como piso em todo par texto/fundo.
- Mobile-first, breakpoints Tailwind `sm` (640px) e `lg` (1024px). Testar sempre em 1440px e 390px.
- Motion: biblioteca `motion` só; toda animação com fallback via `useReducedMotion`. Proibido parallax pesado, contadores animados, cursor customizado, partículas, pop-up, urgência.
- **Fora de escopo — não tocar:** `src/app/admin/**`, `src/lib/supabase/**`, `src/lib/queries.ts`, `src/lib/admin/**`, `src/lib/whatsapp.ts` (a lógica, não o visual dos botões que a consomem), schema/RLS do Supabase, `src/lib/site.ts` (dados, não os componentes que os exibem). Branch `reimaginacao-home` não é referência nem é mesclada.
- Não inventar fatos que não existem em `src/lib/site.ts` (ex.: não há campo "anos de atuação" — não adicionar esse número em nenhuma seção de confiança).
- Comentários novos em português, identificadores de domínio (Imovel/Corretor) em português, vocabulário genérico de engenharia em inglês — ver CLAUDE.md "Domain vocabulary".

---

## File Structure

**Tokens/fontes (Etapa 1):**
- Modify: `src/app/layout.tsx` — troca imports de fonte.
- Modify: `src/styles/tokens/typography.css` — troca `--font-display`/`--font-body`.
- Modify: `src/styles/tokens/colors.css` — novo `--bg-page`, novos neutros quentes.
- Modify: `src/app/globals.css` — `:root` font vars, novas entradas em `@theme inline`, remove comentário de "tokens congelados".
- Modify: `src/components/layout/Container.tsx` — gutter responsivo.
- Modify: `package.json` — dependências `motion` e shadcn/ui.
- Create: `components.json`, `src/lib/utils.ts` (cn helper do shadcn), `src/components/ui/drawer.tsx`, `src/components/ui/dialog.tsx`, `src/components/ui/carousel.tsx` (gerados pelo shadcn CLI).

**Layout global (Etapa 2):**
- Modify: `src/components/layout/Navbar.tsx` — drawer mobile.
- Modify: `src/components/layout/WhatsAppFab.tsx` — escondido abaixo de `lg`.
- Modify: `src/components/layout/Footer.tsx` — ajuste tipográfico/tonal (usa tokens novos).

**Home (Etapa 3):**
- Modify: `src/app/(site)/page.tsx` — hero full-bleed, faixa de confiança, seção de serviços.

**Cards/listagem (Etapa 4):**
- Modify: `src/components/imovel/ImovelCard.tsx`, `src/components/imovel/ImovelCardSkeleton.tsx`.
- Modify: `src/app/(site)/page.tsx` (grid da seção destaque), `src/components/imovel/ImoveisResultsSection.tsx`.
- Modify: `src/components/imovel/SearchFilterBar.tsx`, `src/app/globals.css` (bloco `.sfb-*`).

**Ficha do imóvel (Etapa 5):**
- Create: `src/components/imovel/ImovelGallery.tsx` (client — lightbox).
- Create: `src/components/imovel/ImovelMobilePriceBar.tsx` (server — barra fixa mobile).
- Modify: `src/app/(site)/imovel/[slug]/page.tsx`.

**Páginas secundárias (Etapa 6):**
- Modify: `src/app/(site)/anuncie/page.tsx`, `src/app/(site)/contato/page.tsx`, `src/app/(site)/empresa/page.tsx`.
- Modify: `src/components/forms/SellForm.tsx`, `src/components/forms/ContactForm.tsx` (QA visual, sem mudança de lógica).

**Motion (Etapa 7):**
- Create: `src/components/motion/HeroReveal.tsx`, `src/components/motion/FadeInWhenVisible.tsx`.
- Modify: `src/app/(site)/page.tsx` (envolve hero), `src/components/imovel/ImovelCard.tsx` (hover + fade-up), `src/app/(site)/imoveis/page.tsx` / `ImoveisResultsSection.tsx` (fade-up), transição de rota lista→ficha (arquivo exato definido na Etapa 7 depois de consultar a skill `transitions-dev` e os docs do Next 16 — ver Task 7.4).

**Qualidade (Etapa 8):**
- Create: `docs/redesign/after/*.png`.
- No source files modified beyond fixes apontados pelo `/impeccable audit`/`polish`.

---

## Etapa 1 — Fundação

### Task 1.1: Trocar fontes para Fraunces + Instrument Sans

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/styles/tokens/typography.css:1-3`
- Modify: `src/app/globals.css:6-23`

**Interfaces:**
- Produces: variáveis CSS `--font-fraunces`, `--font-instrument-sans` no `<html>`; `--font-display`/`--font-body` (tokens) passam a resolver para elas. Todo componente existente que já usa `font-display`/`font-body` (Tailwind) ou `style={{ fontFamily: "var(--font-display)" }}` herda a troca sem mudança própria.

- [ ] **Step 1: Trocar o bloco de fontes em `src/app/layout.tsx`**

Substitua:
```tsx
import { Poppins, Inter } from "next/font/google";
...
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
```
por:
```tsx
import { Fraunces, Instrument_Sans } from "next/font/google";
...
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
  display: "swap",
});
```
E troque a linha do `<html>`:
```tsx
className={`${poppins.variable} ${inter.variable} h-full antialiased`}
```
por:
```tsx
className={`${fraunces.variable} ${instrumentSans.variable} h-full antialiased`}
```

- [ ] **Step 2: Atualizar `src/styles/tokens/typography.css`**

Linha 1-3, de:
```css
--font-display:'Poppins',ui-sans-serif,system-ui,sans-serif;
--font-body:'Inter',ui-sans-serif,system-ui,sans-serif;
```
para:
```css
--font-display:'Fraunces',ui-serif,Georgia,serif;
--font-body:'Instrument Sans',ui-sans-serif,system-ui,sans-serif;
```

- [ ] **Step 3: Atualizar o `:root` e o comentário em `src/app/globals.css`**

O comentário nas linhas 12-19 hoje descreve Poppins/Inter; reescreva para descrever Fraunces/Instrument Sans e o bloco `:root` (linhas 20-23) de:
```css
:root {
  --font-display: var(--font-poppins), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}
```
para:
```css
:root {
  --font-display: var(--font-fraunces), ui-serif, Georgia, serif;
  --font-body: var(--font-instrument-sans), ui-sans-serif, system-ui, sans-serif;
}
```

- [ ] **Step 4: Remover o comentário de "tokens congelados" (linhas 6-10 de `globals.css`)**

Esse comentário diz "não edite os valores aqui à mão, edite os tokens de origem [do handoff] e recopie" — decisão revogada pelo redesign (ver CLAUDE.md "Design direction"). Apague o bloco de comentário inteiro (linhas 6-10); os imports de tokens (linhas 1-4) continuam.

- [ ] **Step 5: Verificar**

Rode `npm run build`. Depois `grep -ri "poppins\|inter" src/` — só deve sobrar `Instrument Sans`/`Instrument_Sans` (contém "Inter" como substring de "Instrument", isso é esperado; confirme visualmente que não há `Poppins` nem a palavra isolada `Inter` fora de `Instrument`). Abra a Home em 1440px: títulos devem renderizar em serifada (Fraunces), corpo em sans (Instrument Sans) — o visual muda, isso é esperado nesta etapa.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/styles/tokens/typography.css src/app/globals.css
git commit -m "feat(redesign): trocar Poppins+Inter por Fraunces+Instrument Sans"
```

---

### Task 1.2: Novo fundo off-white quente + neutro quente

**Files:**
- Modify: `src/styles/tokens/colors.css`
- Modify: `src/app/globals.css:25-118` (bloco `@theme inline`)

**Interfaces:**
- Produces: tokens CSS `--paper-50`, `--sand-100`, `--bg-warm-subtle`, `--border-warm`, e as utilities Tailwind correspondentes `bg-paper-50`, `bg-sand-100`, `bg-bg-warm-subtle`, `border-border-warm` (via `@theme inline`). `--bg-page` (logo `bg-bg-page`) passa a resolver para o novo off-white.

- [ ] **Step 1: Adicionar os novos neutros em `src/styles/tokens/colors.css`**

Na linha 2 (bloco "brand base"), adicione uma nova linha logo abaixo da linha `--gray-0...--gray-900`:
```css
--paper-50:#faf7f2;--sand-100:#e9e2d6;
```

- [ ] **Step 2: Trocar `--bg-page` e adicionar aliases semânticos**

Na seção "semantic", troque:
```css
--bg-page:var(--gray-50);
```
por:
```css
--bg-page:var(--paper-50);
--bg-warm-subtle:var(--sand-100);
--border-warm:var(--sand-100);
```
(mantenha `--bg-surface`, `--bg-sunken`, `--bg-inverse` como estão — só `--bg-page` muda de valor.)

- [ ] **Step 3: Expor os novos tokens no `@theme inline` de `globals.css`**

Depois da linha `--color-bg-inverse: var(--bg-inverse);`, adicione:
```css
--color-paper-50: var(--paper-50);
--color-sand-100: var(--sand-100);
--color-bg-warm-subtle: var(--bg-warm-subtle);
```
E depois de `--color-border-focus: var(--border-focus);`, adicione:
```css
--color-border-warm: var(--border-warm);
```

- [ ] **Step 4: Verificar**

`npm run build`. Abra qualquer página pública em 1440px: o fundo deve estar off-white quente (`#faf7f2`), não mais cinza frio. `--bg-surface` (cards, navbar) continua branco puro — só o fundo da página muda, então deve haver contraste sutil entre o fundo da página e os cards/navbar brancos por cima. Não há ainda nenhum uso de `bg-warm-subtle`/`border-warm` no código — isso é esperado, essas tasks vêm nas etapas seguintes (ex.: divisores da faixa de confiança na Etapa 3).

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens/colors.css src/app/globals.css
git commit -m "feat(redesign): fundo off-white quente + neutro sand nos tokens"
```

---

### Task 1.3: Gutter responsivo no Container

**Files:**
- Modify: `src/components/layout/Container.tsx`

**Interfaces:**
- Consumes: nada novo.
- Produces: `Container` continua com a mesma API (`as`, `children`, `className`) — só a classe interna muda. Todo call site existente (Navbar, Footer, todas as páginas) herda automaticamente.

- [ ] **Step 1: Trocar o padding fixo por um padding responsivo**

Em `src/components/layout/Container.tsx:13`, troque:
```tsx
className={clsx("mx-auto w-full px-8", className)}
```
por:
```tsx
className={clsx("mx-auto w-full px-4 sm:px-6 lg:px-8", className)}
```

- [ ] **Step 2: Verificar**

`npm run lint && npm run build`. Abra a Home em 390px: o respiro lateral deve cair de 32px para 16px (mais espaço útil de conteúdo numa tela pequena), sem nenhum elemento encostando na borda. Em 1440px o resultado deve ser idêntico a antes (32px, já que `lg:px-8` bate com o valor antigo).

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Container.tsx
git commit -m "feat(redesign): gutter responsivo no Container (16/24/32px)"
```

---

### Task 1.4: Instalar `motion` e inicializar shadcn/ui (Drawer, Dialog, Carousel)

**Files:**
- Modify: `package.json`
- Create: `components.json`, `src/lib/utils.ts`, `src/components/ui/drawer.tsx`, `src/components/ui/dialog.tsx`, `src/components/ui/carousel.tsx` (nomes exatos definidos pelo shadcn CLI — confirme após rodar).

**Interfaces:**
- Produces: pacote `motion` disponível para import (`import { motion, useReducedMotion } from "motion/react"`, usado na Etapa 7); componentes shadcn `Drawer`/`DrawerTrigger`/`DrawerContent`/... (usado na Etapa 2, Navbar mobile) e `Dialog`/`Carousel` (usado na Etapa 5, galeria da ficha).

- [ ] **Step 1: Instalar `motion`**

```bash
npm install motion
```
Verifique: `package.json` ganhou `"motion": "^<versão>"` em `dependencies`.

- [ ] **Step 2: Inicializar shadcn/ui**

Este projeto usa Tailwind v4 e ainda não tem `components.json`. Invoque a skill `shadcn` (via `Skill` tool) para obter o comando de init atual compatível com Tailwind v4/Next 16 — não assuma a sintaxe de memória, ela muda entre versões do CLI. Ao configurar:
- Aponte o alias de componentes para `src/components/ui` (pasta já existente com os primitivos hand-rolled do handoff — o shadcn CLI escreve arquivos kebab-case como `drawer.tsx` ali dentro, convivendo normalmente com os `Button.tsx`/`Badge.tsx` PascalCase já existentes).
- Aponte o alias de utils para `src/lib/utils.ts` (novo arquivo, só a função `cn()` do shadcn).
- **Não** deixe o CLI sobrescrever `src/app/globals.css` nem `src/styles/tokens/*.css` — se ele oferecer, recuse; os tokens deste projeto são os da Task 1.1/1.2, não os defaults do shadcn.

- [ ] **Step 3: Adicionar os 3 primitivos necessários**

Usando o mesmo shadcn CLI (comando `add`, sintaxe também vinda da skill `shadcn`):
```
drawer
dialog
carousel
```
(`carousel` do shadcn depende de `embla-carousel-react` — o CLI deve instalar sozinho; confirme em `package.json` depois.)

- [ ] **Step 4: Verificar**

`npm run build` e `npm run lint` limpos. `src/components/ui/drawer.tsx`, `dialog.tsx`, `carousel.tsx` existem e exportam componentes React. Nenhum arquivo fora de `src/components/ui/`, `src/lib/utils.ts`, `components.json` e `package.json`/`package-lock.json` foi tocado.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json components.json src/lib/utils.ts src/components/ui/drawer.tsx src/components/ui/dialog.tsx src/components/ui/carousel.tsx
git commit -m "chore(redesign): instalar motion e primitivos shadcn (drawer, dialog, carousel)"
```

---

## Etapa 2 — Layout global

### Task 2.1: Navbar responsiva com drawer mobile

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

**Interfaces:**
- Consumes: `Drawer`/`DrawerTrigger`/`DrawerContent`/`DrawerClose` de `@/components/ui/drawer` (Task 1.4); `NAV_LINKS`, `SITE` de `@/lib/site` (já consumidos hoje).
- Produces: nenhuma prop nova — `Navbar` continua sem props.

- [ ] **Step 1: Esconder a `<nav>` de links e o telefone abaixo de `lg`, adicionar botão de menu**

Em `src/components/layout/Navbar.tsx`, importe `Menu` de `lucide-react` e os componentes de `@/components/ui/drawer`. Troque a `<nav className="flex items-center gap-7">` (linha 36) para `hidden lg:flex items-center gap-7`, e o link de telefone (linha 55-62) para `hidden lg:flex ...` (mantendo as demais classes). Adicione, entre o logo e essa nav (ou seja, um terceiro filho do `<Container>` visível só no mobile), um trigger de drawer:

```tsx
<Drawer direction="right">
  <DrawerTrigger asChild>
    <button
      type="button"
      aria-label="Abrir menu"
      className="lg:hidden flex items-center justify-center w-11 h-11 text-text-1"
    >
      <Menu className="w-6 h-6" />
    </button>
  </DrawerTrigger>
  <DrawerContent className="h-full w-[280px] ml-auto rounded-none">
    <nav className="flex flex-col gap-1 p-6 font-display">
      {NAV_LINKS.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <DrawerClose asChild key={item.href}>
            <Link
              href={item.href}
              className={clsx(
                "block py-3 no-underline",
                active ? "text-brand-primary" : "text-text-1"
              )}
              style={{ font: "var(--text-label)" }}
            >
              {item.label}
            </Link>
          </DrawerClose>
        );
      })}
      <a
        href={SITE.phoneHref}
        className="flex items-center gap-2 text-text-1 no-underline mt-4 pt-4 border-t border-border-1"
        style={{ font: "var(--text-label)" }}
      >
        <Phone className="w-4 h-4" />
        {SITE.phone}
      </a>
    </nav>
  </DrawerContent>
</Drawer>
```

Confira o nome exato dos subcomponentes exportados por `src/components/ui/drawer.tsx` (gerado na Task 1.4) antes de copiar este bloco — shadcn pode variar o nome de `DrawerClose` entre versões; ajuste os imports de acordo com o que o arquivo realmente exporta.

- [ ] **Step 2: Verificar**

`npm run build`. Em 1440px: navbar idêntica a antes (links + telefone visíveis, sem botão de menu). Em 390px: só logo + botão de menu (ícone `Menu`, alvo de toque 44×44px); clicar abre um drawer da direita com os 5 links + telefone; clicar num link fecha o drawer e navega.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat(redesign): navbar mobile com drawer"
```

---

### Task 2.2: WhatsAppFab escondido abaixo de `lg`

**Files:**
- Modify: `src/components/layout/WhatsAppFab.tsx`

**Interfaces:** nenhuma mudança de props.

- [ ] **Step 1: Adicionar `hidden lg:flex` à classe do FAB**

Em `src/components/layout/WhatsAppFab.tsx:12`, troque `className="fixed right-6 bottom-6 z-50 flex items-center..."` para `className="hidden lg:flex fixed right-6 bottom-6 z-50 items-center..."` (troque o `flex` isolado por `items-center` já que `hidden`/`lg:flex` agora controlam o display).

Motivo (documentar como comentário acima do componente, em português): a partir da Etapa 5 a ficha do imóvel ganha uma barra inferior fixa com preço + WhatsApp no mobile — ter também o FAB circular flutuando por cima duplicaria o CTA de WhatsApp na tela mais apertada. Nas demais páginas mobile, o CTA de WhatsApp já está inline (formulários, botões de seção) — o FAB era um reforço, não a única via.

- [ ] **Step 2: Verificar**

`npm run build`. Em 1440px: FAB continua no canto inferior direito, comportamento idêntico a antes. Em 390px: FAB não aparece em nenhuma página (inclusive Home/`/imoveis`, ainda sem CTA de WhatsApp flutuante — aceitável, cada página tem seu próprio CTA de WhatsApp inline).

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/WhatsAppFab.tsx
git commit -m "feat(redesign): esconder WhatsAppFab abaixo de lg (evita duplicar CTA no mobile)"
```

---

### Task 2.3: Footer — usar os tokens novos deliberadamente

**Files:**
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:** nenhuma mudança de props.

- [ ] **Step 1: Trocar o divisor final para o novo tom quente**

Em `src/components/layout/Footer.tsx:46`, troque `border-t border-white/15` por `border-t border-white/10` (o footer já usa `bg-bg-inverse`, que é exatamente o "azul-marinho como superfície elegante" que o brief pede — não precisa mudar de token, só afinar o contraste do divisor agora que o fundo da página ao redor dele mudou para off-white quente). Nenhuma outra mudança estrutural nesta task.

- [ ] **Step 2: Verificar**

`npm run build`. Screenshot em 1440 e 390px: footer continua azul-marinho, texto branco, links e colunas iguais — só o tom do divisor muda sutilmente.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "chore(redesign): ajuste fino do divisor do footer"
```

---

## Etapa 3 — Home

### Task 3.1: Hero editorial full-bleed sobre foto

**Files:**
- Modify: `src/app/(site)/page.tsx:19-71`

**Interfaces:**
- Consumes: `public/images/hero-house.webp` (já existe), `SITE.cj`, `SITE.description` de `@/lib/site`.
- Produces: nenhuma — é a raiz da árvore de componentes da Home.

- [ ] **Step 1: Substituir a seção do hero**

Troque o `<section>` das linhas 19-71 (gradiente azul + caixa de imagem 500×260px) por uma versão full-bleed com a foto como fundo e overlay em gradiente:

```tsx
<section className="relative min-h-[520px] flex items-end pb-20 pt-[calc(72px+var(--space-16))] text-white overflow-hidden">
  <Image
    src="/images/hero-house.webp"
    alt="Fachada de um imóvel em Itaberaí/GO"
    fill
    priority
    sizes="100vw"
    className="object-cover -z-10"
  />
  <div
    className="absolute inset-0 -z-10"
    style={{
      background:
        "linear-gradient(180deg, rgba(22,20,48,0.35) 0%, rgba(22,20,48,0.55) 55%, rgba(22,20,48,0.92) 100%)",
    }}
  />
  <Container>
    <div
      className="uppercase opacity-90 mb-3"
      style={{ font: "var(--text-eyebrow)", letterSpacing: "var(--tracking-eyebrow)" }}
    >
      Itaberaí e região · {SITE.cj}
    </div>
    <h1
      className="max-w-[620px] mb-3.5"
      style={{ font: "var(--text-display-xl)", fontFamily: "var(--font-display)" }}
    >
      O imóvel certo, no lugar certo
    </h1>
    <p className="max-w-[480px] mb-7 opacity-90" style={{ font: "var(--text-body-lg)" }}>
      {SITE.description}
    </p>
    <div className="flex gap-3">
      <Link
        href="/imoveis"
        className="inline-flex items-center rounded-md bg-white text-brand-primary px-[22px] py-[11px] hover:bg-white/90 transition-colors duration-150 ease-out"
        style={{ font: "var(--text-label)", fontFamily: "var(--font-display)" }}
      >
        Buscar imóveis
      </Link>
      <Link
        href="/anuncie"
        className="inline-flex items-center rounded-md border border-white/50 text-white px-[22px] py-[11px] hover:bg-white/10 transition-colors duration-150 ease-out"
        style={{ font: "var(--text-label)", fontFamily: "var(--font-display)" }}
      >
        Anuncie seu imóvel
      </Link>
    </div>
  </Container>
</section>
```

Remova o import de `Image` duplicado se já existir (linha 2 já importa `Image` — reaproveite). Note que o `pt-[calc(72px+var(--space-16))]` reserva espaço pro overlap negativo da barra de busca abaixo (mesma lógica do `-mt-[72px]` já existente na linha 73) somado a respiro extra já que o hero cresceu; ajuste visualmente se a barra de busca ficar colada demais no texto.

- [ ] **Step 2: Ajustar o overlap da barra de busca para telas estreitas**

Linha 73, troque:
```tsx
<Container className="-mt-[72px] !max-w-[960px]">
```
por:
```tsx
<Container className="-mt-10 sm:-mt-16 lg:-mt-[72px] !max-w-[960px]">
```
(overlap menor em telas pequenas evita que o card da busca fique espremido contra o hero.)

- [ ] **Step 3: Verificar**

`npm run build`. Screenshot 1440px: hero ocupa a largura toda com a foto de fundo, overlay escurecendo de cima pra baixo, título grande em serifada, barra de busca sobreposta na base. Screenshot 390px: mesmo layout em coluna única, texto legível sobre a foto (checar contraste — se `rgba(22,20,48,0.92)` na base não bastar para AA atrás do texto, aumente a opacidade do gradiente, não o tamanho da fonte).

- [ ] **Step 4: Commit**

```bash
git add "src/app/(site)/page.tsx"
git commit -m "feat(redesign): hero editorial full-bleed sobre foto na Home"
```

---

### Task 3.2: Faixa de confiança

**Files:**
- Modify: `src/app/(site)/page.tsx`

**Interfaces:**
- Consumes: `SITE.cj`, `SITE.defaultCorretor.{name,creci}`, `SITE.address.{city,state}` de `@/lib/site`.

- [ ] **Step 1: Adicionar a seção logo após a barra de busca**

Entre o `<Container className="-mt-10 ...">` (busca) e o `<Container className="my-16">` (destaques), insira:

```tsx
<Container className="py-10">
  <div className="flex flex-wrap gap-x-10 gap-y-4 justify-center items-center text-center border-y border-border-warm py-6">
    <div>
      <div style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }} className="text-text-1">
        {SITE.cj}
      </div>
      <div className="text-text-3" style={{ font: "var(--text-caption)" }}>
        Registro da imobiliária
      </div>
    </div>
    <div>
      <div style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }} className="text-text-1">
        {SITE.defaultCorretor.creci}
      </div>
      <div className="text-text-3" style={{ font: "var(--text-caption)" }}>
        {SITE.defaultCorretor.name}
      </div>
    </div>
    <div>
      <div style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }} className="text-text-1">
        {SITE.address.city}/{SITE.address.state}
      </div>
      <div className="text-text-3" style={{ font: "var(--text-caption)" }}>
        Atuação local
      </div>
    </div>
  </div>
</Container>
```

Só 3 fatos (todos existentes em `SITE`) — não invente um quarto número (ex.: "anos de atuação" não existe em `site.ts`, não adicione). `border-border-warm` usa o token novo da Task 1.2.

- [ ] **Step 2: Verificar**

`npm run build`. Screenshot 1440 e 390px: linha de 3 itens centralizados, números em Fraunces, legenda pequena em caption, divisores sutis em tom areia acima/abaixo. Em 390px os 3 itens devem quebrar linha (`flex-wrap`) sem overflow horizontal.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(site)/page.tsx"
git commit -m "feat(redesign): faixa de confiança na Home"
```

---

### Task 3.3: Reestilizar a seção "Serviços"

**Files:**
- Modify: `src/app/(site)/page.tsx:97-114`

**Interfaces:** consumes `SERVICES` de `@/lib/services` (inalterado).

- [ ] **Step 1: Trocar o grid de 3 ícones genérico por um layout editorial**

Troque o `<section>` das linhas 97-114 (`grid-cols-3`, ícone solto acima do título, tudo centralizado — o padrão "3 features de SaaS" citado como anti-referência) por linhas horizontais com regra tipográfica, sem ícone:

```tsx
<section className="bg-bg-surface py-16 border-t border-border-1">
  <Container>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
      {SERVICES.map(({ title, description }, index) => (
        <div key={title} className="flex flex-col gap-2 pt-5 border-t-2 border-border-warm">
          <span className="text-text-3" style={{ font: "var(--text-caption)" }}>
            0{index + 1}
          </span>
          <div
            className="text-text-1"
            style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
          >
            {title}
          </div>
          <div className="text-text-2" style={{ font: "var(--text-body-sm)" }}>
            {description}
          </div>
        </div>
      ))}
    </div>
  </Container>
</section>
```

`Icon` de `SERVICES` deixa de ser usado nesta seção (a importação `icon: Icon` na desestruturação do `.map` pode ser removida já que não é mais renderizado) — não é preciso mudar `src/lib/services.ts`, os ícones continuam lá caso outra tela queira usá-los.

- [ ] **Step 2: Verificar**

`npm run build`. Screenshot 1440px: 3 colunas com número discreto + regra superior + título serifado + descrição, sem ícone. Screenshot 390px: 1 coluna empilhada.

- [ ] **Step 3: Commit**

```bash
git add "src/app/(site)/page.tsx"
git commit -m "feat(redesign): reestilizar seção Serviços da Home (sem grid de ícone genérico)"
```

---

## Etapa 4 — Cards / listagem

### Task 4.1: ImovelCard responsivo (grid-friendly, 4:3)

**Files:**
- Modify: `src/components/imovel/ImovelCard.tsx`
- Modify: `src/components/imovel/ImovelCardSkeleton.tsx`

**Interfaces:**
- Consumes: `Imovel` de `@/lib/types` (inalterado).
- Produces: `ImovelCard` deixa de impor largura própria — o componente pai (grid) controla a largura da coluna. Isso é uma mudança de contrato implícito: qualquer lugar que renderize `ImovelCard`/`ImovelCardSkeleton` dentro de `flex flex-wrap` precisa migrar para `grid` (ver Task 4.3) ou os cards vão esticar para 100% da linha.

- [ ] **Step 1: Remover largura fixa e trocar a imagem para 4:3**

Em `src/components/imovel/ImovelCard.tsx:30`, troque:
```tsx
className="group block w-[280px] bg-bg-surface rounded-lg overflow-hidden shadow-md transition-shadow duration-150 ease-out hover:shadow-lg font-body"
```
por:
```tsx
className="group block w-full bg-bg-surface rounded-lg overflow-hidden shadow-md transition-shadow duration-150 ease-out hover:shadow-lg font-body"
```
E na linha 32, troque:
```tsx
<div className="relative h-[180px] bg-bg-sunken">
```
por:
```tsx
<div className="relative aspect-[4/3] bg-bg-sunken">
```

- [ ] **Step 2: Ajustar `sizes` do `ImovelPhoto` dentro do card**

`ImovelPhoto` (linha 33) hoje não recebe `sizes` explícito e cai no default `"280px"` (fixo, do próprio `ImovelPhoto.tsx`) — agora que o card é fluido isso sub-otimiza o carregamento em telas largas com 3 colunas. Passe explicitamente:
```tsx
<ImovelPhoto src={coverImage} alt={title} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
```

- [ ] **Step 3: Espelhar as mesmas dimensões no skeleton**

Em `src/components/imovel/ImovelCardSkeleton.tsx`, troque `w-[280px]` por `w-full` e `h-[180px]` por `aspect-[4/3]`, mantendo o resto igual. Atualize o comentário no topo do arquivo (linha 1) para não citar mais `w-[280px]`/`180px` fixos.

- [ ] **Step 4: Verificar**

`npm run build`. Isoladamente, o card ainda vai parecer "esticado" onde for usado dentro de `flex flex-wrap` (Home/`/imoveis`) até a Task 4.3/4.1-home migrar o container para `grid` — isso é esperado e corrigido no próximo passo desta mesma etapa, não precisa parar aqui.

- [ ] **Step 5: Commit**

```bash
git add src/components/imovel/ImovelCard.tsx src/components/imovel/ImovelCardSkeleton.tsx
git commit -m "feat(redesign): ImovelCard fluido e 4:3 (grid-friendly)"
```

---

### Task 4.2: Grid responsivo nos 3 pontos que renderizam ImovelCard

**Files:**
- Modify: `src/app/(site)/page.tsx` (seção "Imóveis em destaque")
- Modify: `src/components/imovel/ImoveisResultsSection.tsx`

**Interfaces:**
- Consumes: `ImovelCard`/`ImovelCardSkeleton` já ajustados na Task 4.1.

- [ ] **Step 1: Home — grid na seção de destaque**

Em `src/app/(site)/page.tsx`, troque o `<div className="flex gap-5 flex-wrap">` que envolve `featured.map(...)` por:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
```

- [ ] **Step 2: `/imoveis` — grid nos resultados e no skeleton**

Em `src/components/imovel/ImoveisResultsSection.tsx`, troque **as duas ocorrências** de `<div className="flex gap-5 flex-wrap">` (uma para o bloco de skeletons quando `isPending`, outra para `results.map`) por:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
```

- [ ] **Step 3: Verificar**

`npm run build`. Screenshot Home e `/imoveis` em 1440px: 3 colunas de cards do mesmo tamanho. Em 768px (tablet, redimensione a janela): 2 colunas. Em 390px: 1 coluna, cards ocupando a largura útil do Container. Confirme que trocar o filtro Alugar/Comprar em `/imoveis` continua trocando os cards por skeletons do mesmo grid (sem pulo de layout) — é o comportamento que `onPendingChange` já garantia antes, só a classe do container mudou.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(site)/page.tsx" src/components/imovel/ImoveisResultsSection.tsx
git commit -m "feat(redesign): grid responsivo 1/2/3 colunas para os cards de imóvel"
```

---

### Task 4.3: SearchFilterBar responsiva

**Files:**
- Modify: `src/components/imovel/SearchFilterBar.tsx`
- Modify: `src/app/globals.css` (bloco `.sfb-*`, linhas 291-395)

**Interfaces:** nenhuma mudança de props/contrato — só classes.

- [ ] **Step 1: Empilhar o topo (toggle Alugar/Comprar + campo Bairro) no mobile**

Em `src/components/imovel/SearchFilterBar.tsx:272`, troque:
```tsx
<div className="sfb-top flex items-end justify-between">
```
por:
```tsx
<div className="sfb-top flex flex-col sm:flex-row sm:items-end sm:justify-between">
```
E no label do campo Bairro (linha 303), troque `className="flex flex-col gap-1.5 flex-1"` por `className="flex flex-col gap-1.5 flex-1 mt-4 sm:mt-0"` (evita o campo colar no toggle quando empilhado).

- [ ] **Step 2: Empilhar os dois sliders (Quartos / Faixa de preço) no mobile**

Linha 352, troque:
```tsx
<div className="sfb-ranges grid grid-cols-2">
```
por:
```tsx
<div className="sfb-ranges grid grid-cols-1 sm:grid-cols-2">
```

- [ ] **Step 3: Reduzir o padding do formulário no mobile**

Em `src/app/globals.css`, o seletor `.sfb-form` (linha 291-294) tem `padding: 28px;` fixo. Troque para responsivo com uma media query mobile-first logo abaixo do bloco `.sfb-form`:
```css
.sfb-form {
  padding: 18px;
  gap: 20px;
}
@media (min-width: 640px) {
  .sfb-form {
    padding: 28px;
  }
}
```
(remova o `padding: 28px;` duplicado da declaração original de `.sfb-form`, deixando só `gap: 20px;` lá — a media query acima assume esse papel.)

- [ ] **Step 4: Verificar**

`npm run build`. Screenshot `/imoveis` (ou Home) em 390px: toggle Alugar/Comprar e campo Bairro empilhados; os dois sliders um embaixo do outro; padding do card de busca reduzido. Confirme que o auto-submit (mudar Alugar/Comprar, arrastar um slider) ainda dispara navegação — nenhuma lógica de `SearchFilterBar.tsx` foi tocada além de classes, então isso não deveria quebrar, mas teste manualmente mesmo assim (é a parte mais frágil do componente, ver o comentário "Fixed bugs" do CLAUDE.md sobre o remount dos sliders).

- [ ] **Step 5: Commit**

```bash
git add src/components/imovel/SearchFilterBar.tsx src/app/globals.css
git commit -m "feat(redesign): SearchFilterBar responsiva (empilha no mobile)"
```

---

## Etapa 5 — Ficha do imóvel

### Task 5.1: Galeria com lightbox (shadcn Dialog + Carousel)

**Files:**
- Create: `src/components/imovel/ImovelGallery.tsx`
- Modify: `src/app/(site)/imovel/[slug]/page.tsx`

**Interfaces:**
- Consumes: `ImovelPhoto` de `./ImovelPhoto`; `Dialog`/`DialogTrigger`/`DialogContent` de `@/components/ui/dialog`; `Carousel`/`CarouselContent`/`CarouselItem`/`CarouselPrevious`/`CarouselNext` de `@/components/ui/carousel` (Task 1.4); tipo `ImovelPhotoRecord` de `@/lib/types`.
- Produces: `ImovelGallery({ photos, coverImage, title }: { photos: ImovelPhotoRecord[]; coverImage?: string; title: string })` — substitui o bloco de foto grande + 4 thumbnails hoje inline em `page.tsx:80-92`.

- [ ] **Step 1: Criar `src/components/imovel/ImovelGallery.tsx`**

```tsx
"use client";

import { useState } from "react";
import { ImovelPhoto } from "./ImovelPhoto";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import type { ImovelPhotoRecord } from "@/lib/types";

interface ImovelGalleryProps {
  photos: ImovelPhotoRecord[];
  coverImage?: string;
  title: string;
}

// Galeria da ficha do imóvel: foto grande + até 4 miniaturas clicáveis,
// abrindo um lightbox (Dialog + Carousel do shadcn) posicionado na foto
// clicada. Sem fotos reais, ImovelPhoto já cai para o estado "Foto em
// breve" sozinho — a galeria não precisa de um caso especial pra isso.
export function ImovelGallery({ photos, coverImage, title }: ImovelGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const others = photos.filter((p) => !p.isCover).slice(0, 4);
  const allSlides = [
    { url: coverImage, alt: title },
    ...others.map((p) => ({ url: p.url, alt: p.alt || title })),
  ];

  return (
    <Dialog open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
      <button
        type="button"
        onClick={() => coverImage && setOpenIndex(0)}
        className="relative h-[380px] w-full bg-bg-sunken rounded-lg overflow-hidden mb-3 block"
        aria-label="Ampliar foto"
      >
        <ImovelPhoto src={coverImage} alt={title} iconClassName="w-12 h-12" priority />
      </button>
      <div className="flex gap-2.5">
        {Array.from({ length: 4 }).map((_, i) => {
          const thumb = others[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => thumb && setOpenIndex(i + 1)}
              className="relative flex-1 h-[72px] bg-bg-sunken rounded-sm overflow-hidden block"
              aria-label={thumb ? `Ver foto ${i + 2}` : undefined}
              disabled={!thumb}
            >
              <ImovelPhoto src={thumb?.url} alt={thumb?.alt || title} iconClassName="w-5 h-5" />
            </button>
          );
        })}
      </div>

      <DialogContent className="max-w-4xl bg-transparent border-none shadow-none p-0">
        <Carousel opts={{ startIndex: openIndex ?? 0 }}>
          <CarouselContent>
            {allSlides.map((slide, i) => (
              <CarouselItem key={i}>
                <div className="relative aspect-[4/3] bg-bg-sunken rounded-lg overflow-hidden">
                  <ImovelPhoto src={slide.url} alt={slide.alt} sizes="90vw" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
```

Confira, antes de copiar, os nomes exatos exportados por `src/components/ui/dialog.tsx` e `carousel.tsx` (gerados na Task 1.4) e o formato de `opts`/`startIndex` do `Carousel` do shadcn (varia por versão) — ajuste conforme o que os arquivos realmente exportam.

- [ ] **Step 2: Usar `ImovelGallery` na página de detalhe**

Em `src/app/(site)/imovel/[slug]/page.tsx`, importe `ImovelGallery` e substitua o bloco das linhas 80-92:
```tsx
<div className="relative h-[380px] bg-bg-sunken rounded-lg overflow-hidden mb-3">
  <ImovelPhoto src={imovel.coverImage} alt={title} iconClassName="w-12 h-12" />
</div>
<div className="flex gap-2.5">
  {Array.from({ length: 4 }).map((_, i) => {
    const thumb = imovel.photos?.filter((p) => !p.isCover)[i];
    return (
      <div key={i} className="relative flex-1 h-[72px] bg-bg-sunken rounded-sm overflow-hidden">
        <ImovelPhoto src={thumb?.url} alt={thumb?.alt || title} iconClassName="w-5 h-5" />
      </div>
    );
  })}
</div>
```
por:
```tsx
<ImovelGallery photos={imovel.photos ?? []} coverImage={imovel.coverImage} title={title} />
```
O import de `ImovelPhoto` no topo do arquivo pode ser removido se não sobrar mais nenhum uso direto nessa página (confira — o resto do arquivo não usa `ImovelPhoto` fora desse bloco).

- [ ] **Step 3: Verificar**

`npm run build`. Num imóvel com fotos reais (suba fotos via `/admin` se preciso, ou teste com um imóvel existente que já tenha): clicar na foto grande ou numa miniatura abre o lightbox centralizado na foto clicada, com setas prev/next funcionando. Num imóvel sem fotos: continua mostrando "Foto em breve" honestamente (sem erro ao clicar — `disabled` nas miniaturas vazias e o guard `coverImage &&` na foto grande cobrem isso). `Esc` ou clique fora fecha o lightbox.

- [ ] **Step 4: Commit**

```bash
git add src/components/imovel/ImovelGallery.tsx "src/app/(site)/imovel/[slug]/page.tsx"
git commit -m "feat(redesign): galeria com lightbox na ficha do imóvel"
```

---

### Task 5.2: Layout responsivo da ficha + barra inferior fixa mobile

**Files:**
- Create: `src/components/imovel/ImovelMobilePriceBar.tsx`
- Modify: `src/app/(site)/imovel/[slug]/page.tsx`

**Interfaces:**
- Produces: `ImovelMobilePriceBar({ price, purpose, whatsappMessage, whatsappNumber }: { price: number; purpose: ImovelPurpose; whatsappMessage: string; whatsappNumber?: string })` — server component (sem `"use client"`, é só CSS responsivo), renderizado só na ficha, visível apenas abaixo de `lg`.

- [ ] **Step 1: Criar `src/components/imovel/ImovelMobilePriceBar.tsx`**

```tsx
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { formatPrice } from "@/lib/format";
import type { ImovelPurpose } from "@/lib/types";

interface ImovelMobilePriceBarProps {
  price: number;
  purpose: ImovelPurpose;
  whatsappMessage: string;
  whatsappNumber?: string;
}

// Barra fixa só-mobile (abaixo de lg) com preço + WhatsApp — substitui a
// sidebar sticky do desktop, que não cabe/não faz sentido em tela estreita.
// O WhatsAppFab global fica escondido em telas pequenas (ver WhatsAppFab.tsx)
// justamente para não duplicar esse CTA aqui.
export function ImovelMobilePriceBar({
  price,
  purpose,
  whatsappMessage,
  whatsappNumber,
}: ImovelMobilePriceBarProps) {
  return (
    <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 bg-bg-surface border-t border-border-1 shadow-lg px-4 py-3">
      <div className="text-brand-primary" style={{ font: "var(--text-price)" }}>
        {formatPrice(price, purpose)}
      </div>
      <WhatsAppLink message={whatsappMessage} number={whatsappNumber} size="sm">
        WhatsApp
      </WhatsAppLink>
    </div>
  );
}
```

- [ ] **Step 2: Renderizar a barra e empilhar o grid da ficha no mobile**

Em `src/app/(site)/imovel/[slug]/page.tsx`:
- Troque `<div className="grid grid-cols-[2fr_1fr] gap-8">` (linha 78) por `<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 pb-20 lg:pb-0">` (o `pb-20` reserva espaço pra barra fixa não cobrir o fim do conteúdo no mobile).
- Na sidebar de preço (linha 166), troque `className="self-start sticky top-6 ..."` por `className="hidden lg:flex self-start sticky top-6 ..."` (ela vira exclusiva de desktop; o mobile usa a nova barra fixa).
- Logo depois do `</div>` que fecha o grid principal (antes do `</Container>` final), adicione:
```tsx
<ImovelMobilePriceBar
  price={price}
  purpose={purpose}
  whatsappMessage={imovelInquiryMessage(imovel)}
  whatsappNumber={contactWhatsAppNumber}
/>
```
(importe `ImovelMobilePriceBar` no topo — `imovelInquiryMessage` e `contactWhatsAppNumber` já existem nessa página, reaproveite as mesmas variáveis usadas na sidebar desktop.)

- [ ] **Step 3: Verificar**

`npm run build`. Screenshot 1440px: layout idêntico a antes (2 colunas, sidebar sticky). Screenshot 390px: 1 coluna (galeria → specs → descrição), sidebar de preço não aparece no fluxo, barra fixa aparece colada no rodapé da viewport com preço à esquerda e botão WhatsApp à direita, sempre visível ao rolar, sem cobrir o final do texto (`pb-20` faz esse trabalho — ajuste o valor se a barra tiver altura diferente do estimado).

- [ ] **Step 4: Commit**

```bash
git add src/components/imovel/ImovelMobilePriceBar.tsx "src/app/(site)/imovel/[slug]/page.tsx"
git commit -m "feat(redesign): barra inferior fixa mobile (preço + WhatsApp) na ficha do imóvel"
```

---

## Etapa 6 — Páginas secundárias

### Task 6.1: `/anuncie` responsiva

**Files:**
- Modify: `src/app/(site)/anuncie/page.tsx`

- [ ] **Step 1: Padding responsivo no wrapper**

Linha 12, troque `className="max-w-[720px] mx-auto px-8 py-12"` por `className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12"`.

- [ ] **Step 2: Verificar**

`npm run build`. Screenshot 390px: formulário (`SellForm`) sem overflow horizontal, com o mesmo gutter 16px do resto do site (Task 1.3).

- [ ] **Step 3: Commit**

```bash
git add "src/app/(site)/anuncie/page.tsx"
git commit -m "feat(redesign): padding responsivo em /anuncie"
```

---

### Task 6.2: `/contato` responsiva

**Files:**
- Modify: `src/app/(site)/contato/page.tsx`

- [ ] **Step 1: Empilhar as duas colunas no mobile**

Linha 18, troque `className="py-12 grid grid-cols-2 gap-12"` por `className="py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"`.

- [ ] **Step 2: Reduzir a altura do mapa no mobile**

Linha 47, troque `className="h-[220px] rounded-lg mt-7 overflow-hidden border border-border-1"` por `className="h-[180px] lg:h-[220px] rounded-lg mt-7 overflow-hidden border border-border-1"`.

- [ ] **Step 3: Verificar**

`npm run build`. Screenshot 390px: bloco de endereço/telefone/WhatsApp/mapa em cima, `ContactForm` embaixo, sem grid de 2 colunas espremendo o conteúdo.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(site)/contato/page.tsx"
git commit -m "feat(redesign): /contato responsiva (colunas empilham no mobile)"
```

---

### Task 6.3: `/empresa` responsiva

**Files:**
- Modify: `src/app/(site)/empresa/page.tsx`

- [ ] **Step 1: Empilhar "Como trabalhamos" + card do corretor**

Linha 42, troque `className="grid grid-cols-2 gap-12 items-start"` por `className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"`.

- [ ] **Step 2: Empilhar a seção de Serviços (mesmo ajuste da Task 3.3, aqui reaproveitado)**

Linha 71, troque `className="grid grid-cols-3 gap-8 text-center !px-0"` por `className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center !px-0"`. Diferente da Home (Task 3.3), esta seção em `/empresa` **não** foi redesenhada para tirar o ícone — está fora do escopo detalhado no brainstorm (ver `docs/REDESIGN-BRIEF.md` §4, "demais páginas secundárias... seguem os mesmos tokens/componentes... sem uma sessão de brainstorm dedicada"); só ganha a quebra de linha responsiva aqui. Se quiser unificar visualmente com a Home depois, é uma task nova, não esta.

- [ ] **Step 3: Verificar**

`npm run build`. Screenshot 390px: hero, bloco "Como trabalhamos" + card do corretor, e os 3 serviços todos em coluna única, sem grid de 2/3 colunas espremido.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(site)/empresa/page.tsx"
git commit -m "feat(redesign): /empresa responsiva (colunas empilham no mobile)"
```

---

### Task 6.4: QA visual dos formulários (SellForm/ContactForm)

**Files:**
- Modify: `src/components/forms/SellForm.tsx` (só se a verificação abaixo achar algo)
- Modify: `src/components/forms/ContactForm.tsx` (idem)

**Interfaces:** nenhuma mudança de lógica/validação — os dois formulários já constroem a mensagem de WhatsApp via `@/lib/whatsapp` e isso é fora de escopo (não tocar).

- [ ] **Step 1: Screenshot e checklist manual em 390px**

Ambos os formulários já usam `Input`/`Textarea`/`Select`/`Checkbox`/`Button` de `src/components/ui/`, todos já token-driven — o esperado é que herdem a fonte/cor novas automaticamente sem edição. Abra `/contato` e `/anuncie` em 390px e confira:
- Nenhum campo com largura menor que o container (overflow horizontal = bug).
- Todo alvo tocável (input, botão, checkbox) com pelo menos 44px de altura — `Input`/`Select` usam `h-11` (44px) hoje, `Checkbox` pode ser menor, confira visualmente.
- Mensagens de erro (`FieldError`) legíveis, não cortadas.

- [ ] **Step 2: Corrigir só o que a Step 1 encontrar**

Se algo estourar largura ou ficar abaixo de 44px de alvo, ajuste a classe pontual no componente `ui/` correspondente (não em `SellForm`/`ContactForm`, que só compõem os primitivos) — documente a mudança e o motivo. Se nada for encontrado, não crie mudança artificial: registre no commit que a QA não encontrou problemas.

- [ ] **Step 3: Commit**

```bash
git add src/components/forms/SellForm.tsx src/components/forms/ContactForm.tsx src/components/ui/
git commit -m "fix(redesign): QA visual mobile dos formulários (anuncie/contato)"
```
(Se a Step 2 não mudou nada, pule o commit desta task — não há o que commitar.)

---

## Etapa 7 — Motion

### Task 7.1: `HeroReveal` — revelação escalonada da Home

**Files:**
- Create: `src/components/motion/HeroReveal.tsx`
- Modify: `src/app/(site)/page.tsx` (hero da Task 3.1)

**Interfaces:**
- Consumes: `motion`, `useReducedMotion` de `"motion/react"` (Task 1.4).
- Produces: `HeroReveal({ children }: { children: ReactNode[] })` — client wrapper pequeno; `page.tsx` (server component) continua montando o conteúdo do hero, só a animação de entrada vira responsabilidade deste wrapper.

- [ ] **Step 1: Criar `src/components/motion/HeroReveal.tsx`**

```tsx
"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// Revelação escalonada (eyebrow → título → parágrafo → CTAs) no load do
// hero da Home — o único "momento" de motion mais chamativo do site (ver
// docs/REDESIGN-BRIEF.md §5). Cada filho direto vira um passo do stagger.
export function HeroReveal({ children }: { children: ReactNode[] }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {children.map((child, i) => (
        <motion.div key={i} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

- [ ] **Step 2: Envolver o conteúdo textual do hero**

Em `src/app/(site)/page.tsx`, importe `HeroReveal` e envolva os 4 blocos do hero (eyebrow, `h1`, `p`, div dos botões — dentro do `<Container>` da Task 3.1) como filhos diretos de `<HeroReveal>`:
```tsx
<Container>
  <HeroReveal>
    <div className="uppercase opacity-90 mb-3" style={{ ... }}>...</div>
    <h1 ...>...</h1>
    <p ...>...</p>
    <div className="flex gap-3">...</div>
  </HeroReveal>
</Container>
```
(mantenha o conteúdo interno de cada bloco idêntico ao da Task 3.1 — só adicione o wrapper e o array de filhos.)

- [ ] **Step 3: Verificar**

`npm run build`. Recarregue a Home em 1440px: eyebrow, título, parágrafo e botões aparecem em sequência (fade + leve subida), ~80ms de defasagem entre um e outro. No DevTools, ative "Emulate CSS prefers-reduced-motion: reduce": os 4 blocos devem aparecer imediatamente, sem nenhuma animação.

- [ ] **Step 4: Commit**

```bash
git add src/components/motion/HeroReveal.tsx "src/app/(site)/page.tsx"
git commit -m "feat(redesign): revelação escalonada no hero da Home"
```

---

### Task 7.2: `FadeInWhenVisible` — fade-up de cards/seções

**Files:**
- Create: `src/components/motion/FadeInWhenVisible.tsx`
- Modify: `src/app/(site)/page.tsx` (seções "Imóveis em destaque", "Faixa de confiança", "Serviços")
- Modify: `src/components/imovel/ImoveisResultsSection.tsx`

**Interfaces:**
- Produces: `FadeInWhenVisible({ children, className }: { children: ReactNode; className?: string })` — client wrapper genérico, reutilizável em qualquer seção/grid.

- [ ] **Step 1: Criar `src/components/motion/FadeInWhenVisible.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface FadeInWhenVisibleProps {
  children: ReactNode;
  className?: string;
}

// Fade-up genérico ao entrar no viewport (once: não repete ao rolar de
// novo). Usado nas seções da Home e no grid de resultados de /imoveis.
export function FadeInWhenVisible({ children, className }: FadeInWhenVisibleProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Envolver as 3 seções da Home abaixo do hero**

Em `src/app/(site)/page.tsx`, envolva o conteúdo interno de cada `<Container>`/`<section>` das seções "Faixa de confiança" (Task 3.2), "Imóveis em destaque" e "Serviços" (Task 3.3) com `<FadeInWhenVisible>` — por exemplo, a seção de destaque:
```tsx
<Container className="my-16">
  <FadeInWhenVisible>
    <div className="flex justify-between items-baseline mb-6">...</div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">...</div>
  </FadeInWhenVisible>
</Container>
```
(o hero em si **não** usa `FadeInWhenVisible` — já tem `HeroReveal`, que é o efeito de load, não de scroll.)

- [ ] **Step 3: Envolver o grid de resultados de `/imoveis`**

Em `src/components/imovel/ImoveisResultsSection.tsx`, envolva o `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">` do ramo `results.length > 0` (não o de `isPending`/skeleton, que não deve animar) com `<FadeInWhenVisible>`.

- [ ] **Step 4: Verificar**

`npm run build`. Role a Home lentamente em 1440px: cada seção nasce com fade + leve subida ao entrar na tela, uma vez só (rolar pra cima e pra baixo de novo não repete a animação). Com "reduzir movimento" ativado, tudo aparece direto, sem transição.

- [ ] **Step 5: Commit**

```bash
git add src/components/motion/FadeInWhenVisible.tsx "src/app/(site)/page.tsx" src/components/imovel/ImoveisResultsSection.tsx
git commit -m "feat(redesign): fade-up ao entrar na viewport (Home + resultados de /imoveis)"
```

---

### Task 7.3: Hover de card (zoom 1.03 na foto)

**Files:**
- Modify: `src/components/imovel/ImovelCard.tsx`

**Interfaces:** nenhuma mudança de props.

- [ ] **Step 1: Zoom sutil na foto ao passar o mouse**

Isto é puramente CSS (sem necessidade de `motion` — hover não precisa de spring/JS, `transition` do Tailwind já resolve, e é consistente com "Native HTML over client state" do CLAUDE.md). Em `src/components/imovel/ImovelCard.tsx:32`, troque:
```tsx
<div className="relative aspect-[4/3] bg-bg-sunken">
  <ImovelPhoto src={coverImage} alt={title} sizes="..." />
```
por:
```tsx
<div className="relative aspect-[4/3] bg-bg-sunken overflow-hidden">
  <div className="transition-transform duration-300 ease-out group-hover:scale-[1.03] h-full">
    <ImovelPhoto src={coverImage} alt={title} sizes="..." />
  </div>
```
(feche a `</div>` extra correspondente logo antes do `<Badge ...>`.) O card raiz (`<Link>`, linha 28-30) já tem a classe `group`, então `group-hover:scale-[1.03]` funciona sem mudança adicional.

- [ ] **Step 2: Verificar**

`npm run build`. Passe o mouse sobre um card em `/imoveis` ou na Home: a foto cresce sutilmente (3%) dentro dos limites do card (sem vazar por cima do badge/preço, garantido pelo `overflow-hidden` no wrapper), com uma transição suave de 300ms.

- [ ] **Step 3: Commit**

```bash
git add src/components/imovel/ImovelCard.tsx
git commit -m "feat(redesign): zoom sutil na foto do card ao passar o mouse"
```

---

### Task 7.4: Transição de rota `/imoveis` → `/imovel/[slug]`

**Files:**
- Create: `src/app/(site)/imovel/[slug]/template.tsx`

**Interfaces:**
- Consumes: `motion`, `useReducedMotion` de `"motion/react"` (Task 1.4).
- Produces: nenhuma — é folha da árvore, só envolve `children`.

- [ ] **Step 1: Confirmar o mecanismo antes de implementar**

Este repositório está no Next.js 16, que teve mudanças estruturais em relação a versões anteriores (ver o aviso "This is NOT the Next.js you know" no fim do `CLAUDE.md`, e a própria migração `middleware.ts` → `proxy.ts` já documentada) — **não implemente de memória sem checar**. `template.tsx` é a convenção estável do App Router (diferente de `layout.tsx`, ele remonta a cada navegação para dentro do segmento) — é o mecanismo assumido pelo Step 2 abaixo. Antes de copiar o código do Step 2, confirme que essa convenção não mudou de nome/comportamento no Next 16: grep por `template.tsx` em `node_modules/next/dist/docs/` (a partir da raiz do repo) e invoque a skill `transitions-dev` para validar se o padrão recomendado hoje ainda é esse ou se mudou. Se algo estiver diferente do assumido, ajuste o código do Step 2 de acordo com o que a documentação atual mandar — não prossiga com o Step 2 tal como está escrito sem essa checagem.

- [ ] **Step 2: Criar `src/app/(site)/imovel/[slug]/template.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// template.tsx (diferente de layout.tsx) remonta a cada navegação para
// dentro deste segmento — dá o efeito de entrada na ficha do imóvel vindo
// da listagem, sem depender de nenhuma API experimental do Next 16. A
// página em si (page.tsx) continua Server Component; só este wrapper é
// client, e só existe para o segmento /imovel/[slug] — não afeta a
// navegação entre as outras páginas públicas.
export default function ImovelDetailTemplate({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Verificar**

`npm run build`. Navegue de `/imoveis` para a ficha de um imóvel e volte: a entrada na ficha deve ter um fade + leve subida rápidos (250ms), sem flash de conteúdo sem estilo, sem quebrar o back button do navegador. Com "reduzir movimento" ativado (DevTools → emulate `prefers-reduced-motion: reduce`), a navegação deve continuar instantânea, sem nenhuma transição.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(site)/imovel/[slug]/template.tsx"
git commit -m "feat(redesign): transição de entrada na ficha do imóvel (template.tsx)"
```

---

## Etapa 8 — Qualidade

### Task 8.1: Auditoria impeccable por página

**Files:** nenhum arquivo fixo — depende do que `/impeccable audit`/`polish` apontar.

- [ ] **Step 1: Respiro vertical entre seções (`--space-20`/`--space-24`)**

`docs/REDESIGN-BRIEF.md` §4 pede mais respiro vertical entre seções usando `--space-20`(80px)/`--space-24`(96px) — as Etapas 3-6 não bateram esse alvo em todo lugar (várias seções continuam com o `py-12`/`py-14` de antes do redesign, ex.: hero e seções de `/empresa`, wrappers de `/anuncie` e `/contato`). `--space-20`/`--space-24` correspondem exatamente às utilities Tailwind `py-20`/`py-24` (5rem/6rem = 80px/96px) — não é preciso um valor arbitrário novo. Faça uma varredura em `src/app/(site)/**/page.tsx` por `py-8`, `py-10`, `py-12`, `py-14`, `py-16` em elementos de seção de nível superior (não em cards/formulários internos, só no espaçamento vertical entre blocos da página) e suba para `py-20` (mobile) / `lg:py-24` (desktop) onde fizer sentido visualmente — julgue caso a caso com screenshot, não troque automaticamente todo `py-*` do arquivo.

- [ ] **Step 2: Rodar audit + polish em cada página pública**

Para cada uma das 6 páginas públicas (Home, `/imoveis`, `/imovel/[slug]` com um imóvel real, `/anuncie`, `/contato`, `/empresa`), rode `/impeccable audit` e depois `/impeccable polish`. Corrija qualquer item **crítico** de acessibilidade apontado (contraste abaixo de AA, alvo de toque < 44px, falta de `alt`, ordem de foco quebrada pelo drawer/lightbox novos). Itens de opinião de gosto sem justificativa técnica podem ficar como estão — este projeto já tem uma direção de design fechada em `docs/REDESIGN-BRIEF.md`, não é hora de reabri-la.

- [ ] **Step 3: Commit (um por página, ou agrupado se as correções forem pequenas)**

```bash
git commit -m "fix(redesign): correções de a11y/polish apontadas pelo impeccable audit (<página>)"
```

---

### Task 8.2: Grep de resíduos + build/lint final

**Files:** nenhum, a menos que o grep abaixo encontre algo.

- [ ] **Step 1: Confirmar que não sobrou nada do sistema antigo**

```bash
grep -rin "poppins" src/ || echo "OK: sem Poppins"
grep -rin "\binter\b" src/ --include="*.tsx" --include="*.ts" --include="*.css" || echo "OK: sem Inter isolado"
grep -rn "data-impeccable-variant" src/ || echo "OK: sem markup de variantes impeccable"
```
(o segundo grep usa `\b` pra não pegar falsos positivos de "Instrument" — revise manualmente qualquer ocorrência que aparecer, já que grep de palavra inteira em JSX/CSS pode ter exceções.)

- [ ] **Step 2: Build e lint finais**

```bash
npm run lint
npm run build
```
Ambos devem terminar sem erro.

- [ ] **Step 3: Commit (só se a Step 1 encontrou e corrigiu algo)**

```bash
git add -A
git commit -m "chore(redesign): remover resíduos do sistema visual antigo"
```

---

### Task 8.3: Screenshots "depois" para comparação

**Files:**
- Create: `docs/redesign/after/{home,imoveis,imovel-detalhe,anuncie,contato,empresa}-{1440,390}.png`

**Interfaces:** espelha exatamente os nomes de arquivo já usados em `docs/redesign/before/` (ver listagem da Fase 0) — mesma página, mesma largura, mesmo nome, só a pasta muda de `before` para `after`.

- [ ] **Step 1: Capturar as 12 imagens**

Use o mesmo método da Fase 0 (navegador da skill impeccable/live, ou Playwright se disponível — não instale nada novo só para isso). Para cada uma das 6 páginas, capture em 1440px e 390px, salvando em `docs/redesign/after/<pagina>-<largura>.png` com os mesmos nomes de `docs/redesign/before/`.

- [ ] **Step 2: Verificar**

`ls docs/redesign/after/` deve listar exatamente os mesmos 12 nomes de arquivo que `ls docs/redesign/before/`, só que com o visual novo.

- [ ] **Step 3: Commit**

```bash
git add docs/redesign/after/
git commit -m "docs(redesign): screenshots \"depois\" para comparação com o antes"
```

---

## Depois da Etapa 8

Não faz parte deste plano (ver `docs/REDESIGN-PLANO.md` §Fase 4 — Fechamento, prompt separado): atualizar `DESIGN.md` para descrever o sistema visual implementado, atualizar a seção "Current phase" do `CLAUDE.md`, e preparar o merge de `redesign/editorial` para `main` via a skill `finishing-a-development-branch`. Não fazer deploy — isso é manual, no Vercel, pelo usuário.
