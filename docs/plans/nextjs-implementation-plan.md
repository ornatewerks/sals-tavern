# Sal's Tavern — Next.js Implementation Plan

> Build task-by-task. Do not skip verification. **No stock photography, ever.** Use the existing logo at `public/assets/sals-logo.png`. Copy of record is `BRIEF.md §7`; visual contract is `DESIGN.md §3–§7`. If this plan and those files disagree, they win — update this plan to match.

## Goal

A polished Next.js App Router site for Sal's Tavern that reads "small-town bar, six-figure website": dark warm tavern, brass/amber/rose, no-photo-first, mobile-first conversion (Call / Directions). One long-scroll homepage with anchor nav.

## Stack & conventions

- **Next.js (App Router) + TypeScript**, React Server Components by default; `"use client"` only where interaction needs it (header scroll state, cocktail rail, reveal observer).
- **Styling:** one global `globals.css` token layer (from `DESIGN.md §3`) + colocated CSS Modules per component. No Tailwind, no CSS-in-JS runtime.
- **Fonts:** Zodiak + Switzer via `next/font` (Fontshare) — see Task 3b.
- **Content:** single typed object `src/content/site.ts`. No CMS at launch.
- **Motion:** CSS + a tiny IntersectionObserver hook. Pull from `_shared/motion` only if MOTION rises above 4/10 — not needed for launch.
- **Images:** logo only. `next/image` with explicit width/height. No other raster assets.

## Target file tree (end state)

```
sals-tavern/
├─ public/assets/sals-logo.png            # exists
├─ public/favicon.ico, icon.svg, apple-touch-icon.png   # Task 14
├─ public/og.png                          # Task 14 (generated OG card)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx          # fonts, metadata, JSON-LD, skip-link
│  │  ├─ page.tsx            # composes sections
│  │  ├─ globals.css         # token layer + base
│  │  ├─ sitemap.ts
│  │  └─ robots.ts
│  ├─ content/site.ts        # canonical content (Task 2)
│  ├─ lib/hours.ts           # open-now + "today" helper (Task 7)
│  ├─ hooks/useReveal.ts     # IntersectionObserver reveal (Task 4)
│  ├─ components/
│  │  ├─ TavernButton/  BrassPlate/  MenuBoardCard/
│  │  ├─ StoryStamp/  InfoChip/  SectionDivider/
│  │  ├─ Header/  Footer/
│  └─ sections/
│     ├─ Hero.tsx  VisitStrip.tsx  FoodSignboard.tsx
│     ├─ CocktailRail.tsx  Welcome.tsx  Location.tsx
└─ (package.json, next.config.mjs, tsconfig.json)
```

## Prerequisites (one-time, not build tasks)

- Claude Code CLI logged in (`claude /login`) if driving the build via CLI.
- Node 18.18+ / 20+.
- Figma MCP only matters for the design-board pass (Task 16) — **do not block the website on it.** `DESIGN.md` is the source of truth.

---

## Task 1 — Scaffold the app

**Objective:** boot a minimal Next.js + TS App Router app in this folder.

**Steps**
1. Confirm nothing exists yet: `find . -maxdepth 2 -type f | sort`.
2. Scaffold in place (keep `public/assets/`):
   ```bash
   cd '/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern'
   npx create-next-app@latest . --ts --app --eslint --no-tailwind --no-src-dir=false --import-alias "@/*"
   ```
   Choose **src/ dir: yes**, **App Router: yes**, **Tailwind: no**.
3. Keep deps minimal — no UI kit.

**Verify**
```bash
npm run dev   # open http://localhost:3000 — default page renders, no asset errors
npm run build # clean build
```

---

## Task 2 — Content model

**Objective:** all editable tavern content in one typed place. Matches `BRIEF.md §7–§8` exactly.

