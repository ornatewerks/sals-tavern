# Sal's Tavern Run Mobile App + Leaderboard Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Turn the existing Sal's Tavern runner game into a phone-first bar game that feels like a real mini app, includes global high scores, and supports a weekly in-person prize mechanic.

**Architecture:** Keep the game lightweight and static-first, but split responsibilities cleanly: `game.html` remains the playable app shell, `game.js` handles game state/physics/rendering, `leaderboard.js` handles score submission/display, and a small serverless API stores leaderboard entries. Use a mobile-first full-screen design, basic anti-cheat validation, and prize copy that says “weekly prize” rather than hardcoding “free beer” everywhere.

**Tech Stack:** Vanilla HTML/CSS/JS, Canvas 2D, Vercel static hosting, Vercel Serverless Functions, Vercel KV/Upstash Redis or Supabase for persistent leaderboard storage.

**Current Project Path:** `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern`

**Current Live URL:** `https://sals-tavern.vercel.app`

---

## Product Decisions

### Prize language
Use this customer-facing copy:

> Weekly high score wins a Sal's Tavern prize. Must redeem in person. 21+ for alcohol prizes. Sal's Tavern may verify scores.

Do not make the core UI say “win a free beer” as the permanent rule. That can be mentioned by staff/table tent if they choose, but the website should stay flexible and safer.

### Leaderboard periods
Implement three boards:
- Today
- This Week
- All Time

The main prize should be tied to “This Week,” not all-time.

### Player identity
For normal leaderboard submissions:
- Required: nickname/initials
- Optional: phone number only if the score is a weekly #1 and the player wants prize contact

Do not show phone numbers publicly.

### Anti-cheat goal
This is not a bank vault. It only needs to stop casual console tampering:
- Server rejects impossible score-per-second values
- Server rejects impossible beer count for duration
- Server rejects games shorter than a few seconds
- Client sends duration, jumps, beers, obstacle count, score, and a generated session ID

---

# Phase 1: Make the game feel like a real phone app

## Task 1: Back up the current game file

**Objective:** Preserve the current working version before a larger redesign.

**Files:**
- Read: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/game.html`
- Create: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/backups/game-before-mobile-app.html`

**Steps:**
1. Create `backups/` if missing.
2. Copy current `game.html` into `backups/game-before-mobile-app.html`.
3. Verify the backup exists.

**Verification:**
Run:
```bash
cd "/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern"
test -f backups/game-before-mobile-app.html && echo "backup ok"
```
Expected: `backup ok`

---

## Task 2: Convert game page to a full-screen app shell

**Objective:** Remove the desktop webpage feeling and create a portrait-first arcade/app layout.

**Files:**
- Modify: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/game.html`

**Required UI changes:**
- Body should be `height: 100dvh`, `overflow: hidden` during gameplay.
- Header/nav should be minimized or moved into a small top app bar.
- Main app should fit within one mobile viewport.
- Canvas/game stage should dominate the screen.
- Score, beers, and best score should be pinned in a compact HUD.
- The rules cards below the game should be removed from the game screen or moved behind a “How to play” overlay.

**Implementation notes:**
- Use `100dvh` instead of `100vh` for iPhone Safari compatibility.
- Keep a small “Back to Sal’s site” link, but make it secondary.
- Use `touch-action: none` on the game area while playing.

**Verification:**
Open local game at a phone-like viewport and confirm:
- No vertical scroll is required to play.
- Start button is visible without scrolling.
- Score HUD is visible.
- Game canvas is large enough to feel playable.

---

## Task 3: Resize and rebalance gameplay for mobile

**Objective:** Make the game actually playable on phones at a bar.

**Files:**
- Modify: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/game.html`

**Gameplay changes:**
- Increase visible player size on mobile.
- Increase obstacle spacing slightly at the start.
- Make jump feel a little floatier for thumb play.
- Add coyote-time/tap buffering if simple to implement:
  - If player taps just before landing, jump on landing.
  - If player taps within ~100ms after leaving the ground, still allow jump.
- Make beer collectibles easier to understand visually.

**Suggested constants to tune:**
Current values near top of script:
```js
const groundY = 334;
const gravity = 0.82;
let speed = 6.2;
const player = {x:130,y:groundY,w:48,h:82,vy:0,onGround:true,run:0};
```

Tune after changing canvas aspect ratio. Do not blindly keep the current `1080x430` world if the app shell becomes portrait. A good target is a wide internal game world rendered inside a portrait viewport, with the ground line lower and more breathing room above.

**Verification:**
- Start game on mobile viewport.
- Tap to jump 10+ times.
- Confirm jumps are responsive.
- Confirm early obstacles are fair.
- Confirm beer pickups are visible and collectible.

---

## Task 4: Redesign start, pause, and game-over overlays

**Objective:** Make the game feel like an arcade cabinet, not a webpage modal.

**Files:**
- Modify: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/game.html`

**Start overlay content:**
```text
SAL'S TAVERN RUN
Classic Street Challenge

Avoid stools. Grab beers. Chase the weekly board.

