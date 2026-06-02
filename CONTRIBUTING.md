# Contributing / Implementation Notes

This repo is intentionally simple: static HTML/CSS/JS plus Vercel API routes.

## Before changing the game

1. Read `docs/plans/fullscreen-ios-game-rebuild.md`.
2. Pick one issue/task.
3. Make the smallest working change.
4. Run the local game.
5. Commit.

## Local test command

```bash
python3 -m http.server 8765
```

Open:

```text
http://127.0.0.1:8765/game.html
```

## Validation checklist

Before pushing:

- Game loads.
- Start button works.
- Controls work.
- Game-over overlay appears.
- Leaderboard modal opens.
- Submit-score modal opens.
- Browser console has no errors.
- Homepage still loads.

## Deployment command

```bash
HOME=/Users/willkenneedy vercel deploy --prod --yes
```
