# Sal's Tavern Website + Tavern Runner Game

Premium small-town tavern website and mobile-first browser game for Sal's Tavern in Hoosick Falls, NY.

Live site:
https://sals-tavern.vercel.app/

Live game:
https://sals-tavern.vercel.app/game.html

## What is in this repo

- `index.html` — current Sal's Tavern homepage.
- `game.html` — current Sal's Tavern Run game.
- `api/leaderboard.js` — Vercel leaderboard API endpoint.
- `api/submit-score.js` — Vercel score submission API endpoint.
- `manifest.webmanifest` — PWA manifest.
- `service-worker.js` — offline game cache.
- `public/assets/` — site assets.
- `docs/plans/fullscreen-ios-game-rebuild.md` — implementation plan for the next game upgrade.
- `docs/project/fullscreen-ios-game-project.md` — project tracker / execution checklist.

## Current game status

The current game is a working mobile-first canvas runner with:

- Tap-to-jump controls.
- Beer collectibles.
- Tavern-themed obstacles.
- Local best score.
- Leaderboard and score submission UI.
- Vercel API hooks for a future global leaderboard.
- PWA manifest and service worker.

## Next upgrade direction

The next version should become a full-screen iOS-style tavern runner:

- Fullscreen canvas with HUD overlay.
- Home-screen/PWA app feel.
- 3-lane runner movement.
- Tap-to-jump, swipe-to-change-lanes, swipe-down-to-slide.
- Combos, multipliers, near-miss bonuses, and power-ups.
- Tavern-specific stages: Classic Street, Inside the Tavern, Kitchen Rush, Last Call.
- Real weekly leaderboard with Vercel KV/Redis.

Start with:

```bash
open docs/plans/fullscreen-ios-game-rebuild.md
open docs/project/fullscreen-ios-game-project.md
```

## Local development

From this folder:

```bash
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/
http://127.0.0.1:8765/game.html
```

## Deploy

This repo is linked to Vercel. To deploy manually:

```bash
HOME=/Users/willkenneedy vercel deploy --prod --yes
```

## Notes

Do not hard-code fake ratings, fake reviews, or stale leaderboard data. Live business/social/review links should stay the source of truth unless a verified API integration is added.
