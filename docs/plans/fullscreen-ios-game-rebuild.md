# Sal's Tavern Run Fullscreen iOS Game Rebuild Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Turn the current Sal's Tavern Run web mini-game into a full-screen, iOS-style, highly replayable tavern runner that can be promoted by QR code inside Sal's Tavern.

**Architecture:** Keep the game as a static `game.html` canvas app deployed on Vercel, but refactor the code into clearer systems inside the page first: layout shell, input, game state, entities, scoring, rendering, and leaderboard. Do not introduce a framework unless the static HTML version becomes unmaintainable.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Canvas 2D, Vercel static hosting, Vercel serverless API routes, optional Vercel KV/Redis for global leaderboard.

---

## Current baseline

Current files:

- `game.html` — mobile-first canvas runner with HUD, overlays, leaderboard modal, score submit modal, tap-to-jump, beer collectibles, obstacle spawning, local best score, service worker registration.
- `api/leaderboard.js` — leaderboard read endpoint, currently designed to support KV when environment variables exist.
- `api/submit-score.js` — score submission endpoint with basic validation.
- `manifest.webmanifest` — PWA manifest.
- `service-worker.js` — caches game assets.
- `table-tent-copy.md` — QR/table tent marketing copy.
- `assets/sals-run-qr.png` — QR code pointing to the live game.

Current live game:

```text
https://sals-tavern.vercel.app/game.html
```

## Product target

The upgraded game should feel like a small native iOS arcade game:

- Fullscreen presentation.
- No visible web-page/cabinet wrapper during play.
- HUD overlaid on the canvas.
- Big tap/swipe input area.
- Safe-area handling for iPhone notch / Dynamic Island.
- Start screen, pause screen, game-over screen, leaderboard, and install prompt.
- Addictive scoring: combos, multipliers, near-misses, power-ups, missions.
- Tavern-specific personality, not generic runner art.

## Design principles

1. **Real iOS feel over decorative chrome.** The current cabinet looks nice, but it makes the game feel like a website component. The next version should feel like the page disappeared and the game took over.
2. **Simple controls, more decisions.** Keep it easy for bar patrons: tap, swipe left/right, swipe down. No tiny buttons needed during play.
3. **One-more-run loop.** Combos, missions, and near misses make short runs addictive.
4. **Tavern personality.** Use Sal's/Hoosick Falls details: Classic Street, brick facade, tavern room, stools, kegs, neon signs, smash burgers, wings, golden mug.
5. **No fake social proof.** Leaderboards and scores can be local/fallback until backend is configured; do not fake global winners.

---

## Phase 1: Fullscreen iOS game shell

### Task 1: Backup the current game

**Objective:** Preserve the current working game before refactoring.

**Files:**
- Create: `backups/game-before-fullscreen-ios-rebuild.html`
- Modify: none

**Steps:**

```bash
cp game.html backups/game-before-fullscreen-ios-rebuild.html
git add backups/game-before-fullscreen-ios-rebuild.html
git commit -m "chore: back up current game before fullscreen rebuild"
```

**Verification:**

```bash
test -f backups/game-before-fullscreen-ios-rebuild.html && echo "backup exists"
```

Expected:

```text
backup exists
```

---

### Task 2: Replace cabinet layout with fullscreen app shell

**Objective:** Make `game.html` use the full viewport with canvas as the main visual surface.

**Files:**
- Modify: `game.html`

**Implementation notes:**

Replace the current `.app` grid/cabinet presentation with:

- `html, body` fixed at `width:100%; height:100%; overflow:hidden;`.
- `.game-shell` fixed `inset:0`.
- `canvas#game` absolute/fixed `inset:0; width:100vw; height:100dvh;`.
- `.hud-overlay` fixed at top with safe-area padding.
- `.action-overlay` fixed center for start/game-over/pause.
- `.bottom-hint` fixed at bottom with safe-area padding.

Suggested CSS pattern:

```css
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overscroll-behavior: none;
  touch-action: none;
  background: #071d14;
}

.game-shell {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  background: #071d14;
}

#game {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.hud-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: calc(env(safe-area-inset-top) + 10px) 14px 0;
  pointer-events: none;
}

.hud-overlay button,
.hud-overlay a {
  pointer-events: auto;
}
```

**Verification:**

Run locally:

```bash
python3 -m http.server 8765
```

Open:

```text
http://127.0.0.1:8765/game.html
```

Check:

