import type { ReactNode } from "react";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";
import { KIND_OPTIONS, LEGACY_KIND_LABELS } from "@/lib/admin/labels";
import type { AdminImovelRow, CorretorRow } from "@/lib/admin/queries";
import { FormField } from "./FormField";
import { CityStateField } from "./CityStateField";
import { CharacteristicsPanel } from "./CharacteristicsPanel";
import { AnnouncementPanel } from "./AnnouncementPanel";
import { CorretorPanel } from "./CorretorPanel";

interface ImovelFormProps {
  imovel?: AdminImovelRow;
  corretores: CorretorRow[];
  /** Renderizado dentro da seção "Fotos, vídeos e descrição" — omitido no
   *  cadastro, já que as fotos precisam de um property_id salvo. */
  photoManager?: ReactNode;
  /** Renderizado logo após photoManager, na mesma seção — omitido no
   *  cadastro pelo mesmo motivo (vídeos também precisam de um property_id). */
  videoManager?: ReactNode;
  /** Linha de ações rápidas Destacar/Publicar/Excluir, abaixo de "Preço".
   *  Omitida no cadastro — essas ações dependem de um property_id salvo. */
  quickActions?: ReactNode;
  action: (formData: FormData) => void;
  submitLabel: string;
}

/**
 * Formulário de cadastro/edição de imóvel. Layout: coluna fixa à esquerda
 * com a identidade do anúncio + ação de salvar, e à direita as abas
 * Características/Anúncio/Corretor (ver CharacteristicsPanel/
 * AnnouncementPanel/CorretorPanel) — a estrutura de abas em si (radios +
 * .pf-tabs/.pf-panel) está documentada em globals.css.
 */
export function ImovelForm({ imovel, corretores, photoManager, videoManager, quickActions, action, submitLabel }: ImovelFormProps) {
  // Fallback para tipo legado: mantém selecionável um "kind" já atribuído
  // que não é mais oferecido (ver LEGACY_KIND_LABELS), para que salvar o
  // formulário não troque silenciosamente para a primeira opção da lista.
  const kindOptions =
    imovel && !KIND_OPTIONS.some((o) => o.value === imovel.kind)
      ? [...KIND_OPTIONS, { value: imovel.kind, label: LEGACY_KIND_LABELS[imovel.kind] ?? imovel.kind }]
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
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 grid-cols-4">
          <FormField className="col-span-3">
            <span className="text-text-1" style={{ font: "var(--text-label)" }}>
              Finalidade
            </span>
            <SegmentedControl
              name="purpose"
              defaultValue={imovel?.purpose ?? "locacao"}
              options={[
                { value: "locacao", label: "Locação", activeClassName: "peer-checked:bg-brand-secondary peer-checked:text-white" },
                { value: "venda", label: "Venda", activeClassName: "peer-checked:bg-brand-primary peer-checked:text-white" },
              ]}
            />
          </FormField>
          <FormField className="col-start-4">
            <Input label="Código" name="ref" placeholder="000" defaultValue={imovel?.ref} />
          </FormField>
        </div>

        <FormField>
          <Input label="Título" name="title" placeholder="Ex.: Casa 3 quartos" defaultValue={imovel?.title} required />
        </FormField>

        <div className="group">
          <Select label="Tipo" name="kind" options={kindOptions} defaultValue={imovel?.kind ?? "casa"} required />
          <div className="hidden group-has-[option[value=outros]:checked]:block mt-3">
            <Input
              label="Qual tipo?"
              name="kindOther"
              placeholder="Descreva o tipo do imóvel"
              defaultValue={imovel?.kind_other ?? ""}
            />
          </div>
        </div>

        <FormField>
          <Input label="Bairro" name="neighborhood" defaultValue={imovel?.neighborhood} required />
        </FormField>

        <CityStateField
          cityName="city"
          stateName="state"
          defaultCity={imovel?.city ?? "Itaberaí"}
          defaultState={imovel?.state ?? "GO"}
        />

        <Input label="Preço (R$)" name="price" type="number" min={0} step="1" defaultValue={imovel?.price} required />

        {quickActions}

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
            <CharacteristicsPanel imovel={imovel} />
          </div>

          <div className="pf-panel pf-panel-2 pf-panel-scroll">
            <AnnouncementPanel photoManager={photoManager} videoManager={videoManager} description={imovel?.description} />
          </div>

          <div className="pf-panel pf-panel-3 pf-panel-scroll">
            <CorretorPanel corretores={corretores} defaultCorretorId={imovel?.broker_id ?? undefined} />
          </div>
        </div>
      </div>
    </form>
  );
}
