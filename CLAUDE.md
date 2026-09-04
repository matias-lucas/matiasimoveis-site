# Matias Imóveis — site

Real-estate brokerage site for **Matias Imóveis** (Itaberaí/GO, CJ-40079),
replacing the old template site. Built from a Claude Design handoff
bundle. Read this file before re-exploring the repo — it indexes where
things live and the decisions already made, so you don't need to re-read
`handoff/` or re-derive settled questions each session.

**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 +
`lucide-react` + Supabase (Postgres + Auth + Storage) for data and the
admin panel.

**Commands:** `npm run dev` (Turbopack, port 3000, may already be running
in the background — check before starting another) · `npm run build` ·
`npm run lint`.

**Supabase project:** `matiasimoveis` (ref `oaztinevexlzbpyuizfx`, org
`matias`, region `sa-east-1`), free tier. Credentials live in `.env.local`
(gitignored — see `.env.example` for the two required vars). Schema/RLS/
storage were applied via the Supabase MCP tools (`apply_migration`), not
local migration files — there's no `supabase/` directory in this repo.
To change the schema, write and apply a new migration the same way, then
regenerate `src/lib/supabase/database.types.ts` via
`generate_typescript_types` and hand-copy the result in (see the comment
at the top of that file).

## Read these first

- **`PRODUCT.md`** — register (brand), users, brand personality,
  anti-references, design principles. Strategic "who/what/why".
- **`DESIGN.md`** — the visual system as actually implemented: color
  semantics, typography, spacing/radius/shadow, component list, layout,
  icons, motion. Read before touching any styling.
- **`docs/PLANO-IMPLEMENTACAO.md`** — the full phased implementation
  plan (PT-BR), including every divergence found in the handoff bundle
  and how each was resolved (§2), the Supabase data model (§3), and what
  still needs client input (§5).
- **`handoff/`** — the original Claude Design bundle (gitignored, kept
  locally for reference). `Matias Imóveis - Site.dc.html` is the primary
  design source; wins on any conflict with the other handoff files.

## Current phase

**Built:** full public site backed by Supabase, desktop-only (no
responsive breakpoints yet — deliberate, user's explicit instruction:
ship desktop end-to-end first, mobile is a separate later pass since
~70-80% of real traffic will be mobile and deserves its own dedicated
pass, not a rushed afterthought). Home, Buscar imóveis (`/imoveis`,
filtered search), Detalhe do imóvel (`/imovel/[slug]`), Anuncie seu
imóvel (`/anuncie`), Contato (`/contato`), Empresa (`/empresa`) — plus a
full admin panel at `/admin` (auth-gated CRUD for listings + photos).

