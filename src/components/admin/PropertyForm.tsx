import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";
import { KIND_OPTIONS, LEGACY_KIND_LABELS, STATUS_OPTIONS } from "@/lib/admin/labels";
import type { AdminPropertyRow, BrokerRow } from "@/lib/admin/queries";

interface PropertyFormProps {
  property?: AdminPropertyRow;
  brokers: BrokerRow[];
  /** Rendered inside the "Fotos e descrição" section — omitted entirely on
   *  create, since photos need a saved property_id. */
  photoManager?: ReactNode;
  action: (formData: FormData) => void;
  submitLabel: string;
}

function Field({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}

function SubLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-text-2 mt-1" style={{ font: "var(--text-label)" }}>
      {children}
    </h3>
  );
}

function CollapsibleSection({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen: boolean;
  children: ReactNode;
}) {
  return (
    <details className="group/section" open={defaultOpen}>
      <summary
        className="flex items-center justify-between gap-2 cursor-pointer list-none mt-2 mb-1 pb-2 border-b border-border-1 text-text-1 [&::-webkit-details-marker]:hidden"
        style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
      >
        {title}
        <ChevronDown className="w-4 h-4 text-text-2 shrink-0 transition-transform duration-150 ease-out group-open/section:rotate-180" />
      </summary>
      <div className="flex flex-col gap-5 pt-4">{children}</div>
    </details>
  );
}

// Always-open section: same header treatment as CollapsibleSection, no
// disclosure affordance. Used where the content is never actually meant to
// be collapsed (e.g. required fields), so there's no toggle to mislead.
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2
        className="mt-2 mb-1 pb-2 border-b border-border-1 text-text-1"
        style={{ font: "var(--text-display-sm)", fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <div className="flex flex-col gap-5 pt-4">{children}</div>
    </div>
  );
}

