// main.js — bootstrap: wire the canvas, the HUD, input and the loop.
// One clear job: start the game and keep it drawing every frame.
import { CANVAS_W, CANVAS_H } from './config.js';
import { Game } from './game.js';
import { attachInput } from './input.js';
import { isMuted } from './audio.js';
import { drawPanels, drawHintRing, drawWrongFlash, drawMagnifier, drawCrosshair } from './render.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

function el(id) {
  return document.getElementById(id);
}

const els = {
  sceneName: el('sceneName'),
  foundCount: el('foundCount'),
  totalCount: el('totalCount'),
  scoreText: el('scoreText'),
  timerText: el('timerText'),
  timerBar: el('timerBar'),
  message: el('message'),
  hintBtn: el('hintBtn'),
  accuracyText: el('accuracyText'),
  titleOverlay: el('titleOverlay'),
  sceneOverlay: el('sceneOverlay'),
  winOverlay: el('winOverlay'),
  loseOverlay: el('loseOverlay'),
};

const game = new Game(els, ctx);
attachInput(canvas, game);

const startBtn = el('startBtn');
if (startBtn) startBtn.addEventListener('click', () => game.start());
const againBtn = el('againBtn');
if (againBtn) againBtn.addEventListener('click', () => game.start());
const retryBtn = el('retryBtn');
if (retryBtn) retryBtn.addEventListener('click', () => game.start());
const continueBtn = el('continueBtn');
if (continueBtn) continueBtn.addEventListener('click', () => game.startScene(game.sceneIndex + 1));
const hintBtn = el('hintBtn');
if (hintBtn) hintBtn.addEventListener('click', () => game.useHint());
const magBtn = el('magBtn');
if (magBtn) magBtn.addEventListener('click', () => game.onMagnifierKey());
const soundBtn = el('soundBtn');
if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    game.toggleSound();
    soundBtn.textContent = isMuted() ? '🔇 Sound: OFF' : '🔊 Sound: ON';
  });
}

// Screenshot presets come from the URL (?shot=cover|play|zoom|win).
// A plain visit shows the title screen; a preset drops straight into
// the matching mid-game state so screenshots are real game renders.
const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) {
  game.applyShot(shot);
} else {
  game.updateHud();
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(100, now - last);
  last = now;
  game.update(dt);
  drawPanels(ctx, game.sceneId(), game.found, now);
  drawHintRing(ctx, game.hintDiff, now);
  drawWrongFlash(ctx, game.wrongSpot, now);
  if (game.state === 'playing' && game.magnifierOn) {
    drawMagnifier(ctx, canvas, game.mouse);
  }
  if (game.cursor && game.state === 'playing') {
    drawCrosshair(ctx, game.cursor);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