[Tap to Start]
```

**Game-over overlay content:**
```text
Run Over
Score: [score]
Beers: [beers]

[Play Again]
[Submit Score]
[Leaderboard]
```

**New weekly high score overlay content:**
```text
New Weekly High Score
Put your name on the board.
Weekly champion wins a Sal's Tavern prize.
```

**Verification:**
- Start overlay appears on load.
- Game-over overlay appears after crash.
- Play Again restarts cleanly.
- Submit Score button appears only after a completed run.

---

## Task 5: Add app-like polish

**Objective:** Add small touches that make the game feel premium and tactile.

**Files:**
- Modify: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/game.html`

**Add:**
- Haptic feedback on supported devices:
```js
function buzz(ms = 18) {
  if (navigator.vibrate) navigator.vibrate(ms);
}
```
- Call `buzz(12)` on beer collect.
- Call `buzz([40, 40, 80])` on crash.
- Add a mute/sound toggle placeholder even if full sounds are phase 2.
- Add small particle burst when grabbing beer.
- Add “new best” visual flash.

**Verification:**
- No console errors on browsers that do not support vibration.
- Beer collection still works.
- Crash still works.
- Visual feedback is noticeable but not obnoxious.

---

# Phase 2: Add global leaderboard backend

## Task 6: Choose leaderboard storage

**Objective:** Pick a simple persistent database for scores.

**Recommended option:** Vercel KV / Upstash Redis.

**Why:**
- Fits Vercel deployment.
- Simple sorted-set leaderboard model.
- Low operational overhead.

**Alternative:** Supabase table if the user already has Supabase set up.

**Files:**
- Modify: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/vercel.json` only if needed
- Create: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/api/leaderboard.js`
- Create: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/api/submit-score.js`

**Required env vars if using Vercel KV/Upstash:**
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

**Verification:**
Run:
```bash
cd "/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern"
HOME=/Users/willkenneedy vercel env ls
```
Expected: KV env vars exist before deploying backend.

---

## Task 7: Create leaderboard read API

**Objective:** Add an endpoint that returns daily, weekly, and all-time scores.

**Files:**
- Create: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/api/leaderboard.js`

**Endpoint:**
```text
GET /api/leaderboard
```

**Response shape:**
```json
{
  "today": [
    { "rank": 1, "name": "WILL", "score": 4820, "beers": 14 }
  ],
  "week": [
    { "rank": 1, "name": "SAL", "score": 9200, "beers": 31 }
  ],
  "allTime": [
    { "rank": 1, "name": "ACE", "score": 12100, "beers": 44 }
  ]
}
```

**Implementation notes:**
- Return top 10 for each period.
- Never return phone numbers.
- If DB is unavailable, return empty arrays plus an error-safe message, not a crashed page.

**Verification:**
Run locally or after deploy:
```bash
curl https://sals-tavern.vercel.app/api/leaderboard
```
Expected: JSON with `today`, `week`, and `allTime` arrays.

---

## Task 8: Create score submission API

**Objective:** Add an endpoint for game-over score submissions.

**Files:**
- Create: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/api/submit-score.js`

**Endpoint:**
```text
POST /api/submit-score
```

**Request shape:**
```json
{
  "name": "WILL",
  "score": 4820,
  "beers": 14,
  "durationMs": 61700,
  "jumps": 39,
  "obstaclesCleared": 27,
  "sessionId": "client-generated-id",
  "phone": "optional, never public"
}
```

**Validation rules:**
- `name`: required, 2-12 chars, uppercase safe characters only.
- `score`: integer, positive.
- `beers`: integer, non-negative.
- `durationMs`: at least 3000.
- Reject if score per second is obviously impossible.
- Reject if beer count is obviously impossible for duration.
- Reject duplicate session IDs.
- Sanitize all public strings.

**Response shape:**
```json
{
  "ok": true,
  "rankToday": 3,
  "rankWeek": 8,
  "rankAllTime": 12,
  "isWeeklyLeader": false
}
```

**Verification:**
Use curl with a test submission:
```bash
curl -X POST https://sals-tavern.vercel.app/api/submit-score \
  -H 'content-type: application/json' \
  -d '{"name":"TEST","score":1200,"beers":3,"durationMs":20000,"jumps":8,"obstaclesCleared":6,"sessionId":"manual-test-1"}'
```
Expected: `ok: true` or a clear validation error.

---

## Task 9: Add client leaderboard UI

**Objective:** Let players view rankings from inside the game.

**Files:**
- Modify: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/game.html`

**UI:**
- Add `Leaderboard` button to start/game-over screens.
- Add leaderboard panel with tabs:
  - Today
  - This Week
  - All Time
- Show top 10 rows.
- Show loading and error states.

**Public row format:**
```text
#1  WILL    4,820    14 beers
```

**Verification:**
- Leaderboard button opens panel.
- Tabs switch without page reload.
- Empty board state looks intentional.
- API failure does not break game.

---

## Task 10: Add score submission form

**Objective:** Let a player submit their score after game over.

