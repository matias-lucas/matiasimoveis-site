/**
 * Local central dos dados de identidade/contato usados em todo o site.
 * Altere os valores aqui, não nos componentes — ver CLAUDE.md.
 */

export const SITE = {
  name: "Matias Imóveis",
  url: "https://matiasimoveisgo.com.br",
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

  email: "contato@matiasimoveisgo.com.br",

  // Corretor padrão usado nas fichas de imóvel do mock, até o painel
  // admin permitir atribuir um corretor por imóvel.
  defaultCorretor: {
    name: "Divino Matias",
    creci: "CRECI-GO 9155",
  },
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/imoveis", label: "Buscar imóveis" },
  { href: "/anuncie", label: "Anuncie seu imóvel" },
  { href: "/contato", label: "Contato" },
  { href: "/empresa", label: "Empresa" },
] as const;

export const FOOTER_LINKS = [
  {
    heading: "Empresa",
    links: [
      { href: "/empresa", label: "Quem somos" },
      { href: "/contato", label: "Contato" },
    ],
  },
  {
    heading: "Serviços",
    links: [
      { href: "/imoveis?finalidade=venda", label: "Comprar imóvel" },
      { href: "/imoveis?finalidade=locacao", label: "Alugar imóvel" },
    ],
  },
  {
    heading: "Seu imóvel",
    links: [{ href: "/anuncie", label: "Anuncie seu imóvel" }],
  },
] as const;
