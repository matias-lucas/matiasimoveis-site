"use client";

import { useState } from "react";
import { Pencil, Check } from "lucide-react";

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
    <div className="flex items-center gap-1.5 -mt-2">
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label="Editar cidade e UF"
        className="group inline-flex items-center gap-1 text-text-3 hover:text-text-1 transition-colors duration-150 ease-out"
      >
        <span className="underline decoration-dotted underline-offset-2" style={{ font: "var(--text-caption)" }}>
          {defaultCity} · {defaultState}
        </span>
        <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out" />
      </button>
      <input type="hidden" name={cityName} value={defaultCity} />
      <input type="hidden" name={stateName} value={defaultState} />
    </div>
  );
}
