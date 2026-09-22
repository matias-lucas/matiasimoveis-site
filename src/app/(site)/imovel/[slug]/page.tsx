import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, BedDouble, Bath, Car, Ruler, Phone } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { ImovelGallery } from "@/components/imovel/ImovelGallery";
import { ImovelMobilePriceBar } from "@/components/imovel/ImovelMobilePriceBar";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { Button } from "@/components/ui/Button";
import { getAllPublishedSlugs, getImovelBySlug } from "@/lib/queries";
import { KIND_LABELS } from "@/lib/imovel-kind-categories";
import { formatArea, formatPrice, pluralize } from "@/lib/format";
import { imovelInquiryMessage, toWhatsAppNumber } from "@/lib/whatsapp";
import { SITE } from "@/lib/site";
import type { Imovel } from "@/lib/types";

// Título e descrição usados tanto nos metadados (generateMetadata) quanto no
// JSON-LD renderizado no corpo da página — extraídos aqui para não duplicar a lógica.
function buildSeoTitle(imovel: Imovel): string {
  const kindLabel =
    imovel.kind === "outros" && imovel.kindOther ? imovel.kindOther : KIND_LABELS[imovel.kind];
  const bedroomsFragment = imovel.bedrooms != null ? ` ${imovel.bedrooms} quartos` : "";
  const price = formatPrice(imovel.price, imovel.purpose);
  return `${kindLabel}${bedroomsFragment} no ${imovel.neighborhood}, ${imovel.city}/${imovel.state} — ${price} | ${SITE.name}`;
}

function buildSeoDescription(description: string): string {
  return description.length > 160 ? `${description.slice(0, 157)}...` : description;
}

// disponivel/em_negociacao ainda podem ser reservados; vendido/alugado já saíram
// do mercado — status ausente (imóveis antigos) é tratado como disponível.
function resolveAvailability(status: Imovel["status"]): string {
  return status === "vendido" || status === "alugado"
    ? "https://schema.org/SoldOut"
    : "https://schema.org/InStock";
}

