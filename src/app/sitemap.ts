import type { MetadataRoute } from "next";
import { getAllPublishedSlugs } from "@/lib/queries";
import { SITE } from "@/lib/site";

// Páginas estáticas + uma entrada por imóvel publicado. Revalida a cada
// 60s, igual às páginas que usam os mesmos dados (ver `revalidate` em
// app/(site)/page.tsx e app/(site)/imovel/[slug]/page.tsx).
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllPublishedSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/imoveis`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/anuncie`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/contato`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/empresa`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const imovelRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE.url}/imovel/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...imovelRoutes];
}
