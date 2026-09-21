# Matias Imóveis — Redesign visual: plano + prompts para Claude Code (Sonnet)

Documento para dirigir o redesign do site `matiasimoveis-site` no Claude Code, usando
superpowers + impeccable + frontend-design + os MCPs/skills disponíveis. Leia a seção 1
antes de abrir o Claude Code; as seções 3–6 são para copiar e colar.

---

## 0. O que já existe (o que descobri lendo o repo)

| Aspecto | Estado atual |
|---|---|
| Stack | Next.js 16 (App Router) + TS + Tailwind v4 + Supabase + lucide-react |
| Páginas | Home, `/imoveis`, `/imovel/[slug]`, `/anuncie`, `/contato`, `/empresa`, `/admin/*` |
| Design | Portado 1:1 de um handoff do Claude Design. Poppins + Inter, vermelho `#e6383d` + azul `#413e8c` (do logo), cinza frio, hero com gradiente azul |
| Responsivo | **Não** — desktop-only por decisão explícita (mobile era a "fase 4" do plano antigo) |
| Motion | Só transições de 150ms em hover; nenhuma animação de página/scroll |
| Docs | `PRODUCT.md` (excelente, manter), `DESIGN.md` (vai mudar), `CLAUDE.md` (30 KB, muito bom) |
| Impeccable | Já inicializado (`.impeccable/live/config.json`) |

**Três coisas que travam o redesign se não forem tratadas antes:**

1. `DESIGN.md` e `CLAUDE.md` dizem que os tokens do handoff são "fonte da verdade, não
   editar". Um Sonnet obediente vai **recusar** trocar fonte/cor. A fase 0 muda essa regra.
2. `src/app/(site)/page.tsx` está cheio de markup residual do modo `/impeccable live`
   (`data-impeccable-variants`, `data-impeccable-variant="original"`, comentários
   `impeccable-variants-start`). Isso precisa ser limpo primeiro (ficar só com a variante
   escolhida) — senão o redesign vai ser feito em cima de um DOM duplicado.
3. O mobile ainda não existe. **Não faz sentido redesenhar desktop e depois "adaptar"** —
   o redesign já nasce responsivo (70–80% do tráfego é celular, segundo o próprio CLAUDE.md).

**O que NÃO muda no redesign** (deixar explícito pro Claude Code):

- `/admin/*` inteiro (painel funciona, não é vitrine). Só herda tokens novos se for de graça.
- Supabase: schema, queries, RLS, `database.types.ts`, server actions.
- Roteamento, `searchParams` dos filtros, fluxo "tudo vira WhatsApp", `site.ts`.
- `PRODUCT.md` — os princípios (confiança > venda, um clique do WhatsApp, público mais
  velho, sem urgência/dark patterns, regional) continuam sendo a régua do design.

---

## 1. Direção de design (o "brief")

Objetivo em uma frase: **sair de "template imobiliário genérico com tokens bonitos" para
"imobiliária tradicional de cidade do interior que se apresenta com sofisticação editorial".**
Moderno na execução (tipografia, espaço, foto, motion), tradicional no tom (solidez,
seriedade, credencial CJ-40079 visível, nada de startup).

### 1.1 Tipografia — a mudança mais visível
Poppins + Inter são exatamente o par que denuncia "site gerado". Proposta:

- **Display/títulos/preço:** `Fraunces` (serifada variável com eixos ópticos — moderna e
  clássica ao mesmo tempo; funciona em 56px no hero e em 24px no preço do card).
- **Corpo/formulários/labels:** `Instrument Sans` (sans humanista, legível, não é Inter).
- Alternativa se Fraunces parecer "demais": `Newsreader` (display) + `Source Sans 3` (corpo).
- Carregar via `next/font/google` (já é o padrão do repo). Pesos extremos: 300/700+ nos
  títulos, não 400 vs 600. Público mais velho ⇒ corpo nunca abaixo de 16px, line-height 1.6.