interface ImovelDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ImovelDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const imovel = await getImovelBySlug(slug);
  if (!imovel) return {};

  const title = buildSeoTitle(imovel);
  const description = buildSeoDescription(imovel.description);
  const url = `${SITE.url}/imovel/${imovel.slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: SITE.name,
    },
  };
}

export default async function ImovelDetailPage({ params }: ImovelDetailPageProps) {
  const { slug } = await params;
  const imovel = await getImovelBySlug(slug);
  if (!imovel) notFound();

  const {
    purpose,
    title,
    neighborhood,
    city,
    state,
    ref,
    bedrooms,
    bathrooms,
    parking,
    areaM2,
    description,
    price,
    corretor,
  } = imovel;

  // Nomeados seoTitle/seoDescription (não title/description) porque a
  // desestruturação acima já usa esses nomes para o título e a descrição
  // brutos do imóvel, exibidos no <h1>/<p> da página — são conceitos
  // diferentes do título/descrição otimizados para SEO usados no JSON-LD.
  const seoTitle = buildSeoTitle(imovel);
  const seoDescription = buildSeoDescription(imovel.description);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateListing",
        name: seoTitle,
        description: seoDescription,
        url: `${SITE.url}/imovel/${imovel.slug}`,
        image: imovel.coverImage ? [imovel.coverImage] : undefined,
        // Dados de acomodação (endereço, oferta, metragem, cômodos) não são
        // propriedades de RealEstateListing (subtipo de WebPage) — ficam
        // aninhados em mainEntity, que é a Accommodation em si.
        mainEntity: {
          "@type": "Accommodation",
          address: { "@type": "PostalAddress", addressLocality: city, addressRegion: state, addressCountry: "BR" },
          offers: {
            "@type": "Offer",
            price: imovel.price,
            priceCurrency: "BRL",
            availability: resolveAvailability(imovel.status),
            // Preço de locação é mensal, não um valor único de venda — deixa isso
            // explícito para leitores estruturados (equivalente ao "/mês" do formatPrice).
            ...(purpose === "locacao" && {
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: imovel.price,
                priceCurrency: "BRL",
                unitCode: "MON",
              },
            }),
          },
          numberOfBedrooms: bedrooms,
          numberOfBathroomsTotal: bathrooms,
          floorSize: { "@type": "QuantitativeValue", value: areaM2, unitCode: "MTK" },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Buscar imóveis", item: `${SITE.url}/imoveis` },
          { "@type": "ListItem", position: 3, name: seoTitle, item: `${SITE.url}/imovel/${imovel.slug}` },
        ],
      },
    ],
  };

  // Anúncios de venda direcionam o contato direto ao corretor responsável;
  // locação (e venda sem corretor atribuído) cai para o telefone da empresa.
  const corretorDireto = purpose === "venda" ? corretor : undefined;
  const contactWhatsAppNumber = corretorDireto ? toWhatsAppNumber(corretorDireto.contact) : undefined;
  const contactPhoneHref = corretorDireto ? `tel:+${toWhatsAppNumber(corretorDireto.contact)}` : SITE.phoneHref;
  const contactPhoneLabel = corretorDireto ? corretorDireto.contact : SITE.phone;

  return (
    <Container className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/imoveis"
        className="inline-flex items-center gap-1.5 text-text-2 no-underline mb-4 hover:text-text-1 transition-colors duration-150 ease-out"
        style={{ font: "var(--text-body-sm)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a busca
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 pb-20 lg:pb-0">
        <div>
          <ImovelGallery photos={imovel.photos ?? []} coverImage={imovel.coverImage} title={title} />

          <div className="mt-7">
            <Badge tone={purpose === "locacao" ? "locacao" : "venda"}>
              {purpose === "locacao" ? "Locação" : "Venda"}
            </Badge>
            <h1
              className="text-text-1 mt-3 mb-1"
              style={{ font: "var(--text-display-lg)", fontFamily: "var(--font-display)" }}
            >
              {title}
            </h1>
            <div
              className="flex items-center gap-1.5 text-text-2 mb-5"
              style={{ font: "var(--text-body-md)" }}
            >
              <MapPin className="w-4 h-4" />
              {neighborhood} · {city}/{state} · Ref.: {ref}
            </div>
            <div
              className="flex gap-7 py-4 border-t border-b border-border-1 text-text-1"
              style={{ font: "var(--text-body-md)" }}
            >
              {bedrooms != null && (
                <span className="flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4" />
                  {bedrooms} {pluralize(bedrooms, "quarto", "quartos")}
                </span>
              )}
              {bathrooms != null && (
                <span className="flex items-center gap-1.5">
                  <Bath className="w-4 h-4" />
                  {bathrooms} {pluralize(bathrooms, "banheiro", "banheiros")}
                </span>
              )}
              {parking != null && (
                <span className="flex items-center gap-1.5">
                  <Car className="w-4 h-4" />
                  {parking} {pluralize(parking, "vaga", "vagas")}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Ruler className="w-4 h-4" />
                {formatArea(areaM2)}
              </span>
            </div>
            <p className="text-text-2 mt-5 leading-[1.7]" style={{ font: "var(--text-body-md)" }}>
              {description}
            </p>

            {imovel.videos && imovel.videos.length > 0 && (
              <div className="mt-7">
                <h2
                  className="text-text-1 mb-3"
                  style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
                >
                  Vídeos
                </h2>
                <div className="flex flex-col gap-4">
                  {imovel.videos.map((video) => (
                    <video
                      key={video.id}
                      src={video.url}
                      controls
                      preload="metadata"
                      className="w-full rounded-lg bg-bg-sunken"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex self-start sticky top-6 bg-bg-surface border border-border-1 rounded-lg shadow-md p-6 flex-col gap-4">
          <div className="text-brand-primary" style={{ font: "var(--text-price)", fontSize: 32 }}>
            {formatPrice(price, purpose)}
          </div>
          <WhatsAppLink
            message={imovelInquiryMessage(imovel)}
            number={contactWhatsAppNumber}
            className="w-full"
          >
            Falar no WhatsApp
          </WhatsAppLink>
          <Button variant="outline" href={contactPhoneHref} icon={<Phone className="w-4 h-4" />} className="w-full">
            {contactPhoneLabel}
          </Button>
          {corretorDireto && (
            <div className="text-text-3" style={{ font: "var(--text-caption)" }}>
              Corretor responsável: {corretorDireto.name} · {corretorDireto.creci}
            </div>
          )}
        </div>
      </div>

      <ImovelMobilePriceBar
        price={price}
        purpose={purpose}
        whatsappMessage={imovelInquiryMessage(imovel)}
        whatsappNumber={contactWhatsAppNumber}
      />
    </Container>
  );
}
