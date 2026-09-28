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

- **`docs/review/REVIEW-2026-09-28.md`** — raw full-site review (design,
  bugs, measured alignment, performance, AI-asset plan) requested by the
  owner on 2026-09-28. The owner explicitly asked that this review
  **ignore the design principles recorded in the .md files below**, which
  they feel stagnated the design: goals are an eye-catching site, easy to
  read, where a customer finds the property in seconds. Where this review
  conflicts with PRODUCT.md/DESIGN.md/REDESIGN-* on visual or UX matters,
  treat the older docs as open to change (confirm direction with the
  owner via the review's "Perguntas em aberto").
- **`docs/REDESIGN-PLANO.md`** — master plan for the visual redesign
  currently underway on branch `redesign/editorial`: what already
  existed, the design direction, which tool enters at which phase, and
  the copy-paste prompts for each phase. **Takes precedence over
  `DESIGN.md` and over the "frozen tokens" note below** — see "Design
  direction" further down.
- **`PRODUCT.md`** — register (brand), users, brand personality,
  anti-references, design principles. Strategic "who/what/why". Still
  the product ruler during the redesign — only the *visual* system is
  being redone, not who the site is for or why.
- **`DESIGN.md`** — the visual system as actually implemented: color
  semantics, typography, spacing/radius/shadow, component list, layout,
  icons, motion. Read before touching any styling. **Superseded during
  the redesign** by `docs/REDESIGN-BRIEF.md` (written during the
  redesign's Fase 1) once that file exists; until then, treat this file
  as describing the pre-redesign system only.
- **`docs/PLANO-IMPLEMENTACAO.md`** — the full phased implementation
  plan (PT-BR), including every divergence found in the handoff bundle
  and how each was resolved (§2), the Supabase data model (§3), and what
  still needs client input (§5).
- **`handoff/`** — the original Claude Design bundle (gitignored, kept
  locally for reference). `Matias Imóveis - Site.dc.html` is the primary
  design source for the *pre-redesign* system; wins on any conflict with
  the other handoff files for that era. The visual redesign supersedes
  it going forward — see `docs/REDESIGN-PLANO.md`.

## Design direction (visual redesign in progress)

A full visual redesign of the public site is underway — see
`docs/REDESIGN-PLANO.md` for the full brief, phases, and tool mapping.
Two prior decisions are **revoked** by this redesign:

- **Frozen handoff tokens.** `src/styles/tokens/*.css` were previously
  "verbatim copies of the handoff, don't hand-edit." That freeze is
  lifted: the tokens are now editable directly. `docs/REDESIGN-BRIEF.md`
  (to be written during the redesign's Fase 1) plus the code itself are
  the new source of truth for the design system, not the handoff.
- **"Poppins + Inter" fonts.** See the "Decisions already made" bullet
  below — the font pairing is being redefined by the redesign.
- **"Desktop-only, mobile later."** See "Current phase" below — the
  redesign ships mobile-first from the start instead.

Everything else in "Decisions already made" (address, phone, WhatsApp
flow, admin, Supabase, Portuguese vocabulary, etc.) still holds; the
redesign only touches the public site's visual layer
(`src/app/(site)`, `src/components/{layout,imovel,forms,ui}`,
`src/styles`, `globals.css`) — not `/admin`, Supabase, queries, or the
WhatsApp lead flow.

## Current phase

**Built:** full public site backed by Supabase. It originally shipped
desktop-only (no responsive breakpoints — deliberate, user's explicit
instruction at the time: ship desktop end-to-end first, mobile as a
dedicated later pass since ~70-80% of real traffic is mobile and
deserves its own pass, not a rushed afterthought). **That call is now
revoked**: a visual redesign is underway on branch `redesign/editorial`
(see `docs/REDESIGN-PLANO.md`) that ships mobile-first from the start,
folding the mobile pass into the redesign rather than doing it
separately. Home, Buscar imóveis (`/imoveis`, filtered search), Detalhe
do imóvel (`/imovel/[slug]`), Anuncie seu imóvel (`/anuncie`), Contato
(`/contato`), Empresa (`/empresa`) — plus a full admin panel at `/admin`
(auth-gated CRUD for listings + photos).

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

**Deployed:** Vercel project `site-matiasimoveis` (production = `main`,
https://site-matiasimoveis.vercel.app; own domain not set up yet).

**Not built yet:** real property photos/content (the broker uploads
these themselves via the admin panel now), SEO/sitemap pass
(Fase 9 in the plan doc). The mobile responsive pass is no longer a
separate future item — it's folded into the ongoing visual redesign,
see `docs/REDESIGN-PLANO.md`.

## Where things live

```
src/lib/site.ts             Single source for phone/WhatsApp/address/CJ/CRECI/nav+footer links.
                            Edit here, not in components. Has a TODO on the address (see below).
                            SITE.url is the Vercel domain for now (see "Decisions already made").
src/lib/corretor.ts         corretorPadrao(): SITE.defaultCorretor (name/CRECI from SITE) plus the
                            photo uploaded for that corretor in the admin, matched by name. Only the
                            Empresa page's DB-down fallback uses it now (see "Who is the contact").
src/lib/media.ts            aspectOf(), VERTICAL_VIDEO_MAX_ASPECT (0.9: below it a video is "em pé"
                            and gets the side layout), formatDuration().
src/lib/media-upload.ts     Browser-only (admin): readImageSize(), readVideoInfo() (size, duration
                            and a JPEG frame at ~1s for the poster), describeOrientation().
src/lib/types.ts            Imovel/Corretor/ImovelPhotoRecord shape — kept in sync with the live
                            Supabase schema (src/lib/supabase/database.types.ts is the generated
                            source of truth; types.ts is the app-facing shape mapped from it in
                            lib/queries.ts). Domain type names are Portuguese (Imovel, Corretor,
                            ImovelPurpose/Kind/Status) — see "Domain vocabulary" below; the
                            underlying Supabase tables/columns stay English (properties, brokers,
                            broker_id...), since renaming those needs a live migration.
src/lib/queries.ts          Public read layer, all async, backed by Supabase; RLS restricts to
                            `published = true`. Listings (getHomeImoveis, searchImoveis,
                            getSimilarImoveis) use a slim CARD_SELECT and hide vendido/alugado;
                            searchImoveis() paginates (PAGE_SIZE, `.range()` + exact count) and
                            sorts. getCatalogSummary() is one light query (purpose/kind/
                            neighborhood) feeding the per-type counts ("Casas 3"), the neighborhood
                            suggestions and the accent-insensitive bairro match (the DB has no
                            `unaccent`, so the typed bairro is matched in JS against the known
                            names and becomes an exact `.in()`). getImovelBySlug() uses the full
                            select (photos, videos, corretor). mapRow() treats area 0/null as
                            "not informed" and puts the cover first without duplicating it.
                            getCorretores()/getCorretoresSafe() read the public `brokers` table
                            (RLS "public read brokers") with photoUrl from the broker-photos bucket.
                            Photos/videos carry width/height (+ video duration and posterUrl); a
                            listing with no photo uses its first video's poster as coverImage, and
                            CARD_SELECT fetches property_videos(id, position, poster_path) for the
                            card's "Vídeo" badge.
src/lib/search-params.ts    The /imoveis URL contract: parseSearchParams() validates everything
                            (invalid finalidade/tipo/numbers are dropped, never reach queries —
                            they used to 500) and searchHref() writes ONLY what the user chose.
                            Quartos is a minimum (1+..4+), price uses PRICE_OPTIONS presets per
                            finalidade. Legacy params (quartos_min, category tipo values) still
                            parse so old links keep working.
src/lib/imovel-specs.ts     imovelSpecs(): the quartos/banheiros/vagas/área/terreno list shared by
                            card and ficha, with zeros/nulls dropped (lote/galpão have 0 in the DB).
src/lib/format.ts           formatPrice/formatPriceParts/formatArea/pluralize/slugify/
                            normalizeText — small display/string helpers with no Supabase
                            dependency (safe to import from client components).
src/lib/imovel-kind-categories.ts SEARCH_KINDS (the single row of types in the public search, with
                            plural labels), KIND_OPTIONS/KIND_LABELS (admin), PUBLIC_KIND_LABELS,
                            searchKindOf() (sobrado counts as casa), isValidTipo(), and
                            resolveKindFilter() (casa → [casa, sobrado]; legacy categories
                            residencial/comercial/lotes → their kind lists).
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

src/styles/tokens/          Were verbatim copies of handoff/project/ds/tokens/*.css (edit-the-
                            handoff-and-re-copy, don't-hand-edit era). UNFROZEN by the visual
                            redesign (see "Design direction" above and docs/REDESIGN-PLANO.md) —
                            edit these files directly now; the handoff is no longer the source of
                            truth for them. typography.css has its Google Fonts @import stripped
                            (next/font handles loading — see src/app/layout.tsx and the note at
                            the top of globals.css).

src/components/ui/          Design-system primitives ported from the handoff's _ds_bundle.js —
                            Button, Badge, Input, Select, Checkbox, SegmentedControl, Textarea,
                            WhatsAppLink (none in the original handoff) — plus two small
                            cross-cutting helpers pulled out of duplicated call sites:
                            ConfirmDeleteButton (window.confirm() + useTransition() around a
                            bound server action; used by both the imóvel and corretor delete
                            flows) and FieldError (react-hook-form error line, used by every
                            form). These stay English-named — generic UI vocabulary, not this
                            business's domain — see "Domain vocabulary" below. PhotoSlot: a photo
                            frame that shows "Foto pendente" in place while the real photo
                            doesn't exist yet (see "Foto pendente" under Decisions).
src/components/corretor/    CorretorPhoto: round corretor photo (uploaded in Admin → Corretores)
                            or a dashed "Foto pendente" circle. Used on Empresa and on venda fichas.
src/components/imovel/      ImovelCard (price first, specs with words, `listOnMobile` row variant
                            used by /imoveis), ImovelPhoto (image or honest "Fotos em breve" tile
                            with the kind's AI line illustration from kind-illustrations.ts — a
                            drawing, never a fake photo; `compact` true/"mobile"; `preload`
                            replaces Next 16's deprecated `priority`), kind-icons.ts, ImoveisShell (client: sidebar filters on
                            desktop, native <dialog> filter sheet on mobile, sort, removable
                            active-filter chips, dims results while a navigation is pending,
                            remembers the last search in sessionStorage), ImoveisFilters (client:
                            finalidade Todos/Alugar/Comprar, types with counts, bairro with
                            datalist, quartos 1+.., price presets; "sidebar" mode applies on
                            change, "sheet" mode on its button), ImovelGallery (all photos, count
                            badge, native <dialog> lightbox with scroll-snap; see the
                            ViewTransition note below — rewritten 28/09 as the adaptive media row,
                            see "Ficha media layout" below), ImovelVideo (client: poster + big play
                            button in the purpose color, plays inline with sound on tap, one
                            <video> element so iOS accepts play()), BackToSearchLink, ImovelMobilePriceBar
                            (sticky, not fixed, so it stops before the footer).
                            Public-facing only — admin equivalents live under components/admin/.
src/components/home/        HomeSearch (client: explicit "Buscar" button, never navigates on
                            change; also a plain GET form without JS), ListingShowcase (one
                            finalidade's cards; fills leftover grid columns with a "Não achou?"
                            tile so rows never end with an orphan card), ServicesList (shared
                            by Home and Empresa).
src/components/layout/      Navbar (mobile menu = native Popover API, no drawer lib), Footer
                            (grid on the shared Container, with contacts), ImobiliariaSelo (logo
                            mark + "Matias Imóveis": the contact for rentals), WhatsAppFab,
                            Container, ProblemState (body of the 404/error pages). Wired into
                            src/app/(site)/layout.tsx — NOT the root layout, see routing note
                            below — so every public page gets them automatically. app/not-found
                            .tsx re-adds Navbar/Footer itself (it sits outside the (site) group).
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
- **Corretor vs. company**: "Divino Matias · CRECI PF - 9155" is a specific corretor (shown as
  `SITE.defaultCorretor` on Home, footer and listings without their own corretor; the Empresa
  page lists the whole team from the `brokers` table); "Matias Imóveis · CJ-40079" is the company's own
  juridical registration (footer, company-level mentions). These are different things — don't
  conflate them. Both live in `SITE` (`site.ts`). CRECI format = the admin's ("CRECI PF - 9155",
  owner's choice on 28/09; it used to read "CRECI-GO 9155" in SITE).
- **No public e-mail** (owner, 28/09): `contato@matiasimoveisgo.com.br` doesn't receive mail, so
  it was removed from Contato, footer, privacy page and JSON-LD (there's no `SITE.email`). Contact
  is WhatsApp + phone until the own domain is configured.
- **Phone/WhatsApp**: `(62) 3375-3330` for both — confirmed by the user, used as-is even though
  it reads like a landline format; don't "fix" it by inventing a 9th mobile digit.
- **Footer links**: "Trabalhe conosco" and "Simule um financiamento" (present in the old site's
  nav) were dropped — user said remove, not stub.
- **Fonts**: **Outfit** (titles, prices, buttons — `--font-display`, weights 600/700/800) +
  **Instrument Sans** (body — `--font-body`, 400/500/600), chosen on 2026-09-28 when the owner
  asked for a strong visual change ("mudar com força"). Replaced Fraunces (serif, banned as a
  default by the installed higgsfield-websites design guide) which itself had replaced the
  handoff's Poppins + Inter. Type tokens are fluid (`clamp()`), body is 17px (older audience).
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
- **`SITE.url` = `https://site-matiasimoveis.vercel.app` for now** (owner, 28/09: "por enquanto
  ficaremos só no vercel"). The own domain isn't attached to the Vercel project yet; with it in
  SITE.url, the listing links inside WhatsApp messages, the sitemap and Open Graph pointed away
  from this site. When the domain is set up in Vercel, change only that line.
- **"Foto pendente" slots** (owner, 28/09): where a real photo belongs but doesn't exist yet, the
  frame stays in the layout with "Foto pendente" written in it, for the owner to upload later.
  Corretor photos → Admin → Corretores (CorretorPhoto picks them up; Divino and Rafael had none on
  28/09). Office interior on /empresa → the owner sends the photo in the chat (their choice on
  28/09, instead of an admin "Fotos do site" screen); save it in `public/images/` and set
  `FOTO_ESCRITORIO` in `app/(site)/empresa/page.tsx`.
- **Images: real vs. AI.** Real: the brokerage facade (`public/images/fachada-matias*.webp`, sent
  by the owner on 28/09) on the Home hero, Empresa and Contato. AI (Higgsfield, owner approved on
  28/09, `public/images/ia/`): the kind line illustrations for listings without photos, the empty-
  search illustration (/imoveis with no results, 404/erro) and the ipê street on the /anuncie
  banner, labeled "Imagem ilustrativa". Rules: never an AI or stock image as a listing's photo,
  never AI-generated people, realistic AI images always labeled "Imagem ilustrativa".
- **Who is the contact** (owner, 28/09): the site's phone/WhatsApp `(62) 3375-3330` is the
  agency's, never "o corretor" ("Fale direto conosco" on the Home). Locação has no responsible
  corretor: the ficha shows the agency (ImobiliariaSelo). Only venda listings have their own
  corretor (broker_id) — the ficha shows that corretor's photo/CRECI and routes WhatsApp/phone to
  their `contact`. A venda without broker_id falls back to the agency, not to Divino.
- **Color code: azul = locação, vermelho = venda** (owner, 28/09). Applies to every purpose
  signal: card/ficha chips, HomeSearch and /imoveis finalidade toggles, the Alugar/Comprar nav
  items (active text + underline), showcase headings/"Ver todos", the video play button and the
  card's "Vídeo" badge. Neutral UI (filter chips, "Limpar filtros") stays gray; the brand red
  remains for generic CTAs (Buscar, Anunciar band) and the other nav items.
- **Ficha media layout** (owner, 28/09): the video is always the highlight, with a play button
  in the middle; nothing is stretched, cropped or letterboxed — every photo/video box has the
  file's own aspect ratio (width/height stored per media — migration
  `media_dimensions_and_video_poster`: property_photos.width/height, property_videos.width/
  height/duration_seconds/poster_path, all nullable). Two layouts, decided server-side in
  `app/(site)/imovel/[slug]/page.tsx`:
  - first video "em pé" (aspect < 0.9): the video goes big on the left (desktop, sticky, up to
    760px tall / 520px wide) with title, price, contact card, photo thumbnails ("miniaturas" row)
    and the rest on the right; on mobile the video comes first at full width (≤72svh);
  - otherwise: one row on top with video(s) first then photos, all the same height with natural
    widths (`.midia-row` in globals.css: container-query math, 400–560px tall on desktop, the
    widest item fills the phone width on mobile), horizontal scroll with arrows when it
    overflows, centered when it's short.
  Media uploaded before 28/09 has no stored size: the client corrects the aspect on load, and
  the admin VideoManager fills size/duration/poster for old videos by itself when that listing
  is opened in the admin. Posters live in the property-photos bucket (`<id>/poster-*.jpg`)
  because property-videos only accepts video mime types.
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
- **Search (rewritten 2026-09-28, see docs/review/REVIEW-2026-09-28.md).** The old
  SearchFilterBar (dual range sliders, auto-submit on every change, reused on Home) was removed:
  its hidden inputs always wrote quartos/preço limits into the URL, which hid listings without
  bedrooms, froze saved links and made the max price unreachable (slider step); on Home it
  navigated mid-typing; and the hero `<section class="relative">` covered its Alugar/Comprar
  toggle on desktop (the "Comprar não funciona" bug). Now: Home has HomeSearch with an explicit
  Buscar; /imoveis has ImoveisShell/ImoveisFilters; the URL contract lives in
  lib/search-params.ts. Don't reintroduce always-sent range limits.
- **Animations are CSS-only and never hide server HTML.** The old motion-lib wrappers
  (HeroReveal/FadeIn*) rendered `opacity:0` in the server HTML and, with "reduce motion" on,
  `useReducedMotion()` swapped the tree on the client — a hydration mismatch that left the
  property page blank forever. Use the `.reveal` / `.reveal-on-scroll` classes in globals.css
  (inside `prefers-reduced-motion: no-preference`; scroll reveal only where
  `animation-timeline: view()` exists). Don't add JS-driven entrance animations back.
- **Only one `<ViewTransition name="imovel-photo-…">` may be mounted at a time.** ImovelGallery
  renders separate mobile/desktop main photos; the `Morph` helper enables the name only on the
  one matching the viewport (useSyncExternalStore + matchMedia). Duplicate names break the morph.
- **Build must survive the DB being down** (the free Supabase project pauses when idle, and on
  2026-09-21 that took production down and made `next build` fail). generateStaticParams,
  sitemap and the Home loader catch errors; (site)/error.tsx and not-found.tsx exist in PT-BR.
- **`ImovelPhoto` never shows a photo that isn't the listing's.** The handoff's single stock house
  photo (formerly the Home hero, `hero-house.webp`) was removed on 28/09 when the real facade
  replaced it. Every card/gallery slot without a real `coverImage` renders the "Fotos em breve"
  tile with the kind's line illustration (a drawing, obviously not the property). Don't put any
  photo — stock, AI or the facade — into listing placeholders.
- **Playwright full-page screenshots can show `.reveal` elements blank** (the entrance animation
  restarts when the viewport is resized for the capture). Before "fixing" a missing hero image,
  check with a normal viewport screenshot.
- **Native HTML over client libraries where possible**: radios + CSS for toggles/pills, the
  Popover API for the mobile menu, `<dialog>` for the filter sheet and the photo lightbox,
  scroll-snap instead of a carousel lib. This cut ~80 KB of JS per page (motion, @base-ui,
  embla, cn, class-variance-authority, tw-animate-css were uninstalled). Keep it that way.
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
