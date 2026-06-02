# Sal's Tavern Run QA Pass

Date: 2026-06-01
Branch: `feat/complete-fullscreen-tavern-run`

## Scope

This QA pass covers issues #2 through #16 for the fullscreen iOS-style game rebuild.

## Local checks

Command:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

URLs:

- `http://127.0.0.1:8765/`
- `http://127.0.0.1:8765/game.html`
- `http://127.0.0.1:8765/manifest.webmanifest`
- `http://127.0.0.1:8765/backups/game-before-fullscreen-ios-rebuild.html`

## Manual gameplay checklist

- [x] Game opens as a full-viewport canvas app.
- [x] No cabinet wrapper is visible during play.
- [x] HUD floats over the game.
- [x] Canvas resizes to browser/device pixels.
- [x] Tap starts the game and jumps.
- [x] Player stays fixed left in a readable side-scroller view.
- [x] Tap/space jumps as the primary move.
- [x] Swipe down / ArrowDown slides under neon.
- [x] Obstacles and beer routes move right-to-left with visible collision expectations.
- [x] Stool/keg/puddle/neon obstacles use clear jump/slide responses.
- [x] Difficulty ramps continuously: speed rises with distance/clears, hazard cadence tightens, hazard mix gets harsher, and beer rewards become less frequent at later tiers.
- [x] Gameplay avoids visual clutter: no random beer spam, no stacked hazards in the decision window, and reward routes appear as short intentional arcs after hazard beats.
- [x] Hazard art is anchored to the ground with shadows and action cues instead of floating as unrelated objects.
- [x] Hit feedback includes tighter visual/collision alignment, screen shake, and explicit death copy.
- [x] Sprite atlas is loaded from `public/assets/game-sprites.png` with frame metadata in `public/assets/game-sprites.json`.
- [x] Player run/jump/slide, stool, keg, puddle, neon, beer, shield, and impact effects render from animation frames rather than ad-hoc canvas primitives.
- [x] Beer collection increases score and combo.
- [x] Combo changes multiplier.
- [x] Near misses score bonus points.
- [x] Power-ups activate visible HUD chips.
- [x] Stage progression updates the game label and backdrop.
- [x] Leaderboard modal opens.
- [x] Submit-score modal opens after game over.
- [x] Local fallback board works when KV is not configured.
- [x] Browser console has no JavaScript errors.

## Production verification

Production URL:

https://sals-tavern.vercel.app/game.html

Deployment output:

- Inspect: https://vercel.com/will-8589s-projects/sals-tavern/EFQEemphmwQutsWnzUM1VwW3R9xT
- Production deployment URL: https://sals-tavern-rjbqw1x89-will-8589s-projects.vercel.app
- Aliased production URL: https://sals-tavern.vercel.app

Post-deploy checks:

- [x] Production deployment completed from the repo.
- [x] `/` returned HTTP 200.
- [x] `/game.html` returned HTTP 200.
- [x] `/manifest.webmanifest` returned HTTP 200.
- [x] `/api/leaderboard` returned JSON.
- [x] Browser production smoke test completed with zero console errors.

## Known caveats

- Real global leaderboard storage requires Vercel KV env vars: `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
- iPhone Safari cannot be forced into true native fullscreen unless launched from the home screen as a PWA. The game is still designed to visually fill Safari's viewport.
