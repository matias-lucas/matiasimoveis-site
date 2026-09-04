import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ImovelCard } from "@/components/imovel/ImovelCard";
import { SearchFilterBar } from "@/components/imovel/SearchFilterBar";
import { getFeaturedImoveis, getImovelRanges } from "@/lib/queries";
import { SERVICES } from "@/lib/services";
import { SITE } from "@/lib/site";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, ranges] = await Promise.all([getFeaturedImoveis(), getImovelRanges()]);

  return (
    <div data-impeccable-variants="65c7dd10" data-impeccable-variant-count="2" style={{ display: "contents" }}>
      {/* impeccable-variants-start 65c7dd10 */}
      {/* Original */}
      <div data-impeccable-variant="original">
        <div>
          <section
            className="pt-[72px] px-8 pb-[104px] text-white"
            style={{ background: "linear-gradient(135deg, var(--bg-inverse), var(--blue-700))" }}
          >
            <Container className="grid grid-cols-[1.1fr_1fr] gap-12 items-center !px-0">
              <div>
                <div
                  className="uppercase opacity-75 mb-3"
                  style={{
                    font: "var(--text-eyebrow)",
                    letterSpacing: "var(--tracking-eyebrow)",
                  }}
                >
                  Itaberaí e região · {SITE.cj}
                </div>
                <h1
                  className="max-w-[420px] mb-3.5"
                  style={{ font: "var(--text-display-lg)", fontFamily: "var(--font-display)" }}
                >
                  O imóvel certo, no lugar certo
                </h1>
                <p className="max-w-[420px] mb-6 opacity-85" style={{ font: "var(--text-body-lg)" }}>
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
              </div>
              <div className="relative w-full h-[260px] rounded-lg overflow-hidden">
                <Image
                  src="/images/hero-house.webp"
                  alt="Fachada de um imóvel em Itaberaí/GO"
                  fill
                  priority
                  sizes="(min-width: 1024px) 500px, 100vw"
                  className="object-cover"
                />
              </div>
            </Container>
          </section>

          <Container className="-mt-[72px] !max-w-[960px]">
            <SearchFilterBar ranges={ranges} />
          </Container>

          <Container className="my-16">
            <div className="flex justify-between items-baseline mb-6">
              <h2
                className="text-text-1"
                style={{ font: "var(--text-display-md)", fontFamily: "var(--font-display)" }}
              >
                Imóveis em destaque
              </h2>
              <Button variant="ghost" href="/imoveis">
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-5 flex-wrap">
              {featured.map((imovel) => (
                <ImovelCard key={imovel.id} imovel={imovel} />
              ))}
            </div>
          </Container>

          <section className="bg-bg-surface py-14 px-8 border-t border-border-1">
            <Container className="grid grid-cols-3 gap-8 text-center !px-0">
              {SERVICES.map(({ icon: Icon, title, description }) => (
                <div key={title}>
                  <Icon className="w-8 h-8 text-brand-primary mx-auto" />
                  <div
                    className="text-text-1 mt-3 mb-1.5"
                    style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
                  >
                    {title}
                  </div>
                  <div className="text-text-2" style={{ font: "var(--text-body-sm)" }}>
                    {description}
                  </div>
                </div>
              ))}
            </Container>
          </section>
        </div>
      </div>
      {/* Variants: insert below this line */}
      <style data-impeccable-css="65c7dd10">{`
        @scope ([data-impeccable-variant="1"]) {
          :scope > .v1-root { display: block; }
          :scope .v1-hero { position: relative; overflow: hidden; padding: 96px 32px 64px; color: #fff; }
          :scope .v1-hero-bg { position: absolute; inset: 0; z-index: 0; }
          :scope .v1-hero-bg img { object-fit: cover; }
          :scope .v1-scrim { position: absolute; inset: 0; z-index: 1; background: linear-gradient(150deg, rgba(22,20,48, var(--p-scrimStrength, 0.72)) 10%, rgba(40,37,92, calc(var(--p-scrimStrength, 0.72) * 0.85)) 60%, rgba(22,20,48, var(--p-scrimStrength, 0.72)) 100%); }
          :scope .v1-hero-inner { position: relative; z-index: 2; max-width: 620px; padding: 0; }
          :scope .v1-eyebrow { text-transform: uppercase; opacity: .8; margin-bottom: 12px; font: var(--text-eyebrow); letter-spacing: var(--tracking-eyebrow); }
          :scope .v1-title { font-family: var(--font-display); font-weight: 700; font-size: calc(54px * var(--p-titleScale, 1)); line-height: 1.08; letter-spacing: -0.02em; margin-bottom: 16px; text-wrap: balance; }
          :scope .v1-desc { font: var(--text-body-lg); opacity: .9; margin-bottom: 28px; max-width: 480px; }
          :scope .v1-ctas { display: flex; gap: 12px; margin-bottom: 40px; }
          :scope .v1-cta-primary { display: inline-flex; align-items: center; border-radius: 10px; background: #fff; color: var(--brand-primary); padding: 14px 26px; font: var(--text-label); font-family: var(--font-display); transition: transform .15s ease-out, background-color .15s ease-out; }
          :scope .v1-cta-primary:hover { background: rgba(255,255,255,.9); transform: translateY(-1px); }
          :scope .v1-cta-secondary { display: inline-flex; align-items: center; border-radius: 10px; border: 1px solid rgba(255,255,255,.5); color: #fff; padding: 14px 26px; font: var(--text-label); font-family: var(--font-display); transition: background-color .15s ease-out; }
          :scope .v1-cta-secondary:hover { background: rgba(255,255,255,.1); }
          :scope .v1-search { max-width: 640px; }
          :scope .v1-featured { margin-block: 72px; }
          :scope .v1-featured-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; }
          :scope .v1-featured-title { font: var(--text-display-md); font-family: var(--font-display); color: var(--text-1); }
          :scope .v1-featured-grid { display: flex; gap: 20px; flex-wrap: wrap; }
          :scope .v1-services { background: var(--bg-surface); border-top: 1px solid var(--border-1); padding-block: 48px; }
          :scope .v1-services-row { display: flex; align-items: flex-start; gap: 0; padding: 0; }
          :scope .v1-service { flex: 1; display: flex; gap: 12px; padding: 0 24px; position: relative; }
          :scope .v1-service:not(:first-child)::before { content: ""; position: absolute; left: 0; top: 4px; bottom: 4px; width: 1px; background: var(--border-1); }
          :scope .v1-service-icon { width: 28px; height: 28px; color: var(--brand-primary); flex-shrink: 0; }
          :scope .v1-service-title { font: var(--text-display-sm); font-family: var(--font-display); color: var(--text-1); margin-bottom: 4px; }
          :scope .v1-service-desc { font: var(--text-body-sm); color: var(--text-2); }

          :scope[data-p-density="airy"] .v1-hero { padding: 128px 32px 96px; }
          :scope[data-p-density="packed"] .v1-hero { padding: 64px 32px 40px; }
          :scope[data-p-density="airy"] .v1-featured { margin-block: 96px; }
          :scope[data-p-density="packed"] .v1-featured { margin-block: 48px; }
          :scope[data-p-density="airy"] .v1-services { padding-block: 64px; }
          :scope[data-p-density="packed"] .v1-services { padding-block: 32px; }
        }

        @scope ([data-impeccable-variant="2"]) {
          :scope > .v2-root { display: block; }
          :scope .v2-hero { background: linear-gradient(135deg, var(--bg-inverse), var(--blue-700)); color: #fff; padding-top: 72px; }
          :scope .v2-hero-grid { display: grid; grid-template-columns: 1fr calc(var(--p-imageWidth, 460) * 1px); gap: 56px; align-items: center; padding: 8px 0 56px; }
          :scope .v2-hero-text { max-width: 520px; }
          :scope .v2-eyebrow { text-transform: uppercase; opacity: .75; margin-bottom: 12px; font: var(--text-eyebrow); letter-spacing: var(--tracking-eyebrow); }
          :scope .v2-title { font-family: var(--font-display); font-weight: 700; font-size: 44px; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 14px; text-wrap: balance; }
          :scope .v2-title-accent { color: var(--red-300); }
          :scope .v2-desc { font: var(--text-body-lg); opacity: .88; margin-bottom: 28px; max-width: 460px; }
          :scope .v2-ctas { display: flex; gap: 12px; }
          :scope .v2-cta-primary { display: inline-flex; align-items: center; border-radius: 10px; padding: 15px 28px; font: var(--text-label); font-family: var(--font-display); background: var(--brand-primary); color: #fff; box-shadow: 0 8px 20px rgba(230,56,61,.35); transition: background-color .15s ease-out, transform .15s ease-out; }
          :scope .v2-cta-primary:hover { background: var(--brand-primary-hover); transform: translateY(-1px); }
          :scope:not([data-p-ctaCommit]) .v2-cta-primary { background: #fff; color: var(--brand-primary); box-shadow: none; }
          :scope .v2-cta-secondary { display: inline-flex; align-items: center; border-radius: 10px; border: 1px solid rgba(255,255,255,.5); color: #fff; padding: 15px 28px; font: var(--text-label); font-family: var(--font-display); transition: background-color .15s ease-out; }
          :scope .v2-cta-secondary:hover { background: rgba(255,255,255,.1); }
          :scope .v2-hero-image { position: relative; height: 320px; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 48px rgba(0,0,0,.35); border: 1px solid rgba(255,255,255,.15); }
          :scope .v2-img { object-fit: cover; }
          :scope .v2-search-strip { background: var(--bg-surface); border-top: 1px solid var(--border-1); }
          :scope .v2-search-inner { padding: 20px 0; }
          :scope .v2-featured { margin-block: 64px; }
          :scope .v2-featured-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; }
          :scope .v2-featured-title { font: var(--text-display-md); font-family: var(--font-display); color: var(--text-1); }
          :scope .v2-featured-grid { display: flex; gap: 20px; flex-wrap: wrap; }
          :scope .v2-services { background: var(--bg-sunken); padding-block: 40px; }
          :scope .v2-services-inline { display: flex; flex-wrap: wrap; gap: 0; justify-content: center; }
          :scope .v2-service-pill { display: flex; align-items: center; gap: 10px; padding: 8px 28px; border-right: 1px solid var(--border-2); }
          :scope .v2-service-pill:last-child { border-right: none; }
          :scope .v2-service-icon { width: 20px; height: 20px; color: var(--brand-primary); }
          :scope .v2-service-label { font: var(--text-label); color: var(--text-1); }
          :scope .v2-services-cards { display: none; grid-template-columns: repeat(3, 1fr); gap: 32px; text-align: center; }
          :scope .v2-service-card-icon { width: 32px; height: 32px; color: var(--brand-primary); margin-inline: auto; }
          :scope .v2-service-card-title { font: var(--text-display-sm); font-family: var(--font-display); color: var(--text-1); margin-top: 12px; margin-bottom: 6px; }
          :scope .v2-service-card-desc { font: var(--text-body-sm); color: var(--text-2); }

          :scope:not([data-p-servicesInline]) .v2-services-inline { display: none; }
          :scope:not([data-p-servicesInline]) .v2-services-cards { display: grid; }
        }
      `}</style>
      <div
        data-impeccable-variant="1"
        data-impeccable-params='[
          {"id":"scrimStrength","kind":"range","min":0.3,"max":0.9,"step":0.05,"default":0.72,"label":"Escurecimento da imagem"},
          {"id":"titleScale","kind":"range","min":0.85,"max":1.25,"step":0.05,"default":1,"label":"Tamanho do título"},
          {"id":"density","kind":"steps","default":"snug","label":"Densidade","options":[{"value":"airy","label":"Arejado"},{"value":"snug","label":"Confortável"},{"value":"packed","label":"Compacto"}]}
        ]'
      >
        <div className="v1-root">
          <section className="v1-hero">
            <div className="v1-hero-bg">
              <Image
                src="/images/hero-house.webp"
                alt="Fachada de um imóvel em Itaberaí/GO"
                fill
                priority
                sizes="100vw"
              />
            </div>
            <div className="v1-scrim" />
            <Container className="v1-hero-inner">
              <div className="v1-eyebrow">Itaberaí e região · {SITE.cj}</div>
              <h1 className="v1-title">O imóvel certo, no lugar certo</h1>
              <p className="v1-desc">{SITE.description}</p>
              <div className="v1-ctas">
                <Link href="/imoveis" className="v1-cta-primary">
                  Buscar imóveis
                </Link>
                <Link href="/anuncie" className="v1-cta-secondary">
                  Anuncie seu imóvel
                </Link>
              </div>
              <div className="v1-search">
                <SearchFilterBar ranges={ranges} />
              </div>
            </Container>
          </section>

          <Container className="v1-featured">
            <div className="v1-featured-head">
              <h2 className="v1-featured-title">Imóveis em destaque</h2>
              <Button variant="ghost" href="/imoveis">
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="v1-featured-grid">
              {featured.map((imovel) => (
                <ImovelCard key={imovel.id} imovel={imovel} />
              ))}
            </div>
          </Container>

          <section className="v1-services">
            <Container className="v1-services-row">
              {SERVICES.map(({ icon: Icon, title, description }) => (
                <div className="v1-service" key={title}>
                  <Icon className="v1-service-icon" />
                  <div>
                    <div className="v1-service-title">{title}</div>
                    <div className="v1-service-desc">{description}</div>
                  </div>
                </div>
              ))}
            </Container>
          </section>
        </div>
      </div>
      <div
        data-impeccable-variant="2"
        style={{ display: "none" }}
        data-impeccable-params='[
          {"id":"imageWidth","kind":"range","min":360,"max":560,"step":20,"default":460,"label":"Largura da imagem"},
          {"id":"ctaCommit","kind":"toggle","default":true,"label":"CTA vermelho sólido"},
          {"id":"servicesInline","kind":"toggle","default":true,"label":"Serviços em linha (distillado)"}
        ]'
      >
        <div className="v2-root">
          <section className="v2-hero">
            <Container className="v2-hero-grid">
              <div className="v2-hero-text">
                <div className="v2-eyebrow">Itaberaí e região · {SITE.cj}</div>
                <h1 className="v2-title">
                  O imóvel <span className="v2-title-accent">certo</span>, no lugar certo
                </h1>
                <p className="v2-desc">{SITE.description}</p>
                <div className="v2-ctas">
                  <Link href="/imoveis" className="v2-cta-primary">
                    Buscar imóveis
                  </Link>
                  <Link href="/anuncie" className="v2-cta-secondary">
                    Anuncie seu imóvel
                  </Link>
                </div>
              </div>
              <div className="v2-hero-image">
                <Image
                  src="/images/hero-house.webp"
                  alt="Fachada de um imóvel em Itaberaí/GO"
                  fill
                  priority
                  sizes="(min-width: 1024px) 460px, 100vw"
                  className="v2-img"
                />
              </div>
            </Container>
            <div className="v2-search-strip">
              <Container className="v2-search-inner">
                <SearchFilterBar ranges={ranges} />
              </Container>
            </div>
          </section>

          <Container className="v2-featured">
            <div className="v2-featured-head">
              <h2 className="v2-featured-title">Imóveis em destaque</h2>
              <Button variant="ghost" href="/imoveis">
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="v2-featured-grid">
              {featured.map((imovel) => (
                <ImovelCard key={imovel.id} imovel={imovel} />
              ))}
            </div>
          </Container>

          <section className="v2-services">
            <Container className="v2-services-inner">
              <div className="v2-services-inline">
                {SERVICES.map(({ icon: Icon, title }) => (
                  <div className="v2-service-pill" key={title}>
                    <Icon className="v2-service-icon" />
                    <span className="v2-service-label">{title}</span>
                  </div>
                ))}
              </div>
              <div className="v2-services-cards">
                {SERVICES.map(({ icon: Icon, title, description }) => (
                  <div key={title}>
                    <Icon className="v2-service-card-icon" />
                    <div className="v2-service-card-title">{title}</div>
                    <div className="v2-service-card-desc">{description}</div>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        </div>
      </div>
      {/* impeccable-variants-end 65c7dd10 */}
    </div>
  );
}
