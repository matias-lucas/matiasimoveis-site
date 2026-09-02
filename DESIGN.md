# Design

Visual system for the Matias Imóveis site. Source of truth for tokens is
`handoff/project/ds/tokens/*.css`, copied verbatim into
`src/styles/tokens/`. Don't hand-edit values here or in the copies — edit
the handoff source and re-copy, then update this file if the meaning
changed. See `CLAUDE.md` for where things live in the codebase.

## Theme

Light only. One committed brand color (red) for action/identity, a cool
neutral base, and one deliberate "drenched" dark-blue gradient moment on
the Home/Empresa hero. No dark mode — property photography and financial
figures (price, CJ/CRECI numbers) read best on a bright, paper-white
surface, and the audience skews toward users who don't expect a dark-mode
toggle on a local business site.

## Color

Defined in `src/styles/tokens/colors.css`, re-exposed as Tailwind
utilities via `@theme inline` in `src/app/globals.css` (`bg-brand-primary`,
`text-text-2`, `bg-status-venda-bg`, etc. — see that file for the full
list of generated names).

| Role | Token | Hex | Use |
|---|---|---|---|
| Brand primary | `--brand-primary` (red-500) | `#e6383d` | CTAs, active nav, price, "Venda" |
| Brand secondary | `--brand-secondary` (blue-500) | `#413e8c` | Hero gradient, footer, "Locação" |
| Page background | `--bg-page` (gray-50) | `#f7f7f9` | Body |
| Surface | `--bg-surface` (gray-0) | `#ffffff` | Cards, panels, inputs |
| Sunken | `--bg-sunken` (gray-100) | `#eef0f3` | Photo placeholders, pills track |
| Inverse | `--bg-inverse` (blue-900) | `#161430` | Footer, hero gradient start |
| Text 1/2/3 | `--text-1/2/3` (gray-900/600/400) | | Primary / secondary / tertiary text |
| WhatsApp | `--whatsapp` | `#25d366` | WhatsApp CTAs only — never reused elsewhere |

Status colors are semantic, not decorative: **Venda = red, Locação =
blue** (per `colors.css`; the handoff's own DS readme states the
opposite and is wrong — the token file and the primary `.dc.html` design
agree with each other, so they win). Property cards use the **solid**
badge (`Badge solid` — white text on `red-500`/`blue-500`); the detail
page uses the **tonal** badge (pale bg + colored text) — see
`src/components/ui/Badge.tsx`. Two different badge treatments for the
same status, kept deliberately: solid reads better over a photo, tonal
reads better as a page-level label.

## Typography

Poppins (display/headings/prices/CTAs) + Inter (body/forms/labels),
loaded via `next/font/google` in `src/app/layout.tsx` (self-hosted, no
render-blocking Google Fonts request) and pointed at by
`--font-display`/`--font-body` in `globals.css`. Full scale in
`src/styles/tokens/typography.css` — `--text-display-xl` (56px) down to
`--text-caption` (12px), plus `--text-price` (24px Poppins bold).

Applied via inline `style={{ font: "var(--text-body-md)" }}` (the
shorthand token), not Tailwind text-size utilities — this mirrors how the
handoff's own component bundle uses the tokens and keeps every text role
traceable to one named token instead of ad hoc size/weight/family
combinations. Tailwind's `font-display`/`font-body` utilities exist for
the family only (used inside `<Button>`, etc. where the shorthand isn't
practical).

Sizes are fixed px (via the token shorthand), not fluid `clamp()` — a
deliberate deviation from generally-preferred fluid marketing type,
because the tokens are an inherited, approved-pixel-perfect contract
(desktop-only phase; see `docs/PLANO-IMPLEMENTACAO.md` §4 phase 4). When
the mobile-responsive pass happens, expect to either add breakpoint
overrides or move the display sizes to `clamp()` bounded by these same
px values as the max.

## Spacing, radius, shadow

`src/styles/tokens/spacing.css` — 4px base scale (`--space-1`...
`--space-32`), which numerically matches Tailwind's own default spacing
scale 1:1 (Tailwind's `p-4` = 16px = our `--space-4`), so plain Tailwind
spacing utilities are used directly instead of custom classes. Radius
(`--radius-sm` 6px → `--radius-xl` 24px, `--radius-pill` 999px) and
shadow (`--shadow-sm/md/lg`, plus `--shadow-focus` for the branded focus
ring) are re-registered in `@theme inline` so `rounded-lg`, `shadow-md`,
`shadow-focus` etc. resolve to the token values instead of Tailwind's
stock scale. Container max-width (`--container-max: 1200px`) is applied
via inline style in `Container.tsx`, not a utility class.

## Components

Ported 1:1 from `handoff/project/ds/_ds_bundle.js` into
`src/components/ui/`: Button, Badge, Input, Select, Checkbox,
SegmentedControl, Textarea (new — not in the handoff, needed for the
contact form), WhatsAppLink. Two behavioral changes from the source
bundle, both visual-output-preserving:

- **Hover/focus are CSS (`hover:`, `focus-visible:`), not JS state.** The
  handoff bundle tracked hover in `useState` because it's a portable
  vanilla-React bundle; a real Tailwind app doesn't need that.
- **Interactive primitives prefer native HTML** over React state:
  `SegmentedControl`/the Alugar-Comprar toggle are radio-pill groups
  (`peer-checked:`/`group-has-checked:`), `SearchFilterBar` is a native
  `<form method="get" action="/imoveis">` — filters are shareable/
  bookmarkable URLs, not client state.

Property-specific components live in `src/components/property/`
(PropertyCard, SearchFilterBar, PropertyPhoto). `PropertyPhoto` is the
shared image slot: real photo when `coverImage` is set, otherwise an
honest "Foto em breve" placeholder — **never** a stock photo standing in
for a specific fake listing (see `CLAUDE.md` for why).

## Layout

Centered `max-width: 1200px` container (`Container.tsx`), non-fixed
navbar (scrolls with the page, matches the handoff and the old site's
low-chrome feel), search bar overlapping the hero by `-72px`. Desktop-
only right now — no responsive breakpoints yet; see
`docs/PLANO-IMPLEMENTACAO.md` phase 4 for the planned mobile pass
(stacked hero, full-width search fields, sticky bottom price+WhatsApp bar
on the property detail page, drawer nav).

## Icons

`lucide-react` (matches the handoff's Lucide CDN choice, swapped for the
React component form — no `lucide.createIcons()` re-run needed on every
render). 14–18px inline with text, 32px for the services-strip icons.

## Motion

Minimal, matching the handoff: 150ms ease-out color/shadow transitions on
hover/focus. No page transitions, no scroll-driven animation. WhatsApp FAB
gets a small `hover:scale-105`.
