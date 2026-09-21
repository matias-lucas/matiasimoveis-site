# Matias Imóveis — Redesign editorial: brief de design

Fonte da verdade do sistema visual a partir daqui, substituindo `DESIGN.md`
enquanto o redesign estiver em andamento (ver `CLAUDE.md`). Fechado ao final
da Fase 1 (`docs/REDESIGN-PLANO.md` §Fase 1), a partir do brainstorm
interativo desta branch. Reconstruído nesta sessão a partir do resumo
persistido em memória — ver nota de proveniência no final do arquivo.

**Registro:** site institucional local (brand), não produto SaaS. Moderno na
execução, tradicional no tom. Contido é elegante.

---

## 1. Direção

Sair de "template imobiliário genérico" (Poppins + Inter, cinza frio, hero
com gradiente azul, sem motion, desktop-only) para "imobiliária tradicional
de cidade do interior que se apresenta com sofisticação editorial".
Chamativo pelo uso de tipografia, foto e espaço — nunca por efeito.

## 2. Tipografia — decisão final: Fraunces + Instrument Sans

Testado via companion de pares de fontes (Google Fonts); esta foi a opção A,
confirmada pelo usuário.

- **Display / títulos / preço / números de credencial:** `Fraunces`
  (serifada variável, eixos ópticos). Pesos extremos — 300 para itálico de
  apoio, 600–700 para títulos — não 400 vs 600.
- **Corpo / formulários / labels / nav:** `Instrument Sans`.
- Carregar via `next/font/google` em `src/app/layout.tsx`, substituindo os
  imports atuais de `Poppins`/`Inter` (mesmo padrão: `variable` + `display:
  "swap"`).
- Proibido: Inter, Poppins, Roboto, Open Sans, Lato, Space Grotesk,
  system-ui como fonte principal.
- Público inclui muita gente mais velha: corpo nunca < 16px, line-height
  ≥ 1.6, alvos de toque ≥ 44px.

## 3. Cor

As duas cores de marca (vindas do logo) **ficam** — não são negociáveis:
`--red-500 #e6383d` e `--blue-500 #413e8c`. O que muda é o entorno e o peso
com que cada uma aparece.

| Papel | Antes | Depois |
|---|---|---|
| Fundo de página | `--gray-50 #f7f7f9` (cinza frio) | **`#faf7f2`** (off-white quente, "papel") |
| Superfície escura (footer, faixa credencial, overlay do hero) | `--blue-900 #161430` já existe, pouco usado | Vira o tom "elegante" principal das áreas escuras |
| Vermelho `#e6383d` | Espalhado (botões, links, destaques) | **Acento cirúrgico**: CTA primário, preço, selo "Venda". Nunca em área grande |
| Azul `#413e8c` | Secundário | Links, selo "Locação", detalhes |
| Neutro quente novo | — | Areia/bege `#e9e2d6` para bordas, divisores, fundo de card sutil |
| WhatsApp `#25d366` | Exclusivo de ações de WhatsApp | Mantém — nunca reaproveitado para outra coisa |

Os hex de `--red-*`/`--blue-*`/`--whatsapp*` em `src/styles/tokens/colors.css`
não mudam de valor — o que muda é `--bg-page` (de `--gray-50` para o novo
off-white) e a introdução de um novo neutro quente + o uso mais deliberado
de `--blue-900` como superfície, não só como valor isolado.

Verificar WCAG AA em todo par texto/fundo depois da troca — público mais
velho é motivo, não desculpa.

## 4. Layout & composição

Escopo do brainstorm: **Home, ImovelCard (grid/listagem) e Ficha do imóvel**
foram as três áreas discutidas em detalhe (demais páginas secundárias —
`/anuncie`, `/contato`, `/empresa` — seguem os mesmos tokens/componentes na
Fase 3, sem uma sessão de brainstorm dedicada).

- **Hero editorial sobre foto** (`public/images/hero-house.webp`): full-bleed,
  overlay em gradiente `--blue-900`, título serifado grande, eyebrow
  "Itaberaí e região · CJ-40079", barra de busca sobreposta (manter overlap
  de `-72px`, já funciona).
- **Faixa de confiança** abaixo do hero: CJ-40079, CRECI do corretor, anos
  de atuação, endereço — números em Fraunces, sem ícone-em-quadradinho.
