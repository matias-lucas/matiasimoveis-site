"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithRef, KeyboardEvent, Ref } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { clsx } from "clsx";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<ComponentPropsWithRef<"select">, "children"> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const r of refs) {
      if (typeof r === "function") r(node);
      else if (r) (r as React.RefObject<T | null>).current = node;
    }
  };
}

/**
 * Renderiza um <select> nativo real (visualmente oculto) para continuar
 * compatível com submits simples de <form>/FormData, com o register() do
 * react-hook-form (ref/onChange/onBlur caem todos nele) e com o truque CSS
 * group-has-[option...] do ImovelForm — e por cima um gatilho com estilo
 * próprio + listbox renderizada via portal, já que o popup nativo de opções
 * não pode ser estilizado em nenhum navegador. Selecionar uma opção atualiza
 * o select oculto via o setter nativo de value (contorna o atalho de valor
 * rastreado do React) e dispara um evento "change" de verdade, para que
 * tanto props onChange simples quanto o react-hook-form continuem funcionando.
 */
export function Select({
  label,
  options,
  placeholder,
  id,
  className,
  containerClassName,
  ref,
  name,
  defaultValue,
  value,
  onChange,
  onBlur,
  required,
  disabled,
  ...rest
}: SelectProps) {
  const selectId = id ?? name;
  const triggerId = selectId ? `${selectId}-trigger` : undefined;
  const nativeRef = useRef<HTMLSelectElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLLabelElement>(null);

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(() => String(value ?? defaultValue ?? ""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number } | null>(null);

  // O <select> nativo reseta a seleção sozinho quando seus <option> filhos
  // mudam (ex.: SearchFilterBar troca as faixas de preço em Alugar/Comprar) —
  // resincroniza.
  useEffect(() => {
    if (nativeRef.current) setCurrent(nativeRef.current.value);
  }, [options]);

  function updateMenuPosition() {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setMenuRect({ top: rect.bottom + 6, left: rect.left, width: rect.width });
  }

  function openMenu() {
    if (disabled) return;
    updateMenuPosition();
    setActiveIndex(Math.max(0, options.findIndex((o) => o.value === current)));
    setOpen(true);
  }

  function closeMenu(refocusTrigger = false) {
    setOpen(false);
    if (refocusTrigger) triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    menuRef.current?.focus();

    function onScrollOrResize() {
      updateMenuPosition();
    }
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (wrapRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      closeMenu();
    }
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    menuRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function commit(newValue: string) {
    setCurrent(newValue);
    closeMenu(true);
    const select = nativeRef.current;
    if (select && select.value !== newValue) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value")?.set;
      setter?.call(select, newValue);
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function onTriggerKeyDown(e: KeyboardEvent) {
    if (disabled || open) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu();
    }
  }

  function onMenuKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (options[activeIndex]) commit(options[activeIndex].value);
        break;
      case "Escape":
        e.preventDefault();
        closeMenu(true);
        break;
      case "Tab":
        closeMenu();
        break;
    }
  }

  const selectedOption = options.find((o) => o.value === current);

  return (
    <label ref={wrapRef} htmlFor={triggerId} className={clsx("flex flex-col gap-1.5 font-body", containerClassName)}>
      {label && (
        <span className="text-text-1" style={{ font: "var(--text-label)" }}>
          {label}
        </span>
      )}

      <select
        ref={mergeRefs(nativeRef, ref)}
        id={selectId}
        name={name}
        required={required}
        disabled={disabled}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={clsx(
          "relative w-full h-11 pl-3.5 pr-9 bg-bg-surface border rounded-md text-left transition-shadow duration-150 ease-out focus:outline-none",
          open ? "border-border-focus shadow-focus" : "border-border-1",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          !selectedOption && "text-text-3",
          className
        )}
        style={{ font: "var(--text-body-md)" }}
      >
        <span className="block truncate">{selectedOption ? selectedOption.label : (placeholder ?? "")}</span>
        <ChevronDown
          className={clsx(
            "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-2 pointer-events-none transition-transform duration-150 ease-out",
            open && "rotate-180"
          )}
        />
      </button>

      {open &&
        menuRect &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            tabIndex={-1}
            onKeyDown={onMenuKeyDown}
            style={{ position: "fixed", top: menuRect.top, left: menuRect.left, width: menuRect.width }}
            className="ui-select-menu z-50 max-h-60 overflow-y-auto py-1.5 bg-bg-surface border border-border-1 rounded-md shadow-lg focus:outline-none"
          >
            {options.map((o, i) => (
              <div
                key={o.value}
                data-index={i}
                role="option"
                aria-selected={o.value === current}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => commit(o.value)}
                className={clsx(
                  "flex items-center justify-between gap-2 px-3.5 py-2 cursor-pointer transition-colors duration-100 ease-out",
                  i === activeIndex && "bg-bg-sunken",
                  o.value === current ? "text-brand-secondary" : "text-text-1"
                )}
                style={{ font: "var(--text-body-md)" }}
              >
                <span className="truncate">{o.label}</span>
                {o.value === current && <Check className="w-4 h-4 shrink-0" />}
              </div>
            ))}
          </div>,
          document.body
        )}
    </label>
  );
}