**Files:**
- Modify: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/game.html`

**Form fields:**
- Nickname / initials: required
- Phone: optional, only shown with copy like “Optional if you want Sal’s to contact you about prize redemption.”

**Copy:**
```text
Put your name on the board.
Weekly champion wins a Sal's Tavern prize. Redeem in person.
```

**Behavior:**
- Disable submit while request is in progress.
- On success, show ranks.
- If weekly leader, show special message:
```text
You're currently #1 this week. Screenshot this and show the bartender.
```
- Refresh leaderboard after submit.

**Verification:**
- Invalid names are rejected before API call.
- Valid score submits.
- Success message displays.
- Leaderboard updates.

---

# Phase 3: Make it usable inside the bar

## Task 11: Add QR code entry point

**Objective:** Create a simple page or asset Sal’s can use at the bar.

**Files:**
- Create: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/play.html` or reuse `/game.html`
- Create: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/assets/sals-run-qr.png`

**Recommendation:**
Use `/game.html` as the public play URL and generate QR code to:
```text
https://sals-tavern.vercel.app/game.html
```

**Verification:**
- QR opens game on phone.
- Game starts without needing to zoom or scroll.

---

## Task 12: Create printable table tent copy

**Objective:** Give the restaurant a physical activation piece.

**Files:**
- Create: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/table-tent-copy.md`

**Copy:**
```text
CAN YOU TOP THE SAL'S TAVERN RUN BOARD?

Scan to play.
Jump the stools. Grab the beers. Chase the weekly high score.

Weekly champion wins a Sal's Tavern prize.
Redeem in person. 21+ for alcohol prizes.
```

**Verification:**
- Copy is short enough for a table tent.
- Prize language is safe and flexible.

---

## Task 13: Add PWA app polish

**Objective:** Make the game installable and more app-like on mobile.

**Files:**
- Create: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/manifest.webmanifest`
- Create: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/service-worker.js`
- Modify: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/game.html`

**Manifest basics:**
```json
{
  "name": "Sal's Tavern Run",
  "short_name": "Sal's Run",
  "start_url": "/game.html",
  "display": "standalone",
  "background_color": "#092318",
  "theme_color": "#8f211f",
  "icons": []
}
```

**Implementation notes:**
- Add icons if available, otherwise defer icon polish.
- Keep service worker simple: cache app shell only.
- Do not let stale service worker cache block future updates; include versioned cache name.

**Verification:**
- Chrome Lighthouse recognizes manifest.
- iPhone can add the page to home screen.
- Game still updates after deploy.

---

# Phase 4: Test, deploy, and verify

## Task 14: Local desktop and mobile testing

**Objective:** Catch layout and gameplay problems before deployment.

**Files:**
- Read/test: `/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern/game.html`

**Commands:**
```bash
cd "/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern"
python3 -m http.server 8765
```

Open:
```text
http://127.0.0.1:8765/game.html
```

**Test checklist:**
- Desktop starts and plays.
- iPhone-sized viewport starts and plays.
- No scroll during game.
- Start button visible.
- Game-over buttons visible.
- Submit score form works against local or deployed API.
- Leaderboard loads.
- No console errors.

---

## Task 15: Deploy to Vercel production

**Objective:** Publish the finished app and API.

**Files:**
- Whole project directory

**Command:**
```bash
cd "/Users/willkenneedy/Documents/WEBSITE BUILDER/_clients/sals-tavern"
HOME=/Users/willkenneedy vercel deploy --prod --yes
```

**Expected:**
- Production deployment succeeds.
- Alias remains `https://sals-tavern.vercel.app`.

---

## Task 16: Verify live production behavior

**Objective:** Prove the live game works end-to-end.

**URLs:**
- `https://sals-tavern.vercel.app/game.html`
- `https://sals-tavern.vercel.app/api/leaderboard`

**Verification checklist:**
- Live game loads on desktop.
- Live game loads on mobile viewport.
- Game starts.
- Score advances.
- Beer collection works.
- Crash/game-over works.
- Submit score works.
- Leaderboard updates.
- No phone numbers are displayed publicly.
- No console errors.
- Homepage link to game still works.

---

# Acceptance Criteria

The task is complete when:

1. `game.html` feels like a full-screen mobile mini app, not a normal webpage.
2. A person at the bar can open it from a QR code and play without scrolling/zooming.
3. The player can submit a score with a nickname.
4. A global leaderboard displays daily, weekly, and all-time scores.
5. Weekly #1 gets a prize-oriented message.
6. The website avoids unsafe hardcoded “free beer for everyone” style language.
7. Basic anti-cheat validation exists server-side.
8. The game works on desktop and mobile.
9. The production Vercel URL is verified after deployment.
10. No console errors appear during normal gameplay.

---

# Recommended Implementation Order

Do this in order:

1. Backup current game.
2. Redesign mobile app shell.
3. Tune gameplay for mobile.
4. Redesign overlays.
5. Add haptics/polish.
6. Add leaderboard backend.
7. Add leaderboard UI.
8. Add score submission form.
9. Add QR/table tent assets.
10. Add PWA polish.
11. Test locally.
12. Deploy.
13. Verify live.

This order keeps the existing game playable while progressively turning it into a real bar activation product.
