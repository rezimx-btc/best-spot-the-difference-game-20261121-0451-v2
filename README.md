# 🌙 Midnight Market — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rezimx-btc/best-spot-the-difference-game-20261121-0451-v2/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/rezimx-btc/best-spot-the-difference-game-20261121-0451-v2/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

Two pictures hang side by side in the night market — but the right one hides **7 differences**. Find them all before time runs out, then move to the next stall.

## The game

**3 scenes, 21 differences, rising difficulty:**

| Scene | Setting | Time | Mood |
|---|---|---|---|
| 1 · Noodle Stall | Pasar malam at dusk — steamer baskets, chilli jars, a cat on a crate | 2:30 | Easy warm-up |
| 2 · Toy & Kite Stall | Morning market — kites, balloons, a teddy bear, a pinwheel | 2:00 | Medium |
| 3 · The Old Bookshop | Lamplight — shelves, a sleeping cat, a wall clock, the moon | 1:30 | Hard, small marks |

Every difference is fair but hidden by design: a missing jar, a re-coloured awning stripe, an extra bowl, a lamp that slid sideways, a bulb gone from the festoon lights, a star missing from the sign, a collar that changed colour — and fourteen more of the same kind across the other two stalls.

## How to play

- 🖱️ **Click a difference on the RIGHT picture** to circle it in gold. Clicks on the left picture are only a nudge — no penalty.
- ⌨️ **Arrow keys** move the crosshair, **Enter** marks the spot — the whole hunt is playable from the keyboard.
- 💡 **H** asks for a hint (−25 pts, 12s recharge). The hint rings the spot on both panels and tells you what to look for.
- 🔍 **M** toggles the magnifier lens — a 2.2× zoom that follows your cursor for the tiny marks in scene 3.
- ❌ A wrong click costs **5 seconds**. A right click is worth **100 points**, plus a time bonus when you clear a scene.
- 🏆 Clear all three scenes to become the **Market Detective** — final score, accuracy and time on the win screen.

## Feel

- A gold ring pulses around every find on **both** panels, with a chime; a wrong click flashes red with a low thud.
- The timer bar drains from green to red and ticks in the last 10 seconds — the pressure is visible in the frame.
- All art is drawn in code on canvas (no image files, no network): the two panels are the same drawing with exactly the listed changes applied to the right one.
- Sound is tiny WebAudio beeps, mutable, and never blocks play.

## Run it

Serve `game/` with any static server and open `game/index.html` in desktop Chrome. No build step, no network request.

```sh
python3 -m http.server 8080 --directory game
# open http://localhost:8080
```

## Layout

- `game/index.html` — page shell, HUD, overlays
- `game/styles.css` — night-market look
- `game/src/config.js` — tuning: timers, scores, penalties
- `game/src/differences.js` — the 21 differences + the pure hit test
- `game/src/scenes.js` — the three hand-drawn scenes (canvas painters)
- `game/src/render.js` — panels, markers, hint ring, magnifier, crosshair
- `game/src/input.js` — mouse + keyboard, mark resolution
- `game/src/game.js` — state machine: scenes, timer, score, hints, win/lose
- `game/src/audio.js` — WebAudio sound effects
- `game/src/main.js` — bootstrap + render loop
- `main.ts` — copies `game/` + `screenshots/` to `/output` and writes `dossier.json`
- `screenshots/` — real headless renders of the game: cover (3 found, 4 to go), toy stall with a hint ringing, bookshop under the magnifier, and the win screen

## License

MIT License, Copyright (c) 2026 rezimx-btc. See `LICENSE`.
