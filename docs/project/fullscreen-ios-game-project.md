# Fullscreen iOS Game Rebuild Project

Repo: `ornatewerks/sals-tavern`

Plan: `docs/plans/fullscreen-ios-game-rebuild.md`

Live game: https://sals-tavern.vercel.app/game.html

## Project outcome

Make Sal's Tavern Run feel like a real fullscreen iOS arcade game that Sal's can promote through QR codes and weekly in-bar prizes.

## Milestones

### Milestone 1 — Fullscreen app feel

Status: Not started

Deliverables:

- Current game backed up.
- `game.html` converted from cabinet layout to fullscreen shell.
- Canvas resizes sharply for device pixels.
- HUD, pause, sound, score, and overlay screens float over the canvas.
- PWA manifest updated for home-screen installation.

Implementation issues:

1. Back up current game before fullscreen rebuild.
2. Convert game to fullscreen iOS-style shell.
3. Add responsive high-DPI canvas sizing.
4. Improve PWA manifest and iOS home-screen support.

Acceptance criteria:

- Game fills iPhone viewport.
- No web-page scrolling during play.
- Safe-area padding works around notch/Dynamic Island.
- Game still runs locally and on Vercel.

---

### Milestone 2 — Better core gameplay

Status: Not started

Deliverables:

- 3-lane player movement.
- Tap and swipe controls.
- Multiple obstacle classes.
- Jump, slide, and lane-switch decisions.
- Combo/multiplier scoring.
- Tavern-themed power-ups.

Implementation issues:

5. Add three-lane runner model.
6. Add tap and swipe controls.
7. Add lane-based tavern obstacles.
8. Add combo and multiplier scoring.
9. Add tavern power-ups.

Acceptance criteria:

- Tap jumps.
- Swipe left/right changes lanes.
- Swipe down slides.
- Different obstacle types require different actions.
- Score loop feels meaningfully more replayable than current version.

---

### Milestone 3 — Premium game-feel and Sal's identity

Status: Not started

Deliverables:

- Stage progression across Classic Street, Tavern Room, Kitchen Rush, and Last Call.
- Better particles, screen shake, hit pause, popups, and audio cues.
- Sal's-specific visual moments and copy.

Implementation issues:

10. Add tavern stage progression.
11. Add arcade game-feel effects.

Acceptance criteria:

- The game no longer feels generic.
- Stage changes are visually obvious.
- Collecting items and crashing feel satisfying.
- Happy Hour / Last Call moments feel exciting.

---

### Milestone 4 — Real leaderboard and bar activation

Status: Not started

Deliverables:

- Vercel KV/Redis global leaderboard configured.
- Score validation and anti-cheat guardrails.
- Updated QR/table-tent flow.
- Homepage game CTA remains clear.

Implementation issues:

12. Enable global leaderboard storage.
13. Harden leaderboard score validation.
14. Update table-tent and QR game flow.

Acceptance criteria:

- Daily, weekly, and all-time leaderboards show real submitted scores.
- Phone/contact info is not public.
- Obviously fake scores are rejected.
- QR/table tent copy is ready to show a bar owner.

---

### Milestone 5 — QA and production deploy

Status: Not started

Deliverables:

- Local QA completed.
- iPhone/Safari QA completed.
- Production deploy completed.
- Live game verified.

Implementation issues:

15. Run local QA pass.
16. Deploy upgraded game and verify production.

Acceptance criteria:

- No live console errors.
- Game starts and ends correctly.
- Controls work on touch device.
- Leaderboard and submit modals still work.
- `https://sals-tavern.vercel.app/game.html` is production-ready.

## Suggested build order

Do not start with art. Start with feel.

1. Fullscreen shell.
2. Responsive canvas.
3. Swipe/tap controls.
4. Lane model.
5. Obstacles.
6. Scoring.
7. Power-ups.
8. Game-feel effects.
9. Stage art.
10. Leaderboard backend.
11. QA/deploy.

## Weekly implementation cadence

If implementing between other client work:

- Day 1: Milestone 1.
- Day 2: Tasks 5-7.
- Day 3: Tasks 8-9.
- Day 4: Tasks 10-11.
- Day 5: Tasks 12-14.
- Day 6: QA and polish.
- Day 7: Production deploy and iPhone testing.

## Risk notes

- iPhone Safari cannot be forced into true native fullscreen unless launched as an installed PWA. The game should still look fullscreen in Safari, but the best experience is Add to Home Screen.
- Global leaderboard requires Vercel KV/Redis env vars. Keep local fallback working.
- Avoid making controls too complex. Bar patrons should understand the game in under 5 seconds.
- Do not overbuild sprite pipelines before the core loop is fun.