- Canvas fills the browser viewport.
- No cabinet box is visible.
- HUD floats over the game.
- No page scrolling on mobile preview.

Commit:

```bash
git add game.html
git commit -m "feat: convert game to fullscreen mobile shell"
```

---

### Task 3: Resize canvas for device pixels

**Objective:** Make the canvas render sharply at any viewport size.

**Files:**
- Modify: `game.html`

**Implementation notes:**

Add a resize system:

```js
let viewport = { w: 0, h: 0, dpr: 1 };

function resizeCanvas(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  viewport = { w: rect.width, h: rect.height, dpr };
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 120));
resizeCanvas();
```

Then update rendering to use `viewport.w` and `viewport.h` instead of hardcoded `W = 900` and `H = 620` where possible.

**Verification:**

Open desktop and mobile preview. Expected:

- No stretched canvas.
- No blurry text/shapes.
- Game still draws after resizing.

Commit:

```bash
git add game.html
git commit -m "feat: add responsive high-DPI canvas sizing"
```

---

### Task 4: Update PWA manifest for iOS-style app install

**Objective:** Make the game feel like a home-screen app when installed.

**Files:**
- Modify: `manifest.webmanifest`
- Modify: `game.html`
- Optional create: `public/assets/app-icon-192.png`
- Optional create: `public/assets/app-icon-512.png`

**Implementation notes:**

Set manifest fields:

```json
{
  "name": "Sal's Tavern Run",
  "short_name": "Sal's Run",
  "start_url": "/game.html",
  "scope": "/",
  "display": "fullscreen",
  "orientation": "portrait",
  "background_color": "#071d14",
  "theme_color": "#071d14"
}
```

Add iOS tags in `game.html` head:

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Sal's Run" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="apple-touch-icon" href="/public/assets/app-icon-192.png" />
```

**Verification:**

- Open manifest URL: `/manifest.webmanifest`.
- Browser console has no manifest errors.
- iOS Safari can show Add to Home Screen.

Commit:

```bash
git add manifest.webmanifest game.html public/assets/app-icon-*.png
git commit -m "feat: improve PWA manifest for fullscreen game"
```

---

## Phase 2: Upgrade gameplay to a 3-lane tavern runner

### Task 5: Add lane model

**Objective:** Replace single side-scroller position logic with 3 lanes.

**Files:**
- Modify: `game.html`

**Implementation notes:**

Add lane state:

```js
const laneCount = 3;
let laneWidth = 0;
let laneXs = [];

const player = {
  lane: 1,
  targetLane: 1,
  x: 0,
  y: 0,
  w: 54,
  h: 92,
  vy: 0,
  jumping: false,
  sliding: false,
  slideUntil: 0
};

function updateLanes(){
  laneWidth = viewport.w / laneCount;
  laneXs = [laneWidth * 0.5, laneWidth * 1.5, laneWidth * 2.5];
}
```

Player should smoothly lerp toward `laneXs[player.targetLane]`.

**Verification:**

- Player appears in center lane.
- `player.targetLane = 0/1/2` moves the player to the correct lane.

Commit:

```bash
git add game.html
git commit -m "feat: add three-lane runner model"
```

---

### Task 6: Add swipe controls

**Objective:** Add mobile controls: swipe left/right for lanes, swipe down to slide, tap to jump.

**Files:**
- Modify: `game.html`

**Implementation notes:**

Track pointer start:

```js
let pointerStart = null;

function onPointerDown(e){
  e.preventDefault();
  pointerStart = { x: e.clientX, y: e.clientY, t: performance.now() };
}

