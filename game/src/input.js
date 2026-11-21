// input.js — mouse and keyboard play.
// One clear job: turn pointer and key events into game actions.
// Clicks on the RIGHT panel test the differences; clicks on the left
// panel are a nudge (no penalty, no find). Arrow keys move a crosshair,
// Enter marks the spot under it, H hints, M toggles the magnifier.
import { PANEL_W, PANEL_GAP, PANEL_H } from './config.js';
import { hitTest } from './differences.js';

export function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

// Which panel is a canvas point in: 'left', 'right', or null (gap/outside).
export function panelAt(p) {
  if (p.y < 0 || p.y > PANEL_H) return null;
  if (p.x >= 0 && p.x < PANEL_W) return 'left';
  if (p.x >= PANEL_W + PANEL_GAP && p.x < PANEL_W * 2 + PANEL_GAP) return 'right';
  return null;
}

// Convert a right-panel canvas point to scene coordinates.
export function scenePoint(p) {
  return { x: p.x - PANEL_W - PANEL_GAP, y: p.y };
}

export function attachInput(canvas, game) {
  canvas.addEventListener('pointermove', (event) => {
    const p = canvasPoint(canvas, event);
    game.onMouseMove(p);
  });
  canvas.addEventListener('pointerleave', () => {
    game.onMouseLeave();
  });
  canvas.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    const p = canvasPoint(canvas, event);
    game.onMouseMove(p);
    game.onMark(p);
  });
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      game.onArrow(key);
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      game.onEnterMark();
    } else if (key === 'h' || key === 'H') {
      game.onHintKey();
    } else if (key === 'm' || key === 'M') {
      game.onMagnifierKey();
    } else if (key === 'n' || key === 'N') {
      game.onNextKey();
    }
  });
}

// Shared mark resolution, also used by the keyboard path and the tests:
// returns { kind: 'found', diff } | { kind: 'wrong' } | { kind: 'left' } | { kind: 'none' }
export function resolveMark(sceneId, p, foundIds) {
  const panel = panelAt(p);
  if (!panel) return { kind: 'none' };
  if (panel === 'left') return { kind: 'left' };
  const sp = scenePoint(p);
  const diff = hitTest(sceneId, sp.x, sp.y, foundIds);
  if (diff) return { kind: 'found', diff };
  return { kind: 'wrong', at: p };
}
