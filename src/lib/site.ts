/**
 * Local central dos dados de identidade/contato usados em todo o site.
 * Altere os valores aqui, não nos componentes — ver CLAUDE.md.
 */

export const SITE = {
  name: "Matias Imóveis",
  // Domínio da Vercel por enquanto (decisão do dono em 28/09). O domínio
  // próprio não está ligado a este projeto na Vercel: com ele aqui, os links
  // dos anúncios nas mensagens de WhatsApp, o sitemap e o Open Graph levavam
  // para fora deste site. Quando o domínio for configurado, troque só esta linha.
  url: "https://site-matiasimoveis.vercel.app",
  description:
    "Venda e locação de casas, apartamentos, lotes e imóveis comerciais em Itaberaí/GO.",
  cj: "CJ-40079",

  // TODO(cliente): confirmar endereço exato — divergência entre as fontes
  // do handoff ("Alfredo Nasser" vs "Alfredo Nascer"). Mantido como no
  // arquivo de design primário até a Matias confirmar.
  address: {
    street: "Rua Alfredo Nasser, nº 20-B",
    district: "Centro",
    city: "Itaberaí",
    state: "GO",
  },

  // Telefone/WhatsApp da imobiliária (confirmado pelo cliente).
  phone: "(62) 3375-3330",
  phoneHref: "tel:+556233753330",
  whatsappNumber: "556233753330",
  whatsappDefaultMessage: "Olá! Preciso de uma informação.",

  // Sem e-mail público por enquanto: o contato@ do domínio próprio não
  // recebe mensagens (dono, 28/09). Volta quando o domínio for configurado.

  // Corretor padrão: Home, rodapé e anúncios sem corretor próprio. CRECI no
  // mesmo formato do cadastro em Admin → Corretores (dono, 28/09).
  defaultCorretor: {
    name: "Divino Matias",
    creci: "CRECI PF - 9155",
  },
} as const;

/** Menu principal: as duas intenções que trazem gente ao site (alugar,
 * comprar) vêm primeiro e levam direto à busca filtrada. */
export const NAV_LINKS = [
  { href: "/imoveis?finalidade=locacao", label: "Alugar", purpose: "locacao" },
  { href: "/imoveis?finalidade=venda", label: "Comprar", purpose: "venda" },
  { href: "/anuncie", label: "Anunciar" },
  { href: "/empresa", label: "Empresa" },
  { href: "/contato", label: "Contato" },
] as const;

export const FOOTER_LINKS = [
  {
    heading: "Imóveis",
    links: [
      { href: "/imoveis?finalidade=locacao", label: "Alugar" },
      { href: "/imoveis?finalidade=venda", label: "Comprar" },
      { href: "/imoveis", label: "Todos os imóveis" },
      { href: "/anuncie", label: "Anunciar meu imóvel" },
    ],
  },
  {
    heading: "Empresa",
    links: [
      { href: "/empresa", label: "Quem somos" },
      { href: "/contato", label: "Contato" },
      { href: "/privacidade", label: "Política de privacidade" },
    ],
  },
] as const;
