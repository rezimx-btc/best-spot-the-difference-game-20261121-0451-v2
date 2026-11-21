// config.js — tuning and scene metadata for Midnight Market.
// One clear job: every number the game balances on lives here.
export const PANEL_W = 560;
export const PANEL_H = 420;
export const PANEL_GAP = 20;
export const CANVAS_W = PANEL_W * 2 + PANEL_GAP;
export const CANVAS_H = PANEL_H;

export const SCENES = [
  {
    id: 'noodle',
    name: 'Scene 1 · Noodle Stall',
    sub: 'Pasar malam — easy warm-up',
    timeLimit: 150,
    sky: ['#2b1e4d', '#7a3b5e'],
  },
  {
    id: 'toys',
    name: 'Scene 2 · Toy & Kite Stall',
    sub: 'Morning market — medium',
    timeLimit: 120,
    sky: ['#8ecae6', '#fef3c7'],
  },
  {
    id: 'books',
    name: 'Scene 3 · The Old Bookshop',
    sub: 'Lamplight — hard, small marks',
    timeLimit: 90,
    sky: ['#3a2a1a', '#6b4226'],
  },
];

export const SCORE_FIND = 100;
export const SCORE_TIME_BONUS_PER_SEC = 5;
export const WRONG_CLICK_TIME_PENALTY = 5;
export const HINT_COOLDOWN_MS = 12000;
export const HINT_SCORE_COST = 25;
export const MAGNIFIER_RADIUS = 70;
export const MAGNIFIER_ZOOM = 2.2;
export const MARK_RING_COLOR = '#ffd60a';
export const MARK_PULSE_MS = 900;