### 1.2 Cor — manter a marca, mudar a temperatura
As duas cores do logo (vermelho `#e6383d`, azul `#413e8c`) **ficam** — são a identidade.
O que muda é o entorno:

- Fundo de página sai do cinza frio `#f7f7f9` e vai para um **off-white quente** (papel,
  ex.: `#faf7f2`). É isso que dá "tradição" sem mudar a marca.
- **Azul-marinho profundo** (`--blue-900 #161430` já existe) vira o tom "elegante" das
  seções escuras (footer, faixa de credenciais, fundo do hero sobre foto).
- Vermelho vira **acento cirúrgico**: CTA primário, preço, selo "Venda". Nunca em área
  grande. Hoje ele está espalhado demais.
- Adicionar um neutro quente (areia/bege: `#e9e2d6`) para bordas, divisores e fundos de
  card sutis. Manter `--whatsapp` exclusivo para ações de WhatsApp.
- Verificar WCAG AA em todo par texto/fundo — o público mais velho é motivo, não desculpa.

### 1.3 Layout & composição
- **Hero editorial sobre foto** (já existe `public/images/hero-house.webp`): foto
  full-bleed, overlay azul-marinho em gradiente, título serifado grande, eyebrow
  "Itaberaí e região · CJ-40079", barra de busca sobreposta (manter os `-72px` de overlap
  — funciona).
- **Faixa de confiança** logo abaixo do hero: CJ-40079, CRECI do corretor, anos de
  atuação, endereço — números em Fraunces, sem ícones-em-quadradinho.
- **Cards de imóvel**: foto com proporção 4:3 e zoom sutil no hover, selo Venda/Locação
  sólido sobre a foto (regra atual, manter), preço em serif, referência e bairro em
  caption. Grid responsivo: 1 / 2 / 3 colunas.
- **Ficha do imóvel**: galeria com foto grande + thumbnails (lightbox), barra lateral
  sticky com preço + botão WhatsApp no desktop; no mobile vira **barra inferior fixa**
  com preço + WhatsApp (já estava planejado no plano antigo).
- Container 1200px mantido. Mais respiro vertical entre seções (`--space-20`/`--space-24`).
- Navbar: continua não-fixa no desktop (decisão do repo), mas ganha versão mobile com
  drawer.

### 1.4 Motion — elegante, não chamativo
- Uma **revelação escalonada** no load da home (eyebrow → título → parágrafo → busca),
  200–300ms, ease-out. Esse é o "momento" do site; o resto é discreto.
- Cards e seções com fade-up ao entrar no viewport (`whileInView`, once).
- Transição de rota entre lista → ficha do imóvel (View Transitions / `transitions-dev`).
- Hover: zoom 1.03 na foto do card, elevação de sombra. Só.
- **Respeitar `prefers-reduced-motion` sempre.** Nada de parallax pesado, contadores,
  cursor customizado, partículas — contraria `PRODUCT.md`.
- Biblioteca: `motion` (Motion for React) — o MCP `motion` e a skill `motion` estão
  conectados pra consultar a API atual.

### 1.5 Anti-referências (copiar no prompt)
Poppins/Inter/Roboto; gradiente roxo/azul de SaaS; ícone dentro de quadradinho arredondado
acima de cada título; card dentro de card; texto cinza sobre fundo colorido; hero
centralizado com "3 features"; emojis; contadores animados; pop-up; urgência.

---

## 2. Mapa de ferramentas — quem faz o quê

