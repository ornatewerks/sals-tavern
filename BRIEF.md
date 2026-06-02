# Sal's Tavern — Brief

> Source of truth for positioning, voice, decisions, and copy. The design system lives in `DESIGN.md`; the build sequence lives in `docs/plans/nextjs-implementation-plan.md`. If copy and code disagree, this file wins.

---

## 1. The one sentence

A Hoosick Falls corner tavern, given the website a steakhouse three towns over wishes it had — dark, warm, brass-edged, and built to turn a phone screen into a phone call.

## 2. What we are actually selling

Not "dining." Not "experience." We're selling the decision to drive to 24 Classic Street tonight instead of staying home. Every screen has one job: make a stranger trust the place and a regular feel seen.

The brief from Will: **small-town bar, six-figure website.** That tension is the whole concept. We are NOT sanding the tavern down into a white-tablecloth restaurant. We are taking the things a tavern already has — the engraved sign, the amber light, the burger people drive in for, the cocktail with a story — and giving them the typography, spacing, and restraint of an expensive brand. Cheap bar, expensive frame.

## 3. Positioning — say this, not that

| We are | We are not |
|---|---|
| The neighborhood tavern on Classic Street | A "gastropub" or "eatery" |
| Smash burgers and cocktails with a story | Farm-to-table, chef-driven, curated |
| Open Thursday through Sunday, and worth the trip | Open for brunch, here for your journey |
| Confident and plainspoken | Cute, quirky, or apologetic |
| A real place with real regulars | A brand cosplaying as a small business |

**The differentiation line (internal):** Every other bar website in a 30-mile radius is either a Facebook page or a default Squarespace block. The win condition is that Sal's is the one that looks like someone *decided* every pixel.

## 4. Audiences, in priority order

1. **The phone-in-hand local, 5:40pm, deciding on dinner.** Needs in 10 seconds: open tonight? what do I order? how far? They convert with **Call** and **Directions**, not paragraphs. This visitor is ~70% of traffic and 100% of the design priority.
2. **The weekend traveler / out-of-towner.** Needs confidence and a vibe read: is this a real local spot or a tourist trap? Won the moment the hero loads — the sign does the talking.
3. **The Facebook regular.** Already follows the day-to-day. The site is the polished front door that makes them proud to share it, and it routes them *back* to Facebook for this week's specials rather than competing with it.

## 5. Current site — the audit

Live: `https://www.salstavern.com/` (Squarespace, single page, stock template).

