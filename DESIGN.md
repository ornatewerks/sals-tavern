# Sal's Tavern — Design System

> Visual source of truth. Copy lives in `BRIEF.md`; build order in `docs/plans/nextjs-implementation-plan.md`. Tokens here are the contract — the CSS in the build must match these values exactly.

---

## 1. Thesis

**Small-town tavern, agency-grade execution.** The site should feel like the engraved Sal's sign came off the wall and learned typography: dark lacquered wood, amber beer light, brass edgework, one rose-red accent, and enough negative space to feel expensive. No photos yet — so the type, the logo, and the surfaces do all the work. Restraint is the luxury signal. We use *one* ornate thing (the logo) and keep everything around it disciplined.

### Intensity dials (locked)
- **VARIANCE: 6/10** — asymmetric signboards, offset headers, a feature-card bento. Collapses to clean single-column on mobile.
- **MOTION: 4/10** — slow reveals, a brass line that draws in, a one-time logo warm-up. No scroll-hijack, no parallax circus.
- **DENSITY: 4/10** — comfortable, generous gaps. The expensive feel comes from air, not packing.

---

## 2. Color — verified against the real logo

I read the palette off `public/assets/sals-logo.png` directly, not off any filename. What the mark actually contains:
- **Engraved lettering:** near-black warm brown with a cream outer stroke — *not* pure black.
- **Beer in the mugs:** a golden honey **amber**, lighter at the foam line.
- **Foam:** warm off-white cream.
- **Roses:** a true, slightly cool **red** (not orange-red, not maroon) with darker red shadow.
- **Scrollwork:** the same near-black as the lettering.

That maps cleanly to the palette below. **Stated back for sign-off: dark wood + cream type + amber beer glow + brass linework, with rose red used only as a spark.** If that reading is wrong, fix it here before any code lands.

```css
:root {
  /* ---- Primitive palette (raw, never used directly in components) ---- */
  --ink:        #120e0b;  /* primary off-black — warm, not neutral */
  --char:       #1a1410;  /* charred tavern wall */
  --espresso:   #2a1d14;  /* dark lacquered wood */
  --walnut:     #4b2f1f;  /* warm wood detail / raised surface */
  --foam:       #f6efe2;  /* warm cream — primary text on dark */
  --paper:      #ead9bf;  /* aged menu paper — card surface */
  --brass:      #c59a4a;  /* premium linework + labels */
  --brass-lo:   #9d7836;  /* brass shadow / pressed state */
  --beer:       #d88b2d;  /* amber glow — warm accent, CTAs */
  --rose:       #b8232f;  /* logo rose — the one spark */
  --rose-dark:  #711922;  /* rose shadow */
  --muted:      #a99782;  /* secondary text on dark */
  --subtle:     #6f6253;  /* tertiary text / disabled */
}
```