| Ferramenta | Papel neste redesign | Quando |
|---|---|---|
| **superpowers** | O "gerente de projeto": brainstorming → plano em tarefas de 2–5 min → execução com subagentes + review em 2 estágios | Espinha dorsal de tudo |
| **impeccable** | O "diretor de arte": vocabulário de comandos (`typeset`, `colorize`, `layout`, `bolder`, `animate`, `adapt`, `critique`, `audit`, `polish`, `live`) + detectores de anti-padrão | Antes (shape/critique), durante (comandos pontuais), depois (audit/polish) |
| **frontend-design** (plugin) | Skill base de estética; ativa sozinha quando há UI | Passivo |
| **mobbin MCP** | Referências reais de padrões (busca de imóvel, ficha, galeria, filtros mobile) | Fase 1 (brainstorm) |
| **motion MCP + skill `motion`** | Docs atualizadas do Motion for React | Fase 3.6 (animação) |
| **motion-plus MCP** | Componentes premium do Motion (usar só se algo específico pedir — ex. ticker, cursor não) | Opcional |
| **skill `transitions-dev` / `transitions-polish`** | Transições de rota/página (você já usou 4× hoje — é a mesma coisa) | Fase 3.6 |
| **skill `shadcn`** | Só para primitivos que faltam: Drawer (menu mobile), Dialog (lightbox da galeria), Carousel (embla). Não substituir os `ui/` que já existem | Fase 3.3 e 3.5 |
| **remember** (plugin) | Persistir decisões entre sessões (par de fontes, paleta, o que não mexer) | Fim de cada fase |
| **supabase** (plugin) | Nenhum papel — o redesign não toca schema | — |
| **find-skills** | Se o Claude Code disser "não sei como fazer X" | Sob demanda |
| **higgsfield-websites / generate** | Opcional: gerar 1–2 imagens de atmosfera (fachada, rua de interior) pra Empresa/Anuncie. **Nunca** foto "de imóvel" fingindo ser listagem (regra do PRODUCT.md) | Opcional, fase 3.5 |
| **expo, higgsfield-*(outros), migrate-radix** | Irrelevantes aqui | — |

### 2.1 Como usar o superpowers do jeito certo
- **Não force skills manualmente.** Descreva o objetivo; a skill `brainstorming` ativa
  sozinha em pedidos de feature/redesign. Os comandos `/superpowers:brainstorm`,
  `/superpowers:write-plan`, `/superpowers:execute-plan` existem só como atalhos.
- **Brainstorm = ele te faz perguntas, uma de cada vez.** Responda curto. Ele termina
  propondo um design doc; você aprova antes de qualquer código.
- **Write-plan** gera `docs/plans/<nome>.md` com tarefas pequenas, caminhos exatos e passo
  de verificação. Leia o plano. Se uma tarefa for vaga ("melhorar o hero"), mande
  quebrar — Sonnet executa bem tarefas precisas e mal tarefas vagas.
- **Execute-plan** despacha um subagente por tarefa com review de spec + review de código.
  Deixe rodar; intervenha só nos checkpoints.
- Ele vai sugerir **git worktree**. Aceite — o redesign fica numa branch isolada
  (`redesign/editorial`) e `main` continua deployável.
- **Contexto:** faça `/clear` entre fases e recarregue com o plano (`@docs/plans/...`) +
  `@docs/REDESIGN-BRIEF.md`. Sonnet perde qualidade com contexto longo.
- `verification-before-completion` ativa sozinha: ele vai buildar/lintar antes de dizer
  "pronto". Confie, mas confira o screenshot.

### 2.2 Impeccable dentro do superpowers
Superpowers organiza *o processo*; impeccable organiza *o gosto*. Padrão por tarefa
visual:

```
implementar tarefa → screenshot → /impeccable critique <área> → corrigir → próxima
```

E no final de cada página: `/impeccable audit <página>` (a11y/perf/responsivo) e
`/impeccable polish <página>`.

---

## 3. Fases e prompts

Abra o Claude Code na raiz do repo, modelo Sonnet. Cada fase começa com `/clear`.

### Fase 0 — Preparação (1 sessão curta)

**Prompt 0.1 — destravar tokens e limpar resíduos**