**One manual step left, by design:** there's no public sign-up (see
"Decisions already made"). To get a working login, create the first
user in the Supabase dashboard — **Authentication → Users → Add user**
— with "Auto Confirm User" checked. The login screen asks for a
**username**, not an e-mail (see `lib/admin/auth.ts`), but Supabase Auth
itself always stores an e-mail, so when creating the user in the
dashboard, the **Email** field must be `<username>@login.matiasimoveisgo.com.br`
(e.g. a broker who should log in as "divino" gets the dashboard e-mail
`divino@login.matiasimoveisgo.com.br` — that domain is never actually
mailed to, it's just the synthetic suffix `usernameToEmail()` appends).
A DB trigger (`handle_new_user`, applied in the `initial_schema`
migration) automatically gives any new `auth.users` row a `profiles` row
with `role = 'admin'`, so no extra step is needed after that; log in at
`/admin` with just the username part. (I didn't create this myself —
writing directly into `auth.users` is a credential-store operation,
correctly outside what an agent should do unprompted; it needs a
password only the client knows.)

**Not built yet:** mobile responsive pass, real property photos/content
(the broker uploads these themselves via the admin panel now), deploy,
SEO/sitemap pass (Fase 9 in the plan doc).

## Where things live

```
src/lib/site.ts             Single source for phone/WhatsApp/address/CJ/CRECI/nav+footer links.
                            Edit here, not in components. Has a TODO on the address (see below).
src/lib/types.ts            Imovel/Corretor/ImovelPhotoRecord shape — kept in sync with the live
                            Supabase schema (src/lib/supabase/database.types.ts is the generated
                            source of truth; types.ts is the app-facing shape mapped from it in
                            lib/queries.ts). Domain type names are Portuguese (Imovel, Corretor,
                            ImovelPurpose/Kind/Status) — see "Domain vocabulary" below; the
                            underlying Supabase tables/columns stay English (properties, brokers,
                            broker_id...), since renaming those needs a live migration.
src/lib/queries.ts          Public read layer — searchImoveis()/getImovelBySlug()/
                            getFeaturedImoveis()/getAllPublishedSlugs(), all async, backed by
                            Supabase (replaced mock-properties.ts wholesale; call sites just
                            gained `await`). RLS restricts these to `published = true` rows.
src/lib/format.ts           formatPrice/formatArea/pluralize/slugify — small display/string
                            helpers with no Supabase dependency, used across app/ and components/.
src/lib/imovel-kind-categories.ts KIND_CATEGORIES (Residencial/Comercial/Lotes — the first row of
                            "Tipo" buttons in SearchFilterBar) and resolveKindFilter(), which
                            turns the URL's `tipo` value into either a single ImovelKind or the
                            category's full list for searchImoveis()'s `.in()` filter.
src/lib/whatsapp.ts         buildWhatsAppUrl() + the 3 message builders (imovelInquiryMessage,
                            sellInquiryMessage, contactInquiryMessage). All lead capture goes
                            through here.
src/lib/services.ts         The 3 "Compra e venda / Locação segura / Administração" service
                            items — shared by Home and Empresa.
src/lib/image-compression.ts Client-only canvas resize/re-encode (max 1600px, JPEG q0.82) run
                            before every admin photo upload — phone photos land at 4-5MB raw.
src/lib/supabase/           env.ts (URL/anon key, IMOVEL_PHOTOS_BUCKET/IMOVEL_VIDEOS_BUCKET/
                            CORRETOR_PHOTOS_BUCKET bucket-name constants, publicStorageUrl() —
                            the constant names are Portuguese but their string values are the
                            actual Supabase Storage bucket names and stay English, e.g.
                            IMOVEL_PHOTOS_BUCKET = "property-photos"; renaming buckets is a live
                            infra change, not done here), public.ts (cookie-less client for
                            public reads — keeps site pages statically renderable/ISR'd),
                            client.ts (browser client, admin login + direct Storage uploads),
                            server.ts (cookie-aware client for admin server components/actions —
                            RLS then applies the "admin full access" policies), database.types.ts
                            (generated, see Supabase project note above — don't hand-edit; this
                            file is the one place table/column names stay exactly as Supabase
                            generated them, snake_case and English).
src/lib/admin/              queries.ts (admin reads: listImoveis, getImovelById, listCorretores,
                            getCorretorById, getCurrentUserEmail — all bypass the published-only
                            RLS filter for an authenticated admin), labels.ts (ImovelKind/
                            ImovelStatus <-> PT-BR label maps, shared by the admin form and
                            list), auth.ts (username <-> synthetic-e-mail mapping for login —
                            see "Decisions already made" below).
src/proxy.ts                Next 16 renamed "middleware" to "proxy" (same mechanism, new file/
                            export name — see the deprecation note this repo's `next dev`
                            appends below). Refreshes the Supabase session cookie on every
                            request and gates /admin/*.

src/styles/tokens/          Verbatim copies of handoff/project/ds/tokens/*.css. Don't hand-edit;
                            edit the handoff source and re-copy. typography.css has its Google
                            Fonts @import stripped (next/font handles loading — see
                            src/app/layout.tsx and the note at the top of globals.css).

src/components/ui/          Design-system primitives ported from the handoff's _ds_bundle.js —
                            Button, Badge, Input, Select, Checkbox, SegmentedControl, Textarea,
                            WhatsAppLink (none in the original handoff) — plus two small
                            cross-cutting helpers pulled out of duplicated call sites:
                            ConfirmDeleteButton (window.confirm() + useTransition() around a
                            bound server action; used by both the imóvel and corretor delete
                            flows) and FieldError (react-hook-form error line, used by every
                            form). These stay English-named — generic UI vocabulary, not this
                            business's domain — see "Domain vocabulary" below.
src/components/imovel/      ImovelCard, ImovelCardSkeleton (same footprint as ImovelCard, shown
                            while a filter change is in flight — see the auto-submit note below),
                            SearchFilterBar (client component: purpose-dependent range-slider
                            bounds, and now also owns auto-submit-on-change — see "Fixed bugs"
                            below), ImoveisResultsSection (client wrapper used only by
                            /imoveis/page.tsx — pairs SearchFilterBar with the results grid so it
                            can swap in ImovelCardSkeleton while a navigation it triggered is
                            pending), ImovelPhoto (shared image-or-placeholder slot, now also
                            used for real Supabase Storage photos, not just mock data).
                            Public-facing only — admin equivalents live under components/admin/.
src/components/layout/      Navbar, Footer, WhatsAppFab, Container. Wired into
                            src/app/(site)/layout.tsx — NOT the root layout, see routing note
                            below — so every public page gets them automatically.
src/components/forms/       SellForm, ContactForm — client components, react-hook-form + zod,
                            build a WhatsApp message on submit via lib/whatsapp.ts and
                            window.open() it. No email/database backend exists for these yet.
src/components/admin/       AdminHeader (logo + user email + Sair, shared by both admin sections)
                            and LoginForm (client, Supabase signInWithPassword) sit flat here;
                            everything else is grouped by which admin feature it belongs to:
  admin/corretor/              CorretorCard (grid tile that flips into an inline edit <form>) and
                              CorretorForm (plain create/edit form) — re-exported from index.ts,
                              so callers do `import { CorretorCard } from "@/components/admin/corretor"`.
  admin/imovel-form/           Everything that exists only to build the imóvel create/edit form.
                              ImovelForm.tsx is the orchestrator (left column of always-visible
                              fields + the 3-tab right column); CharacteristicsPanel.tsx,
                              AnnouncementPanel.tsx and CorretorPanel.tsx are those three tabs, one
                              file each; FormField.tsx holds the tiny FormField/SubLabel layout
                              helpers shared between them. AreaM2Input/CityStateField/
                              QuantityStepper are form-only inputs used exclusively inside these
                              panels. PhotoManager/VideoManager/ImovelQuickActions are client
                              components the edit page (app/admin/imoveis/[id]/page.tsx) renders
                              and passes into ImovelForm as `photoManager`/`videoManager`/
                              `quickActions` props — grouped here because they're conceptually
                              "the imóvel editor", even though the edit page imports them
                              directly rather than through ImovelForm. index.ts re-exports the
                              4 pieces external code actually imports (ImovelForm, PhotoManager,
                              VideoManager, ImovelQuickActions); the rest are this folder's
                              private implementation detail — import them only from within it.

src/app/layout.tsx          Minimal root shell (html/body/fonts/metadata) only — intentionally
                            has no Navbar/Footer/WhatsAppFab so /admin/* doesn't inherit them.
src/app/(site)/             Route group holding every public page (Home, /imoveis, /imovel/
                            [slug], /anuncie, /contato, /empresa) plus its own layout.tsx that
                            adds the public chrome. The group folder doesn't affect URLs.
src/app/admin/              page.tsx = login (route "/admin"). actions.ts = signOut — the one
                            admin Server Action used by both imoveis/ and corretores/ (AdminHeader
                            posts to it), so it lives at this shared level instead of under either
                            subsection. corretores/actions.ts = corretor CRUD (createCorretor/
                            updateCorretor/deleteCorretor) — small enough to stay one file.
                            imoveis/actions/ = every imóvel-related Server Action, split by what
                            it operates on rather than kept as one file: imoveis.ts (slug
                            generation, form-field parsing, createImovel/updateImovel/
                            setPublished/setFeatured/deleteImovel), photos.ts (add/delete/
                            setCover/move), videos.ts (add/delete/move) — PhotoManager and
                            VideoManager import straight from photos.ts/videos.ts respectively,
                            pages import from imoveis.ts. imoveis/layout.tsx and
                            corretores/layout.tsx both render the shared AdminHeader chrome for
                            their subsection's routes.
```

### Domain vocabulary: Portuguese, not English

Types, functions, components, props and file names that name a concept of *this business*
(imóvel, corretor) are in Portuguese — `Imovel`, `Corretor`, `ImovelCard`, `getImovelBySlug`,
`listCorretores`, `ImovelForm.tsx` — not their English translations (`Property`, `Broker`,
`PropertyCard`...). This was a deliberate rename, done in one pass across the whole `src/`
TypeScript/React layer; the user's own words: comments and identifiers alike should "reflect"
that they speak Portuguese, not just the UI strings.

**What stayed English, and why:**
- Generic framework/engineering vocabulary that isn't specific to this business — design-system
  primitives (`Button`, `Select`, `ConfirmDeleteButton`), React/Next.js APIs (`children`,
  `ReactNode`, `useState`, Server Actions), third-party library exports. The line is domain noun
  vs. generic engineering noun.
- The Supabase schema — table names (`properties`, `brokers`, `property_photos`,
  `property_videos`) and column names (`property_id`, `broker_id`, `storage_path`...) are
  unchanged. Renaming those needs a migration applied to the live production project via
  `apply_migration` — a materially different, harder-to-reverse kind of change than an in-repo
  rename, kept as a distinct future decision rather than bundled into this one. Concretely: app
  code still calls `.from("properties")` / `.from("brokers")`, destructures DB rows as
  `property_photos`/`broker_id`/etc. exactly as Supabase returns them, and `database.types.ts`
  (regenerated, never hand-edited) still reflects those English names. Only the *identifiers I
  control* around that boundary changed — e.g. `getPropertyById` → `getImovelById`, but the
  `.from("properties")` call inside it didn't; the `<Select name="brokerId">` field posted a
  `broker_id`-shaped update, and both the field's `name` and the local variable reading it were
  renamed to `corretorId` since that's a request contract I own, not a DB column.
- Storage bucket *values* are unchanged for the same reason (`"property-photos"`,
  `"broker-photos"` are real bucket names); only the JS constants pointing at them were renamed
  (`IMOVEL_PHOTOS_BUCKET`, `CORRETOR_PHOTOS_BUCKET`).
- CLAUDE.md/PRODUCT.md/DESIGN.md/docs/ are meta-documentation for AI-assisted development, not
  "code" — they reference the current (Portuguese) identifiers by name where accuracy matters,
  but aren't required to be written in Portuguese themselves.

## Decisions already made (don't re-litigate without new input)

From the user, during implementation:
- **Address**: placeholder text in `site.ts` (marked with a `TODO(cliente)` comment) — the
  handoff's two source files disagreed ("Alfredo Nasser" vs "Alfredo Nascer") and the user said
  to leave it, they'll correct it later. Don't guess a third spelling.
- **Corretor vs. company**: "Divino Matias · CRECI-GO 9155" is a specific corretor (shown as
  `SITE.defaultCorretor` on the Empresa page); "Matias Imóveis · CJ-40079" is the company's own
  juridical registration (footer, company-level mentions). These are different things — don't
  conflate them. Both live in `SITE` (`site.ts`).
- **Phone/WhatsApp**: `(62) 3375-3330` for both — confirmed by the user, used as-is even though
  it reads like a landline format; don't "fix" it by inventing a 9th mobile digit.
- **Footer links**: "Trabalhe conosco" and "Simule um financiamento" (present in the old site's
  nav) were dropped — user said remove, not stub.
- **Fonts**: Poppins + Inter kept as the handoff's design system chose them; user had no
  preference and deferred to this call.
- **Forms → WhatsApp, not email/database**: user's explicit choice. No leads are stored anywhere
  yet — if that's ever wanted, it's a `leads` table + server action, additive to the current flow.
- **`properties.price` is `numeric` reais, not `price_cents`.** `docs/PLANO-IMPLEMENTACAO.md` §3
  specced cents; the app's `formatPrice()` already rendered whole reais with no decimals, so
  cents would only add conversion bugs for no display benefit. Code (this schema) is the source
  of truth over that doc section now.
- **`condo_price`/`iptu_price` columns exist in the DB but nothing in the app reads or writes
  them.** They shipped with inputs already commented out in the imóvel form from the very first
  commit that added them — half-finished, never actually usable from the admin UI — so the dead
  JSX plus the matching plumbing in `types.ts`/`queries.ts`/`imoveis/actions/imoveis.ts` were
  removed. The DB columns themselves were left alone (dropping them needs a migration against the
  live Supabase project, a separate, more deliberate step). If Condomínio/IPTU display is wanted
  later, it's a small re-add: two `<Input>`s in `CharacteristicsPanel.tsx` (or a new panel) plus
  the corresponding fields back in those three files — not a schema change.
- **Code comments are in Portuguese; domain identifiers (types/functions/components/file names
  for imóvel/corretor concepts) are in Portuguese too; generic engineering vocabulary stays
  English.** See "Domain vocabulary" above for the full rationale and the DB-schema boundary.
- **No public signup; every admin is `role = 'admin'`.** Matches the plan doc's threat model (one
  small brokerage, a handful of trusted staff) — there's no owner/editor distinction. A DB trigger
  (`handle_new_user`) auto-inserts a `profiles` row for any new `auth.users` row, so account
  creation is the only gate; see "One manual step left" above.
