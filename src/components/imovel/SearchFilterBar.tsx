"use client";

import { useEffect, useRef, useState, useTransition, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import {
  MapPin,
  LayoutGrid,
  Home,
  Store,
  LandPlot,
  BedSingle,
  Building2,
  Warehouse,
  Ellipsis,
  type LucideIcon,
} from "lucide-react";
import { KIND_OPTIONS } from "@/lib/admin/labels";
import { KIND_CATEGORIES, type ImovelKindCategory } from "@/lib/imovel-kind-categories";
import type { ImovelRangesByPurpose } from "@/lib/queries";
import type { ImovelKind, ImovelPurpose } from "@/lib/types";

const CATEGORY_ICONS: Record<ImovelKindCategory, LucideIcon> = {
  residencial: Home,
  comercial: Store,
  lotes: LandPlot,
};

const KIND_ICONS: Record<ImovelKind, LucideIcon> = {
  casa: Home,
  kitnet: BedSingle,
  apartamento: Building2,
  sala_comercial: Store,
  galpao: Warehouse,
  lote: LandPlot,
  outros: Ellipsis,
  sobrado: Home,
};

function formatQuartos(value: number) {
  return `${value}`;
}

function formatPreco(value: number) {
  return `R$${value.toLocaleString("pt-BR")}`;
}

// Slider de faixa dupla (dois <input type="range"> sobrepostos, um para o
// mínimo e um para o máximo) usado nos campos Quartos e Faixa de preço. O
// truque de CSS que faz só o thumb responder a clique/arraste (não a track
// inteira) vive em globals.css, junto do comentário que explica por quê.
function DualRangeSlider({
  label,
  min,
  max,
  step,
  defaultLow,
  defaultHigh,
  format,
  nameLow,
  nameHigh,
  accent,
  suffix,
  onCommit,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  defaultLow: number;
  defaultHigh: number;
  format: (value: number) => string;
  nameLow: string;
  nameHigh: string;
  accent: string;
  suffix?: string;
  onCommit?: () => void;
}) {
  const [low, setLow] = useState(defaultLow);
  const [high, setHigh] = useState(defaultHigh);
  const [dragging, setDragging] = useState<"low" | "high" | null>(null);
  const stopDragging = () => {
    setDragging(null);
    onCommit?.();
  };

  const lowPct = ((low - min) / (max - min)) * 100;
  const highPct = ((high - min) / (max - min)) * 100;

  return (
    <div className="sfb-range flex flex-col gap-1.5">
      <div className="flex items-baseline gap-1.5">
        <span className="text-text-1" style={{ font: "var(--text-label)" }}>
          {label}
        </span>
        <span className="sfb-range-value" style={{ font: "var(--text-caption)", color: "var(--text-2)" }}>
          {format(low)} – {format(high)}
          {suffix ?? ""}
        </span>
      </div>
      <div className="sfb-range-track-wrap" style={{ "--accent": accent } as CSSProperties}>
        <div className="sfb-range-track" />
        <div
          className="sfb-range-fill"
          style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
        />
        {dragging === "low" && (
          <div className="sfb-range-bubble" style={{ left: `${lowPct}%` }}>
            {format(low)}
          </div>
        )}
        {dragging === "high" && (
          <div className="sfb-range-bubble" style={{ left: `${highPct}%` }}>
            {format(high)}
          </div>
        )}
        <input
          type="range"
          className="sfb-range-input"
          min={min}
          max={max}
          step={step}
          value={low}
          aria-label={`${label} mínimo`}
          onChange={(e) => setLow(Math.min(Number(e.target.value), high))}
          onPointerDown={() => setDragging("low")}
          onPointerUp={stopDragging}
          onBlur={stopDragging}
        />
        <input
          type="range"
          className="sfb-range-input"
          min={min}
          max={max}
          step={step}
          value={high}
          aria-label={`${label} máximo`}
          onChange={(e) => setHigh(Math.max(Number(e.target.value), low))}
          onPointerDown={() => setDragging("high")}
          onPointerUp={stopDragging}
          onBlur={stopDragging}
        />
      </div>
      <input type="hidden" name={nameLow} value={low} readOnly />
      <input type="hidden" name={nameHigh} value={high} readOnly />
    </div>
  );
}

// Botão de rádio (peer-checked, mesmo padrão do toggle Alugar/Comprar acima)
// usado nas duas linhas do filtro Tipo — "md" para as categorias amplas,
// "sm" para os tipos específicos.
function TipoButton({
  value,
  label,
  icon: Icon,
  checked,
  size = "md",
}: {
  value: string;
  label: string;
  icon: LucideIcon;
  checked: boolean;
  size?: "md" | "sm";
}) {
  return (
    <label className="cursor-pointer">
      <input type="radio" name="tipo" value={value} defaultChecked={checked} className="peer sr-only" />
      <span
        className={clsx(
          "flex items-center border rounded-md border-border-1 bg-bg-surface text-text-2 cursor-pointer transition-colors duration-150 ease-out hover:border-border-2 peer-checked:bg-text-1 peer-checked:border-text-1 peer-checked:text-white peer-focus-visible:shadow-focus",
          size === "md" ? "gap-1.5 px-4 py-2.5" : "gap-1 px-3 py-1.5"
        )}
        style={{ font: size === "md" ? "var(--text-label)" : "var(--text-caption)" }}
      >
        <Icon className={size === "md" ? "w-4 h-4 shrink-0" : "w-3.5 h-3.5 shrink-0"} />
        {label}
      </span>
    </label>
  );
}

interface SearchFilterBarProps {
  ranges: ImovelRangesByPurpose;
  defaultPurpose?: ImovelPurpose;
  defaultNeighborhood?: string;
  defaultKind?: string;
  /** Avisa o pai (ImoveisResultsSection) quando uma navegação disparada por
   * este formulário está em andamento, pra ele trocar a grade de resultados
   * por skeletons. Home não passa essa prop — lá o formulário só navega para
   * /imoveis, não há resultado local pra cobrir com skeleton. */
  onPendingChange?: (pending: boolean) => void;
}

export function SearchFilterBar({
  ranges,
  defaultPurpose = "locacao",
  defaultNeighborhood,
  defaultKind,
  onPendingChange,
}: SearchFilterBarProps) {
  const [purpose, setPurpose] = useState<ImovelPurpose>(defaultPurpose);
  const accent = purpose === "locacao" ? "var(--brand-secondary)" : "var(--brand-primary)";
  const range = ranges[purpose];

  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Lê o <form> via FormData (em vez de espalhar estado controlado por
  // campo) pra reaproveitar os valores nativos — inclusive os dos hidden
  // inputs do DualRangeSlider, e (no caso do toggle Alugar/Comprar) os já
  // remontados com a nova faixa padrão da finalidade, já que o setTimeout(0)
  // do scheduleSubmit só roda depois do commit do React que segue o clique.
  function submitNow() {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) {
      if (typeof value !== "string") continue;
      if ((key === "bairro" || key === "tipo") && value.trim() === "") continue;
      params.set(key, key === "bairro" ? value.trim() : value);
    }
    startTransition(() => {
      router.push(`/imoveis?${params.toString()}`, { scroll: false });
    });
  }

  function scheduleSubmit(delay: number) {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(submitNow, delay);
  }

  // Delegado no <form> em vez de um onChange por campo: cobre Alugar/Comprar
  // e Tipo (rádios nativos) de graça. Bairro ganha debounce pra não buscar a
  // cada tecla; os inputs de range visíveis não têm `name` (só os hidden
  // nameLow/nameHigh têm) e disparam onChange a cada tick do arraste, por
  // isso são ignorados aqui — o commit deles vem do onCommit ao soltar.
  function handleFormChange(event: React.ChangeEvent<HTMLFormElement>) {
    const target = event.target as unknown as HTMLInputElement;
    if (!target.name) return;
    scheduleSubmit(target.name === "bairro" ? 500 : 0);
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    submitNow();
  }

  return (
    <form
      ref={formRef}
      action="/imoveis"
      method="get"
      onChange={handleFormChange}
      onSubmit={handleFormSubmit}
      className="sfb-form bg-bg-surface rounded-lg shadow-lg flex flex-col font-body"
    >
      <div className="sfb-top flex items-end justify-between">
        <div className="inline-flex self-start bg-bg-sunken rounded-pill p-1 gap-1 font-display">
          {(["locacao", "venda"] as const).map((option) => (
            <label key={option} className="cursor-pointer">
              <input
                type="radio"
                name="finalidade"
                value={option}
                checked={purpose === option}
                onChange={() => setPurpose(option)}
                className="sr-only"
              />
              <span
                className="block px-[22px] py-[9px] rounded-pill transition-colors duration-150 ease-out"
                style={{
                  font: "var(--text-label)",
                  background:
                    purpose === option
                      ? option === "locacao"
                        ? "var(--brand-secondary)"
                        : "var(--brand-primary)"
                      : "transparent",
                  color: purpose === option ? "#fff" : "var(--text-2)",
                }}
              >
                {option === "locacao" ? "Alugar" : "Comprar"}
              </span>
            </label>
          ))}
        </div>

        <label className="flex flex-col gap-1.5 flex-1">
          <span className="text-text-1" style={{ font: "var(--text-label)" }}>
            Bairro
          </span>
          <div className="flex items-center gap-2 h-11 px-3.5 border border-border-1 rounded-md focus-within:border-border-focus focus-within:shadow-focus transition-shadow duration-150 ease-out">
            <MapPin className="w-4 h-4 text-text-2 shrink-0" />
            <input
              name="bairro"
              defaultValue={defaultNeighborhood}
              placeholder="Digite o bairro"
              className="flex-1 min-w-0 border-none outline-none bg-transparent text-text-1 placeholder:text-text-3"
              style={{ font: "var(--text-body-md)" }}
            />
          </div>
        </label>
      </div>

      <div className="sfb-tipo flex flex-col gap-2.5">
        <span className="text-text-1" style={{ font: "var(--text-label)" }}>
          Tipo
        </span>

        <div className="flex flex-wrap gap-2">
          <TipoButton value="" label="Todos" icon={LayoutGrid} checked={!defaultKind} />
          {KIND_CATEGORIES.map((category) => (
            <TipoButton
              key={category.value}
              value={category.value}
              label={category.label}
              icon={CATEGORY_ICONS[category.value]}
              checked={defaultKind === category.value}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {KIND_OPTIONS.map((option) => (
            <TipoButton
              key={option.value}
              value={option.value}
              label={option.label}
              icon={KIND_ICONS[option.value]}
              checked={defaultKind === option.value}
              size="sm"
            />
          ))}
        </div>
      </div>

      <div className="sfb-ranges grid grid-cols-2">
        <DualRangeSlider
          key={`quartos-${purpose}`}
          label="Quartos"
          min={range.minBedrooms}
          max={range.maxBedrooms}
          step={1}
          defaultLow={range.minBedrooms}
          defaultHigh={range.maxBedrooms}
          format={formatQuartos}
          nameLow="quartos_min"
          nameHigh="quartos_max"
          accent={accent}
          onCommit={() => scheduleSubmit(0)}
        />

        <DualRangeSlider
          key={`preco-${purpose}`}
          label="Faixa de preço"
          min={range.minPrice}
          max={range.maxPrice}
          step={100}
          defaultLow={range.minPrice}
          defaultHigh={range.maxPrice}
          format={formatPreco}
          nameLow="preco_min"
          nameHigh="preco_max"
          accent={accent}
          suffix={purpose === "locacao" ? "/mês" : undefined}
          onCommit={() => scheduleSubmit(0)}
        />
      </div>
    </form>
  );
}