**File:** `src/content/site.ts`
```ts
export const site = {
  name: "Sal's Tavern",
  tagline: "Pull up a chair.",
  description:
    "Smash burgers, cold drinks, specialty cocktails, and small-town nights on Classic Street.",
  address: { street: "24 Classic St", city: "Hoosick Falls", state: "NY", zip: "12090" },
  phone: { display: "518-205-5097", tel: "+15182055097" },
  email: "wintersolsticehg@gmail.com",   // hidden by default — see showEmail
  showEmail: false,                       // BRIEF.md §9 decision #2 default
  facebookUrl: "https://www.facebook.com/", // TODO: real page URL
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Sal%27s+Tavern+24+Classic+St+Hoosick+Falls+NY+12090",
  hours: [
    { day: "Monday", value: "Closed", closed: true },
    { day: "Tuesday", value: "Closed", closed: true },
    { day: "Wednesday", value: "Closed", closed: true },
    { day: "Thursday", open: "16:00", close: "21:00", value: "4pm–9pm" },
    { day: "Friday", open: "12:00", close: "22:00", value: "12pm–10pm" },
    { day: "Saturday", open: "12:00", close: "22:00", value: "12pm–10pm", confirm: true },
    { day: "Sunday", open: "12:00", close: "19:00", value: "12pm–7pm" },
  ],
  food: [
    { name: "Sal's Famous Smash Burgers", note: "The one people drive in for. Smashed thin, crisp at the edges.", feature: true, stamp: "Famous for a reason." },
    { name: "Chicken Pot Pie", note: "Comfort food, tavern style." },
    { name: "French Onion Soup", note: "Crock, crust, and a lot of cheese." },
    { name: "Philly Cheese Steak" },
    { name: "Pasta Puttanesca" },
    { name: "Pan-Seared Chicken Sandwich" },
    { name: "Totachos", note: "Tots where the nachos should be. Trust it." },
  ],
  cocktails: [
    { name: "The Iron Nail", note: "There's a story behind the name. Ask your bartender.", feature: true },
    { name: "Sal's Old Fashioned", note: "The house pour. The way it should be." },
    { name: "Ginja Ninja", note: "Crowd favorite. 818 Reposado and ginger liqueur." },
    { name: "The Cobblestone Buck", note: "Spiced rum, lime, ginger beer. Named for the street." },
    { name: "Sal's Margarita", note: "No mix, no shortcuts." },
    { name: "Green Tea Gimlet", note: "Cool, clean, a little unexpected." },
  ],
} as const;
```

**Verify:** import `site.name` into `page.tsx`, render it, `npm run build` passes type check.

---

## Task 3 — Design tokens (globals.css)

**Objective:** lay the full token layer from `DESIGN.md §3`.

**File:** `src/app/globals.css`
- Paste the **entire** `:root` block from `DESIGN.md §3` (primitive + semantic), spacing, radius, shadows, type scale, motion, z, layout.
- Base: `html{scroll-behavior:smooth}`, body `background:var(--color-bg); color:var(--color-text); font-family:var(--font-switzer)`.
- Utilities: `.container`, `.section`, `.visually-hidden`, `.skip-link`.
- `:focus-visible { outline:2px solid var(--brass); outline-offset:2px }` — never remove.
- `@media (prefers-reduced-motion: reduce)` kill-switch (durations → .01ms).

**Verify:** `npm run build`; no CSS errors. Confirm **no `#000000`** anywhere: `grep -ri "#000\b\|#000000\|black;" src/`.

---

## Task 3b — Fonts (next/font)

**Objective:** load Zodiak (display) + Switzer (body), set CSS variables.

**Steps**
1. Fontshare isn't on `next/font/google`. Use `next/font/local` with downloaded Zodiak (400/600/700) + Switzer (400/500/600) woff2 placed in `src/app/fonts/`, OR a `<link>` to `https://api.fontshare.com/v2/css?f[]=zodiak@600,700&f[]=switzer@400,500,600&display=swap` with `preconnect`. Prefer local for performance/no-FOUT.
2. Expose `--font-zodiak`, `--font-switzer`; assign per `DESIGN.md §4` table.

**Verify:** H1 renders in Zodiak, body in Switzer; `font-display: swap`; Lighthouse shows no render-blocking font. Only 2 families load.

---

## Task 4 — Core components

**Objective:** custom components per `DESIGN.md §5`. No generic cards.

**Files:** `src/components/{TavernButton,BrassPlate,MenuBoardCard,StoryStamp,InfoChip,SectionDivider}/` (each `.tsx` + `.module.css`), plus `src/hooks/useReveal.ts`.

**Requirements**
- `TavernButton`: `variant: "primary"|"outline"|"ghost"`, renders `<a>` or `<button>`; fill-wipe hover, 48px min height, brass focus ring.
- `BrassPlate`: dark-gradient surface, brass border, inset top highlight, optional corner dots.
- `MenuBoardCard`: `variant: "paper"|"dark"`; label/title/note slots; hover lift+tilt (paper) / brass-rule grow (dark).
- `StoryStamp`: rose outline, −4deg, uppercase.
- `InfoChip`: pill, optional status dot.
- `SectionDivider`: brass hairline that scales-in via `useReveal`.
- `useReveal`: IntersectionObserver, adds `.in` once; respects reduced-motion.