- **Admin login is by username, not e-mail** — user's explicit ask, after confirming they were
  fine losing e-mail-based "forgot password" self-service (there's no public signup anyway, so a
  forgotten password just gets reset by hand in the Supabase dashboard). `lib/admin/auth.ts`
  converts `username` <-> `username@login.matiasimoveisgo.com.br` at the login form boundary;
  Supabase Auth itself never sees anything but that synthetic e-mail. See "One manual step left"
  above for how this affects creating a user in the dashboard.
- **Admin create flow is "save basics, then manage photos"**, not one long form: `/admin/imoveis/
  novo` only collects text/number fields and has no photo uploader, because `property_photos`
  rows need a `property_id` FK that doesn't exist until the row is inserted. Submitting redirects
  to `/admin/imoveis/[id]`, which has the full form (now pre-filled) plus PhotoManager. New
  properties are `published = false` until explicitly published from the list or the edit page —
  no half-filled listing can go live by accident.
- **Property photos are public files even for draft (unpublished) listings.** The Storage bucket
  is `public` for simplicity (plain URLs, works with `next/image` with no signed-URL plumbing) —
  RLS still gates the `properties`/`property_photos` *rows*, but a photo's raw storage path
  (`<property-uuid>/<random-uuid>.jpg`) is fetchable by anyone who has it. Treated as an
  acceptable trade-off for listing photos (not sensitive content) rather than a bug to fix.