function onPointerUp(e){
  if(!pointerStart) return;
  const dx = e.clientX - pointerStart.x;
  const dy = e.clientY - pointerStart.y;
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);

  if(Math.max(adx, ady) < 28){
    requestJump();
  } else if(adx > ady && dx < 0){
    changeLane(-1);
  } else if(adx > ady && dx > 0){
    changeLane(1);
  } else if(ady > adx && dy > 0){
    requestSlide();
  } else if(ady > adx && dy < 0){
    requestJump();
  }
  pointerStart = null;
}
```

**Verification:**

Use browser/mobile preview:

- Tap starts/jumps.
- Swipe left moves left one lane.
- Swipe right moves right one lane.
- Swipe down starts slide animation/state.

Commit:

```bash
git add game.html
git commit -m "feat: add tap and swipe runner controls"
```

---

### Task 7: Add obstacle types by lane

**Objective:** Make obstacles require different responses.

**Files:**
- Modify: `game.html`

Obstacle types:

- `stool` — ground obstacle; jump over or switch lane.
- `keg` — lane blocker; switch lane.
- `neon` — overhead obstacle; slide under.
- `puddle` — ground hazard; switch lane or jump.

Data shape:

```js
obstacles.push({
  type: 'stool',
  lane: Math.floor(Math.random() * 3),
  z: viewport.h + 120,
  w: 58,
  h: 70,
  passed: false
});
```

Use a pseudo-depth `z` or vertical progression if the game becomes an into-the-screen runner. If keeping side-scroller, use `x` plus lane row. Choose one direction and keep it consistent.

Recommended: keep side-scroll for this phase, but render three horizontal lane bands so controls matter without needing full 3D perspective.

**Verification:**

- Obstacles spawn in one of three lanes.
- Collision only happens if player is in same lane and response is wrong.
- Neon only hits if player is not sliding.

Commit:

```bash
git add game.html
git commit -m "feat: add lane-based tavern obstacles"
```

---

### Task 8: Add combo and multiplier scoring

**Objective:** Make collecting beers and clean play feel addictive.

**Files:**
- Modify: `game.html`

Scoring rules:

- Base distance score continues.
- Beer collection increments `combo`.
- 5 combo = 2x multiplier.
- 10 combo = 3x multiplier.
- 20 combo = Happy Hour Mode.
- Missing a beer resets combo to 0.
- Near miss gives +50 and increases combo by 1.

Suggested state:

```js
let combo = 0;
let multiplier = 1;
let happyHourUntil = 0;

function updateMultiplier(){
  multiplier = combo >= 20 ? 4 : combo >= 10 ? 3 : combo >= 5 ? 2 : 1;
}
```

**Verification:**

- HUD shows combo/multiplier.
- Beer collection increases combo.
- Combo changes multiplier.
- Score increases faster when multiplier is high.

Commit:

```bash
git add game.html
git commit -m "feat: add combo and multiplier scoring"
```

---

### Task 9: Add power-ups

**Objective:** Add replay value and more exciting moments.

**Files:**
- Modify: `game.html`

Power-ups:

1. `pretzelShield` — survives one collision.
2. `beerMagnet` — pulls collectible beers toward the player for 8 seconds.
3. `jukeboxSlowMo` — slows speed for 5 seconds.
4. `goldenMug` — rare collectible worth +1000 and combo boost.

Suggested state:

```js
const effects = {
  shield: false,
  magnetUntil: 0,
  slowMoUntil: 0
};
```

**Verification:**

- Shield prevents one crash and disappears.
- Magnet visibly pulls collectibles.
- Slow-mo reduces effective obstacle speed.
- Golden mug gives large score bump.

Commit:

```bash
git add game.html
git commit -m "feat: add tavern power-ups"
```

---

## Phase 3: Premium visual/game-feel pass

### Task 10: Add stage progression

**Objective:** Give the run a sense of place and progression.

**Files:**
- Modify: `game.html`

Stages:

1. `classicStreet` — brick exterior, Classic Street, hanging Sal's sign.
2. `tavernRoom` — bar stools, dark wood, bottles, neon.
3. `kitchenRush` — plates, wings, burger baskets, steam.
4. `lastCall` — darker palette, faster, golden glow.

Stage changes by distance:

```js
function currentStage(){
  if(distance < 1200) return 'classicStreet';
  if(distance < 2600) return 'tavernRoom';
  if(distance < 4200) return 'kitchenRush';
  return 'lastCall';
}
```

**Verification:**

- Background visibly changes as score/distance increases.
- Stage label appears briefly on transition.

Commit:

```bash
git add game.html
git commit -m "feat: add tavern stage progression"
```

---

### Task 11: Add better game feel

**Objective:** Make every action feel more satisfying.

**Files:**
- Modify: `game.html`

Add:

- Screen shake on crash/near miss.
- Particle burst on beer collection.
- Score popups for combo/near miss.
- Short hit freeze on collision.
- Warm glow during Happy Hour Mode.
- Better sound effects for jump, slide, collect, crash, new best.

**Verification:**

- Collecting a beer has visible and audible feedback.
- Crash has impact but does not feel janky.
- Happy Hour Mode is obvious.

Commit:

```bash
git add game.html
git commit -m "feat: add arcade game-feel effects"
```

---

## Phase 4: Real leaderboard and bar activation

### Task 12: Configure Vercel KV/Redis leaderboard

**Objective:** Make leaderboard global instead of local-only fallback.

**Files:**
- Modify: `api/leaderboard.js`
- Modify: `api/submit-score.js`
- Modify: Vercel environment variables

Required env vars:

```text
KV_REST_API_URL
KV_REST_API_TOKEN
```

Implementation notes:

- Keep daily, weekly, and all-time sorted sets.
- Store score, beers, duration, jumps, obstacles cleared, session ID, createdAt.
- Public leaderboard should show nickname, score, beers, rank only.
- Phone number must never be shown publicly.

**Verification:**

```bash
curl -s https://sals-tavern.vercel.app/api/leaderboard | jq .
```

Expected:

- `configured: true`
- arrays for `today`, `week`, `allTime`

Commit:

```bash
git add api/leaderboard.js api/submit-score.js
git commit -m "feat: enable global leaderboard storage"
```

---

### Task 13: Add score validation and anti-cheat guardrails

**Objective:** Prevent obviously fake leaderboard submissions.

**Files:**
- Modify: `api/submit-score.js`

Validation rules:

- Reject missing/short session IDs.
- Reject names shorter than 2 chars after sanitization.
- Reject impossible beer count for duration.
- Reject impossible score for duration.
- Reject runs under 3 seconds unless score is tiny.
- Rate-limit by IP/session if available.

**Verification:**

Run these manually:

```bash
curl -s -X POST https://sals-tavern.vercel.app/api/submit-score \
  -H 'content-type: application/json' \
  -d '{"name":"BOT","score":999999,"beers":999,"durationMs":1000,"jumps":0,"obstaclesCleared":0,"sessionId":"bad"}'
