import type { ReactNode } from "react";
import Link from "next/link";
import { Save, BedDouble, Bath, Car, Ruler, MapPin } from "lucide-react";
import { QuantityStepper } from "@/components/admin/QuantityStepper";
import { AreaM2Input } from "@/components/admin/AreaM2Input";
import { CityStateField } from "@/components/admin/CityStateField";
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
  /** Rendered inside the "Fotos, vídeos e descrição" section — omitted
   *  entirely on create, since photos need a saved property_id. */
  photoManager?: ReactNode;
  /** Rendered right after photoManager, same section — omitted on create
   *  for the same reason (videos need a saved property_id too). */
  videoManager?: ReactNode;
  action: (formData: FormData) => void;
  submitLabel: string;
}

function Field({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-col gap-1.5 ${className}`}>{children}</div>;
}

function SubLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-text-2 mt-1" style={{ font: "var(--text-label)" }}>
      {children}
    </h3>
  );
}

export function PropertyForm({ property, brokers, photoManager, videoManager, action, submitLabel }: PropertyFormProps) {
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
      className="group/form grid grid-cols-[320px_1fr] gap-x-12 gap-y-6 items-stretch bg-bg-surface border border-border-1 rounded-lg p-7"
    >
      {/* Coluna fixa: identidade do anúncio + ação de salvar sempre visíveis.
          A coluna de abas à direita é esticada (items-stretch acima) para ter
          a mesma altura desta coluna — ver pf-panel-wrap/.pf-panel-scroll em
          globals.css para como os painéis rolam dentro desse espaço. */}
      <div className="pf-left-col flex flex-col gap-4">
        <div className={`grid gap-4 ${property ? "grid-cols-4" : "grid-cols-1"}`}>
          <Field className="col-span-3">
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
          {property && (
            <Field className="col-start-4">
              <Input label="Código" name="ref" placeholder="000" defaultValue={property.ref} />
            </Field>
          )}
        </div>

        <Field>
          <Input label="Título" name="title" placeholder="Ex.: Casa 3 quartos" defaultValue={property?.title} required />
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

        <Field>
          <Input label="Bairro" name="neighborhood" defaultValue={property?.neighborhood} required />
        </Field>

        <CityStateField
          cityName="city"
          stateName="state"
          defaultCity={property?.city ?? "Itaberaí"}
          defaultState={property?.state ?? "GO"}
        />

        <Input label="Preço (R$)" name="price" type="number" min={0} step="1" defaultValue={property?.price} required />
        {/* <Input
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
        /> */}

        <Button type="submit" size="lg" className="mt-2 w-full" icon={<Save className="w-5 h-5" />}>
          {submitLabel}
        </Button>
      </div>

      {/* Coluna de detalhes: abas em vez de seções empilhadas */}
      <div className="pf-tabs flex flex-col">
        <input type="radio" name="pfTab" id="pfTab1" defaultChecked className="sr-only" />
        <input type="radio" name="pfTab" id="pfTab2" className="sr-only" />
        <input type="radio" name="pfTab" id="pfTab3" className="sr-only" />

        <div className="pf-tabnav">
          <label htmlFor="pfTab1" className="pf-tab pf-tab-1">
            Características adicionais
          </label>
          <label htmlFor="pfTab2" className="pf-tab pf-tab-2">
            Anúncio
          </label>
          <label htmlFor="pfTab3" className="pf-tab pf-tab-3 pf-tab-corretor">
            Corretor responsável
          </label>
        </div>

        <div className="pf-panel-wrap">
          <div className="pf-panel pf-panel-1 pf-panel-scroll">
            <SubLabel>Características</SubLabel>
            <div className="pf-layout-2x2 grid grid-cols-2 gap-4">
              <QuantityStepper
                size="compact"
                label={<span className="pf-field-icon inline-flex items-center gap-1.5"><BedDouble className="w-3.5 h-3.5" />Quartos</span>}
                name="bedrooms"
                min={0}
                defaultValue={property?.bedrooms ?? 0}
              />
              <QuantityStepper
                size="compact"
                label={<span className="pf-field-icon inline-flex items-center gap-1.5"><Bath className="w-3.5 h-3.5" />Banheiros</span>}
                name="bathrooms"
                min={0}
                defaultValue={property?.bathrooms ?? 0}
              />
              <Field>
                <QuantityStepper
                  size="compact"
                  label={<span className="pf-field-icon inline-flex items-center gap-1.5"><Car className="w-3.5 h-3.5" />Vagas</span>}
                  name="parking"
                  min={0}
                  defaultValue={property?.parking ?? 0}
                />
                <Checkbox
                  label="Vaga não cabe carro, só moto"
                  name="parkingMotorcycleOnly"
                  defaultChecked={property?.parking_motorcycle_only}
                />
              </Field>
              <AreaM2Input
                variant="segmented"
                label={<span className="pf-field-icon inline-flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5" />Área <i>(opcional)</i></span>}
                name="areaM2"
                placeholder="00"
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

            <SubLabel>
              <span className="pf-field-icon inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />Localização</span>
            </SubLabel>
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
          </div>

          <div className="pf-panel pf-panel-2 pf-panel-scroll">
            {photoManager}
            {videoManager}

            <Field>
              <Textarea
                label="Descrição"
                name="description"
                rows={4}
                placeholder="Descreva o imóvel: cômodos, localização, diferenciais…"
                defaultValue={property?.description}
              />
            </Field>
          </div>

          <div className="pf-panel pf-panel-3 pf-panel-scroll">
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
          </div>
        </div>
      </div>
    </form>
  );
}