**Verify:** temporarily mount all on `page.tsx`; Tab through — every interactive element has a visible focus ring; no clickable `<div>`s.

---

## Task 5 — Header

**File:** `src/components/Header/Header.tsx` (`"use client"` for scroll state).
- Mobile: logo + `Call`/`Directions` icon buttons + `Menu` anchor sheet.
- Desktop: `Menu · Drinks · Visit` with brass underline wipe; `Call`/`Directions` filled.
- Transparent over hero → `--char` backdrop + hairline after ~80px scroll.

**Verify:** anchors jump to `#menu`/`#drinks`/`#visit`; phone is `tel:+15182055097`; Directions opens `site.mapsUrl`. Keyboard reachable; menu sheet traps focus.

---

## Task 6 — Hero

**File:** `src/sections/Hero.tsx`. Copy from `BRIEF.md §7 / Hero`.
- Ghost word `TAVERN` (`--fs-ghost`, opacity .06) behind logo.
- `next/image` logo, `priority`, explicit 1500×861 (scaled), alt from `BRIEF.md`.
- Eyebrow → H1 `Pull up a chair.` → subhead → CTAs (`View the Menu`/`Get Directions`/`Call Sal's`) → InfoChips.
- Background: radial `--espresso→--ink` + `--glow-beer`; brass corner brackets.
- Load stagger per `DESIGN.md §7`.

**Verify:** at 390px no horizontal scroll; logo + H1 fit; hero image **not** lazy-loaded; LCP element is H1 or logo and paints fast.

---

## Task 7 — Visit strip ("Today at Sal's")

**Files:** `src/sections/VisitStrip.tsx`, `src/lib/hours.ts`.
- `hours.ts`: `getToday(hours)` and `isOpenNow(hours, date)` → status string ("Open now · until 10pm" / "Open Thursday–Sunday" fallback). Compute client-side to avoid SSR/timezone hydration mismatch (render static fallback on server, enhance on mount).
- BrassPlate; desktop one row, mobile 2×2. Status · hours-today · address · Call/Directions.

**Verify:** links tappable (≥44px); contrast passes; no hydration warning in console.

---

## Task 8 — Food signboard

**File:** `src/sections/FoodSignboard.tsx`. `id="menu"`.
- Label `From the Kitchen`, H2 `Tavern food, done right.`
- Feature = `site.food.find(f => f.feature)` → MenuBoardCard paper + StoryStamp.
- Remaining items in asymmetric bento (`grid-template-columns: 2fr 1fr 1fr`, feature spans 2 rows); mobile vertical stack, smash burger first.
- Specials line: `Specials change weekly. Follow along on Facebook.`

**Verify:** **not** a 3-equal-column SaaS row; mobile order logical; cards aren't generic white.

---

## Task 9 — Cocktail rail

**File:** `src/sections/CocktailRail.tsx`. `id="drinks"`. (`"use client"` if drag added.)
- Label `From the Bar`, H2 `Cocktails with a story.`
- Feature = The Iron Nail, highlighted (dark MenuBoardCard, rose spark).
- Horizontal scroll + `scroll-snap-type: x mandatory` on mobile; desktop shows 3–4 with an off-screen cue.

**Verify:** all cards keyboard-reachable; rail does **not** cause body-level horizontal overflow (wrap in `overflow-x` container); snap works.

---

## Task 10 — Welcome

**File:** `src/sections/Welcome.tsx`.
- Editorial split: Zodiak-italic pull-quote left, supporting line right. Copy from `BRIEF.md §7 / Welcome`. Street/address motif, no fake owner bio.

**Verify:** zero AI clichés (grep the banned list from `BRIEF.md §6`).

---

## Task 11 — Visit / Location (conversion)

**File:** `src/sections/Location.tsx`. `id="visit"`.
- H2 `24 Classic Street.` + city line.
- Hours table from `site.hours`, tabular nums; Saturday shows a small `[CONFIRM]` note until verified (visible internally, replace before launch).
- Actions: `Call 518-205-5097` (`tel:`), `Get Directions` (`site.mapsUrl`), `Follow on Facebook`.
- Email only if `site.showEmail` (default false).
- Styled static map block (CSS, no API key) — a stylized street label, not an embed, until a key is added.

**Verify:** phone dials on mobile; directions opens maps; Saturday note present until confirmed.

---