## Fixed bugs / non-obvious implementation notes

- **Tailwind v4 cascade layers**: `globals.css` had unlayered `a { color }` / `* { border-color
  }` rules that silently beat *every* Tailwind utility class regardless of specificity (unlayered
  CSS always wins over `@layer`-wrapped CSS, which is where `@import "tailwindcss"` puts its own
  rules). Caught via screenshot — the hero's white outline button was rendering blue-purple text.
  Fixed by wrapping those base rules in `@layer base { ... }` in `globals.css`. If a Tailwind
  color/border utility ever silently "doesn't work" again, check for unlayered CSS first.
- **Quartos/Faixa de preço bounds are purpose-dependent**: the handoff's `SearchFilterBar` had one
  fixed sale-oriented price scale (hundreds of thousands) applied regardless of Alugar/Comprar —
  meaningless for rent prices (hundreds/month). `getImovelRanges()` (`lib/queries.ts`) computes
  real min/max price and bedroom counts per finalidade from published listings, and
  `SearchFilterBar`'s `DualRangeSlider` remounts (`key={`quartos-${purpose}`}`, same for preço)
  with that finalidade's bounds whenever the toggle changes. This replaced an earlier discrete
  "price band" `<select>` (`lib/price-bands.ts`, now deleted) with a continuous two-handle slider.
