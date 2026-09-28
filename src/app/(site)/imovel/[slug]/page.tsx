import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, BedDouble, Bath, Car, Ruler, Phone, Check, ExternalLink, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ImovelGallery } from "@/components/imovel/ImovelGallery";
import { ImovelVideo } from "@/components/imovel/ImovelVideo";
import { ImovelCard } from "@/components/imovel/ImovelCard";
import { ImovelMobilePriceBar } from "@/components/imovel/ImovelMobilePriceBar";
import { BackToSearchLink } from "@/components/imovel/BackToSearchLink";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { Button } from "@/components/ui/Button";
import { CorretorPhoto } from "@/components/corretor/CorretorPhoto";
import { ImobiliariaSelo } from "@/components/layout/ImobiliariaSelo";
import { getAllPublishedSlugs, getImovelBySlug, getSimilarImoveis } from "@/lib/queries";
import { PUBLIC_KIND_LABELS } from "@/lib/imovel-kind-categories";
import { formatPrice, formatPriceParts } from "@/lib/format";
import { imovelSpecs, type SpecKey } from "@/lib/imovel-specs";
import { imovelInquiryMessage, toWhatsAppNumber } from "@/lib/whatsapp";
import { SITE } from "@/lib/site";
import { aspectOf, VERTICAL_VIDEO_MAX_ASPECT } from "@/lib/media";
import type { Imovel } from "@/lib/types";

const SPEC_ICONS: Record<SpecKey, LucideIcon> = {
  quartos: BedDouble,
  banheiros: Bath,
  vagas: Car,
  area: Ruler,
  terreno: Ruler,
};

function kindLabel(imovel: Imovel): string {
  return imovel.kind === "outros" && imovel.kindOther ? imovel.kindOther : PUBLIC_KIND_LABELS[imovel.kind];
}

// Título e descrição usados tanto nos metadados (generateMetadata) quanto no
// JSON-LD renderizado no corpo da página — extraídos aqui para não duplicar a lógica.
function buildSeoTitle(imovel: Imovel): string {
  const bedroomsFragment = imovel.bedrooms ? ` ${imovel.bedrooms} quartos` : "";
  const action = imovel.purpose === "locacao" ? "para alugar" : "à venda";
  return `${kindLabel(imovel)}${bedroomsFragment} ${action} no ${imovel.neighborhood}, ${imovel.city}/${imovel.state}`;
}

function buildSeoDescription(imovel: Imovel): string {
  const base = imovel.description.replace(/\s+/g, " ").trim() || buildSeoTitle(imovel);
  const text = `${formatPrice(imovel.price, imovel.purpose)}. ${base}`;
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}

// disponivel/em_negociacao ainda podem ser reservados; vendido/alugado já saíram
// do mercado — status ausente (imóveis antigos) é tratado como disponível.
function resolveAvailability(status: Imovel["status"]): string {
  return status === "vendido" || status === "alugado"
    ? "https://schema.org/SoldOut"
    : "https://schema.org/InStock";
}

const STATUS_BADGE: Partial<Record<NonNullable<Imovel["status"]>, string>> = {
  em_negociacao: "Em negociação",
  vendido: "Vendido",
  alugado: "Alugado",
};

interface ImovelDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

// Com o banco fora do ar o build não pode quebrar (antes quebrava, e nem uma
// correção podia ser publicada): sem slugs, as fichas são geradas sob demanda.
export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error("generateStaticParams: catálogo indisponível", error);
    return [];
  }
}