**No `#000000` anywhere.** Darkest allowed surface is `--ink` (#120e0b).

### 60 / 30 / 10
- **60% dark wood** — `--ink` / `--char` / `--espresso` backgrounds.
- **30% cream + brass** — text and linework (`--foam`, `--paper`, `--brass`).
- **10% warm accent** — `--beer` for action, `--rose` for a single spark per screen (stamps, The Iron Nail). Rose is a seasoning; if it appears more than twice per viewport, cut one.

### Contrast (WCAG AA — verified intent)
- `--foam` on `--ink` ≈ 13:1 ✓ (body and headlines)
- `--muted` on `--ink` ≈ 5.4:1 ✓ (secondary text — keep ≥16px)
- `--brass` on `--ink` ≈ 6.8:1 ✓ (labels, large only is fine but it passes for normal too)
- `--espresso` text on `--paper` ≈ 9:1 ✓ (menu-card body)
- Primary button: `--ink` text on `--beer` fill ≈ 7:1 ✓
- **Do not** put `--rose` text on `--ink` for body (≈3.8:1 — fails normal text). Rose is for large/graphic use only.

---

## 3. Design tokens (layered — primitive → semantic)

The build's `globals.css` must define this entire layer system. Components reference **semantic** tokens only.

```css
:root {
  /* ===== SPACING (4px base) ===== */
  --space-1: .25rem;  --space-2: .5rem;   --space-3: .75rem;  --space-4: 1rem;
  --space-5: 1.25rem; --space-6: 1.5rem;  --space-8: 2rem;    --space-10: 2.5rem;
  --space-12: 3rem;   --space-16: 4rem;   --space-20: 5rem;   --space-24: 6rem;
  --space-32: 8rem;   --space-40: 10rem;

  /* ===== RADIUS — varied on purpose, never uniform ===== */
  --radius-sm: 2px;     /* brass plates, signage — tight, machined */
  --radius-md: 6px;     /* buttons */
  --radius-lg: 14px;    /* menu cards */
  --radius-pill: 999px; /* info chips only */

  /* ===== SHADOWS — tinted warm, never neutral, never a neon glow ===== */
  --shadow-sm: 0 1px 2px rgba(10,7,4,.5);
  --shadow-md: 0 8px 24px -8px rgba(10,7,4,.7);
  --shadow-lg: 0 24px 60px -16px rgba(10,7,4,.8);
  --shadow-inset-brass: inset 0 1px 0 rgba(197,154,74,.28);   /* top brass highlight */
  --glow-beer: 0 0 80px -20px rgba(216,139,45,.45);           /* hero ambient only */

  /* ===== BORDERS ===== */
  --line:        rgba(246,239,226,.16);  /* hairline divider on dark */
  --line-brass:  rgba(197,154,74,.45);   /* brass edge */
  --line-paper:  rgba(42,29,20,.18);     /* divider on paper */

  /* ===== TYPE SCALE (fluid; clamp min/preferred/max) ===== */
  --fs-eyebrow: .8125rem;                              /* 13px, tracked caps */
  --fs-body:    clamp(1rem, .95rem + .25vw, 1.125rem); /* 16–18 */
  --fs-lead:    clamp(1.25rem, 1.1rem + .8vw, 1.6rem);
  --fs-h3:      clamp(1.5rem, 1.2rem + 1.6vw, 2.25rem);
  --fs-h2:      clamp(2rem, 1.4rem + 3vw, 3.75rem);
  --fs-h1:      clamp(3.25rem, 1.5rem + 9vw, 8.5rem);  /* hero "Pull up a chair." */
  --fs-ghost:   clamp(6rem, 4rem + 16vw, 18rem);       /* "TAVERN" backdrop word */

  /* ===== MOTION ===== */
  --ease-out:    cubic-bezier(.16, 1, .3, 1);   /* default reveal */
  --ease-inout:  cubic-bezier(.65, 0, .35, 1);
  --dur-fast: 180ms; --dur-base: 420ms; --dur-slow: 700ms; --dur-ambient: 1400ms;

  /* ===== Z-INDEX ===== */
  --z-base: 0; --z-rail: 10; --z-header: 200; --z-overlay: 300; --z-modal: 400;

  /* ===== LAYOUT ===== */
  --container: 1200px;
  --container-wide: 1360px;
  --gutter: clamp(1.25rem, 4vw, 4rem);
  --section-y: clamp(4rem, 3rem + 6vw, 9rem);

  /* ===== SEMANTIC (use THESE in components) ===== */
  --color-bg:          var(--ink);
  --color-surface:     var(--char);
  --color-surface-2:   var(--espresso);
  --color-surface-paper: var(--paper);
  --color-text:        var(--foam);
  --color-text-muted:  var(--muted);
  --color-text-subtle: var(--subtle);
  --color-label:       var(--brass);
  --color-action:      var(--beer);
  --color-action-text: var(--ink);
  --color-spark:       var(--rose);
  --color-border:      var(--line);
  --color-border-edge: var(--line-brass);
}
```

---

## 4. Typography — locked, two faces only

**Decision: two typefaces. Zodiak for display, Switzer for everything else.** The logo already carries all the ornament the page can afford; a third decorative or script face would tip into theme-restaurant kitsch and break the "max 2–3 fonts" vintage gate. Hierarchy comes from weight, size, color, and tracking — not from adding fonts.

| Role | Face | Weight | Size | Treatment |
|---|---|---|---|---|
| H1 (hero) | **Zodiak** | 700 | `--fs-h1` | line-height .85, letter-spacing −.04em, `--foam` |
| H2 (section heads) | **Zodiak** | 600 | `--fs-h2` | line-height .95, −.02em |
| H3 / item titles | **Zodiak** | 600 | `--fs-h3` | line-height 1.05 |
| Pull-quote | **Zodiak** | 500 *italic* | `--fs-h2` | warm cream, generous leading |
| Eyebrow / label | **Switzer** | 600 | `--fs-eyebrow` | UPPERCASE, letter-spacing .2em, `--brass` |
| Lead / subhead | **Switzer** | 400 | `--fs-lead` | line-height 1.4, `--muted` → `--foam` |
| Body | **Switzer** | 400 | `--fs-body` | line-height 1.55 |
| Button label | **Switzer** | 600 | `--fs-body` | letter-spacing .01em |
| Hours / numerals | **Switzer** | 500 | `--fs-body` | `font-variant-numeric: tabular-nums` |

**Why Zodiak:** high-contrast warm serif with real character at display size — it reads "old sign painter who went to design school," which is exactly the small-town-but-expensive brief. It's in Will's approved library. **Why Switzer:** clean neutral grotesque that disappears into readability and never fights the serif. **Banned here:** Inter, Montserrat, gradient-filled headlines, all-caps full sentences.

Loading (Fontshare, single CDN, `font-display: swap`):
```html
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=zodiak@400,500,600,700,1&f[]=switzer@400,500,600&display=swap" rel="stylesheet">
```
Subset to Latin. Preload only the Zodiak 700 used by the hero H1.

> **Optional documented upgrade (not for launch):** a single condensed signage face (e.g. a grotesque condensed) for the utility-strip labels could add menu-board authenticity. Hold it — two faces ships tighter and passes the gate. Revisit only if the client asks for more "bar sign" texture.

---

## 5. Components — specs with states

All components are custom. No Bootstrap card (border + shadow + white) anywhere. Every surface earns its treatment.

### TavernButton
- **primary:** `--beer` fill, `--ink` text, `--shadow-sm`. Hover: amber→brass fill **wipe** left-to-right (`--dur-fast`), translateY(−1px). Active: translateY(0), `--brass-lo` fill.
- **outline:** transparent, 1px `--line-brass` border, `--foam` text. Hover: fill wipes to `rgba(197,154,74,.12)`, border brightens.
- **ghost:** text only, `--foam`, with an underline that slides in from left on hover.
- Min height **48px**, horizontal padding `--space-6`, radius `--radius-md`. Focus: 2px `--brass` outline, 2px offset (never removed).

### BrassPlate
The signature surface — "brass plate screwed into dark wood." Used for the utility strip and the hours block.
- Fill: `linear-gradient(180deg, rgba(43,29,20,.9), rgba(18,14,11,.92))`.
- Border: 1px `--line-brass`; top edge `--shadow-inset-brass` highlight.
- Radius `--radius-sm` (tight/machined). Optional 4 corner "screw" dots in `--brass-lo` at 3px.
- Inner padding `--space-6`.

### MenuBoardCard
Two variants:
- **paper** (default food items): `--paper` surface, `--espresso` text, `--line-paper` hairline, slight `--shadow-md`, radius `--radius-lg`. Reads like an aged menu insert pinned to the wall. Hover: lifts 2px + rotates **−0.6deg**.
- **dark** (cocktails): `--char` surface, `--foam` title, `--muted` note, 1px `--line-brass` left edge only (a "rule" down the side). Hover: the brass left-rule grows from 1px→2px and brightens.
- Structure: top label (brass caps) → title (Zodiak) → note (Switzer muted).

### StoryStamp
Small angled red stamp for unique claims ("Famous for a reason.", "Ask the story").
- `--rose` text + 1.5px `--rose` border, transparent fill, rotated **−4deg**, uppercase Switzer 600, tracking .12em, padding `--space-2`/`--space-3`. Slightly distressed opacity (.9). One per section, max.

### InfoChip
Hero chips ("Smash Burgers", "Open Thu–Sun").
- Pill (`--radius-pill`), 1px `--line`, `--muted` text, `--space-2`/`--space-4` padding. A small `--beer` dot before "Open" status. Decorative only — not links.

### SectionDivider
A brass hairline that **draws in** on scroll, with a single small scrollwork glyph centered (a simplified echo of the logo's flourish, *not* the logo pasted). Never repeat the full logo ornament as a texture.

### Header
- Mobile: compact bar — small logo left, `Call`/`Directions` icon-buttons right, `Menu` opens an anchor sheet. Actions are always one tap away.
- Desktop: logo left, `Menu · Drinks · Visit` center-right with a brass underline that wipes in on hover, `Call`/`Directions` as the only filled buttons.
- Transparent over hero; gains a `--char` backdrop + hairline bottom border after ~80px scroll.

---

## 6. Homepage layout — wireframe + measurements

One long, confident scroll. Asymmetric where it earns it; centered only where the logo demands it (hero).

```
┌─ HEADER ──────────────────────────────────────────────┐  sticky, transparent→char
│  [logo]                      Menu  Drinks  Visit  [Call][Directions]
└───────────────────────────────────────────────────────┘

┌─ 1 HERO ─ ~92vh ──────────────────────────────────────┐  bg: radial espresso→ink, --glow-beer top
│            ░░░░░  T A V E R N  (ghost word) ░░░░░       │  --fs-ghost, opacity .06, behind
│                    [ Sal's logo — large ]              │  centered, max-width 520px
│        Hoosick Falls, NY · Est. on Classic Street      │  eyebrow, brass
│                  Pull up a chair.                      │  H1 Zodiak --fs-h1
│   Smash burgers, cold drinks, specialty cocktails…     │  lead, max 46ch
│      [ View the Menu ]  [ Get Directions ]  Call Sal's │  primary / outline / ghost
│      • Smash Burgers   • Specialty Cocktails  • Thu–Sun│  InfoChips
│            ⌐ brass corner brackets at frame ¬          │
└───────────────────────────────────────────────────────┘

┌─ 2 TODAY AT SAL'S — BrassPlate, overlaps hero −40px ──┐
│  TODAY AT SAL'S | Open now · until 10pm | 24 Classic St | [Call][Directions]
└───────────────────────────────────────────────────────┘   desktop: 1 row · mobile: 2×2 grid

┌─ 3 FOOD SIGNBOARD ─ asymmetric bento ─────────────────┐
│  From the Kitchen                                      │  label, offset left
│  Tavern food, done right.                              │  H2
│  ┌───────── FEATURE ─────────┐ ┌─ card ─┐ ┌─ card ─┐   │  grid: 2fr 1fr 1fr
│  │ [stamp: Famous for a       │ │Chicken │ │French  │   │  feature spans 2 rows
│  │  reason.]                  │ │Pot Pie │ │Onion   │   │
│  │ Sal's Famous Smash Burgers │ └────────┘ └────────┘   │
│  │ The one people drive in for│ ┌─ card ─┐ ┌─ card ─┐   │
│  └────────────────────────────┘ │Philly  │ │Totachos│   │
│  Specials change weekly. Follow on Facebook.           │
└───────────────────────────────────────────────────────┘

┌─ 4 COCKTAIL RAIL ─ dark cards, horizontal ────────────┐
│  From the Bar — Cocktails with a story.                │
│  ┌── THE IRON NAIL (feature) ──┐  ┌Old Fashioned┐ ┌Ginja│ →  horizontal scroll/snap
│  │ Ask your bartender.          │  └─────────────┘ └────  │   desktop: 3–4 in view, offset cue
└───────────────────────────────────────────────────────┘

┌─ 5 WELCOME — editorial split ─────────────────────────┐
│  The Place        │  "Burgers on the table, a cold      │  quote left (7 col),
│                   │   drink in reach…" — Zodiak italic  │  note right (5 col)
└───────────────────────────────────────────────────────┘

┌─ 6 VISIT — conversion, BrassPlate hours ──────────────┐
│  Find Us — 24 Classic Street.   │  ┌ Hours table ─────┐ │
│  Hoosick Falls, NY 12090        │  │ Thu  4–9          │ │  tabular nums
│  [Call 518-205-5097]            │  │ Fri  12–10        │ │
│  [Get Directions][Facebook]     │  │ Sat  12–10*       │ │  * = [CONFIRM] note
│  (styled static map block)      │  └──────────────────┘ │
└───────────────────────────────────────────────────────┘

┌─ 7 FOOTER ────────────────────────────────────────────┐
│  [logo sm]   Come hungry. Stay awhile.                 │
│  Open Thu–Sun · 24 Classic St · 518-205-5097 · Facebook│
│  © Sal's Tavern · Built by Ornate Werks                │
└───────────────────────────────────────────────────────┘
```

**Grid:** 12-col, `--container` 1200px, `--gutter` clamp. Section vertical rhythm `--section-y`. Vary padding between sections (don't repeat the same value) so the scroll breathes unevenly — wider air around hero and welcome, tighter around the utility strip.

**Mobile (≤768px):** every asymmetric block collapses to single column. Order: Hero → Today strip → Smash Burger feature first, then food stack → cocktail rail (horizontal snap stays) → Welcome → Visit (Call + Directions buttons pinned high) → Footer. No horizontal scroll at 320px except the intentional cocktail rail (which must not cause body overflow — contain it).

---

## 7. Motion spec (MOTION 4/10)

Bar atmosphere, not SaaS. Everything respects `prefers-reduced-motion`.

| Element | Motion | Timing |
|---|---|---|
| Hero load | logo fades + `--glow-beer` warms up once, eyebrow→H1→lead→CTAs stagger up 12px | `--dur-slow`, stagger 80ms, `--ease-out` |
| Section reveals | content rises 16px + fades on enter (IntersectionObserver, once) | `--dur-base`, `--ease-out` |
| SectionDivider | brass hairline scales x 0→1 from center; glyph fades | `--dur-slow` |
| Buttons | fill wipe + 1px lift | `--dur-fast` |
| Menu cards | lift 2px + ≤0.6deg tilt on hover | `--dur-fast` |
| Cocktail rail | smooth drag/scroll with snap; no auto-advance | native + snap |
| Header | backdrop fade-in after 80px | `--dur-base` |

**Banned motion:** bouncy springs on UI, parallax layers, spinning objects, scroll-hijack, animated "scroll down" indicator, gradient shimmer. Reduced-motion: all of the above become instant; only opacity remains.

---

## 8. Responsive

- Mobile-first, fluid via `clamp()` so breakpoints are few.
- Breakpoints where layout actually breaks: `40em` (stack→side-by-side), `60em` (bento/rail expand), `80em` (container max).
- Touch targets ≥44px; hero CTAs stack full-width on mobile.
- Utility strip sits directly under hero content on mobile so hours/call/directions are reachable without scrolling far.
- Container queries for cards so they respond to their slot, not just the viewport.

---

## 9. Figma concept board — frame & layer plan

> Status of the live file is recorded in **§10**. This section is the spec the board is built to, whether authored via MCP or by hand.

**File name:** `Sal's Tavern — Concept (Ornate Werks)`
**Canvas:** dark `#120e0b` background (never pure black). Page: `Concept v1`.

| Frame | Size | Contents |
|---|---|---|
| `00 Cover / Mood` | 1440×1024 | Logo asset placed, one-line direction, palette swatches (all 12 tokens labeled with hex), Zodiak+Switzer specimen, dial readout (V6 / M4 / D4). |
| `01 Home / Desktop` | 1440×(auto, ~5200) | Full homepage hero→footer using **real copy from BRIEF.md §7**. No lorem. |
| `02 Home / Mobile` | 390×(auto, ~3400) | Mobile flow; sticky Call/Directions behavior described in a note layer. |
| `03 Components` | 1440×1400 | TavernButton (primary/outline/ghost + hover + focus), BrassPlate, MenuBoardCard (paper+dark), StoryStamp, InfoChip, CocktailCard, SectionDivider. |
| `04 Tokens` | 1440×1200 | Color styles, type styles, spacing scale, radius/shadow/easing reference. Bound as Figma variables where possible. |

**Layer naming convention (enforced):**
```
section/hero · section/today · section/food-signboard · section/cocktail-rail
  · section/welcome · section/visit · section/footer
component/tavern-button/primary · component/menu-board-card/smash-burger
  · component/brass-plate/hours · component/story-stamp/famous
token/color/brass · token/type/h1 · token/space/8
```

**Figma rules:** keep the logo as a single linked component (place once, reuse). Build the **no-photo comp first**; any photo zones appear only as clearly-labeled `state/future-photo` placeholders, never as the default. Use Auto Layout for the utility strip and cards so they reflow.

---

## 10. Figma MCP — live file status & next steps

**Capability check (done this session):** the connected Figma MCP *did* expose authoring tools — `create_new_file`, `use_figma` (write designs into Figma), `upload_assets`, `generate_figma_design` — not just read tools. So creating a real concept board from here is technically supported by the toolchain.

**What actually happened (the write path is gated by a permission prompt, not by missing tools):**
1. The MCP write path requires an authenticated-user/plan lookup (`whoami` → `planKey` → `create_new_file`). Every `whoami` attempt returned **"requested permissions… not yet granted"** — the Figma tool permissions are not approved for this agent session, so I did not (could not) write into Will's Figma drafts.
2. The server briefly disconnected and then reconnected mid-session; I retried `whoami` after reconnect and it was **still permission-gated**. The block is the unapproved permission, not tool availability.

**Net result: no Figma file was created.** The board spec in §9 is complete and build-ready; only the live authoring step is outstanding, and it needs nothing more than the Figma MCP permission grant (then the 5 steps below run end-to-end).

**Exact next steps to generate the board:**
1. Re-run this task in a session where the Figma MCP tools are pre-approved (or approve the permission prompt when it appears).
2. The agent will: `whoami` → pick the team/org `planKey` → `create_new_file({ fileName: "Sal's Tavern — Concept (Ornate Werks)", editorType: "design" })` (after loading the mandatory `/figma-create-new-file` skill).
3. `upload_assets` for `public/assets/sals-logo.png` so the mark is a reusable component.
4. Load the mandatory `/figma-use` skill, then `use_figma` to author frames `00`–`04` exactly per §9, pulling copy from `BRIEF.md §7` and tokens from §3–§4.
5. Write the resulting file URL + name back into this section.

**Live file:** [Sal's Tavern — Concept (Ornate Werks)](https://www.figma.com/design/CLAJWZcUxrNzAhm0VkiXAN)

- File key: `CLAJWZcUxrNzAhm0VkiXAN`
- Created via project-scoped Claude Code Figma MCP from `/Users/willkenneedy` using planKey `team::1619065296429727855`.
- Current status: concept board authored on page `Concept v1` with five top-level frames: `00 Cover / Mood`, `01 Homepage / Desktop 1440`, `02 Homepage / Mobile 390`, `03 Components`, `04 Tokens`.
- Note: logo bitmap upload was blocked during MCP authoring, so the Cover uses a typographic logo lockup plus a labeled drop-in note for `public/assets/sals-logo.png`. Figma font stand-ins are Fraunces + Archivo because Zodiak/Switzer were not available in Figma.
**Manual fallback:** open Figma desktop, create the file named above, and hand-build to §9; the layer names and frame list are copy-pasteable.

---

## 11. Later photography (upgrade path, not launch)

When real photos exist they slot into existing surfaces without changing the system. Priority: (1) exterior at dusk, window glow → hero backdrop behind the type; (2) smash burger close-up → feature card; (3) cocktail on the bar, warm light → Iron Nail card; (4) specials board; (5) wide interior with regulars → welcome block. Each replaces a typographic surface 1:1; tokens, type, and layout stay put. Until then, photo-free is the design, not a gap.
