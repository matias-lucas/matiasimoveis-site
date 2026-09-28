import { BedDouble, Bath, Car, Ruler, MapPin } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { STATUS_OPTIONS } from "@/lib/admin/labels";
import type { AdminImovelRow } from "@/lib/admin/queries";
import { FormField, SubLabel } from "./FormField";
import { QuantityStepper } from "./QuantityStepper";
import { AreaM2Input } from "./AreaM2Input";

interface CharacteristicsPanelProps {
  imovel?: AdminImovelRow;
}

/** Aba "Características adicionais" do ImovelForm: cômodos, área, endereço interno e situação. */
export function CharacteristicsPanel({ imovel }: CharacteristicsPanelProps) {
  return (
    <>
      <SubLabel>Características</SubLabel>
      <div className="pf-layout-2x2 grid grid-cols-2 gap-4">
        <QuantityStepper
          size="compact"
          label={
            <span className="pf-field-icon inline-flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5" />
              Quartos
            </span>
          }
          name="bedrooms"
          min={0}
          defaultValue={imovel?.bedrooms ?? 0}
        />
        <QuantityStepper
          size="compact"
          label={
            <span className="pf-field-icon inline-flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5" />
              Banheiros
            </span>
          }
          name="bathrooms"
          min={0}
          defaultValue={imovel?.bathrooms ?? 0}
        />
        <FormField>
          <QuantityStepper
            size="compact"
            label={
              <span className="pf-field-icon inline-flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                Vagas
              </span>
            }
            name="parking"
            min={0}
            defaultValue={imovel?.parking ?? 0}
          />
          <Checkbox
            label="Vaga não cabe carro, só moto"
            name="parkingMotorcycleOnly"
            defaultChecked={imovel?.parking_motorcycle_only}
          />
        </FormField>
        <AreaM2Input
          variant="segmented"
          label={
            <span className="pf-field-icon inline-flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5" />
              Área <i>(opcional)</i>
            </span>
          }
          name="areaM2"
          placeholder="00"
          defaultValue={imovel?.area_m2 ?? ""}
        />
      </div>

      <FormField>
        <Input
          label="Características adicionais"
          name="features"
          placeholder="Mobiliado, piscina, murado (separe por vírgula)"
          defaultValue={imovel?.features?.join(", ") ?? ""}
        />
      </FormField>

      <SubLabel>
        <span className="pf-field-icon inline-flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          Localização
        </span>
      </SubLabel>
      <FormField>
        <Input
          label="Endereço completo — opcional"
          name="address"
          placeholder="Rua, número, complemento"
          defaultValue={imovel?.address ?? ""}
        />
        <span className="text-text-3" style={{ font: "var(--text-caption)" }}>
          Uso interno — não aparece no site público.
        </span>
      </FormField>

      {/* O destaque na home fica só na coluna da esquerda (estrela ao lado de
          Visível/Oculto), no cadastro e na edição — ver CadastroToggles. */}
      <SubLabel>Situação</SubLabel>
      <Select label="Situação" name="status" options={STATUS_OPTIONS} defaultValue={imovel?.status ?? "disponivel"} />
    </>
  );
}
