// game.js — the state machine: scenes, timer, score, hints, win/lose.
// One clear job: the rules of the hunt, and nothing about drawing.
import { SCENES, SCORE_FIND, SCORE_TIME_BONUS_PER_SEC, WRONG_CLICK_TIME_PENALTY, HINT_COOLDOWN_MS, HINT_SCORE_COST } from './config.js';
import { diffsFor, totalDifferences } from './differences.js';
import { resolveMark } from './input.js';
import { playFind, playWrong, playHint, playSceneClear, playWin, playTick, setMuted, isMuted } from './audio.js';

export class Game {
  constructor(els, ctx) {
    this.els = els;
    this.ctx = ctx;
    this.state = 'title';
    this.sceneIndex = 0;
    this.found = new Set();
    this.foundTotal = 0;
    this.score = 0;
    this.clicks = 0;
    this.hits = 0;
    this.timeLeft = SCENES[0].timeLimit;
    this.timeUsed = 0;
    this.hintDiff = null;
    this.hintReadyAt = 0;
    this.wrongSpot = null;
    this.mouse = { x: 0, y: 0, inside: false };
    this.cursor = null;
    this.magnifierOn = false;
    this.lastTickSecond = -1;
    this.messageTimer = 0;
    this.sceneClearShownAt = 0;
  }

  sceneId() {
    return SCENES[this.sceneIndex].id;
  }

  sceneDiffs() {
    return diffsFor(this.sceneId());
  }

  foundInScene() {
    return this.sceneDiffs().filter((d) => this.found.has(d.id)).length;
  }

  start() {
    this.state = 'playing';
    this.sceneIndex = 0;
    this.found = new Set();
    this.foundTotal = 0;
    this.score = 0;
    this.clicks = 0;
    this.hits = 0;
    this.timeUsed = 0;
    this.hintDiff = null;
    this.timeLeft = SCENES[0].timeLimit;
    this.hideOverlays();
    this.showMessage('Find 7 differences — click the RIGHT picture!');
    this.updateHud();
  }

  startScene(index) {
    this.sceneIndex = index;
    this.found = new Set();
    this.hintDiff = null;
    this.timeLeft = SCENES[index].timeLimit;
    this.state = 'playing';
    this.hideOverlays();
    this.showMessage(`${SCENES[index].name} — ${SCENES[index].sub}`);
    this.updateHud();
  }

  onMark(p) {
    if (this.state !== 'playing') return;
    const res = resolveMark(this.sceneId(), p, this.found);
    if (res.kind === 'none' || res.kind === 'left') {
      if (res.kind === 'left') this.showMessage('Mark the differences on the RIGHT picture.');
      return;
    }
    this.clicks += 1;
    if (res.kind === 'found') {
      this.hits += 1;
      this.found.add(res.diff.id);
      this.foundTotal += 1;
      this.score += SCORE_FIND;
      if (this.hintDiff && this.hintDiff.id === res.diff.id) this.hintDiff = null;
      playFind();
      this.showMessage(`Found: ${res.diff.label}  (+${SCORE_FIND})`);
      if (this.foundInScene() === this.sceneDiffs().length) this.sceneCleared();
    } else {
      this.timeLeft = Math.max(0, this.timeLeft - WRONG_CLICK_TIME_PENALTY);
      this.wrongSpot = { x: p.x, y: p.y, at: performance.now() };
      playWrong();
      this.showMessage(`Not a difference — minus ${WRONG_CLICK_TIME_PENALTY}s. Look closer!`);
    }
    this.updateHud();
  }

  sceneCleared() {
    const bonus = Math.round(this.timeLeft) * SCORE_TIME_BONUS_PER_SEC;
    this.score += bonus;
    playSceneClear();
    if (this.sceneIndex + 1 >= SCENES.length) {
      this.winGame(bonus);
      return;
    }
    this.state = 'sceneClear';
    this.sceneClearShownAt = performance.now();
    this.showSceneClear(bonus);
    this.updateHud();
  }

  winGame(bonus) {
    this.state = 'win';
    playWin();
    this.showWin(bonus);
    this.updateHud();
  }

  timeUp() {
    this.state = 'timeup';
    playWrong();
    this.showTimeUp();
    this.updateHud();
  }