## Task 12 — Footer

**File:** `src/components/Footer/Footer.tsx`. Semantic `<footer>`.
- Logo/wordmark · `Come hungry. Stay awhile.` · `Open Thursday–Sunday` · address · phone · Facebook · `© Sal's Tavern · Built by Ornate Werks`. No 4-column link farm.

**Verify:** descriptive link labels (no "click here"); landmark present.

---

## Task 13 — Assemble homepage

**File:** `src/app/page.tsx` — order: Header → Hero → VisitStrip → FoodSignboard → CocktailRail → Welcome → Location → Footer. Wrap content in `<main id="main">`.

**Verify**
```bash
npm run build && npm run dev
```
Inspect at **320 / 390 / 768 / 1440**. No horizontal scroll at 320/390 (except contained cocktail rail). Tab through entire page.

---

## Task 14 — Metadata, SEO, favicons, OG

**Files:** `src/app/layout.tsx` (Metadata API + JSON-LD), `src/app/sitemap.ts`, `src/app/robots.ts`, `public/` icons + `og.png`.

- `metadata`: title/description/OG/Twitter from `BRIEF.md §7 / meta`. `metadataBase` set.
- **JSON-LD** `BarOrPub`: name, address (PostalAddress), telephone, `openingHoursSpecification` from `site.hours`, url, servesCuisine: ["American","Bar Food"], priceRange "$$".
- Favicons: generate from the logo (cream mark on `--ink`). `icon.svg`, `apple-touch-icon.png`, `favicon.ico`, `manifest`.
- **OG card** `public/og.png` (1200×630): logo + `Pull up a chair.` + `Hoosick Falls, NY` on `--ink`/brass. Build as a static export of an `app/opengraph-image.tsx` (next/og) so it's generated, not hand-painted, and stays on-brand.

**Verify:** `view-source` shows populated meta + JSON-LD; validate JSON-LD in Google Rich Results test; Lighthouse SEO ≥ 90.

---

## Task 15 — Accessibility & performance pass (Ship Gate)

Walk `CLAUDE.md` Ship Gate top to bottom. Hard checks:
- No `#000000`; no lorem; all images alt'd; focus rings visible; full keyboard nav; targets ≥44px; no 320px horizontal scroll; `prefers-reduced-motion` honored.
- Semantic h1→h6, one h1; `nav`/`main`/`footer` landmarks; skip-link first focusable.

```bash
npm run build && npm start
# new terminal:
npx lighthouse http://localhost:3000 --preset=desktop --view
npx lighthouse http://localhost:3000 --preset=mobile --view
```
**Targets (record actual numbers before calling it ready):** mobile Performance ≥ 85 (aim 90+), SEO ≥ 90, Accessibility ≥ 90, LCP < 2.5s, CLS < 0.05. If anything fails, fix before handoff or surface the trade-off per `CLAUDE.md`.

---

## Task 16 — Figma concept board (design review, parallel/optional)

**Status:** Figma MCP authoring tools ARE available (`create_new_file`, `use_figma`, `upload_assets`). In this session the write path was permission-gated and the file was not created — see `DESIGN.md §10` for the exact 5-step generation sequence and the manual fallback. This task does **not** block the website build.

**When unblocked:** create `Sal's Tavern — Concept (Ornate Werks)`, build frames `00–04` per `DESIGN.md §9`, real copy from `BRIEF.md §7`, tokens from `DESIGN.md §3–§4`, logo as a linked component, no-photo comp first. Write the file URL back into `DESIGN.md §10`.

---

## Pre-launch client questions (block launch)

From `BRIEF.md §9` — resolve before going live:
1. Saturday 12pm–10pm? 2. Keep email public? (default: no) 3. Real Facebook page URL. 4. Full menu or highlights? 5. Specials: manual or Facebook-directed? (default: Facebook) 6. Any events/live music/trivia?

## Definition of done

- [ ] Builds clean; no console errors at 320/390/768/1440.
- [ ] Logo used as the hero anchor; **no stock photos, no `#000000`, no lorem**.
- [ ] Copy matches `BRIEF.md §7` verbatim; no AI clichés.
- [ ] Hours/Call/Directions reachable in one glance on mobile.
- [ ] Metadata + JSON-LD + favicons + OG card present and valid.
- [ ] Lighthouse run and **numbers recorded** (mobile Perf ≥85, SEO ≥90, A11y ≥90).
- [ ] Saturday hours + email + Facebook URL confirmed, or flagged at handoff with the shipped defaults.
