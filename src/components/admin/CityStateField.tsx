"use client";

import { useState } from "react";
import { Pencil, Check, MapPin } from "lucide-react";

interface CityStateFieldProps {
  cityName: string;
  stateName: string;
  defaultCity?: string;
  defaultState?: string;
}

export function CityStateField({ cityName, stateName, defaultCity = "Itaberaí", defaultState = "GO" }: CityStateFieldProps) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="flex flex-col gap-1.5 font-body">
        <span className="text-text-1" style={{ font: "var(--text-label)" }}>
          Cidade / UF
        </span>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 h-11 px-3.5 bg-bg-surface border border-border-1 rounded-md transition-shadow duration-150 ease-out focus-within:border-border-focus focus-within:shadow-focus">
            <input
              name={cityName}
              defaultValue={defaultCity}
              className="flex-1 min-w-0 border-none outline-none bg-transparent text-text-1"
              style={{ font: "var(--text-body-md)" }}
            />
          </div>
          <div className="w-16 flex items-center gap-2 h-11 px-3 bg-bg-surface border border-border-1 rounded-md transition-shadow duration-150 ease-out focus-within:border-border-focus focus-within:shadow-focus">
            <input
              name={stateName}
              defaultValue={defaultState}
              maxLength={2}
              className="w-full border-none outline-none bg-transparent text-text-1 text-center"
              style={{ font: "var(--text-body-md)" }}
            />
          </div>
          <button
            type="button"
            onClick={() => setEditing(false)}
            aria-label="Concluir edição"
            className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-md text-text-2 hover:bg-bg-sunken hover:text-text-1 transition-colors duration-150 ease-out"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-impeccable-variants="bfd6524e" data-impeccable-variant-count="2" style={{ display: "contents" }}>
      {/* impeccable-variants-start bfd6524e */}
      <div data-impeccable-variant="original" style={{ display: "none" }}>
        <div className="flex flex-col gap-1.5 font-body">
          <span className="text-text-1" style={{ font: "var(--text-label)" }}>
            Cidade / UF
          </span>
          <div className="flex items-center justify-between h-11 px-3.5 bg-bg-surface border border-border-1 rounded-md">
            <span className="text-text-1" style={{ font: "var(--text-body-md)" }}>
              {defaultCity} · {defaultState}
            </span>
            <button
              type="button"
              onClick={() => setEditing(true)}
              aria-label="Editar cidade e UF"
              className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded text-text-2 hover:bg-bg-sunken hover:text-text-1 transition-colors duration-150 ease-out"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <input type="hidden" name={cityName} value={defaultCity} />
            <input type="hidden" name={stateName} value={defaultState} />
          </div>
        </div>
      </div>

      <div
        data-impeccable-variant="1"
        data-impeccable-params='[{"id":"gap","kind":"range","min":-8,"max":8,"step":1,"default":-2,"label":"Espaço acima"}]'
      >
        <div className="pf-citystate-collapsed flex items-center gap-1.5">
          <span className="text-text-3" style={{ font: "var(--text-caption)" }}>
            {defaultCity} · {defaultState}
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Editar cidade e UF"
            className="pf-citystate-edit shrink-0 inline-flex items-center justify-center w-5 h-5 rounded text-text-3 hover:text-text-1 hover:bg-bg-sunken transition-colors duration-150 ease-out"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <input type="hidden" name={cityName} value={defaultCity} />
          <input type="hidden" name={stateName} value={defaultState} />
        </div>
      </div>

      <div
        data-impeccable-variant="2"
        data-impeccable-params='[{"id":"pin","kind":"toggle","default":true,"label":"Ícone de local"}]'
        style={{ display: "none" }}
      >
        <div className="pf-citystate-collapsed-chip inline-flex items-center gap-1 w-fit">
          <MapPin className="pf-citystate-pin w-3 h-3 text-text-3" />
          <span className="text-text-3" style={{ font: "var(--text-caption)" }}>
            {defaultCity} · {defaultState}
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Editar cidade e UF"
            className="pf-citystate-edit shrink-0 inline-flex items-center justify-center w-5 h-5 rounded text-text-3 hover:text-text-1 hover:bg-bg-sunken transition-colors duration-150 ease-out"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <input type="hidden" name={cityName} value={defaultCity} />
          <input type="hidden" name={stateName} value={defaultState} />
        </div>
      </div>

      <style data-impeccable-css="bfd6524e">{`
        @scope ([data-impeccable-variant="1"]) {
          :scope > .pf-citystate-collapsed {
            margin-top: calc(var(--p-gap, -2) * 1px);
          }
        }
        @scope ([data-impeccable-variant="2"]) {
          :scope .pf-citystate-pin {
            display: none;
          }
          :scope[data-p-pin] .pf-citystate-pin {
            display: inline;
          }
        }
      `}</style>
      {/* Variants: insert below this line */}
      {/* impeccable-variants-end bfd6524e */}
    </div>
  );
}
