// audio.js — tiny WebAudio sound effects, no audio files.
// One clear job: every beep, chime and thud the game makes.
let audioCtx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function ensureCtx() {
  if (audioCtx) return audioCtx;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  } catch (e) {
    audioCtx = null;
  }
  return audioCtx;
}

function tone(freq, startAt, dur, type, vol) {
  if (muted) return;
  const ctx = ensureCtx();
  if (!ctx) return;
  try {
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
    gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + startAt);
    osc.stop(ctx.currentTime + startAt + dur + 0.05);
  } catch (e) {
    // Sound is garnish: never let it break the game.
  }
}

export function playFind() {
  tone(660, 0, 0.12, 'sine', 0.25);
  tone(880, 0.09, 0.18, 'sine', 0.25);
  tone(1320, 0.18, 0.22, 'sine', 0.18);
}

export function playWrong() {
  tone(180, 0, 0.16, 'square', 0.12);
  tone(140, 0.1, 0.2, 'square', 0.1);
}

export function playHint() {
  tone(520, 0, 0.1, 'triangle', 0.2);
  tone(780, 0.08, 0.14, 'triangle', 0.2);
}

export function playSceneClear() {
  tone(523, 0, 0.14, 'sine', 0.22);
  tone(659, 0.12, 0.14, 'sine', 0.22);
  tone(784, 0.24, 0.22, 'sine', 0.22);
}

export function playWin() {
  const notes = [523, 659, 784, 1047, 784, 1047];
  notes.forEach((n, i) => tone(n, i * 0.13, 0.2, 'sine', 0.22));
}

export function playTick() {
  tone(980, 0, 0.05, 'square', 0.06);
}