export async function generateMetadata({ params }: ImovelDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const imovel = await getImovelBySlug(slug);
  if (!imovel) return {};

  const title = buildSeoTitle(imovel);
  const description = buildSeoDescription(imovel);
  const url = `${SITE.url}/imovel/${imovel.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: SITE.name },
  };
}

export default async function ImovelDetailPage({ params }: ImovelDetailPageProps) {
  const { slug } = await params;
  const imovel = await getImovelBySlug(slug);
  if (!imovel) notFound();

  const similar = await getSimilarImoveis(imovel).catch(() => []);
  const { purpose, title, neighborhood, city, state, ref, description, price, corretor, status, features, areaM2 } = imovel;
  const specs = imovelSpecs(imovel);
  const { value: priceValue, suffix: priceSuffix } = formatPriceParts(price, purpose);
  const statusBadge = status ? STATUS_BADGE[status] : undefined;

  const seoTitle = buildSeoTitle(imovel);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateListing",
        name: seoTitle,
        description: buildSeoDescription(imovel),
        url: `${SITE.url}/imovel/${imovel.slug}`,
        image: imovel.coverImage ? [imovel.coverImage] : undefined,
        mainEntity: {
          "@type": "Accommodation",
          address: { "@type": "PostalAddress", addressLocality: city, addressRegion: state, addressCountry: "BR" },
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "BRL",
            availability: resolveAvailability(status),
            ...(purpose === "locacao" && {
              priceSpecification: { "@type": "UnitPriceSpecification", price, priceCurrency: "BRL", unitCode: "MON" },
            }),
          },
          numberOfBedrooms: imovel.bedrooms || undefined,
          numberOfBathroomsTotal: imovel.bathrooms || undefined,
          floorSize: areaM2 ? { "@type": "QuantitativeValue", value: areaM2, unitCode: "MTK" } : undefined,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Imóveis", item: `${SITE.url}/imoveis` },
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
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${neighborhood}, ${city} - ${state}`)}`;

  // Fotos e vídeos: o vídeo é sempre o destaque. Em pé (9:16 e parecidos), ele
  // vai grande à esquerda e acompanha a rolagem, com as informações ao lado;
  // senão, vídeo e fotos ficam lado a lado numa faixa no topo (dono, 28/09).
  const photos = imovel.photos ?? [];
  const videos = imovel.videos ?? [];
  const heroVideo = videos[0];
  const heroAspect = heroVideo ? aspectOf(heroVideo, 0) : 0;
  const videoEmPe = heroVideo !== undefined && heroAspect > 0 && heroAspect < VERTICAL_VIDEO_MAX_ASPECT;

  const precoGrande = (
    <div className="text-blue-900 tabular" style={{ font: "800 34px/1.1 var(--font-display)" }}>
      {priceValue}
      {priceSuffix && (
        <span className="text-text-2" style={{ font: "600 18px/1 var(--font-display)" }}>
          {priceSuffix}
        </span>
      )}
    </div>
  );

  const botoesContato = (
    <>
      <WhatsAppLink message={imovelInquiryMessage(imovel)} number={contactWhatsAppNumber} size="lg" className="w-full">
        Falar no WhatsApp
      </WhatsAppLink>
      <Button variant="outline" size="lg" href={contactPhoneHref} icon={<Phone className="w-5 h-5" aria-hidden />} className="w-full">
        {contactPhoneLabel}
      </Button>
    </>
  );

  // Venda: o corretor do imóvel. Locação: a própria imobiliária (não há
  // corretor responsável; dono, 28/09).
  const corretorLinha = corretorDireto ? (
    <div className="flex items-center gap-3 text-text-2" style={{ font: "var(--text-body-sm)" }}>
      <CorretorPhoto corretor={corretorDireto} size={56} />
      <div className="min-w-0">
        <div className="text-text-1" style={{ font: "700 16px/1.3 var(--font-display)" }}>
          {corretorDireto.name}
        </div>
        Corretor · {corretorDireto.creci}
      </div>
    </div>
  ) : (
    <ImobiliariaSelo detail={`Atendimento da imobiliária · ${SITE.cj}`} />
  );

  const cabecalho = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={purpose === "locacao" ? "rounded-pill px-3 py-1.5 bg-blue-500 text-white" : "rounded-pill px-3 py-1.5 bg-red-600 text-white"}
          style={{ font: "700 13px/1 var(--font-display)" }}
        >
          {purpose === "locacao" ? "Aluguel" : "Venda"}
        </span>
        <span className="rounded-pill px-3 py-1.5 bg-bg-sunken text-text-1" style={{ font: "600 13px/1 var(--font-display)" }}>
          {kindLabel(imovel)}
        </span>
        {statusBadge && (
          <span className="rounded-pill px-3 py-1.5 bg-amber-100 text-gray-900" style={{ font: "700 13px/1 var(--font-display)" }}>
            {statusBadge}
          </span>
        )}
      </div>

      <h1 className="text-text-1 mt-3" style={{ font: "var(--text-display-lg)" }}>
        {title}
      </h1>
      <p className="flex items-center gap-1.5 mt-2 text-text-2" style={{ font: "var(--text-body-md)" }}>
        <MapPin className="w-4 h-4 shrink-0" aria-hidden />
        {neighborhood}, {city}/{state}
      </p>

      <div className="lg:hidden mt-4 text-blue-900 tabular" style={{ font: "var(--text-display-lg)" }}>
        {priceValue}
        {priceSuffix && (
          <span className="text-text-2" style={{ font: "600 18px/1 var(--font-display)" }}>
            {priceSuffix}
          </span>
        )}
      </div>
    </>
  );

  const caracteristicas = specs.length > 0 && (
    <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
      {specs.map((spec) => {
        const Icon = SPEC_ICONS[spec.key];
        return (
          <li key={spec.key} className="flex items-center gap-3 rounded-xl border border-border-1 bg-bg-surface p-3.5">
            <Icon className="w-6 h-6 shrink-0 text-blue-500" aria-hidden />
            <span className="min-w-0">
              <span className="block text-text-1 tabular" style={{ font: "800 19px/1.1 var(--font-display)" }}>
                {spec.value}
              </span>
              <span className="block text-text-2" style={{ font: "var(--text-body-sm)" }}>
                {spec.label}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );

  const detalhes = (
    <>
      {description && (
        <section className="mt-8">
          <h2 className="text-text-1 mb-3" style={{ font: "var(--text-display-sm)" }}>
            Sobre o imóvel
          </h2>
          <p className="text-text-2 whitespace-pre-line max-w-[68ch]" style={{ font: "var(--text-body-md)", lineHeight: 1.7 }}>
            {description}
          </p>
        </section>
      )}

      {features && features.length > 0 && (
        <section className="mt-8">
          <h2 className="text-text-1 mb-3" style={{ font: "var(--text-display-sm)" }}>
            Características
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-text-1" style={{ font: "var(--text-body-md)" }}>
                <Check className="w-5 h-5 shrink-0 text-green-500" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-text-1 mb-2" style={{ font: "var(--text-display-sm)" }}>
          Localização
        </h2>
        <p className="text-text-2" style={{ font: "var(--text-body-md)" }}>
          {neighborhood}, {city}/{state}. O endereço exato é passado pelo corretor.
        </p>
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-3 h-11 px-4 rounded-md border border-border-2 text-text-1 no-underline hover:border-text-1 hover:text-text-1"
          style={{ font: "600 15px/1 var(--font-display)" }}
        >
          <MapPin className="w-4 h-4" aria-hidden />
          Ver o bairro no mapa
          <ExternalLink className="w-4 h-4 text-text-3" aria-hidden />
        </a>
      </section>

      <p className="mt-8 text-text-3" style={{ font: "var(--text-caption)" }}>
        Código do imóvel: {ref}
      </p>
    </>
  );

  return (
    <Container className="pt-1 lg:pt-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BackToSearchLink />

      {videoEmPe ? (
        <div className="mt-1 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-10 lg:items-start">
          <div className="lg:sticky lg:top-24">
            <ImovelVideo
              video={heroVideo}
              title={title}
              purpose={purpose}
              className="video-em-pe mx-auto rounded-2xl"
              style={{ "--ar": heroAspect } as CSSProperties}
            />
          </div>

          <div className="min-w-0 mt-6 lg:mt-0">
            {cabecalho}

            <div className="hidden lg:flex flex-col gap-4 mt-6 rounded-2xl border border-border-1 bg-bg-surface shadow-md p-6">
              {precoGrande}
              <div className="grid grid-cols-2 gap-3">{botoesContato}</div>
              <div className="pt-4 border-t border-border-1">{corretorLinha}</div>
            </div>

            {(photos.length > 0 || videos.length > 1) && (
              <section className="mt-8" aria-label="Fotos">
                <ImovelGallery
                  slug={imovel.slug}
                  title={title}
                  kind={imovel.kind}
                  purpose={purpose}
                  photos={photos}
                  videos={videos.slice(1)}
                  variant="miniaturas"
                />
              </section>
            )}

            {caracteristicas}
            {detalhes}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-1">
            <ImovelGallery
              slug={imovel.slug}
              title={title}
              kind={imovel.kind}
              purpose={purpose}
              photos={photos}
              videos={videos}
              variant="destaque"
            />
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-8 lg:gap-12 mt-6 lg:mt-8">
            <div className="min-w-0">
              {cabecalho}
              {caracteristicas}
              {detalhes}
            </div>

            <aside className="hidden lg:block" aria-label="Contato">
              <div className="sticky top-24 flex flex-col gap-4 rounded-2xl border border-border-1 bg-bg-surface shadow-md p-6">
                {precoGrande}
                {botoesContato}
                <div className="pt-4 border-t border-border-1">{corretorLinha}</div>
              </div>
            </aside>
          </div>
        </>
      )}

      {similar.length > 0 && (
        <section className="mt-14 pt-10 border-t border-border-1" aria-labelledby="parecidos">
          <h2 id="parecidos" className="text-text-1 mb-5" style={{ font: "var(--text-display-md)" }}>
            {purpose === "locacao" ? "Outros imóveis para alugar" : "Outros imóveis à venda"}
          </h2>
          <ul className="snap-row flex gap-4 overflow-x-auto -mx-4 px-4 pb-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:gap-5">
            {similar.map((item) => (
              <li key={item.id} className="w-[80%] shrink-0 sm:w-auto flex">
                <ImovelCard imovel={item} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="pb-10 lg:pb-16" />

      <ImovelMobilePriceBar
        price={price}
        purpose={purpose}
        whatsappMessage={imovelInquiryMessage(imovel)}
        whatsappNumber={contactWhatsAppNumber}
        phoneHref={contactPhoneHref}
      />
    </Container>
  );
}
