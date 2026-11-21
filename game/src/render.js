// render.js — draws both panels, found markers, the hint ring,
// the magnifier lens and the crosshair onto the single canvas.
// One clear job: everything the eye sees inside the canvas.
import { PANEL_W, PANEL_H, PANEL_GAP, MAGNIFIER_RADIUS, MAGNIFIER_ZOOM, MARK_RING_COLOR } from './config.js';
import { paintScene, allDiffIds } from './scenes.js';
import { diffsFor } from './differences.js';

const EMPTY_MODS = new Set();

export function drawPanels(ctx, sceneId, foundIds, now) {
  ctx.clearRect(0, 0, PANEL_W * 2 + PANEL_GAP, PANEL_H);
  // Left panel: the original. Right panel: all 7 differences applied.
  ctx.save();
  paintScene(ctx, sceneId, EMPTY_MODS);
  ctx.restore();
  ctx.save();
  ctx.translate(PANEL_W + PANEL_GAP, 0);
  paintScene(ctx, sceneId, allDiffIds(sceneId));
  ctx.restore();
  // Panel frames and labels
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, PANEL_W - 2, PANEL_H - 2);
  ctx.strokeRect(PANEL_W + PANEL_GAP + 1, 1, PANEL_W - 2, PANEL_H - 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(8, 8, 74, 24);
  ctx.fillRect(PANEL_W + PANEL_GAP + 8, 8, 74, 24);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('ORIGINAL', 16, 25);
  ctx.fillText('CHANGED', PANEL_W + PANEL_GAP + 16, 25);
  // Found markers: a pulsing gold ring on BOTH panels at each found spot.
  for (const d of diffsFor(sceneId)) {
    if (!foundIds.has(d.id)) continue;
    const pulse = 1 + 0.12 * Math.sin((now % 900) / 900 * Math.PI * 2);
    for (const ox of [0, PANEL_W + PANEL_GAP]) {
      ctx.beginPath();
      ctx.arc(ox + d.x, d.y, d.r * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = MARK_RING_COLOR;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ox + d.x, d.y, d.r * pulse + 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 214, 10, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ox + d.x - 7, d.y);
      ctx.lineTo(ox + d.x + 7, d.y);
      ctx.moveTo(ox + d.x, d.y - 7);
      ctx.lineTo(ox + d.x, d.y + 7);
      ctx.strokeStyle = MARK_RING_COLOR;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }
}

export function drawHintRing(ctx, hintDiff, now) {
  if (!hintDiff) return;
  const ox = PANEL_W + PANEL_GAP;
  const alpha = 0.55 + 0.45 * Math.sin((now % 600) / 600 * Math.PI * 2);
  for (const baseX of [0, ox]) {
    ctx.beginPath();
    ctx.arc(baseX + hintDiff.x, hintDiff.y, hintDiff.r + 10, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 229, 255, ${alpha.toFixed(2)})`;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

export function drawWrongFlash(ctx, wrongSpot, now) {
  if (!wrongSpot) return;
  const age = now - wrongSpot.at;
  if (age > 450) return;
  const alpha = 1 - age / 450;
  ctx.beginPath();
  ctx.arc(wrongSpot.x, wrongSpot.y, 14 + age / 30, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(230, 57, 70, ${alpha.toFixed(2)})`;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(wrongSpot.x - 8, wrongSpot.y - 8);
  ctx.lineTo(wrongSpot.x + 8, wrongSpot.y + 8);
  ctx.moveTo(wrongSpot.x + 8, wrongSpot.y - 8);
  ctx.lineTo(wrongSpot.x - 8, wrongSpot.y + 8);
  ctx.strokeStyle = `rgba(230, 57, 70, ${alpha.toFixed(2)})`;
  ctx.lineWidth = 3;
  ctx.stroke();
}

export function drawMagnifier(ctx, canvas, mouse) {
  if (!mouse || !mouse.inside) return;
  const r = MAGNIFIER_RADIUS;
  const zoom = MAGNIFIER_ZOOM;
  const sx = Math.max(0, Math.min(canvas.width - r * 2 / zoom, mouse.x - r / zoom));
  const sy = Math.max(0, Math.min(canvas.height - r * 2 / zoom, mouse.y - r / zoom));
  ctx.save();
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(canvas, sx, sy, (r * 2) / zoom, (r * 2) / zoom, mouse.x - r, mouse.y - r, r * 2, r * 2);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#ffd60a';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, r + 4, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();
  // crosshair inside the lens
  ctx.beginPath();
  ctx.moveTo(mouse.x - 10, mouse.y);
  ctx.lineTo(mouse.x + 10, mouse.y);
  ctx.moveTo(mouse.x, mouse.y - 10);
  ctx.lineTo(mouse.x, mouse.y + 10);
  ctx.strokeStyle = 'rgba(255, 214, 10, 0.9)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function drawCrosshair(ctx, cursor) {
  if (!cursor) return;
  ctx.beginPath();
  ctx.moveTo(cursor.x - 12, cursor.y);
  ctx.lineTo(cursor.x + 12, cursor.y);
  ctx.moveTo(cursor.x, cursor.y - 12);
  ctx.lineTo(cursor.x, cursor.y + 12);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, 5, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 214, 10, 0.9)';
  ctx.lineWidth = 2;
  ctx.stroke();
}