- **`SearchFilterBar` has no submit button — it auto-submits on every change**, debounced for
  Bairro, via `router.push` wrapped in `useTransition` (not a native form GET). The `<form>` is
  still the source of truth for field values (read with `new FormData(formRef.current)` at submit
  time) so the native radio/hidden-input plumbing didn't need to change, just how submission is
  triggered: a delegated `onChange` on the `<form>` schedules `submitNow()` — immediately for most
  fields, after a 500ms debounce for `bairro` (`name=""` visible range `<input type="range">`
  elements are ignored here; they fire onChange on every drag tick, and their commit instead comes
  from `DualRangeSlider`'s new `onCommit` prop, called on pointer-up/blur). The one subtlety: when
  the Alugar/Comprar toggle changes, `setPurpose` remounts the two `DualRangeSlider`s with a new
  finalidade's default bounds, but that remount hasn't committed yet inside the same synchronous
  change-event handler — reading `FormData` right there would still see the *old* finalidade's
  slider values. `scheduleSubmit`'s `setTimeout(fn, delay)` (even at `delay=0`) defers to the next
  macrotask, which is after React's commit, so `submitNow()` always reads the post-remount DOM.
  `SearchFilterBar` takes an optional `onPendingChange(pending)` prop — `/imoveis` wires it up via
  `ImoveisResultsSection` (a small client wrapper) to swap the results grid for
  `ImovelCardSkeleton` cards while `isPending` is true, so a filter change never blanks the page
  (the "pisca-pisca" the user explicitly asked to avoid) while still showing that something is
  loading. Home's usage of `SearchFilterBar` doesn't pass `onPendingChange` — there's no local
  results grid to cover there, changing a filter just client-navigates to `/imoveis`.
- **`ImovelPhoto` never reuses the one real handoff photo across listings.** The handoff bundle
  had exactly one real stock photo (a house exterior, embedded in `.image-slots.state.json`),
  repeated across every image slot in the prototype. Reusing it across 6 different fake listings
  would misrepresent which property it's a photo of — actively misleading, not just "placeholder-
  y". It's used once, honestly, as atmosphere on the Home hero (`public/images/hero-house.webp`).
  Every property card/gallery slot without a real `coverImage` renders an honest "Foto em breve"
  empty state instead. Don't wire the hero photo into card placeholders as a shortcut.
- **Native HTML over client state where possible**: SegmentedControl/purpose toggle = radio
  inputs + `peer-checked`/`group-has-checked` CSS, not `useState`. Checkbox = same pattern.
  `SearchFilterBar` still uses a real `<form>` as its state container — filters are read from it
  via `FormData` into URL query params on `/imoveis`, shareable/bookmarkable, not React state —
  but submission itself is client-driven (`router.push` in a transition, no button, auto-submit on
  change) rather than a native GET; see the "Fixed bugs" note above for why. Keep the native-form-
  as-data-source pattern for new interactive UI unless there's a real reason (e.g. purpose-
  dependent range bounds, or needing a pending state) to reach for a client component.
