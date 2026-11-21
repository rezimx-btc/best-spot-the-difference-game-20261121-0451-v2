// scenes.js — three original hand-drawn scenes, painted in code.
// paintScene(ctx, sceneId, mods) draws one panel; mods is the Set of
// difference ids active in that panel (empty = left panel, all = right).
// Every difference is a small branch inside the painter, so the two
// panels are the same drawing with exactly the listed changes.
import { PANEL_W, PANEL_H } from './config.js';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function star(ctx, x, y, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(ang) * rad;
    const py = y + Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
}

function ground(ctx, y, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(0, y, PANEL_W, PANEL_H - y);
}

// --- Scene 1: Noodle Stall at the night market ---
function paintNoodle(ctx, mods) {
  sky(ctx, '#2b1e4d', '#7a3b5e');
  // distant rooftops
  ctx.fillStyle = '#241a3e';
  ctx.fillRect(0, 150, 120, 90);
  ctx.fillRect(130, 130, 150, 110);
  ctx.fillRect(420, 140, 140, 100);
  ctx.fillStyle = '#ffd166';
  for (const wx of [30, 80, 170, 220, 450, 500]) {
    ctx.fillRect(wx, 165, 16, 20);
  }
  // distant food carts and paper lanterns fill the middle band
  ctx.fillStyle = '#2e2148';
  ctx.fillRect(300, 210, 90, 50);
  ctx.fillStyle = '#e63946';
  ctx.fillRect(300, 200, 90, 12);
  ctx.fillStyle = '#ffd166';
  for (const lx of [315, 340, 365]) {
    ctx.fillRect(lx, 226, 8, 10);
  }
  ctx.fillStyle = '#2e2148';
  ctx.fillRect(430, 220, 70, 40);
  ctx.fillStyle = '#2a9d8f';
  ctx.fillRect(430, 212, 70, 10);
  circle(ctx, 205, 152, 9, '#e63946');
  circle(ctx, 335, 158, 9, '#ff9f1c');
  circle(ctx, 90, 210, 2, '#ffe066');
  circle(ctx, 250, 190, 2, '#ffe066');
  circle(ctx, 480, 180, 2, '#ffe066');
  ground(ctx, 340, '#3d2b4f');
  // festoon lights: 5 bulbs across the top; n5 removes the one at 352
  ctx.strokeStyle = '#1d1430';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 40);
  ctx.quadraticCurveTo(280, 78, 540, 40);
  ctx.stroke();
  for (const bx of [52, 152, 252, 352, 452]) {
    if (bx === 352 && mods.has('n5')) continue;
    circle(ctx, bx, 62, 7, '#ffe066');
    circle(ctx, bx, 62, 11, 'rgba(255, 224, 102, 0.25)');
  }
  // striped awning; n2 flips the middle stripe red -> teal
  const stripeColors = ['#e63946', '#f4f1de', '#e63946', '#f4f1de', '#e63946', '#f4f1de', '#e63946', '#f4f1de'];
  for (let i = 0; i < 8; i++) {
    let c = stripeColors[i];
    if (i === 3 && mods.has('n2')) c = '#2a9d8f';
    ctx.fillStyle = c;
    ctx.fillRect(40 + i * 60, 78, 60, 34);
  }
  ctx.fillStyle = '#8d2f38';
  ctx.fillRect(40, 108, 480, 8);
  // wooden sign with a star; n6 removes the star
  ctx.fillStyle = '#6b4226';
  rr(ctx, 420, 92, 100, 44, 6);
  ctx.fill();
  ctx.fillStyle = '#f4f1de';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MIE AYAM', 470, 112);
  if (!mods.has('n6')) star(ctx, 470, 126, 7, '#ffd60a');
  // hanging lamp; n4 moves it from x 90 to x 140
  const lampX = mods.has('n4') ? 140 : 90;
  ctx.strokeStyle = '#1d1430';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lampX, 112);
  ctx.lineTo(lampX, 128);
  ctx.stroke();
  circle(ctx, lampX, 138, 10, '#ffb703');
  circle(ctx, lampX, 138, 16, 'rgba(255, 183, 3, 0.25)');
  // stall counter
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(30, 280, 500, 60);
  ctx.fillStyle = '#a06b3f';
  ctx.fillRect(30, 280, 500, 10);
  ctx.fillStyle = '#5d3a1e';
  ctx.fillRect(30, 336, 500, 6);
  // steamer baskets
  ctx.fillStyle = '#c89b6a';
  circle(ctx, 90, 272, 22, '#c89b6a');
  circle(ctx, 90, 252, 18, '#d9b380');
  ctx.fillStyle = '#fff3e0';
  circle(ctx, 90, 248, 12, '#fff3e0');
  // chilli jar; n1 removes it
  if (!mods.has('n1')) {
    ctx.fillStyle = '#d62828';
    rr(ctx, 134, 272, 32, 40, 6);
    ctx.fill();
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(138, 266, 24, 8);
    ctx.fillStyle = '#ffd60a';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('🌶', 150, 298);
  }
  // sauce bottles
  ctx.fillStyle = '#2a9d8f';
  rr(ctx, 196, 276, 16, 36, 4);
  ctx.fill();
  ctx.fillStyle = '#e9c46a';
  rr(ctx, 220, 276, 16, 36, 4);
  ctx.fill();
  // bowls on the counter; n3 adds an extra bowl at 428
  const bowls = [300, 350, 400];
  if (mods.has('n3')) bowls.push(428);
  for (const bx of bowls) {
    ctx.fillStyle = '#f4f1de';
    ctx.beginPath();
    ctx.arc(bx, 312, 18, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#e63946';
    ctx.beginPath();
    ctx.arc(bx, 312, 13, 0, Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#8a5a33';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx + 8, 296);
    ctx.lineTo(bx + 26, 288);
    ctx.stroke();
  }
  // crate with the market cat; n7 flips the collar red -> blue
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(452, 352, 84, 48);
  ctx.strokeStyle = '#5d3a1e';
  ctx.lineWidth = 2;
  ctx.strokeRect(452, 352, 84, 48);
  ctx.beginPath();
  ctx.moveTo(452, 376);
  ctx.lineTo(536, 376);
  ctx.stroke();
  ctx.fillStyle = '#f4a261';
  circle(ctx, 494, 336, 16, '#f4a261');
  ctx.beginPath();
  ctx.moveTo(482, 324);
  ctx.lineTo(486, 308);
  ctx.lineTo(494, 320);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(498, 320);
  ctx.lineTo(506, 308);
  ctx.lineTo(510, 324);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#1d3557';
  ctx.fillRect(486, 350, 16, 3);
  circle(ctx, 494, 352, 3, mods.has('n7') ? '#4361ee' : '#e63946');
  // steam wisps
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 3;
  for (const sx of [80, 110, 310]) {
    ctx.beginPath();
    ctx.moveTo(sx, 240);
    ctx.quadraticCurveTo(sx + 8, 220, sx, 202);
    ctx.stroke();
  }
}

// --- Scene 2: Toy & Kite Stall, morning market ---
function paintToys(ctx, mods) {
  sky(ctx, '#8ecae6', '#fef3c7');
  circle(ctx, 500, 60, 26, '#ffd60a');
  circle(ctx, 500, 60, 34, 'rgba(255, 214, 10, 0.3)');
  ctx.fillStyle = '#ffffff';
  circle(ctx, 120, 60, 18, '#ffffff');
  circle(ctx, 140, 54, 14, '#ffffff');
  circle(ctx, 100, 54, 12, '#ffffff');
  ground(ctx, 340, '#74c69d');
  // red kite in the sky; t1 removes one tail ribbon
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.moveTo(122, 66);
  ctx.lineTo(146, 92);
  ctx.lineTo(122, 118);
  ctx.lineTo(98, 92);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#6b4226';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(122, 118);
  ctx.lineTo(132, 160);
  ctx.stroke();
  const ribbons = [126, 142, 158];
  for (let i = 0; i < ribbons.length; i++) {
    if (i === 1 && mods.has('t1')) continue;
    ctx.fillStyle = i % 2 === 0 ? '#ffd60a' : '#4361ee';
    ctx.fillRect(128, ribbons[i], 14, 6);
  }
  // balloons; t2 adds an extra balloon at 432
  const balloons = [
    { x: 380, y: 120, c: '#ef476f' },
    { x: 470, y: 130, c: '#06d6a0' },
    { x: 420, y: 80, c: '#118ab2' },
  ];
  if (mods.has('t2')) balloons.push({ x: 432, y: 102, c: '#ff9f1c' });
  for (const b of balloons) {
    circle(ctx, b.x, b.y, 16, b.c);
    ctx.strokeStyle = '#6b4226';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y + 16);
    ctx.lineTo(b.x + 4, b.y + 30);
    ctx.stroke();
  }
  // stall pole with flag; t6 removes the flag
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(498, 60, 6, 220);
  if (!mods.has('t6')) {
    ctx.fillStyle = '#e63946';
    ctx.beginPath();
    ctx.moveTo(504, 60);
    ctx.lineTo(534, 68);
    ctx.lineTo(504, 78);
    ctx.closePath();
    ctx.fill();
  }
  // striped roof; t7 flips the middle stripe yellow -> purple
  const roofColors = ['#ff9f1c', '#f4f1de', '#ff9f1c', '#f4f1de', '#ff9f1c', '#f4f1de'];
  for (let i = 0; i < 6; i++) {
    let c = roofColors[i];
    if (i === 2 && mods.has('t7')) c = '#7b2cbf';
    ctx.fillStyle = c;
    ctx.fillRect(90 + i * 60, 78, 60, 26);
  }
  ctx.fillStyle = '#8d2f38';
  ctx.fillRect(90, 100, 360, 8);
  // table
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(60, 280, 440, 60);
  ctx.fillStyle = '#a06b3f';
  ctx.fillRect(60, 280, 440, 10);
  // toy drum; t3 flips it blue -> green
  circle(ctx, 252, 302, 20, mods.has('t3') ? '#06d6a0' : '#118ab2');
  ctx.fillStyle = '#f4f1de';
  ctx.fillRect(232, 292, 40, 8);
  ctx.fillRect(232, 304, 40, 8);
  ctx.strokeStyle = '#6b4226';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(236, 282);
  ctx.lineTo(268, 282);
  ctx.stroke();
  // pinwheel; t4 removes one of its 4 blades
  const px = 352;
  const py = 202;
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(px - 2, py, 4, 78);
  const bladeColors = ['#ef476f', '#ffd60a', '#06d6a0', '#118ab2'];
  for (let i = 0; i < 4; i++) {
    if (i === 2 && mods.has('t4')) continue;
    const ang = (i * Math.PI) / 2;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(ang);
    ctx.fillStyle = bladeColors[i];
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(22, -8);
    ctx.lineTo(22, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  circle(ctx, px, py, 6, '#f4f1de');
  // teddy bear; t5 moves it from x 180 to x 222
  const tx = mods.has('t5') ? 222 : 180;
  ctx.fillStyle = '#b08968';
  circle(ctx, tx, 318, 16, '#b08968');
  circle(ctx, tx - 12, 336, 10, '#b08968');
  circle(ctx, tx + 12, 336, 10, '#b08968');
  circle(ctx, tx, 340, 18, '#b08968');
  circle(ctx, tx - 8, 312, 5, '#b08968');
  circle(ctx, tx + 8, 312, 5, '#b08968');
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.moveTo(tx - 6, 336);
  ctx.lineTo(tx + 6, 336);
  ctx.lineTo(tx, 344);
  ctx.closePath();
  ctx.fill();
  // wooden horse and blocks
  ctx.fillStyle = '#e07a5f';
  rr(ctx, 420, 300, 56, 26, 8);
  ctx.fill();
  circle(ctx, 428, 296, 8, '#e07a5f');
  ctx.fillStyle = '#f4f1de';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A', 110, 300);
  ctx.fillStyle = '#118ab2';
  ctx.fillRect(96, 306, 26, 26);
  ctx.fillStyle = '#ffd60a';
  ctx.fillRect(128, 306, 26, 26);
  // flowers on the grass
  for (const fx of [40, 90, 520, 200, 300]) {
    circle(ctx, fx, 372, 5, '#ef476f');
    circle(ctx, fx, 372, 2, '#ffd60a');
  }
}

// --- Scene 3: The Old Bookshop, lamplight ---
function paintBooks(ctx, mods) {
  sky(ctx, '#3a2a1a', '#6b4226');
  ground(ctx, 340, '#4a3220');
  // window with the moon; b7 flips the moon yellow -> orange
  ctx.fillStyle = '#2b1e4d';
  rr(ctx, 56, 48, 100, 110, 8);
  ctx.fill();
  circle(ctx, 92, 82, 20, mods.has('b7') ? '#fb8500' : '#ffe066');
  ctx.fillStyle = '#2b1e4d';
  ctx.fillRect(100, 48, 6, 110);
  ctx.fillRect(56, 98, 100, 6);
  ctx.strokeStyle = '#8a5a33';
  ctx.lineWidth = 4;
  ctx.strokeRect(56, 48, 100, 110);
  // bookshelves
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(200, 40, 300, 200);
  ctx.fillStyle = '#4a3220';
  ctx.fillRect(210, 50, 280, 180);
  const shelfBooks = [
    { x: 220, c: '#e63946' }, { x: 246, c: '#2a9d8f' }, { x: 272, c: '#e9c46a' },
    { x: 298, c: '#4361ee' }, { x: 324, c: '#ef476f' }, { x: 350, c: '#06d6a0' },
    { x: 376, c: '#ffd60a' },
  ];
  for (const b of shelfBooks) {
    ctx.fillStyle = b.c;
    ctx.fillRect(b.x, 120, 22, 50);
  }
  // b2 adds an extra book on the middle shelf at 402
  if (mods.has('b2')) {
    ctx.fillStyle = '#7b2cbf';
    ctx.fillRect(402, 122, 20, 48);
  }
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(210, 170, 280, 8);
  for (const b of shelfBooks) {
    ctx.fillStyle = b.c;
    ctx.fillRect(b.x, 196, 22, 34);
  }
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(210, 230, 280, 8);
  // wall clock; b5 slides it down from y 90 to y 132
  const cy = mods.has('b5') ? 132 : 90;
  circle(ctx, 470, cy, 22, '#f4f1de');
  ctx.strokeStyle = '#6b4226';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(470, cy, 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(470, cy);
  ctx.lineTo(470, cy - 12);
  ctx.moveTo(470, cy);
  ctx.lineTo(478, cy + 6);
  ctx.stroke();
  // floor stack of books; b4 removes one, 4 -> 3
  const stack = ['#e63946', '#2a9d8f', '#e9c46a', '#4361ee'];
  const stackCount = mods.has('b4') ? 3 : 4;
  for (let i = 0; i < stackCount; i++) {
    ctx.fillStyle = stack[i];
    ctx.fillRect(180, 262 - i * 14, 64 - i * 4, 12);
  }
  // desk with candle; b1 removes the candle
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(100, 300, 160, 14);
  ctx.fillRect(112, 314, 10, 40);
  ctx.fillRect(238, 314, 10, 40);
  if (!mods.has('b1')) {
    ctx.fillStyle = '#f4f1de';
    ctx.fillRect(138, 282, 8, 20);
    ctx.fillStyle = '#ffd60a';
    circle(ctx, 142, 276, 6, '#ffd60a');
    circle(ctx, 142, 276, 10, 'rgba(255, 214, 10, 0.3)');
  }
  ctx.fillStyle = '#118ab2';
  ctx.fillRect(180, 284, 40, 18);
  // rug; b3 flips it red -> green
  ctx.fillStyle = mods.has('b3') ? '#2a9d8f' : '#9d0208';
  rr(ctx, 220, 356, 160, 34, 8);
  ctx.fill();
  ctx.strokeStyle = '#e9c46a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(230, 373);
  ctx.lineTo(370, 373);
  ctx.stroke();
  // armchair with the sleeping cat; b6 removes the tail
  ctx.fillStyle = '#7f4f24';
  rr(ctx, 320, 300, 110, 60, 12);
  ctx.fill();
  ctx.fillStyle = '#935e2e';
  rr(ctx, 320, 286, 110, 30, 12);
  ctx.fill();
  ctx.fillStyle = '#e8e8e8';
  circle(ctx, 352, 312, 16, '#e8e8e8');
  ctx.beginPath();
  ctx.moveTo(340, 302);
  ctx.lineTo(344, 288);
  ctx.lineTo(350, 300);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(356, 300);
  ctx.lineTo(362, 288);
  ctx.lineTo(366, 302);
  ctx.closePath();
  ctx.fill();
  if (!mods.has('b6')) {
    ctx.strokeStyle = '#e8e8e8';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(368, 322);
    ctx.quadraticCurveTo(392, 330, 396, 312);
    ctx.stroke();
  }
  // potted plant
  ctx.fillStyle = '#c1440e';
  ctx.beginPath();
  ctx.moveTo(500, 330);
  ctx.lineTo(516, 330);
  ctx.lineTo(512, 356);
  ctx.lineTo(504, 356);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2a9d8f';
  circle(ctx, 508, 316, 12, '#2a9d8f');
  circle(ctx, 498, 322, 9, '#2a9d8f');
  circle(ctx, 518, 322, 9, '#2a9d8f');
}

export function paintScene(ctx, sceneId, mods) {
  if (sceneId === 'noodle') paintNoodle(ctx, mods);
  else if (sceneId === 'toys') paintToys(ctx, mods);
  else paintBooks(ctx, mods);
}

export function allDiffIds(sceneId) {
  const ids = {
    noodle: ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7'],
    toys: ['t1', 't2', 't3', 't4', 't5', 't6', 't7'],
    books: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7'],
  };
  return new Set(ids[sceneId] || []);
}