- **ImovelCard**: foto 4:3 com zoom sutil no hover, selo Venda/Locação
  sólido sobre a foto (mantém), preço em serif (Fraunces), referência/bairro
  em caption (Instrument Sans). Grid responsivo 1 / 2 / 3 colunas.
- **Ficha do imóvel**: galeria com foto grande + thumbnails (lightbox),
  sidebar sticky com preço + WhatsApp no desktop; no **mobile vira barra
  inferior fixa** com preço + WhatsApp.
- Container 1200px mantido. Mais respiro vertical entre seções
  (`--space-20`/`--space-24`).
- Navbar: continua não-fixa no desktop; ganha **drawer no mobile**.

## 5. Motion

Biblioteca: `motion` (Motion for React) — ainda não está no `package.json`,
entra na Fase 3 etapa 1 (fundação) ou etapa 7 (motion), conforme o plano de
execução decidir.

- Revelação escalonada no load da home (eyebrow → título → parágrafo →
  busca), 200–300ms, ease-out. É o único "momento" do site.
- Fade-up em cards/seções ao entrar no viewport (`whileInView`, once).
- Transição de rota lista → ficha do imóvel (skill `transitions-dev`).
- Hover de card: zoom 1.03 na foto + elevação de sombra. Só isso.
- `prefers-reduced-motion` respeitado em tudo, sempre — sem exceção.
- Proibido: parallax pesado, contadores animados, cursor customizado,
  partículas, pop-up, urgência (contraria `PRODUCT.md`).

## 6. Responsivo

O redesign nasce responsivo (mobile-first no CSS), breakpoints 640/1024,
seguindo o mapeamento já usado no restante do Next/Tailwind do repo:

- Navbar → drawer abaixo de 1024px.
- Grid de cards → 1 coluna abaixo de 640px, 2 entre 640–1024px, 3 acima.
- Busca (SearchFilterBar) → campos empilhados no mobile.
- Ficha do imóvel → sidebar sticky vira barra inferior fixa (preço +
  WhatsApp) abaixo de 1024px.

## 7. O que fica intacto (não mexer)

- `/admin/*` inteiro — só herda tokens novos se for "de graça" (ex.:
  cor/fonte propagada via `@theme`), sem trabalho dedicado de redesign lá.
- Supabase: schema, RLS, queries, `database.types.ts`, server actions.
- Roteamento, `searchParams` dos filtros, fluxo "tudo vira WhatsApp",
  `src/lib/site.ts`.
- `PRODUCT.md` — confiança > venda, um clique do WhatsApp, público mais
  velho, sem urgência/dark patterns, regional.
- Branch `reimaginacao-home` — variante antiga, não será mesclada nem usada
  como referência; decisão explícita do usuário.

## 8. Anti-referências

Poppins/Inter/Roboto/Open Sans/Lato/Space Grotesk/system-ui como fonte
principal; gradiente roxo/azul de SaaS; ícone dentro de quadradinho
arredondado acima de cada título; card dentro de card; texto cinza sobre
fundo colorido; hero centralizado com "3 features"; emoji; contadores
animados; pop-up; urgência; o site antigo (matiasimoveisgo.com.br).

---

## Proveniência / nota para revisão

Este arquivo foi escrito nesta sessão reconstruindo o brief a partir do
resumo comprimido em `.remember/today-2026-09-15.md` (o brainstorm rodou em
sessões anteriores hoje, mas o arquivo nunca chegou a ser salvo em disco
antes do `/clear`). As decisões de tipografia (Fraunces + Instrument Sans,
opção A do companion) e paleta (`#faf7f2`, navio `--blue-900`, vermelho
`#e6383d` como acento) batem exatamente com a proposta original de
`docs/REDESIGN-PLANO.md` §1 — não houve desvio registrado na memória. As
seções de layout/motion/responsivo acima também seguem esse documento
1:1, já que a memória confirma o escopo (Home/cards/ficha) sem indicar
mudanças.

**Pontos que valem uma checada rápida do usuário antes de seguir para a
Fase 2** (nada aqui foi contestado na memória, mas também não foi
re-verificado nesta sessão):
- Fraunces + Instrument Sans como decisão final (vs. a alternativa
  Newsreader + Source Sans 3 cotada no plano original).
- O neutro quente `#e9e2d6` (bege/areia) — citado no plano, não confirmado
  explicitamente na memória do brainstorm.
- Se alguma página secundária (`/anuncie`, `/contato`, `/empresa`) recebeu
  tratamento específico no brainstorm além de "herda os tokens".
