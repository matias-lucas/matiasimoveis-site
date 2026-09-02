import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, BedDouble, Bath, Car, Ruler, Phone } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { PropertyPhoto } from "@/components/property/PropertyPhoto";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { Button } from "@/components/ui/Button";
import { getAllPublishedSlugs, getPropertyBySlug } from "@/lib/queries";
import { formatArea, formatPrice, pluralize } from "@/lib/format";
import { propertyInquiryMessage } from "@/lib/whatsapp";
import { SITE } from "@/lib/site";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};

  return {
    title: `${property.title} no ${property.neighborhood}, ${property.city}/${property.state}`,
    description: property.description,
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

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
    broker,
  } = property;

  return (
    <Container className="py-8">
      <Link
        href="/imoveis"
        className="inline-flex items-center gap-1.5 text-text-2 no-underline mb-4 hover:text-text-1 transition-colors duration-150 ease-out"
        style={{ font: "var(--text-body-sm)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a busca
      </Link>

      <div className="grid grid-cols-[2fr_1fr] gap-8">
        <div>
          <div className="relative h-[380px] bg-bg-sunken rounded-lg overflow-hidden mb-3">
            <PropertyPhoto src={property.coverImage} alt={title} iconClassName="w-12 h-12" />
          </div>
          <div className="flex gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => {
              const thumb = property.photos?.filter((p) => !p.isCover)[i];
              return (
                <div key={i} className="relative flex-1 h-[72px] bg-bg-sunken rounded-sm overflow-hidden">
                  <PropertyPhoto src={thumb?.url} alt={thumb?.alt || title} iconClassName="w-5 h-5" />
                </div>
              );
            })}
          </div>

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
                  <BedDouble className="w-[18px] h-[18px]" />
                  {bedrooms} {pluralize(bedrooms, "quarto", "quartos")}
                </span>
              )}
              {bathrooms != null && (
                <span className="flex items-center gap-1.5">
                  <Bath className="w-[18px] h-[18px]" />
                  {bathrooms} {pluralize(bathrooms, "banheiro", "banheiros")}
                </span>
              )}
              {parking != null && (
                <span className="flex items-center gap-1.5">
                  <Car className="w-[18px] h-[18px]" />
                  {parking} {pluralize(parking, "vaga", "vagas")}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Ruler className="w-[18px] h-[18px]" />
                {formatArea(areaM2)}
              </span>
            </div>
            <p className="text-text-2 mt-5 leading-[1.7]" style={{ font: "var(--text-body-md)" }}>
              {description}
            </p>
          </div>
        </div>

        <div className="self-start sticky top-6 bg-bg-surface border border-border-1 rounded-lg shadow-md p-6 flex flex-col gap-4">
          <div className="text-brand-primary" style={{ font: "var(--text-price)", fontSize: 32 }}>
            {formatPrice(price, purpose)}
          </div>
          <WhatsAppLink message={propertyInquiryMessage(property)} className="w-full">
            Falar no WhatsApp
          </WhatsAppLink>
          <Button variant="outline" href={SITE.phoneHref} icon={<Phone className="w-4 h-4" />} className="w-full">
            {SITE.phone}
          </Button>
          <div className="text-text-3" style={{ font: "var(--text-caption)" }}>
            Corretor responsável: {broker.name} · {broker.creci}
          </div>
        </div>
      </div>
    </Container>
  );
}
