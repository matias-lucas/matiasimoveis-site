# Product

## Register

brand

## Users

Compradores, locatários e vendedores de imóveis em Itaberaí/GO e região —
público local, faixa etária ampla (inclui muitos usuários mais velhos ou
menos familiarizados com tecnologia), acostumado a resolver tudo pelo
WhatsApp. Chegam ao site buscando um imóvel específico (casa, apartamento,
lote, galpão) ou querendo anunciar o próprio imóvel para venda/locação.
O corretor/atendente do outro lado é quem recebe e responde os contatos.

## Product Purpose

Vitrine digital da Matias Imóveis (corretora regulamentada, CJ-40079,
Itaberaí/GO), substituindo um site antigo de template genérico. O site
mostra os imóveis disponíveis com filtros de busca, e converte cada
interesse (buscar, ver detalhe de um imóvel, anunciar o próprio imóvel,
contato geral) em uma conversa de WhatsApp já com contexto — sem
formulário que "desaparece" num banco de dados. Sucesso = visitante chega
no WhatsApp certo, falando do imóvel certo, sem fricção.

## Brand Personality

Confiável, direta, acolhedora. Voz em primeira pessoa do plural ("nós
encontraremos", "atendemos"), tratamento informal ("você"), tom de quem
ajuda — não de quem vende com urgência ou desconto. Nada de emoji. Números
importam e aparecem sem rodeio: preço, referência do imóvel, CJ-40079,
CRECI do corretor — são sinais de confiança numa profissão regulamentada.

## Anti-references

O site atual (matiasimoveisgo.com.br) é a referência negativa explícita:
visual de gerador de template imobiliário genérico, datado. Evitar também:
tom corporativo/frio, urgência de vendas agressiva ("últimas unidades!",
contadores, pop-ups), e qualquer coisa que pareça um SaaS genérico — este
é um negócio local, físico, de uma cidade específica.

## Design Principles

- **Confiança antes de venda** — preço, CJ-40079, CRECI e referência do
  imóvel sempre visíveis e sem esconder nada; nenhum dark pattern de
  urgência.
- **Um clique do WhatsApp** — toda superfície relevante (card de imóvel,
  ficha, "anuncie", "contato") leva a uma conversa de WhatsApp já com o
  contexto (qual imóvel, qual intenção) preenchido.
- **O design system herdado é a fonte da verdade** — tokens e componentes
  vindos do handoff (`handoff/project/ds/`) não são reinventados; qualquer
  divergência resolvida a favor do arquivo `.dc.html` (ver
  `docs/PLANO-IMPLEMENTACAO.md` seção 2).
  Ver DESIGN.md para o mapeamento project → uso no repositório.
- **Regional e pessoal** — Itaberaí/GO nomeado explicitamente, voz de
  equipe local, nunca "corporate voice" genérica.
- **Simples para qualquer idade** — hierarquia clara, alvos de toque
  generosos, sem exigir familiaridade prévia com sites/apps.

## Accessibility & Inclusion

WCAG AA como piso: contraste de texto ≥4.5:1 (≥3:1 para texto grande),
estados de foco sempre visíveis (halo do token `--shadow-focus`), alvos de
toque/clique de pelo menos 44px (já é o padrão dos componentes do design
system), sem depender de cor isoladamente para transmitir informação
(badges de Venda/Locação usam cor + texto). Sem requisito formal adicional
além disso, mas o público-alvo mais velho pesa a favor de manter tipografia
generosa e nunca comprimir a hierarquia só por estética.