- **`src/app/icon.png` (favicon)** is not a raw copy of the handoff's `logo-icon.png` — that asset has
  "CJ-40079" baked into the same PNG below the house mark, illegible at favicon size and unreadable-
  contrast on a dark browser tab bar (transparent background). It's cropped to just the circular
  mark (rows 0–343, detected via the transparent gap before the text) and composited onto a white
  rounded-square canvas. The cropped mark-only source is also saved at `public/images/logo-mark.png`
  for reuse. Regenerate both from `handoff/project/ds/assets/logo-icon.png` if that source changes —
  don't hand-edit the PNGs.
- **Google Maps embed** on `/contato` (`iframe` src `google.com/maps?q=<address>&output=embed`)
  needs no API key — it's the free public embed endpoint. Will auto-correct once the real address
  lands in `site.ts`.
- **`(site)` route group exists solely to keep Navbar/Footer/WhatsAppFab off `/admin/*`.** Next.js
  nests every layout under the root one, so the only way to give `/admin` a different shell is to
  move the public chrome out of `app/layout.tsx` and into a group layout that only public routes
  sit under. The group folder is invisible in URLs — `app/(site)/imoveis/page.tsx` is still
  `/imoveis`. If you add a new public top-level page, it goes under `app/(site)/`, not `app/`.
- **`next.config.ts` needs `images.remotePatterns` for the Supabase project's storage host**
  (`oaztinevexlzbpyuizfx.supabase.co`) — every `next/image` use that renders a real photo
  (ImovelPhoto, PhotoManager thumbnails) 404s/errors without it. If the Supabase project is ever
  recreated (new ref), update both this file and `src/lib/supabase/env.ts`'s URL.
- **`middleware.ts` → `proxy.ts`.** Next 16 deprecated the `middleware` file convention in favor
  of `proxy` (same request-interception mechanism); the exported function must be named `proxy`,
  not `middleware`, or the build fails with "missing expected function export name". Keep using
  this name going forward — don't rename back.

## Style conventions

- Typography via the inline `style={{ font: "var(--text-*)" }}` shorthand token, not Tailwind
  font-size utilities — see `DESIGN.md` for why.
- Colors/spacing/radius/shadow via Tailwind utilities bound to the tokens (`bg-brand-primary`,
  `rounded-lg`, `shadow-md`, `p-4`...) — see the `@theme inline` block in `globals.css` for the
  full generated-name list before assuming a utility doesn't exist.
- `SITE` constant (`lib/site.ts`) is the only place contact/address/corretor facts should be
  written — never hardcode a phone number or address string in a component.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