**Keep (brand equity, don't touch):**
- The ornate **Sal's Tavern** mark — clinking amber mugs, two red roses, black scrollwork. This is the crown jewel and the entire visual anchor. (See `public/assets/sals-logo.png`, 1500×861.)
- The plainspoken local voice and the specialty cocktail names — especially **The Iron Nail**.
- Radical simplicity of information: menu highlights, drinks, hours, address, phone. We keep the simplicity; we lose the bareness.

**Fix (what makes it read as unfinished):**
- Logo floats on a flat dark field with no composition around it — looks like a placeholder, not a hero.
- Zero hierarchy. Menu, drinks, hours, and contact all sit at the same visual weight, so nothing leads.
- No headline, no reason-to-visit, no first sentence that sounds like a person.
- Hours render confusingly (Saturday shows as `12am / 12am–10pm`); almost certainly **12pm–10pm** — must confirm before launch.
- The social icon points to **Twitter**, but the live channel is **Facebook**. Wrong front door.
- No SEO structure, no metadata, no schema — the place is effectively invisible to "bars near me / open now."
- Everything centered and stacked. Symmetry reads as a template; we replace it with asymmetric signboard composition.

## 6. Voice

**Plainspoken, local, confident. Sounds like the bartender, not the brochure.**

Sentence test: would Sal say it out loud to someone on a stool? If not, cut it.

**On-brand, use freely:**
- "Pull up a chair."
- "Smash burgers, cold drinks, and cocktails with a story."
- "The neighborhood tavern on Classic Street."
- "Come hungry. Stay awhile."
- "Ask about The Iron Nail."
- "Famous for a reason."

**Banned — Sal's would never say:**
- Elevate, elevated, curated, artisanal, crafted, handcrafted
- Culinary experience, dining destination, journey, seamless, unforgettable
- "Where tradition meets innovation"
- "Nestled in the heart of"
- Any sentence with an em-dash trying to sound profound about food
- Exclamation points stacked for fake energy

**Punctuation/style:** Periods, not exclamation points. Short declaratives. Lowercase headlines are fine where it reads warm. Never ALL-CAPS a full sentence — caps are for short signage labels only.

---

## 7. Homepage copy deck — final, exact, build from this

> This is the copy of record. No Lorem Ipsum, no "TBD" shipping to the client. Anything genuinely unconfirmed is flagged `[CONFIRM]` and must be resolved (Section 9) before launch — do not invent a value to fill it.

### Document / meta
- **`<title>`:** `Sal's Tavern — Smash Burgers & Cocktails | Hoosick Falls, NY`
- **Meta description:** `The neighborhood tavern on Classic Street in Hoosick Falls. Smash burgers, comfort food, and specialty cocktails — open Thursday through Sunday. Call 518-205-5097.`
- **OG title:** `Sal's Tavern — Hoosick Falls, NY`
- **OG description:** `Pull up a chair. Smash burgers, cold drinks, and cocktails with a story on Classic Street.`
- **Logo alt text:** `Sal's Tavern — engraved sign with two clinking amber beer mugs and red roses`

### Header / nav
- Wordmark: `Sal's Tavern` (or logo mark at small size)
- Links: `Menu` · `Drinks` · `Visit`
- Persistent actions: `Call` · `Directions`

### 1 — Hero
- Eyebrow: `Hoosick Falls, New York · Est. on Classic Street`
- Ghost word behind logo (oversized, low-opacity): `TAVERN`
- H1: `Pull up a chair.`
- Subhead: `Smash burgers, cold drinks, specialty cocktails, and small-town nights on Classic Street.`
- Primary CTA: `View the Menu`
- Secondary CTA: `Get Directions`
- Tertiary CTA (mobile-forward): `Call Sal's`
- Info chips: `Smash Burgers` · `Specialty Cocktails` · `Open Thu–Sun`

### 2 — Today at Sal's (utility strip)
- Label: `Today at Sal's`
- Status (if live status implemented): `Open now · until 10pm` / fallback static: `Open Thursday–Sunday`
- Hours-today line: `Friday · 12pm–10pm` (renders dynamically from the hours data)
- Address: `24 Classic St, Hoosick Falls, NY`
- Phone: `518-205-5097`
- Tap actions: `Call` · `Directions`

### 3 — Food signboard
- Section label: `From the Kitchen`
- Heading: `Tavern food, done right.`
- Feature card — Smash Burgers:
  - Stamp: `Famous for a reason.`
  - Title: `Sal's Famous Smash Burgers`
  - Line: `The one people drive in for. Smashed thin, crisp at the edges, stacked the way a burger should be.`
- Supporting items (title only, from the kitchen list):
  - `Chicken Pot Pie` — `Comfort food, tavern style.`
  - `French Onion Soup` — `Crock, crust, and a lot of cheese.`
  - `Philly Cheese Steak`
  - `Pasta Puttanesca`
  - `Pan-Seared Chicken Sandwich`
  - `Totachos` — `Tots where the nachos should be. Trust it.`
- Specials note: `Specials change weekly. Follow along on Facebook.`

### 4 — Cocktail story rail
- Section label: `From the Bar`
- Heading: `Cocktails with a story.`
- Feature — The Iron Nail:
  - Title: `The Iron Nail`
  - Line: `There's a story behind the name. Ask your bartender — that's the whole point.`
- Rail items:
  - `Sal's Old Fashioned` — `The house pour. The way it should be.`
  - `Ginja Ninja` — `Crowd favorite. 818 Reposado and ginger liqueur.`
  - `The Cobblestone Buck` — `Spiced rum, lime, ginger beer. Named for the street.`
  - `Sal's Margarita` — `No mix, no shortcuts.`
  - `Green Tea Gimlet` — `Cool, clean, a little unexpected.`

### 5 — Welcome / about block
- Section label: `The Place`
- Pull-quote (large serif): `Burgers on the table, a cold drink in reach, and somebody nearby with a story worth hearing.`
- Supporting line: `Sal's is the neighborhood tavern on Classic Street — the kind of place you know before you walk in. Come hungry. Stay awhile.`

### 6 — Visit / hours + location (the conversion block)
- Section label: `Find Us`
- Heading: `24 Classic Street.`
- Sub: `Hoosick Falls, NY 12090`
- Hours table:
  - `Monday — Closed`
  - `Tuesday — Closed`
  - `Wednesday — Closed`
  - `Thursday — 4pm–9pm`
  - `Friday — 12pm–10pm`
  - `Saturday — 12pm–10pm` `[CONFIRM]`
  - `Sunday — 12pm–7pm`
- Actions: `Call 518-205-5097` (`tel:`) · `Get Directions` (Google Maps) · `Follow on Facebook`
- Email line (pending decision, Section 9): `wintersolsticehg@gmail.com` `[CONFIRM public]`

### 7 — Footer
- Mark: small logo or `Sal's Tavern` wordmark
- Sign-off: `Come hungry. Stay awhile.`
- Hours summary: `Open Thursday–Sunday`
- Contact: address · `518-205-5097` · Facebook
- Fine print: `© Sal's Tavern, Hoosick Falls NY` · `Built by Ornate Werks`

### Reusable microcopy
- Directions link label: `Get Directions` (never "click here")
- Maps query: `Sal's Tavern, 24 Classic St, Hoosick Falls, NY 12090`
- `tel:` target: `+15182055097`
- Empty-photo states: never apologize for missing photos; the typographic treatment is the design, not a placeholder.

---

## 8. Content inventory (canonical data)

### Kitchen
Sal's Famous Smash Burgers · Chicken Pot Pie · Pasta Puttanesca · Totachos · Pan-Seared Chicken Sandwich · French Onion Soup · Philly Cheese Steak

### Bar
Sal's Old Fashioned · The Iron Nail (ask the story) · Ginja Ninja (818 Reposado, ginger liqueur) · Sal's Margarita · The Cobblestone Buck (spiced rum, lime, ginger beer) · Green Tea Gimlet

### Hours
Closed Mon–Wed · Thu 4pm–9pm · Fri 12pm–10pm · Sat 12pm–10pm `[CONFIRM]` · Sun 12pm–7pm

### Contact
24 Classic St, Hoosick Falls, NY 12090 · `518-205-5097` · `wintersolsticehg@gmail.com` `[CONFIRM public]` · Facebook: *Sal's Tavern | Hoosick Falls NY*

---

## 9. Decisions needed — with our recommended default

> Each row has a recommended default so the build is **not blocked**. Will/client can override; if no answer comes back, we ship the default and flag it at handoff.

| # | Question | Recommended default (ship this if no answer) |
|---|---|---|
| 1 | Saturday hours — is it 12pm–10pm? | Ship `12pm–10pm` with a `[CONFIRM]` flag; correct on first reply. |
| 2 | Should the Gmail address be public on the site? | **Hide it.** Route contact through Call + Facebook. A public Gmail invites spam and looks unfinished. Re-add only if client insists. |
| 3 | Full menu PDF, or highlights only? | **Highlights only** at launch (what's in Section 8). Add a Menu page when a real menu/PDF exists. |
| 4 | Weekly specials — manual edit, Facebook pull, or "follow Facebook"? | **"Follow Facebook for this week's specials."** Zero-maintenance, honest, routes to the live channel. |
| 5 | Online ordering / reservations / gift cards / events later? | Out of scope for launch. Design leaves room; we add when there's a real need. |
| 6 | Live social channels — Facebook only, or also Instagram? | **Facebook only** until told otherwise. Remove the stray Twitter icon from the old site entirely. |
| 7 | Sitemap — one-page anchored, or multi-page? | **One page, anchored** (`#menu`, `#drinks`, `#visit`). Split to a Menu page only when a full menu lands. |

## 10. Photography stance

No real photos exist. We do **not** buy stock and we do **not** fake a "diverse crowd at a bar." The concept is **photo-free on purpose** — the engraved sign, the type, and the warm dark surfaces carry it. If it ever looks empty, that's a layout problem to fix in design, not a reason to drop in stock.

**Upgrade path when real photos arrive** (priority order): exterior at dusk with window glow → the smash burger close-up → a cocktail on the bar in warm light → the specials board → wide interior with regulars. These slot into existing surfaces without changing the system (see `DESIGN.md` → *Later photography*).

## 11. Definition of "good first review"

Will or the client looks at it and says: **"That still feels like Sal's — but it finally looks like somebody took the place seriously."**

And on a phone, in under 10 seconds, a stranger can answer:
1. What kind of place is this?
2. What do I order?
3. Are they open?
4. How do I call or get there?

If any of those four take longer than a glance, the homepage isn't done.