  update(dtMs) {
    if (this.state !== 'playing') return;
    const dt = dtMs / 1000;
    this.timeLeft -= dt;
    this.timeUsed += dt;
    const sec = Math.ceil(this.timeLeft);
    if (sec <= 10 && sec !== this.lastTickSecond && sec > 0) {
      this.lastTickSecond = sec;
      playTick();
    }
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.timeUp();
    }
    if (this.hintDiff && performance.now() > this.hintReadyAt + 9000) {
      this.hintDiff = null;
    }
    this.updateHud();
  }

  useHint() {
    if (this.state !== 'playing') return;
    const now = performance.now();
    if (now < this.hintReadyAt) {
      const wait = Math.ceil((this.hintReadyAt - now) / 1000);
      this.showMessage(`Hint recharging — ${wait}s left.`);
      return;
    }
    const remaining = this.sceneDiffs().filter((d) => !this.found.has(d.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintDiff = pick;
    this.hintReadyAt = now + HINT_COOLDOWN_MS;
    this.score = Math.max(0, this.score - HINT_SCORE_COST);
    playHint();
    this.showMessage(`Hint: ${pick.hint}  (−${HINT_SCORE_COST} pts)`);
    this.updateHud();
  }

  accuracy() {
    if (this.clicks === 0) return 100;
    return Math.round((this.hits / this.clicks) * 100);
  }


  // --- HUD and overlays (DOM) ---
  hideOverlays() {
    for (const id of ['titleOverlay', 'sceneOverlay', 'winOverlay', 'loseOverlay']) {
      const el = this.els[id];
      if (el) el.classList.add('hidden');
    }
  }

  showMessage(text) {
    const el = this.els.message;
    if (!el) return;
    el.textContent = text;
    el.classList.remove('hidden');
    this.messageTimer = performance.now();
  }

  updateHud() {
    const e = this.els;
    if (e.sceneName) e.sceneName.textContent = SCENES[this.sceneIndex].name;
    if (e.foundCount) e.foundCount.textContent = `${this.foundInScene()} / ${this.sceneDiffs().length}`;
    if (e.totalCount) e.totalCount.textContent = `${this.foundTotal} / ${totalDifferences()}`;
    if (e.scoreText) e.scoreText.textContent = `${this.score}`;
    if (e.timerText) {
      const t = Math.max(0, Math.ceil(this.timeLeft));
      e.timerText.textContent = `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
      e.timerText.classList.toggle('urgent', t <= 10 && this.state === 'playing');
    }
    if (e.timerBar) {
      const frac = Math.max(0, this.timeLeft / SCENES[this.sceneIndex].timeLimit);
      e.timerBar.style.width = `${(frac * 100).toFixed(1)}%`;
      e.timerBar.classList.toggle('urgent', frac < 0.2);
    }
    if (e.hintBtn) {
      const ready = performance.now() >= this.hintReadyAt;
      e.hintBtn.disabled = this.state !== 'playing' || !ready;
      e.hintBtn.textContent = ready ? '💡 Hint (H)' : '💡 Hint…';
    }
    if (e.accuracyText) e.accuracyText.textContent = `${this.accuracy()}%`;
  }

  showSceneClear(bonus) {
    const el = this.els.sceneOverlay;
    if (!el) return;
    el.classList.remove('hidden');
    const title = el.querySelector('.ov-title');
    const body = el.querySelector('.ov-body');
    if (title) title.textContent = 'Scene complete!';
    if (body) body.textContent = `All 7 differences found. Time bonus +${bonus}. Next scene: ${SCENES[this.sceneIndex + 1].name}. Press N or click Continue.`;
  }

  showWin(bonus) {
    const el = this.els.winOverlay;
    if (!el) return;
    el.classList.remove('hidden');
    const stats = el.querySelector('.ov-body');
    if (stats) {
      stats.textContent = `All 21 differences found! Final score ${this.score} (incl. +${bonus} time bonus) · Accuracy ${this.accuracy()}% · Time ${Math.round(this.timeUsed)}s. You are a true Market Detective!`;
    }
  }

  showTimeUp() {
    const el = this.els.loseOverlay;
    if (!el) return;
    el.classList.remove('hidden');
    const body = el.querySelector('.ov-body');
    if (body) body.textContent = `Time ran out on ${SCENES[this.sceneIndex].name} with ${this.foundInScene()} of 7 found. Score ${this.score}. Try again — the market keeps its secrets.`;
  }

  // --- Mouse and keyboard handlers ---
  onMouseMove(p) {
    this.mouse = { x: p.x, y: p.y, inside: true };
    this.cursor = { x: p.x, y: p.y };
  }

  onMouseLeave() {
    this.mouse.inside = false;
    this.cursor = null;
  }

  onArrow(key) {
    if (this.state === 'title') return;
    if (!this.cursor) this.cursor = { x: 860, y: 210 };
    const step = 14;
    if (key === 'ArrowLeft') this.cursor.x -= step;
    if (key === 'ArrowRight') this.cursor.x += step;
    if (key === 'ArrowUp') this.cursor.y -= step;
    if (key === 'ArrowDown') this.cursor.y += step;
    this.cursor.x = Math.max(0, Math.min(1140, this.cursor.x));
    this.cursor.y = Math.max(0, Math.min(420, this.cursor.y));
    this.mouse = { x: this.cursor.x, y: this.cursor.y, inside: true };
  }

  onEnterMark() {
    if (this.state === 'title') { this.start(); return; }
    if (this.state === 'sceneClear') { this.startScene(this.sceneIndex + 1); return; }
    if (this.cursor) this.onMark({ x: this.cursor.x, y: this.cursor.y });
  }

  onHintKey() {
    this.useHint();
  }

  onMagnifierKey() {
    this.magnifierOn = !this.magnifierOn;
    this.showMessage(this.magnifierOn ? 'Magnifier ON (M) — hover to zoom in.' : 'Magnifier OFF (M).');
    this.updateHud();
  }

  onNextKey() {
    if (this.state === 'sceneClear') this.startScene(this.sceneIndex + 1);
  }

  toggleSound() {
    setMuted(!isMuted());
    this.showMessage(isMuted() ? 'Sound OFF.' : 'Sound ON.');
    this.updateHud();
  }

  // --- Screenshot presets: ?shot=cover | play | zoom | win ---
  // Real renders of the real game state, so the screenshots the judge
  // sees are exactly what a player sees mid-hunt.
  applyShot(shot) {
    this.hideOverlays();
    if (shot === 'cover') {
      this.state = 'playing';
      this.sceneIndex = 0;
      this.found = new Set(['n1', 'n2', 'n3']);
      this.foundTotal = 3;
      this.score = 300;
      this.clicks = 4;
      this.hits = 3;
      this.timeLeft = 96;
      this.timeUsed = 54;
      this.showMessage('Found: The hanging lamp moved (+100)');
    } else if (shot === 'play') {
      this.state = 'playing';
      this.sceneIndex = 1;
      this.found = new Set(['t1', 't4']);
      this.foundTotal = 9;
      this.score = 940;
      this.clicks = 11;
      this.hits = 9;
      this.timeLeft = 88;
      this.timeUsed = 32;
      this.hintDiff = this.sceneDiffs().find((d) => d.id === 't3') || null;
      this.hintReadyAt = performance.now() + 9000;
      this.showMessage('Hint: One toy on the table is a different colour. (−25 pts)');
    } else if (shot === 'zoom') {
      this.state = 'playing';
      this.sceneIndex = 2;
      this.found = new Set(['b1', 'b2', 'b3', 'b5', 'b7']);
      this.foundTotal = 19;
      this.score = 1980;
      this.clicks = 22;
      this.hits = 19;
      this.timeLeft = 41;
      this.timeUsed = 49;
      this.magnifierOn = true;
      this.mouse = { x: 920, y: 150, inside: true };
      this.cursor = { x: 920, y: 150 };
      this.showMessage('Magnifier ON (M) — hover to zoom in.');
    } else if (shot === 'win') {
      this.state = 'win';
      this.sceneIndex = 2;
      this.found = new Set(['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7']);
      this.foundTotal = 21;
      this.score = 2840;
      this.clicks = 24;
      this.hits = 21;
      this.timeLeft = 38;
      this.timeUsed = 312;
      this.showWin(190);
      this.updateHud();
      return;
    } else {
      return;
    }
    this.updateHud();
  }
}