```

Expected: rejected.

Commit:

```bash
git add api/submit-score.js
git commit -m "feat: harden leaderboard score validation"
```

---

### Task 14: Update table-tent copy and QR flow

**Objective:** Make the game usable as an in-bar marketing feature.

**Files:**
- Modify: `table-tent-copy.md`
- Optional modify/create: `assets/sals-run-qr.png`
- Modify: `index.html`

Copy direction:

```text
CAN YOU BEAT CLASSIC STREET?
Scan to play Sal's Tavern Run.
Weekly high score wins a Sal's prize.
Ask the bartender how to claim.
```

**Verification:**

- QR points to `/game.html`.
- Homepage has a clear game CTA.
- Game start screen explains weekly prize without overpromising alcohol prizes.

Commit:

```bash
git add table-tent-copy.md assets/sals-run-qr.png index.html
git commit -m "docs: update table tent and QR game flow"
```

---

## Phase 5: QA and deployment

### Task 15: Local QA pass

**Objective:** Catch broken layout/gameplay before deploy.

**Files:**
- No required modifications unless bugs are found.

Run:

```bash
python3 -m http.server 8765
```

Verify:

- `http://127.0.0.1:8765/game.html`
- `http://127.0.0.1:8765/`
- mobile preview if available

Checklist:

- No console errors.
- Game starts.
- Tap jump works.
- Swipe lanes works.
- Swipe down slide works.
- Pause works.
- Game over works.
- Leaderboard modal works.
- Submit modal works.
- No page scroll on mobile.
- No horizontal overflow.

Commit fixes if needed.

---

### Task 16: Deploy to Vercel and verify production

**Objective:** Ship the upgraded game live.

**Files:**
- No required modifications unless bugs are found.

Deploy:

```bash
HOME=/Users/willkenneedy vercel deploy --prod --yes
```

Verify:

```bash
curl -I https://sals-tavern.vercel.app/game.html
curl -I https://sals-tavern.vercel.app/
```

Browser checks:

- Open `https://sals-tavern.vercel.app/game.html?v=fullscreen-rebuild`.
- Start a run.
- Test controls.
- Check console errors.
- Open on iPhone Safari.
- Add to Home Screen and launch from icon if possible.

Commit any production fixes.

---

## Definition of done

This project is done when:

- The game visually fills the full iPhone screen.
- It feels playable without reading instructions.
- Tap/swipe controls work reliably.
- A run has more than one interesting decision type.
- Combos/power-ups make replaying fun.
- Leaderboard UI still works.
- Global leaderboard is either configured or clearly falls back locally.
- Homepage still links to the game.
- Production deploy is verified.
- No console errors on live game.