export function PropertyForm({ property, brokers, photoManager, action, submitLabel }: PropertyFormProps) {
  const hasData = Boolean(property);
  // Legacy fallback: keeps a currently-assigned kind that's no longer offered
  // (see LEGACY_KIND_LABELS) selectable, so saving the form doesn't silently
  // switch it to whichever option happens to be first in the list.
  const kindOptions =
    property && !KIND_OPTIONS.some((o) => o.value === property.kind)
      ? [...KIND_OPTIONS, { value: property.kind, label: LEGACY_KIND_LABELS[property.kind] ?? property.kind }]
      : KIND_OPTIONS;

  return (
    <form
      action={action}
      className="group/form grid grid-cols-[320px_1fr] gap-x-12 gap-y-6 items-start bg-bg-surface border border-border-1 rounded-lg p-7"
    >
      {/* Coluna fixa: identidade do anúncio + ação de salvar sempre visíveis */}
      <div className="flex flex-col gap-4 sticky top-6">
        <Field>
          <Input label="Título" name="title" placeholder="Ex.: Casa 3 quartos" defaultValue={property?.title} required />
        </Field>

        <Field>
          <span className="text-text-1" style={{ font: "var(--text-label)" }}>
            Finalidade
          </span>
          <SegmentedControl
            name="purpose"
            defaultValue={property?.purpose ?? "locacao"}
            options={[
              { value: "locacao", label: "Locação", activeClassName: "peer-checked:bg-brand-secondary peer-checked:text-white" },
              { value: "venda", label: "Venda", activeClassName: "peer-checked:bg-brand-primary peer-checked:text-white" },
            ]}
          />
        </Field>

        <div className="group">
          <Select label="Tipo" name="kind" options={kindOptions} defaultValue={property?.kind ?? "casa"} required />
          <div className="hidden group-has-[option[value=outros]:checked]:block mt-3">
            <Input
              label="Qual tipo?"
              name="kindOther"
              placeholder="Descreva o tipo do imóvel"
              defaultValue={property?.kind_other ?? ""}
            />
          </div>
        </div>

        <Input label="Preço (R$)" name="price" type="number" min={0} step="1" defaultValue={property?.price} required />
        <Input
          label="Condomínio (R$)"
          name="condoPrice"
          type="number"
          min={0}
          step="1"
          defaultValue={property?.condo_price ?? ""}
        />
        <Input
          label="IPTU (R$)"
          name="iptuPrice"
          type="number"
          min={0}
          step="1"
          defaultValue={property?.iptu_price ?? ""}
        />

        <Button type="submit" size="lg" className="mt-2">
          {submitLabel}
        </Button>
      </div>

      {/* Coluna de detalhes: características, localização, mídia e atribuição */}
      <div className="flex flex-col gap-10">
        <Section title="Características e localização">
          <SubLabel>Características</SubLabel>
          <div className="grid grid-cols-4 gap-4">
            <Input label="Quartos" name="bedrooms" type="number" min={0} defaultValue={property?.bedrooms ?? ""} />
            <Input label="Banheiros" name="bathrooms" type="number" min={0} defaultValue={property?.bathrooms ?? ""} />
            <Field>
              <Input label="Vagas" name="parking" type="number" min={0} defaultValue={property?.parking ?? ""} />
              <Checkbox
                label="Somente motos"
                name="parkingMotorcycleOnly"
                defaultChecked={property?.parking_motorcycle_only}
              />
            </Field>
            <Input
              label="Área (m²) — opcional"
              name="areaM2"
              type="number"
              min={0}
              step="0.01"
              defaultValue={property?.area_m2 ?? ""}
            />
          </div>

          <Field>
            <Input
              label="Características adicionais"
              name="features"
              placeholder="Mobiliado, piscina, murado (separe por vírgula)"
              defaultValue={property?.features?.join(", ") ?? ""}
            />
          </Field>

          <Field>
            <Input
              label="Área do lote (m²)"
              name="lotAreaM2"
              type="number"
              min={0}
              step="0.01"
              defaultValue={property?.lot_area_m2 ?? ""}
            />
          </Field>

          <SubLabel>Localização</SubLabel>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Bairro" name="neighborhood" defaultValue={property?.neighborhood} required />
            <Input label="Cidade" name="city" defaultValue={property?.city ?? "Itaberaí"} />
            <Input label="UF" name="state" defaultValue={property?.state ?? "GO"} maxLength={2} />
          </div>

          <Field>
            <Input
              label="Endereço completo — opcional"
              name="address"
              placeholder="Rua, número, complemento"
              defaultValue={property?.address ?? ""}
            />
            <span className="text-text-3" style={{ font: "var(--text-caption)" }}>
              Uso interno — não aparece no site público.
            </span>
          </Field>

          <SubLabel>Situação</SubLabel>
          <div className={`grid gap-4 ${property ? "grid-cols-3" : "grid-cols-2"}`}>
            {property && <Input label="Código" name="ref" defaultValue={property.ref} />}
            <Select label="Situação" name="status" options={STATUS_OPTIONS} defaultValue={property?.status ?? "disponivel"} />
            <Field>
              <span className="text-text-1" style={{ font: "var(--text-label)" }}>
                Destaque
              </span>
              <div className="h-11 flex items-center">
                <Checkbox label="Exibir na home" name="featured" defaultChecked={property?.featured} />
              </div>
            </Field>
          </div>
        </Section>

        <CollapsibleSection title={property ? "Fotos e descrição" : "Descrição"} defaultOpen={hasData}>
          {photoManager}

          <Field>
            <Textarea
              label="Descrição"
              name="description"
              rows={4}
              placeholder="Descreva o imóvel: cômodos, localização, diferenciais…"
              defaultValue={property?.description}
            />
          </Field>

          {property && (
            <Field>
              <Input label="Slug (URL)" name="slug" defaultValue={property.slug} />
              <span className="text-text-3" style={{ font: "var(--text-caption)" }}>
                matiasimoveisgo.com.br/imovel/{property.slug}
              </span>
            </Field>
          )}
        </CollapsibleSection>

        <div className="hidden group-has-[input[name=purpose][value=venda]:checked]/form:block">
          <CollapsibleSection title="Corretor responsável" defaultOpen={hasData}>
            {brokers.length === 0 ? (
              <p className="text-text-3" style={{ font: "var(--text-body-sm)" }}>
                Nenhum corretor cadastrado ainda.{" "}
                <Link href="/admin/corretores/novo" className="text-brand-primary">
                  Cadastre um corretor
                </Link>{" "}
                para poder atribuí-lo a imóveis de venda.
              </p>
            ) : (
              <Field>
                <Select
                  label="Corretor responsável"
                  name="brokerId"
                  placeholder="Selecione um corretor"
                  defaultValue={property?.broker_id ?? ""}
                  options={brokers.map((b) => ({ value: b.id, label: `${b.name} · ${b.creci}` }))}
                />
                <span className="text-text-3" style={{ font: "var(--text-caption)" }}>
                  Em imóveis de venda, o cliente entra em contato diretamente com este corretor.
                </span>
              </Field>
            )}
          </CollapsibleSection>
        </div>
      </div>
    </form>
  );
}
