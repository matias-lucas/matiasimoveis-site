"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { PRICE_BANDS } from "@/lib/price-bands";
import { KIND_OPTIONS } from "@/lib/admin/labels";
import type { PropertyPurpose } from "@/lib/types";

const BEDROOM_OPTIONS = [
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

interface SearchFilterBarProps {
  defaultPurpose?: PropertyPurpose;
  defaultNeighborhood?: string;
}

export function SearchFilterBar({
  defaultPurpose = "locacao",
  defaultNeighborhood,
}: SearchFilterBarProps) {
  const [purpose, setPurpose] = useState<PropertyPurpose>(defaultPurpose);

  return (
    <form
      action="/imoveis"
      method="get"
      className="bg-bg-surface rounded-lg shadow-lg p-6 flex flex-col gap-4 font-body"
    >
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

      <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-3 items-end">
        <label className="flex flex-col gap-1.5">
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

        <Select name="tipo" label="Tipo" placeholder="Todos" options={KIND_OPTIONS} />
        <Select name="quartos" label="Quartos" placeholder="Todos" options={BEDROOM_OPTIONS} />
        <Select
          name="preco"
          label="Faixa de preço"
          placeholder="Todos"
          options={PRICE_BANDS[purpose]}
        />

        <button
          type="submit"
          className="h-11 px-6 rounded-md border-none bg-brand-primary text-white flex items-center gap-2 cursor-pointer transition-colors duration-150 ease-out hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:shadow-focus"
          style={{ font: "var(--text-label)", fontFamily: "var(--font-display)" }}
        >
          <Search className="w-4 h-4" />
          Buscar
        </button>
      </div>
    </form>
  );
}