```
Vamos iniciar um redesign visual completo do site público deste repositório. Antes de
qualquer coisa, preciso de três ajustes de base. NÃO comece o redesign ainda.

1. Crie a branch de trabalho `redesign/editorial` a partir de `main` (pode usar git
   worktree se preferir, conforme a skill using-git-worktrees).

2. Em `src/app/(site)/page.tsx` existe markup residual do modo `/impeccable live`
   (`data-impeccable-variants`, `data-impeccable-variant`, comentários
   `impeccable-variants-start/end`). Remova toda a estrutura de variantes e mantenha
   apenas o conteúdo da variante "original", sem alterar o visual. Faça o mesmo em
   qualquer outro arquivo que tenha esse markup (grep por `impeccable-variant`).
   Verifique com `npm run build` e `npm run lint`.

3. Atualize `CLAUDE.md` e `DESIGN.md` para registrar a nova decisão:
   - Os tokens do handoff (`src/styles/tokens/*.css`) DEIXAM de ser fonte da verdade
     congelada. A partir de agora eles são editáveis e a nova fonte da verdade será
     `docs/REDESIGN-BRIEF.md` (a ser criado na próxima sessão) + o próprio código.
   - A decisão "Poppins + Inter" é revogada — fontes serão redefinidas no redesign.
   - A decisão "desktop-only, mobile depois" é revogada — o redesign nasce responsivo.
   - Tudo o mais em "Decisions already made" continua valendo (endereço, telefone,
     forms → WhatsApp, admin, Supabase, vocabulário em português etc.).
   Mantenha o resto dos dois arquivos intacto; só edite as seções afetadas.

4. Tire screenshots "antes" de cada página pública em 1440px e 390px de largura e salve
   em `docs/redesign/before/`. Use o navegador que a skill impeccable/live usa, ou
   Playwright se já estiver disponível — não instale nada pesado só pra isso.

Commit ao final: "chore: preparar base para redesign (branch, limpar variantes
impeccable, destravar tokens)".
```

**Prompt 0.2 — persistir contexto**

```
Use o plugin remember para guardar: (a) estamos na branch redesign/editorial fazendo um
redesign visual; (b) tokens do handoff não são mais congelados; (c) admin, Supabase e
fluxo WhatsApp não mudam; (d) PRODUCT.md continua sendo a régua de produto.
```

### Fase 1 — Brainstorm + brief (1 sessão)

**Prompt 1.1 — o pedido principal (cole inteiro; ele dispara a skill brainstorming)**

```
Quero redesenhar visualmente o site público da Matias Imóveis (tudo em `src/app/(site)`,
`src/components/{layout,imovel,forms,ui}`, `src/styles`, `globals.css`). Leia primeiro
PRODUCT.md, DESIGN.md, CLAUDE.md e docs/PLANO-IMPLEMENTACAO.md. O admin, o Supabase, as
queries, os filtros por searchParams e o fluxo "tudo abre o WhatsApp" NÃO mudam.

OBJETIVO
Sair do visual atual (portado de um handoff, com cara de template imobiliário genérico:
Poppins + Inter, cinza frio, hero com gradiente azul, sem motion, desktop-only) para um
site que pareça uma imobiliária tradicional de cidade do interior se apresentando com
sofisticação editorial. Moderno na execução, tradicional no tom. Chamativo pelo uso de
tipografia, foto e espaço — não por efeitos. Elegante = contido.

RESTRIÇÕES DE MARCA
- Vermelho #e6383d e azul #413e8c vêm do logo e permanecem. O vermelho vira acento
  cirúrgico (CTA primário, preço, selo Venda); o azul-marinho profundo (#161430) vira o
  tom elegante das áreas escuras. O fundo da página sai do cinza frio e vai para um
  off-white quente (papel).
- Verde do WhatsApp continua exclusivo de ações de WhatsApp.
- WCAG AA como piso; público inclui muita gente mais velha: corpo ≥16px, alvos ≥44px,
  hierarquia óbvia. Nada que exija familiaridade com apps.

TIPOGRAFIA (proposta inicial, discuta comigo)
- Display/títulos/preço: Fraunces (variável). Corpo: Instrument Sans.
- Alternativa: Newsreader + Source Sans 3.
- Proibido: Inter, Poppins, Roboto, Open Sans, Lato, Space Grotesk, system-ui como
  escolha principal.

MOTION
- Uma revelação escalonada no load da home; fade-up de cards/seções ao entrar na
  viewport; transição de rota lista → ficha; zoom sutil na foto do card no hover.
- Biblioteca `motion` (use o MCP motion para a API atual). prefers-reduced-motion
  respeitado em tudo. Nada de parallax pesado, contadores, cursor customizado,
  partículas, pop-ups, urgência.

RESPONSIVO
- O redesign nasce responsivo (mobile-first no CSS, breakpoints 640/1024). Ficha do
  imóvel no mobile ganha barra inferior fixa com preço + WhatsApp. Navbar mobile com
  drawer.

ANTI-REFERÊNCIAS
O site antigo (matiasimoveisgo.com.br); qualquer landing de SaaS; gradiente roxo/azul;
ícone em quadradinho arredondado acima de cada título; card dentro de card; texto cinza
sobre fundo colorido; hero centralizado com 3 features; emoji.

PESQUISA
Antes de propor, use o MCP do Mobbin para levantar 3–5 referências reais de: hero de
busca imobiliária, card de imóvel, ficha de imóvel com galeria, filtros de busca em
mobile. Resuma o que cada uma faz bem e o que não serve para o nosso contexto (negócio
local, público mais velho). Não copie nada; use como vocabulário.

PROCESSO
Siga a skill brainstorming: me faça perguntas uma de cada vez até fechar a direção.
Termine escrevendo `docs/REDESIGN-BRIEF.md` com: direção visual, tokens novos (fontes,
paleta com hex, escala tipográfica, raios/sombras que mudam), comportamento de cada
página em desktop e mobile, catálogo de motion, o que fica intacto, e as
anti-referências. Esse arquivo será a nova fonte da verdade de design. Não escreva
código nesta sessão.
```

Durante o brainstorm ele vai perguntar coisas como "hero sobre foto ou sobre cor?",
"quão serifada a marca aguenta?", "Fraunces ou Newsreader?". Respostas curtas. Quando
ele propuser o brief, leia com calma — é o único ponto em que gosto pessoal entra.

**Prompt 1.2 — validar o brief com o impeccable antes de codar**

```
Com base em docs/REDESIGN-BRIEF.md, rode /impeccable shape para a Home e para a ficha do
imóvel (`/imovel/[slug]`), em desktop e mobile. Quero o planejamento de UX/UI (hierarquia,
zonas, o que o usuário vê primeiro) antes de qualquer código. Se o shape contradizer o
brief, me mostre o conflito em vez de resolver sozinho.
```

### Fase 2 — Plano de execução (1 sessão)

```
/superpowers:write-plan

Escreva o plano de implementação do redesign descrito em @docs/REDESIGN-BRIEF.md.
Ordem obrigatória das etapas (cada uma deve deixar o site buildando e visualmente
coerente, para que eu possa parar em qualquer ponto):

1. Fundação: novas fontes via next/font, novos tokens em src/styles/tokens (cores,
   tipografia, espaçamento/raio/sombra), @theme inline em globals.css, e componentes
   base em src/components/ui adaptados. Sem mudar layout de páginas ainda.
2. Layout global: Navbar (desktop + drawer mobile via shadcn Drawer), Footer, Container,
   WhatsAppFab.
3. Home: hero editorial sobre foto, barra de busca sobreposta, faixa de confiança,
   imóveis em destaque, serviços, CTA anuncie.
4. ImovelCard + /imoveis (grid responsivo, SearchFilterBar responsiva, estados vazio e
   skeleton).
5. Ficha do imóvel: galeria com lightbox (shadcn Dialog + Carousel), specs, sidebar
   sticky no desktop, barra inferior fixa no mobile.
6. Páginas secundárias: /anuncie, /contato, /empresa (formulários reestilizados,
   mantendo o envio para WhatsApp).
7. Motion: reveal escalonado da home, whileInView de cards, transição de rota (skill
   transitions-dev), hover de card; prefers-reduced-motion.
8. Qualidade: /impeccable audit e polish por página, lint, build, screenshots "depois"
   em docs/redesign/after/.

Cada tarefa deve ter: arquivos exatos, o que muda, como verificar (comando ou
screenshot em 1440 e 390px). Tarefas de no máximo ~5 minutos. Nada de tocar em
src/app/admin, src/lib/supabase, src/lib/queries.ts, src/lib/admin. Salve em
docs/plans/redesign-editorial.md.
```

Leia o plano. Peça pra quebrar qualquer tarefa que diga "melhorar", "refinar" ou
"ajustar" sem dizer o quê.

### Fase 3 — Execução (várias sessões; uma etapa do plano por sessão)

**Prompt padrão por sessão**

```
/clear
```
```
/superpowers:execute-plan @docs/plans/redesign-editorial.md

Execute apenas a etapa N ("<nome da etapa>"). Contexto de design em
@docs/REDESIGN-BRIEF.md. Ao terminar cada tarefa visual, tire screenshot em 1440px e
390px e rode `/impeccable critique <área>`; corrija o que for apontado antes de seguir.
No fim da etapa: npm run lint && npm run build, commit, e resumo do que mudou.
```

**Comandos do impeccable que fazem sentido em cada etapa**

| Etapa | Comando(s) |
|---|---|
| 1 Fundação | `/impeccable typeset` (escala e pareamento), `/impeccable colorize` (paleta quente + acento) |
| 2 Layout | `/impeccable layout navbar e footer` |
| 3 Home | `/impeccable bolder o hero` se ficar tímido; `/impeccable quieter` se passar do ponto |
| 4 Cards/lista | `/impeccable layout a listagem`, `/impeccable onboard` para estado vazio da busca |
| 5 Ficha | `/impeccable critique a ficha do imóvel em mobile` |
| 6 Forms | `/impeccable clarify` (copy dos formulários), `/impeccable harden` (erros, overflow) |
| 7 Motion | `/impeccable animate` + skill `transitions-polish` |
| 8 Qualidade | `/impeccable audit`, `/impeccable polish`, `/impeccable adapt` se algo quebrou no mobile |

Se quiser experimentar variações visuais de um trecho sem gastar sessão: `/impeccable live`
no hero ou no card — depois **limpe o markup de variantes** (mesmo problema da fase 0).

**Prompt específico da etapa 7 (motion), porque é onde Sonnet exagera**

```
Etapa 7 do plano. Consulte o MCP motion para a API atual de `motion/react` antes de
escrever (não confie na memória: verifique `motion`, `useReducedMotion`, `whileInView`,
`stagger`). Catálogo permitido está em REDESIGN-BRIEF.md seção Motion — nada além
disso. Cada animação deve ter versão sem movimento via useReducedMotion. Transição de
rota /imoveis → /imovel/[slug] com a skill transitions-dev, e depois passe a skill
transitions-polish. Componentes animados devem ser client components pequenos
(`"use client"`) envolvendo os server components existentes — não converta páginas
inteiras em client.
```

### Fase 4 — Fechamento

```
Etapa 8 concluída. Agora siga a skill finishing-a-development-branch: revise o diff
completo de redesign/editorial contra main, atualize DESIGN.md para refletir o sistema
visual real implementado (substituindo o conteúdo antigo do handoff), atualize a seção
"Current phase" do CLAUDE.md, gere screenshots "depois" lado a lado com os "antes" em
docs/redesign/, e prepare o merge. Não faça deploy — eu faço o deploy no Vercel
manualmente.
```

Depois: `remember` com a decisão final de fontes/paleta e o fato de o redesign ter sido
mergeado.

---

## 4. Bloco de estética para o CLAUDE.md (opcional, mas recomendado)

Cole no final do `CLAUDE.md` depois da fase 1, adaptando com os hex/fontes que o brief
fechou. Assim toda sessão futura (inclusive fora do superpowers) herda a direção.

```markdown
## Direção estética (redesign editorial — ver docs/REDESIGN-BRIEF.md)

Registro: brand (site institucional local), não product. Moderno na execução,
tradicional no tom. Contido > chamativo.

Tipografia: display Fraunces (títulos, preço, números de credencial), corpo Instrument
Sans. Pesos extremos, saltos de tamanho grandes. Corpo nunca < 16px. Proibido Inter,
Poppins, Roboto, system-ui como principal.

Cor: fundo off-white quente; azul-marinho #161430 para superfícies escuras; vermelho
#e6383d só como acento (CTA primário, preço, selo Venda); azul #413e8c em links, selo
Locação e detalhes. Verde #25d366 exclusivo de WhatsApp. WCAG AA obrigatório.

Layout: container 1200px, mobile-first, respiro vertical generoso, foto como
protagonista do hero e dos cards. Sem card dentro de card, sem ícone-em-quadradinho
acima de títulos, sem grid de "3 features" genérico.

Motion: reveal escalonado no load da home, fade-up whileInView, transição de rota
lista→ficha, zoom sutil no hover. Sempre com useReducedMotion. Nada de parallax
pesado, contadores, cursor custom, partículas, pop-ups, urgência.

Antes de mexer em UI: ler docs/REDESIGN-BRIEF.md. Depois de mexer: screenshot 1440 e
390px + /impeccable critique.
```

---

## 5. Checklist de aceite (para você julgar o resultado)

- [ ] Em 3 segundos na home, dá pra ver: que cidade, o que a empresa faz, e onde buscar.
- [ ] Nenhuma fonte Inter/Poppins sobrou (`grep -ri "inter\|poppins" src/`).
- [ ] O vermelho aparece só em CTA/preço/selo — não em fundos grandes.
- [ ] A 390px: navbar vira drawer, cards em 1 coluna, busca empilhada, ficha tem barra
      inferior fixa com preço + WhatsApp.
- [ ] Com "reduzir movimento" ativado no sistema, nada se move e tudo é visível.
- [ ] `/impeccable audit` sem itens críticos de a11y; Lighthouse mobile ≥ 90 em a11y.
- [ ] `/admin` funciona exatamente como antes (login, criar imóvel, fotos, publicar).
- [ ] Todos os botões de WhatsApp ainda abrem com a mensagem certa (imóvel/intenção).
- [ ] `npm run build` limpo; nenhum `data-impeccable-*` no código.

---

## 6. Armadilhas conhecidas com Sonnet neste repo

- **Ele vai tentar "respeitar" o DESIGN.md antigo.** Por isso a fase 0 existe. Se mesmo
  assim ele hesitar, aponte: "a decisão de tokens congelados foi revogada no commit X".
- **Tailwind v4 e CSS sem `@layer`**: regra já documentada no CLAUDE.md — CSS sem layer
  vence toda utility. Se uma cor "não pegar", é isso.
- **Fontes por `style={{ font: "var(--text-...)" }}`**: o repo usa shorthand de token
  inline em vez de utilities. Decida no brief se mantém (rastreável) ou migra para
  utilities `@theme` (mais Tailwind). Não misture os dois.
- **Server vs client components**: motion precisa de client; páginas são server. A
  regra é wrapper pequeno, nunca converter a página.
- **Ele adora adicionar dependências.** Permitidas: `motion`, os primitivos shadcn
  necessários (drawer, dialog, carousel). Qualquer outra, perguntar.
- **Contexto longo degrada.** Uma etapa por sessão, `/clear` sempre, brief e plano via `@`.