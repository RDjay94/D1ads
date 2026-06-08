/* BIGTAKA FREE-PLAY — shared app logic */
/* Wallet • Catalog • Modals • Filters • SFX */

// ============ AUDIO (Web Audio synthesized SFX) ============
const SFX_KEY = 'bigtaka_freeplay_sfx_v1';
const Sfx = {
  ctx: null,
  enabled: localStorage.getItem(SFX_KEY) !== '0',
  master: 0.35,

  _ensure() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { this.enabled = false; return null; }
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    return this.ctx;
  },

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem(SFX_KEY, this.enabled ? '1' : '0');
    this.render();
    if (this.enabled) this.click();
  },

  render() {
    document.querySelectorAll('[data-sfx-icon]').forEach(el => {
      el.textContent = this.enabled ? '🔊' : '🔇';
    });
    document.querySelectorAll('[data-sfx-btn]').forEach(el => {
      el.title = this.enabled ? 'Mute sounds' : 'Unmute sounds';
      el.style.opacity = this.enabled ? '1' : '0.5';
    });
  },

  _tone(freq, dur, type = 'sine', vol = 0.3, attack = 0.005) {
    const ctx = this._ensure();
    if (!ctx || !this.enabled) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(vol * this.master, ctx.currentTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.02);
  },

  _slide(freqStart, freqEnd, dur, type = 'sine', vol = 0.3) {
    const ctx = this._ensure();
    if (!ctx || !this.enabled) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), ctx.currentTime + dur);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(vol * this.master, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.02);
  },

  _noise(dur, vol = 0.2, freq = 1500, q = 1) {
    const ctx = this._ensure();
    if (!ctx || !this.enabled) return;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = q;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol * this.master, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  },

  // ============ SOUND VOCABULARY ============
  click()    { this._tone(820, 0.05, 'square', 0.14); },
  hover()    { this._tone(1400, 0.025, 'sine', 0.07); },
  tick()     { this._tone(560, 0.04, 'square', 0.18); },
  open()     { this._slide(440, 880, 0.16, 'triangle', 0.18); },
  close()    { this._slide(880, 440, 0.12, 'triangle', 0.15); },

  bet() {
    this._tone(523, 0.06, 'triangle', 0.22);
    setTimeout(() => this._tone(659, 0.08, 'triangle', 0.2), 40);
  },

  coin() {
    // Crisp "ka-ching": 3 rising metallic pings + a sustained ring
    this._tone(1320, 0.06, 'triangle', 0.22);
    setTimeout(() => this._tone(1760, 0.07, 'triangle', 0.2), 45);
    setTimeout(() => this._tone(2637, 0.1, 'triangle', 0.2), 100);
    setTimeout(() => { this._tone(2093, 0.5, 'sine', 0.13); this._tone(3136, 0.45, 'sine', 0.08); }, 110);
  },

  // ============ CELEBRATION SOUNDS ============

  // Bell — sustained sine harmonic stack (used in win celebrations)
  bell(freq, dur = 0.6, vol = 0.18) {
    const ctx = this._ensure();
    if (!ctx || !this.enabled) return;
    const t = ctx.currentTime;
    // 3 harmonics for bell-like overtones
    [1, 2.01, 3.02].forEach((mult, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq * mult;
      const gain = ctx.createGain();
      const v = (vol / (i + 1)) * this.master;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(v, t + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    });
  },

  // Sparkle — rapid high-pitched chimes (the "shimmer" of a win)
  sparkle(count = 8, baseDelay = 35) {
    if (!this.enabled) return;
    const pool = [2093, 2349, 2637, 3136, 3520, 3951, 4186, 2637, 2093];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const f = pool[Math.floor(Math.random() * pool.length)];
        this._tone(f, 0.1, 'sine', 0.12);
      }, i * baseDelay + Math.random() * 20);
    }
  },

  // Crowd cheer — filtered noise burst with amplitude swell
  cheer(dur = 0.55, vol = 0.15) {
    const ctx = this._ensure();
    if (!ctx || !this.enabled) return;
    const t = ctx.currentTime;
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      // Swell envelope shaped like a cheer (fade in, hold, fade out)
      const env = Math.sin(i / len * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1400;
    filter.Q.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.value = vol * this.master;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(t);
  },

  // Coin shower — rapid metallic "ka-ching" pings
  coinShower(count = 14, baseDelay = 60) {
    if (!this.enabled) return;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const f = 1100 + Math.random() * 2000;
        this._tone(f, 0.08, 'triangle', 0.16);
        this._tone(f * 1.5, 0.06, 'sine', 0.1);
      }, i * baseDelay + Math.random() * 30);
    }
  },

  // win() — small win: chord stab + sparkle + light cheer (~700ms)
  win() {
    // C major chord stab
    [523, 659, 784, 1047].forEach(f => this._tone(f, 0.4, 'triangle', 0.2));
    // Bell ring on top
    setTimeout(() => this.bell(1568, 0.7, 0.16), 30);
    // Sparkle layer
    setTimeout(() => this.sparkle(6, 45), 80);
    // Light cheer
    setTimeout(() => this.cheer(0.45, 0.1), 60);
  },

  // bigWin() — medium win: fanfare chord progression + sparkle shower + cheer + bell (~1.6s)
  bigWin() {
    // I → IV → V → I fanfare (C-F-G-C)
    [
      [523, 659, 784, 1047],          // C major
      [698, 880, 1047, 1397],         // F major
      [784, 988, 1175, 1568],         // G major
      [1047, 1319, 1568, 2093]        // C major (octave up, climactic)
    ].forEach((chord, i) => {
      setTimeout(() => chord.forEach(f => this._tone(f, 0.55, 'triangle', 0.22)), i * 220);
    });
    // Sparkle storm during last 2 chords
    setTimeout(() => this.sparkle(14, 45), 400);
    // Bell chime on the climax
    setTimeout(() => { this.bell(2093, 1.2, 0.16); this.bell(2637, 1.2, 0.12); }, 660);
    // Cheer underneath
    setTimeout(() => this.cheer(0.9, 0.13), 100);
    // Coin pings
    setTimeout(() => this.coinShower(6, 80), 200);
  },

  // jackpot() — huge win: coin shower + ascending chord stack + bell choir + extended cheer (~2.5s)
  jackpot() {
    // Coin avalanche
    this.coinShower(20, 55);
    // Ascending chord crescendo (C → F → G → Am → F → G → C-major-9)
    [
      [523, 659, 784],
      [587, 698, 880],
      [659, 784, 988],
      [698, 880, 1047],
      [784, 988, 1175],
      [880, 1109, 1319],
      [988, 1175, 1397],
      [1047, 1319, 1568, 1976, 2349]  // C major 9 — the climax
    ].forEach((chord, i) => {
      setTimeout(() => chord.forEach(f => this._tone(f, 0.5, 'triangle', 0.22)), 220 + i * 180);
    });
    // Long bell choir at the climax
    setTimeout(() => {
      this.bell(2093, 2.0, 0.18);
      this.bell(2637, 2.0, 0.14);
      this.bell(3136, 2.0, 0.11);
    }, 1600);
    // Sustained cheer
    setTimeout(() => this.cheer(1.6, 0.16), 200);
    // Sparkle storm throughout
    for (let i = 0; i < 25; i++) {
      setTimeout(() => {
        const f = 2000 + Math.random() * 3500;
        this._tone(f, 0.08, 'sine', 0.09);
      }, 200 + Math.random() * 2400);
    }
  },

  loss() {
    this._slide(330, 165, 0.28, 'sawtooth', 0.22);
  },

  crash() {
    this._noise(0.45, 0.4, 220, 0.4);
    this._tone(110, 0.4, 'sawtooth', 0.28);
    setTimeout(() => this._slide(180, 60, 0.4, 'sawtooth', 0.22), 30);
  },

  bounce(pitch = 1) {
    this._tone(800 * pitch, 0.035, 'triangle', 0.11);
  },

  gem() {
    this._tone(880, 0.07, 'triangle', 0.18);
    setTimeout(() => this._tone(1320, 0.1, 'triangle', 0.16), 55);
  },

  mine() {
    this._noise(0.5, 0.42, 120, 0.6);
    this._tone(70, 0.5, 'sawtooth', 0.32);
  },

  spin()     { this._noise(0.35, 0.16, 2200, 1.5); },
  reelStop() { this._tone(420, 0.07, 'square', 0.2); this._noise(0.05, 0.1, 800); },
  deal()     { this._noise(0.07, 0.18, 4500, 1); },
  swish()    { this._noise(0.22, 0.24, 5500, 1.2); },

  thwack() {
    this._noise(0.07, 0.32, 900, 0.8);
    this._tone(170, 0.08, 'sine', 0.25);
  },

  whoosh() { this._noise(0.18, 0.18, 3200, 1.5); },

  wheelTick() { this._tone(560, 0.035, 'square', 0.12); },

  takeoff() { this._slide(180, 720, 0.5, 'sawtooth', 0.22); }
};


// ============ WALLET (FUN coins) ============
const WALLET_KEY = 'bigtaka_freeplay_balance_v1';
const STARTING_BALANCE = 10000;

const Wallet = {
  get() {
    const v = localStorage.getItem(WALLET_KEY);
    if (v === null) {
      localStorage.setItem(WALLET_KEY, String(STARTING_BALANCE));
      return STARTING_BALANCE;
    }
    return Math.max(0, parseFloat(v) || 0);
  },
  set(v) {
    const value = Math.max(0, Math.round(v));
    localStorage.setItem(WALLET_KEY, String(value));
    this.render();
    return value;
  },
  add(delta) { return this.set(this.get() + delta); },
  reset() {
    if (confirm('Reset your FUN balance to 10,000? These are practice coins — nothing real on the line.')) {
      this.set(STARTING_BALANCE);
      Sfx.coin();
      toast('Balance reset to 10,000 FUN coins', 'win');
    }
  },
  format(n) {
    return Math.round(n).toLocaleString('en-US');
  },
  render() {
    document.querySelectorAll('[data-wallet]').forEach(el => {
      el.textContent = this.format(this.get());
    });
  }
};

// ============ TOAST ============
function toast(msg, type = '') {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.className = 'toast ' + type;
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ============ GAME CATALOG ============
const CATEGORIES = {
  slots:  { name: 'Slots',        emoji: '🎰', count: 25, blurb: 'Spin the reels — match symbols to win.' },
  live:   { name: 'Live Casino',  emoji: '♠️', count: 22, blurb: 'Real dealers, real-time action.' },
  crash:  { name: 'Aviator & Crash', emoji: '🚀', count: 10, blurb: 'Cash out before the rocket crashes.' },
  fast:   { name: 'Fast Games',   emoji: '⚡', count: 5,  blurb: 'Quick rounds, instant outcomes.' },
  sports: { name: 'Sports',       emoji: '🏏', count: 10, blurb: 'Cricket, soccer & NBA challenges.' }
};

const GAMES = [
  // ===== SLOTS (20) =====
  { id: 'gates-olympus', cat: 'slots', name: 'Gates of Olympus', provider: 'Pragmatic Play', color: ['#ffb800', '#ff6a00'], icon: '⚡', tag: 'hot', play: 'games/slot.html?theme=olympus&name=Gates+of+Olympus',
    rtp: '96.50%', volatility: 'High', maxWin: '5,000×', minBet: '20 FUN',
    how: 'Zeus rains down golden multipliers. Land 8+ matching symbols anywhere on the 6×5 grid to win. Multipliers (2×–500×) drop randomly and stack.',
    rules: ['Pays anywhere — no paylines, just 8+ symbols', 'Lightning multipliers (2×–500×) appear randomly', 'Free Spins triggered by 4+ scatter symbols', 'Multipliers persist & combine in Free Spins'],
    strategy: 'Patient bankroll wins. Set a session budget. The big payouts come from rare lightning-multiplier hits during Free Spins — chase the bonus, not the base game.'
  },
  { id: 'sweet-bonanza', cat: 'slots', name: 'Sweet Bonanza', provider: 'Pragmatic Play', color: ['#ff5fde', '#ff1ed7'], icon: '🍬', tag: 'hot', play: 'games/slot.html?theme=candy&name=Sweet+Bonanza',
    rtp: '96.48%', volatility: 'High', maxWin: '21,100×', minBet: '20 FUN',
    how: 'A 6×5 candy-themed grid. Land 8+ matching fruits anywhere for a win. Bombs drop with random multipliers up to 100×.',
    rules: ['Pay-anywhere mechanic — no fixed lines', 'Tumble feature: winning symbols disappear, new ones drop', 'Free Spins triggered by 4 lollipop scatters', 'Buy Bonus available (100× bet)'],
    strategy: 'Tumbles can chain into massive wins. The bonus round is where the 21,100× hits happen — base game is mostly small wins.'
  },
  { id: 'sugar-rush', cat: 'slots', name: 'Sugar Rush', provider: 'Pragmatic Play', color: ['#ff8fb1', '#ff4d8a'], icon: '🍭', tag: 'new', play: 'games/slot.html?theme=candy&name=Sugar+Rush',
    rtp: '96.50%', volatility: 'High', maxWin: '5,000×', minBet: '20 FUN',
    how: '7×7 cluster pays grid. Cluster wins build multipliers on positions, which persist for the round and compound in free spins.',
    rules: ['Cluster pays — 5+ matching adjacent symbols', 'Sticky multipliers on winning positions', 'Free Spins multiply up to 128×', 'Buy Bonus feature available'],
    strategy: 'Stacking position multipliers is the key. Don\'t bail early — late tumbles often trigger the biggest combos.'
  },
  { id: 'starlight-princess', cat: 'slots', name: 'Starlight Princess', provider: 'Pragmatic Play', color: ['#9d6cff', '#500ecf'], icon: '👸', tag: 'tutorial', play: 'games/slot.html?theme=cosmic&name=Starlight+Princess',
    rtp: '96.50%', volatility: 'High', maxWin: '5,000×', minBet: '20 FUN',
    how: 'Anime-styled 6×5 grid. Random multipliers up to 500× drop on winning combos. 4+ scatters trigger Free Spins.',
    rules: ['Pay-anywhere with 8+ matching symbols', 'Multipliers add together (not multiply)', '15 free spins on 4 scatters, more on 5+', 'Buy Bonus: 100× bet'],
    strategy: 'Mathematically similar to Gates of Olympus — patience required. Free Spins is where the big wins live.'
  },
  { id: 'wild-west-gold', cat: 'slots', name: 'Wild West Gold', provider: 'Pragmatic Play', color: ['#d4a017', '#7a4a0d'], icon: '🤠', tag: 'tutorial', play: 'games/slot.html?theme=western&name=Wild+West+Gold',
    rtp: '96.51%', volatility: 'High', maxWin: '10,000×', minBet: '20 FUN',
    how: 'Classic 5×4 reel slot with 40 fixed paylines. Sticky wilds with 2×/3×/5× multipliers turn ordinary spins into massive payouts.',
    rules: ['40 fixed paylines', 'Wild multipliers stack and combine', 'Free spins: 8/12/20 for 3/4/5 scatters', 'Buy Bonus: 100× bet'],
    strategy: 'Multiple sticky wilds in free spins can hit 125× per spin (5×5×5). Worth the bonus buy if you have a strong bankroll.'
  },
  { id: 'dog-house', cat: 'slots', name: 'The Dog House', provider: 'Pragmatic Play', color: ['#7a4a0d', '#3d2506'], icon: '🐕', tag: 'tutorial', play: 'games/slot.html?theme=classic&name=The+Dog+House',
    rtp: '96.51%', volatility: 'High', maxWin: '6,750×', minBet: '20 FUN',
    how: '5×3 reels with 20 paylines. Sticky wilds with 2× or 3× multipliers during free spins are the big-win mechanic.',
    rules: ['20 fixed paylines', 'Wilds appear on reels 2, 3, 4', 'Free Spins: sticky wilds with multipliers', 'Buy Bonus: 100× bet'],
    strategy: 'Cute aesthetic, brutal volatility. Save your big bets for the bonus round.'
  },
  { id: 'big-bass', cat: 'slots', name: 'Big Bass Bonanza', provider: 'Pragmatic Play', color: ['#1ec0ff', '#0066b3'], icon: '🎣', tag: 'play', play: 'games/slot.html?theme=ocean&name=Big+Bass+Bonanza',
    rtp: '96.71%', volatility: 'High', maxWin: '2,100×', minBet: '10 FUN',
    how: 'Fishing-themed 5×3 slot. Money fish symbols carry cash values. Wild fishermen "collect" all money fish on screen during free spins.',
    rules: ['10 fixed paylines', 'Money symbols hold cash values 2×–2000×', 'Free Spins: fisherman collects all money symbols', 'Retrigger up to 30 free spins'],
    strategy: 'A money symbol + a fisherman wild in free spins = instant collect. Lower volatility than Pragmatic\'s flagship titles.'
  },
  { id: 'fruit-party', cat: 'slots', name: 'Fruit Party', provider: 'Pragmatic Play', color: ['#ff5fde', '#a4ff2c'], icon: '🍓', tag: 'tutorial', play: 'games/slot.html?theme=candy&name=Fruit+Party',
    rtp: '96.50%', volatility: 'High', maxWin: '5,000×', minBet: '20 FUN',
    how: '7×7 cluster grid. Five or more matching fruits in any adjacent cluster trigger a win. Random multipliers in base game; cumulative multipliers in bonus.',
    rules: ['Cluster pays (no paylines)', 'Tumble mechanic between wins', '256× multiplier cap in Free Spins', 'Buy Bonus: 100× bet'],
    strategy: 'Smaller hits more frequent than other Pragmatic high-vol games. Bonus round is where massive multipliers stack.'
  },
  { id: 'mahjong-ways', cat: 'slots', name: 'Mahjong Ways 2', provider: 'PG Soft', color: ['#1ec0ff', '#500ecf'], icon: '🀄', tag: 'hot', play: 'games/slot.html?theme=cosmic&name=Mahjong+Ways+2',
    rtp: '96.95%', volatility: 'High', maxWin: '100,000×', minBet: '10 FUN',
    how: '4-row Megaways-style mechanic with mahjong tile symbols. Wins multiply progressively in free spins — multiplier never resets.',
    rules: ['Ways-to-win (up to 32,768)', 'Cascading reels', 'Free Spins: progressive multiplier', 'Buy Bonus available'],
    strategy: 'Long sessions in free spins build huge multipliers. Big risk: free spins can also be very short.'
  },
  { id: 'wild-bandito', cat: 'slots', name: 'Wild Bandito', provider: 'PG Soft', color: ['#ff5a00', '#7a1f00'], icon: '🌶️', tag: 'tutorial', play: 'games/slot.html?theme=western&name=Wild+Bandito',
    rtp: '96.71%', volatility: 'High', maxWin: '12,500×', minBet: '10 FUN',
    how: 'Mexican standoff theme. Sticky wilds carry random multipliers. Tumble feature means one spin can chain into many wins.',
    rules: ['Wild symbols stick during cascades', 'Wild multipliers from 2× to 100×', 'Free Spins with persistent wilds', 'Buy Bonus: 70× bet'],
    strategy: 'Tumbling wilds is the engine. The bonus is shorter (typically 10 spins) but multipliers can stack absurdly.'
  },
  { id: 'lucky-neko', cat: 'slots', name: 'Lucky Neko', provider: 'PG Soft', color: ['#ff1ed7', '#500ecf'], icon: '🐱', tag: 'tutorial', play: 'games/slot.html?theme=cosmic&name=Lucky+Neko',
    rtp: '96.71%', volatility: 'Med-High', maxWin: '15,000×', minBet: '10 FUN',
    how: 'Japanese fortune-cat theme. Symbols collapse and ways-to-win expand from 1,024 up to 8,192 as you win consecutive cascades.',
    rules: ['Ways-to-win expand on cascading wins', 'Mystery symbols transform to single matching type', 'Bonus retrigger possible', 'Buy Bonus: 80× bet'],
    strategy: 'Medium-volatility means more frequent payouts. A solid choice for longer sessions on smaller bankrolls.'
  },
  { id: 'treasures-aztec', cat: 'slots', name: 'Treasures of Aztec', provider: 'PG Soft', color: ['#89eb16', '#3a5c10'], icon: '🗿', tag: 'tutorial', play: 'games/slot.html?theme=cosmic&name=Treasures+of+Aztec',
    rtp: '96.71%', volatility: 'High', maxWin: '12,500×', minBet: '10 FUN',
    how: 'Aztec ruins setting. Wild symbols include multipliers up to 100×. Free spins keep increasing the multiplier with no upper cap.',
    rules: ['6 reels, variable rows', 'Wild multipliers (2×, 3×, 5×)', 'Free Spins: progressive multiplier', 'Buy Bonus: 60× bet'],
    strategy: 'The unlimited multiplier mechanic is the dream. Volatility means long droughts before the win — manage stakes carefully.'
  },
  { id: 'fortune-tiger', cat: 'slots', name: 'Fortune Tiger', provider: 'PG Soft', color: ['#ff6a00', '#d4a017'], icon: '🐯', tag: 'hot', play: 'games/slot.html?theme=classic&name=Fortune+Tiger',
    rtp: '96.81%', volatility: 'High', maxWin: '2,500×', minBet: '10 FUN',
    how: 'Classic 3×3 reel slot. Wild tiger expands across reels and multiplies wins. Simple, fast, addictive.',
    rules: ['3×3 grid, 5 paylines', 'Wild tiger doubles wins', 'No free spins — base game only', 'Quick rounds (~2s each)'],
    strategy: 'Lower max win but more frequent hits. Best for short, quick sessions. Often called the "ATM game" in Asian markets.'
  },
  { id: 'book-of-dead', cat: 'slots', name: 'Book of Dead', provider: 'Play\'n GO', color: ['#d4a017', '#3d2506'], icon: '📖', tag: 'tutorial', play: 'games/slot.html?theme=classic&name=Book+of+Dead',
    rtp: '96.21%', volatility: 'High', maxWin: '5,000×', minBet: '10 FUN',
    how: 'Egyptian-themed 5×3 slot with 10 paylines. The "Book" is wild AND scatter. Free Spins reveal an "expanding symbol" that fills entire reels.',
    rules: ['10 paylines, both directions', 'Book = wild + scatter', 'Free Spins: random expanding symbol', 'Gamble feature (double or nothing)'],
    strategy: 'The expanding symbol picks before free spins start — if you land a high-paying expanding symbol, the bonus can be huge.'
  },
  { id: 'starburst', cat: 'slots', name: 'Starburst', provider: 'NetEnt', color: ['#1ec0ff', '#ff1ed7'], icon: '✨', tag: 'play', play: 'games/slot.html?theme=cosmic&name=Starburst',
    rtp: '96.09%', volatility: 'Low', maxWin: '500×', minBet: '10 FUN',
    how: 'Pays both ways on 10 lines. Wild stars expand to fill an entire reel and trigger a re-spin (up to 3 in a row).',
    rules: ['Win both left-to-right AND right-to-left', 'Expanding wild on reels 2, 3, 4', 'Up to 3 re-spins per trigger', 'No free spins, no bonus round'],
    strategy: 'Low volatility = frequent small wins. Perfect for beginners learning slot mechanics without big swings.'
  },
  { id: 'gonzos-quest', cat: 'slots', name: 'Gonzo\'s Quest', provider: 'NetEnt', color: ['#a4ff2c', '#3a5c10'], icon: '🗺️', tag: 'tutorial', play: 'games/slot.html?theme=cosmic&name=Gonzos+Quest',
    rtp: '95.97%', volatility: 'Med-High', maxWin: '2,500×', minBet: '20 FUN',
    how: 'Avalanche reels (cascading wins) on a 5×3 grid. Each consecutive win increases the multiplier — up to 5× in base game, 15× in free spins.',
    rules: ['20 paylines', 'Avalanche: winning symbols disappear, new ones fall', 'Multiplier increases per consecutive win', 'Free Falls = free spins with bigger multipliers'],
    strategy: 'A pioneer of cascade mechanics — fundamental to learn before tackling modern cascade slots like Sweet Bonanza.'
  },
  { id: 'super-ace', cat: 'slots', name: 'Super Ace', provider: 'JILI', color: ['#ff5fde', '#500ecf'], icon: '🃏', tag: 'hot', play: 'games/slot.html?theme=classic&name=Super+Ace',
    rtp: '96.50%', volatility: 'High', maxWin: '1,500×', minBet: '10 FUN',
    how: 'Card-themed 5×4 slot. Joker symbol transforms others into matching symbols. Free Games can multiply up to 5×.',
    rules: ['1,024 ways to win', 'Joker wild transforms symbols', 'Free Games with multipliers', 'Persistent multipliers in free spins'],
    strategy: 'Joker transforms are the engine — a single transform can fill the grid. Watch for joker landings in base game too.'
  },
  { id: 'money-coming', cat: 'slots', name: 'Money Coming', provider: 'JILI', color: ['#d4a017', '#7a4a0d'], icon: '💰', tag: 'tutorial', play: 'games/slot.html?theme=classic&name=Money+Coming',
    rtp: '96.50%', volatility: 'Med', maxWin: '1,200×', minBet: '5 FUN',
    how: 'Classic 3-reel slot. Lucky 7s and lucky cats. Mini, Minor, Major and Grand jackpots — picked symbol bonus.',
    rules: ['3×3 grid, simple paylines', 'Wild and Jackpot symbols', 'Pick-a-prize bonus mini-game', '4-tier jackpot'],
    strategy: 'Old-school feel, modern math. Lower volatility — good entry point for slot beginners.'
  },
  { id: 'mega-ace', cat: 'slots', name: 'Mega Ace', provider: 'JILI', color: ['#ff8fb1', '#ff1ed7'], icon: '👑', tag: 'tutorial', play: 'games/slot.html?theme=classic&name=Mega+Ace',
    rtp: '96.50%', volatility: 'High', maxWin: '3,000×', minBet: '10 FUN',
    how: '5×4 reel slot with cascade mechanic. Multipliers up to 256× during free games. Joker symbols transform up to 4 others.',
    rules: ['Tumble feature on every win', 'Multipliers double on consecutive cascades', 'Free Games with sticky multipliers', 'Joker transformation feature'],
    strategy: 'The cascade chains are where big wins happen. Free Games doubles every consecutive win — long chains snowball hard.'
  },
  { id: 'boxing-king', cat: 'slots', name: 'Boxing King', provider: 'JILI', color: ['#ff5a00', '#d4a017'], icon: '🥊', tag: 'tutorial', play: 'games/slot.html?theme=classic&name=Boxing+King',
    rtp: '96.50%', volatility: 'High', maxWin: '5,000×', minBet: '10 FUN',
    how: 'Boxing-themed 5×3 slot. Knockouts deliver instant cash wins. Free Spins triggered by 3+ KO symbols.',
    rules: ['25 paylines', 'KO symbol = instant cash win', 'Free Spins with stacked wilds', 'Multiple multiplier paths'],
    strategy: 'KO instant wins are the headline mechanic — they can hit in base game without needing free spins.'
  },

  // ===== BIGTAKA ORIGINAL SLOTS (5 new themed slots) =====
  { id: 'treasure-tiger', cat: 'slots', name: 'Treasure Tiger', provider: 'Bigtaka Originals', color: ['#ff8a00', '#7a3000'], icon: '🐯', tag: 'hot', play: 'games/slot.html?theme=tiger&name=Treasure+Tiger',
    rtp: '96.80%', volatility: 'High', maxWin: '10,000×', minBet: '10 FUN', jackpot: true,
    how: 'A jungle-treasure slot where a golden tiger guards stacked treasure. Match 3+ matching jungle symbols to win, plus the Tiger Roar wild fills entire reels.',
    rules: ['25 paylines, 5×3 grid', 'Tiger wild = full-reel expand', 'Treasure chest scatter triggers free spins', 'Multiplier ladder up to 10×'],
    strategy: 'Bet flat — the tiger wild does heavy lifting in base game. Skip the gamble feature; the bonus round is where 1,000×+ hits live.'
  },
  { id: 'dhaka-fortune', cat: 'slots', name: 'Dhaka Fortune', provider: 'Bigtaka Originals', color: ['#ffd700', '#a85d00'], icon: '🛺', tag: 'new', play: 'games/slot.html?theme=dhaka&name=Dhaka+Fortune',
    rtp: '96.50%', volatility: 'Med-High', maxWin: '7,500×', minBet: '10 FUN', jackpot: true,
    how: 'Bangladeshi street-life slot — rickshaws, food stalls, neon lights. Land the Taka coin symbol anywhere to multiply your bet directly. 4+ scatter rickshaws trigger free spins.',
    rules: ['20 paylines on 5×3 grid', 'Taka coin = instant cash multiplier', 'Rickshaw scatter triggers 10–25 free spins', 'Street-light wild moves left each spin'],
    strategy: 'Lower variance than imported slots. Steady wins for longer sessions — great practice slot for beginners.'
  },
  { id: 'royal-palace-spin', cat: 'slots', name: 'Royal Palace Spin', provider: 'Bigtaka Originals', color: ['#ff1ed7', '#500ecf'], icon: '👑', tag: 'new', play: 'games/slot.html?theme=royal&name=Royal+Palace+Spin',
    rtp: '96.65%', volatility: 'High', maxWin: '15,000×', minBet: '20 FUN', jackpot: true,
    how: 'Royal court setting — king, queen, jewels, golden palace. Stacked royal symbols + gem cascade mechanic. King symbol can hold the entire reel.',
    rules: ['Cluster pays — 5+ matching adjacent symbols', 'Tumble feature after every win', 'King wild = sticky for 3 spins', 'Buy Bonus: 80× bet'],
    strategy: 'Patient slot — long tumble chains build huge wins. Don\'t bail after 1-2 tumbles, the sticky King makes round 3+ explosive.'
  },
  { id: 'candy-blast', cat: 'slots', name: 'Candy Blast', provider: 'Bigtaka Originals', color: ['#ff8fb1', '#ff1ed7'], icon: '🍭', tag: 'play', play: 'games/slot.html?theme=candyblast&name=Candy+Blast',
    rtp: '96.40%', volatility: 'Medium', maxWin: '5,000×', minBet: '10 FUN',
    how: 'Bright pop-art candy slot for beginners. 7×7 cluster grid. Match 5+ same-colored candies anywhere on the grid. Each cluster blast adds a multiplier dot.',
    rules: ['Cluster pays (no fixed paylines)', 'Tumble mechanic — candies fall to fill gaps', 'Multiplier dots stack up to 50×', 'Bonus rainbow wild appears randomly'],
    strategy: 'Smaller variance, more frequent hits. Perfect onboarding slot — get comfortable with cluster pays here before tackling Sugar Rush or Sweet Bonanza.'
  },
  { id: 'dragon-gold', cat: 'slots', name: 'Dragon Gold', provider: 'Bigtaka Originals', color: ['#d4042c', '#7a0017'], icon: '🐉', tag: 'hot', play: 'games/slot.html?theme=dragon&name=Dragon+Gold',
    rtp: '96.75%', volatility: 'Very High', maxWin: '25,000×', minBet: '20 FUN', jackpot: true,
    how: 'Mythical dragon slot with a fire breath bonus mode. Dragon scatter symbols stack on reel 3 to trigger Treasure Hoard free spins with progressive multipliers.',
    rules: ['5×4 grid, 1,024 ways to win', 'Dragon scatters stack to trigger bonus', 'Free spins multiplier never resets within bonus', 'Buy Bonus: 100× bet'],
    strategy: 'High-volatility behemoth. Save big bets for the bonus — base game is usually break-even at best. The Treasure Hoard can pay 5,000× in a single run.'
  },

  // ===== LIVE CASINO (15) =====
  { id: 'crazy-time', cat: 'live', name: 'Crazy Time', provider: 'Evolution Gaming', color: ['#ff1ed7', '#500ecf'], icon: '🎡', tag: 'hot', play: 'games/crazy-time.html?name=Crazy+Time',
    rtp: '96.08%', volatility: 'High', maxWin: '25,000×', minBet: '10 FUN',
    how: 'Live game-show wheel with 4 bonus rounds: Coin Flip, Cash Hunt, Pachinko, and Crazy Time. Bet on a number or bonus segment.',
    rules: ['Bet on numbers 1, 2, 5, 10 or 4 bonus games', 'Top Slot multiplier above the wheel can multiply your win', 'Bonus games trigger 6–12% of spins', 'Crazy Time bonus = biggest payouts'],
    strategy: 'Spread small bets on bonus segments — single bonus hit can pay 100×+. Avoid betting all-in on one segment.'
  },
  { id: 'lightning-roulette', cat: 'live', name: 'Lightning Roulette', provider: 'Evolution Gaming', color: ['#d4a017', '#500ecf'], icon: '⚡', tag: 'play', play: 'games/lightning-roulette.html?name=Lightning+Roulette',
    rtp: '97.30%', volatility: 'Medium', maxWin: '500×', minBet: '20 FUN',
    how: 'European roulette with random "lightning numbers" that pay 50× to 500× on a straight bet hit (instead of standard 35×).',
    rules: ['1-5 numbers struck by lightning each round', 'Lightning numbers pay 50×–500× on a hit', 'Standard straight-up payout becomes 30:1', 'Outside bets unchanged'],
    strategy: 'Straight-up bets become +EV when boosted by lightning. Spread small bets across many numbers to catch the multipliers.'
  },
  { id: 'monopoly-live', cat: 'live', name: 'Monopoly Live', provider: 'Evolution Gaming', color: ['#1ec0ff', '#89eb16'], icon: '🎩', tag: 'tutorial', play: 'games/monopoly-live.html?name=Monopoly+Live',
    rtp: '96.23%', volatility: 'High', maxWin: '10,000×', minBet: '10 FUN',
    how: 'Money wheel with a 3D Monopoly board bonus. Bet on numbers (1, 2, 5, 10) or "2 Rolls" / "4 Rolls" bonus segments.',
    rules: ['Numbers pay 1× to 10× the bet', 'Chance segments give random multiplier or cash prize', '2/4 Rolls trigger the Monopoly board bonus', 'Mr. Monopoly multiplies your board winnings'],
    strategy: 'The board bonus is the big payday. A small "4 Rolls" bet that hits Mr. Monopoly multipliers can deliver thousands of times bet.'
  },
  { id: 'dream-catcher', cat: 'live', name: 'Dream Catcher', provider: 'Evolution Gaming', color: ['#ff8fb1', '#ff1ed7'], icon: '🎯', tag: 'tutorial', play: 'games/dream-catcher.html?name=Dream+Catcher',
    rtp: '96.58%', volatility: 'Medium', maxWin: '40×', minBet: '10 FUN',
    how: 'The original money-wheel show. Bet on numbers 1, 2, 5, 10, 20, or 40. Pays exactly the multiplier of the segment landed.',
    rules: ['54 segments on the wheel', '1× to 40× payout on number bet', '2× / 7× multipliers from Top Slot', 'No bonus rounds — pure simple math'],
    strategy: 'Bet on \'1\' for highest hit rate (lowest variance), \'40\' for thrill (one hit = 40× win). Most players spread across all 6.'
  },
  { id: 'crazy-coin-flip', cat: 'live', name: 'Crazy Coin Flip', provider: 'Evolution Gaming', color: ['#d4a017', '#ff6a00'], icon: '🪙', tag: 'tutorial', play: 'games/crazy-coin-flip.html?name=Crazy+Coin+Flip',
    rtp: '96.05%', volatility: 'High', maxWin: '20,000×', minBet: '10 FUN',
    how: 'Two-phase game. Phase 1: a slot game qualifies you for the bonus. Phase 2: a live coin flip with multipliers on red/blue sides.',
    rules: ['Slot phase determines bonus eligibility', 'Coin flip has different multipliers per side', 'Top Slot can boost multipliers up to 100×', 'Re-flip feature can extend rounds'],
    strategy: 'Bonus qualification rate ~10%. Without bonus you can\'t win — many players auto-spin and wait for triggers.'
  },
  { id: 'funky-time', cat: 'live', name: 'Funky Time', provider: 'Evolution Gaming', color: ['#a4ff2c', '#ff1ed7'], icon: '🪩', tag: 'new', play: 'games/funky-time.html?name=Funky+Time',
    rtp: '95.93%', volatility: 'High', maxWin: '25,000×', minBet: '10 FUN',
    how: 'Disco-themed money wheel with 4 bonus rounds: VIP Disco, Stayin\' Alive, Disco, and Funky Time. Newer cousin to Crazy Time.',
    rules: ['Bet on numbers or bonus segments', 'Top Slot multiplier above the wheel', 'VIP Disco = highest paying bonus', 'Funky Time bonus = up to 5,000×'],
    strategy: 'Similar EV strategy to Crazy Time — spread bets on bonus rounds. VIP Disco is rarer but highest payout potential.'
  },
  { id: 'mega-wheel', cat: 'live', name: 'Mega Wheel', provider: 'Pragmatic Live', color: ['#ff1ed7', '#d4a017'], icon: '🎡', tag: 'play', play: 'games/mega-wheel.html?name=Mega+Wheel',
    rtp: '96.51%', volatility: 'Medium', maxWin: '500×', minBet: '10 FUN',
    how: '54-segment wheel with numbers 1, 2, 5, 10, 20, 30, 40. Top of the wheel has a "Mega" multiplier (2×–500×) that can boost wins.',
    rules: ['7 number bets (1–40)', 'Mega Multiplier randomly assigned at start', 'No bonus games — pure wheel spin', 'Single-spin rounds (~25s each)'],
    strategy: 'Pragmatic\'s answer to Dream Catcher with a multiplier twist. Lower volatility than Crazy Time but smaller ceiling.'
  },
  { id: 'sweet-candyland', cat: 'live', name: 'Sweet Bonanza Candyland', provider: 'Pragmatic Live', color: ['#ff5fde', '#a4ff2c'], icon: '🍬', tag: 'new', play: 'games/candyland.html?name=Candyland',
    rtp: '96.59%', volatility: 'High', maxWin: '20,000×', minBet: '10 FUN',
    how: 'Live-show version of the Sweet Bonanza slot. Bet on numbers or 4 bonus rounds: Sweet Spin, Candy Drop, Sweet Bonanza, Candy Bonanza.',
    rules: ['54 segments on wheel', 'Multiplier slot above wheel (2×–10×)', 'Candy Bonanza = highest bonus payout', 'Tumble mechanic in Sweet Bonanza bonus'],
    strategy: 'Newer than Crazy Time but similar mechanics. Less crowded, potentially better experience for new players learning the format.'
  },
  { id: 'lightning-blackjack', cat: 'live', name: 'Lightning Blackjack', provider: 'Evolution Gaming', color: ['#1ec0ff', '#500ecf'], icon: '⚡', tag: 'tutorial', play: 'games/blackjack.html?game=blackjack&name=Lightning+Blackjack',
    rtp: '99.56%', volatility: 'Low', maxWin: '25×', minBet: '20 FUN',
    how: 'Standard blackjack with a "lightning fee" surcharge. Winning hands get a random multiplier (2×–25×) applied.',
    rules: ['Win = base payout × random multiplier', 'Lightning fee = 100% of base bet (added to total)', 'Multiplier only applies to winning hands', 'Lose = lose entire bet (base + lightning)'],
    strategy: 'House edge is lower than standard blackjack despite the fee. Bigger swing potential makes sessions more exciting.'
  },
  { id: 'speed-baccarat', cat: 'live', name: 'Speed Baccarat', provider: 'Evolution Gaming', color: ['#d4a017', '#7a4a0d'], icon: '♠️', tag: 'tutorial', play: 'games/blackjack.html?game=baccarat&name=Speed+Baccarat',
    rtp: '98.94%', volatility: 'Low', maxWin: '8×', minBet: '20 FUN',
    how: 'Bet on Player, Banker, or Tie. Faster version of standard baccarat — rounds complete in ~27 seconds instead of 48.',
    rules: ['Player pays 1:1', 'Banker pays 1:1 (minus 5% commission)', 'Tie pays 8:1', 'Banker has slight edge — bet on Banker if unsure'],
    strategy: 'Lowest house edge in the casino on Banker bet (~1.06%). Skip the Tie bet — house edge ~14%.'
  },
  { id: 'dragon-tiger', cat: 'live', name: 'Dragon Tiger Live', provider: 'Ezugi', color: ['#ff5a00', '#1ec0ff'], icon: '🐉', tag: 'play', play: 'games/blackjack.html?game=dragontiger&name=Dragon+Tiger+Live',
    rtp: '96.27%', volatility: 'Low', maxWin: '11×', minBet: '10 FUN',
    how: 'Two cards dealt — one to Dragon, one to Tiger. Bet on which one is higher (or Tie). Simpler than baccarat.',
    rules: ['Dragon and Tiger each get one card', 'Highest card wins (A is lowest)', 'Dragon/Tiger bet pays 1:1', 'Tie pays 11:1 but rare (~7% hit rate)'],
    strategy: 'Simplest live casino game to learn. Dragon and Tiger have identical odds — purely 50/50 (minus tie possibility).'
  },
  { id: 'andar-bahar', cat: 'live', name: 'Andar Bahar Live', provider: 'Ezugi', color: ['#89eb16', '#500ecf'], icon: '🃏', tag: 'hot', play: 'games/blackjack.html?game=andarbahar&name=Andar+Bahar+Live',
    rtp: '97.85%', volatility: 'Low', maxWin: '4.85×', minBet: '10 FUN',
    how: 'Classic Indian card game. A "joker" card is revealed, then cards are dealt to Andar (left) and Bahar (right) until one matches the joker.',
    rules: ['Bet on Andar or Bahar before dealing', 'Andar wins if matched first (lower payout due to dealing order)', 'Bahar pays 1:1', 'Side bets on number of cards to match available'],
    strategy: 'Andar has ~51.5% win rate but pays 0.9:1. Bahar has 48.5% but pays 1:1. Math is nearly even — pick by feel.'
  },
  { id: 'teen-patti', cat: 'live', name: 'Teen Patti Live', provider: 'Ezugi', color: ['#ff1ed7', '#d4a017'], icon: '♠️', tag: 'hot', play: 'games/blackjack.html?game=teenpatti&name=Teen+Patti+Live',
    rtp: '97.85%', volatility: 'Medium', maxWin: '60×', minBet: '10 FUN',
    how: 'Indian "three-card" poker. Player A and Player B each get 3 cards. Bet on which hand is stronger.',
    rules: ['Hand rankings: Trail > Pure Sequence > Sequence > Color > Pair > High Card', 'Bet on Player A or Player B (1:1)', 'Side bets: Pair Plus, 3+3 Bonus', '6-card bonus available'],
    strategy: 'Main bet is essentially 50/50. Side bets have higher house edge but bigger payouts — play them small.'
  },
  { id: 'sic-bo', cat: 'live', name: 'Sic Bo', provider: 'Evolution Gaming', color: ['#1ec0ff', '#ff1ed7'], icon: '🎲', tag: 'tutorial', play: 'games/dice.html?theme=sicbo&name=Sic+Bo',
    rtp: '97.22%', volatility: 'Medium', maxWin: '180×', minBet: '10 FUN',
    how: 'Three dice are rolled. Bet on totals, combinations, specific numbers, or triples.',
    rules: ['Big (11–17) / Small (4–10) = 1:1', 'Specific triple = 180:1', 'Any triple = 30:1', 'Single number = 1:1 (per die that matches)'],
    strategy: 'Big/Small bets have lowest house edge (~2.78%). Triple bets are exciting but only ~0.5% hit rate.'
  },
  { id: 'football-studio', cat: 'live', name: 'Football Studio', provider: 'Evolution Gaming', color: ['#89eb16', '#1ec0ff'], icon: '⚽', tag: 'play', play: 'games/blackjack.html?game=dragontiger&name=Football+Studio',
    rtp: '96.27%', volatility: 'Low', maxWin: '11×', minBet: '10 FUN',
    how: 'Soccer-themed Dragon Tiger variant. Bet on Home, Away, or Draw. One card to each side — highest wins.',
    rules: ['Home and Away each get 1 card', 'Highest card wins', 'Home/Away pay 1:1', 'Draw pays 11:1'],
    strategy: 'Football branding but mechanically identical to Dragon Tiger. Same simple math.'
  },

  // ===== NEW CARD GAMES (7 added) =====
  { id: 'blackjack-royale', cat: 'live', name: 'Blackjack Royale', provider: 'Evolution Gaming', color: ['#ffd700', '#c80060'], icon: '👑', tag: 'hot', play: 'games/blackjack.html?game=blackjack&name=Blackjack+Royale',
    rtp: '99.56%', volatility: 'Low', maxWin: '25×', minBet: '20 FUN', jackpot: true,
    how: 'Classic blackjack at a premium gold table. Side bets (Perfect Pairs, 21+3), streak bonuses on consecutive wins, and Lucky 21 instant payouts.',
    rules: ['Beat dealer without busting', 'Blackjack pays 3:2', 'Dealer hits to 17', 'Side bets available', 'Streak bonus on 3+ wins'],
    strategy: 'Side bets are flashy but house edge is 5-15%. Stick to the main bet for the lowest casino edge in any game.'
  },
  { id: 'baccarat-palace', cat: 'live', name: 'Baccarat Palace', provider: 'Pragmatic Live', color: ['#ffd700', '#5b0d8c'], icon: '♠️', tag: 'hot', play: 'games/blackjack.html?game=baccarat&name=Baccarat+Palace',
    rtp: '98.94%', volatility: 'Low', maxWin: '8×', minBet: '20 FUN',
    how: 'Fast-paced baccarat with trend roadmaps, dragon streak effects, and multiplier rounds. Bet Player, Banker, or Tie.',
    rules: ['Player and Banker each get 2-3 cards', 'Closest to 9 wins', 'Player pays 1:1', 'Banker pays 0.95:1 (5% commission)', 'Tie pays 8:1'],
    strategy: 'Banker has the lowest house edge (~1.06%). Skip the Tie bet — house edge ~14%.'
  },
  { id: 'casino-holdem', cat: 'live', name: 'Casino Hold\'em Poker', provider: 'Evolution Gaming', color: ['#a4ff2c', '#0a4423'], icon: '♠️', tag: 'new', play: 'games/blackjack.html?game=holdem&name=Casino+Hold%27em+Poker',
    rtp: '97.84%', volatility: 'Med', maxWin: '100×', minBet: '20 FUN', jackpot: true,
    how: 'Texas Hold\'em-style table game against the dealer with dramatic flop-turn-river reveals. Best 5-card hand wins.',
    rules: ['Player and dealer each get 2 hole cards', '5 community cards revealed flop/turn/river', 'Best 5-card hand wins', 'Royal Flush pays 100×'],
    strategy: 'A pair of aces wins ~60% of pre-flop confrontations. The big bonuses are flush draws on the turn/river.'
  },
  { id: 'three-card-poker', cat: 'live', name: 'Three Card Poker', provider: 'Evolution Gaming', color: ['#ff1ed7', '#500ecf'], icon: '🃏', tag: 'play', play: 'games/blackjack.html?game=threecard&name=Three+Card+Poker',
    rtp: '96.63%', volatility: 'Med', maxWin: '33×', minBet: '10 FUN',
    how: 'Quick poker-based game with pair-plus bonuses and cinematic card-flip animations. 3 cards each — best hand wins.',
    rules: ['Dealer qualifies on Queen-high or better', 'Trail (3-of-a-kind) pays 33×', 'Straight Flush pays 21×', 'Straight pays 7×', 'Flush pays 4×'],
    strategy: 'Always Play with Q-6-4 or better. Fold anything weaker — the math favors only top-third hands.'
  },
  { id: 'caribbean-stud', cat: 'live', name: 'Caribbean Stud Poker', provider: 'Evolution Gaming', color: ['#1ec0ff', '#0066b3'], icon: '🏝️', tag: 'tutorial', play: 'games/blackjack.html?game=stud&name=Caribbean+Stud+Poker',
    rtp: '94.78%', volatility: 'High', maxWin: '100×', minBet: '20 FUN', jackpot: true,
    how: 'Poker against the dealer with jackpot side bets and progressive reward system. 5 cards each, dealer needs Ace-King to qualify.',
    rules: ['Both get 5 cards (1 dealer card face up)', 'Dealer needs Ace-King to qualify', 'Royal Flush pays 100×', 'Straight Flush pays 50×', 'Progressive jackpot side bet'],
    strategy: 'Call when you have a pair or better. Fold otherwise. The jackpot bet has high house edge — play it small for the thrill.'
  },
  { id: 'war-of-cards', cat: 'live', name: 'War of Cards', provider: 'Evolution Gaming', color: ['#ff5a00', '#7a0017'], icon: '⚔️', tag: 'new', play: 'games/blackjack.html?game=war&name=War+of+Cards',
    rtp: '97.16%', volatility: 'Low', maxWin: '2×', minBet: '10 FUN',
    how: 'Simple high-card battle game where the higher card wins. Multiplier zones and instant bonus rounds add spice.',
    rules: ['You and Dealer each get 1 card', 'Higher card wins (Aces high)', 'Tie = push (bet returned)', 'Multiplier zones occasionally activate'],
    strategy: 'Pure 50/50. The fastest live game on the platform — perfect for warming up before bigger sessions.'
  },
  { id: 'speed-blackjack', cat: 'live', name: 'Speed Blackjack', provider: 'Evolution Gaming', color: ['#ffd700', '#c89211'], icon: '⚡', tag: 'play', play: 'games/blackjack.html?game=blackjack&name=Speed+Blackjack',
    rtp: '99.56%', volatility: 'Low', maxWin: '25×', minBet: '10 FUN',
    how: 'Turbo blackjack — faster dealing animations, combo streaks, and rapid-fire rounds. Same math, 2× the action.',
    rules: ['Standard blackjack rules', 'Dealing speed ~50% faster', 'Combo streak bonuses on 3+ wins', 'Same 3:2 blackjack payout'],
    strategy: 'Same strategy as regular blackjack. The pace creates pressure — discipline pays.'
  },

  // ===== AVIATOR & CRASH (10) =====
  { id: 'aviator', cat: 'crash', name: 'Aviator', provider: 'Spribe', color: ['#ff1ed7', '#500ecf'], icon: '✈️', tag: 'play', play: 'games/aviator.html?name=Aviator',
    rtp: '97.00%', volatility: 'High', maxWin: '100×+', minBet: '10 FUN',
    how: 'A plane flies, the multiplier climbs from 1×. Cash out before the plane flies away. The longer you wait, the higher the multiplier — but also the higher the risk it crashes.',
    rules: ['Place bet before round starts', 'Multiplier increases as plane climbs', 'Cash out anytime before crash', 'Two bet panels available — independent cashouts'],
    strategy: 'Set an auto-cashout (e.g., 1.5×) for steady gains. Chasing 100× crashes most bankrolls. Discipline beats hope.'
  },
  { id: 'aviatrix', cat: 'crash', name: 'Aviatrix', provider: 'Aviatrix', color: ['#a4ff2c', '#500ecf'], icon: '🛩️', tag: 'new', play: 'games/aviator.html?name=Aviatrix',
    rtp: '97.00%', volatility: 'High', maxWin: '100×+', minBet: '10 FUN',
    how: 'Customizable NFT plane crash game. Same crash mechanic as Aviator, but each plane has unique stats and the in-game shop adds gamification.',
    rules: ['Crash mechanic identical to Aviator', 'Choose / customize your plane', 'Plane levels up with use', 'Loyalty rewards for active players'],
    strategy: 'Mechanically identical to Aviator. The metagame around planes is for engagement — the math is the same.'
  },
  { id: 'jetx', cat: 'crash', name: 'JetX', provider: 'SmartSoft Gaming', color: ['#ff5a00', '#d4a017'], icon: '🚀', tag: 'play', play: 'games/aviator.html?name=JetX',
    rtp: '97.00%', volatility: 'High', maxWin: '500×+', minBet: '10 FUN',
    how: 'Pre-Aviator-era crash game. A jet ascends, the multiplier climbs. Cash out or burn. Slightly different visual feel from Aviator.',
    rules: ['Single bet per round', 'Manual or auto-cashout', 'Crash distribution similar to Aviator', 'Active chat room'],
    strategy: 'Same math as Aviator. Some players prefer it because the explosion animation is more dramatic — pure psychology.'
  },
  { id: 'jetx3', cat: 'crash', name: 'JetX3', provider: 'SmartSoft Gaming', color: ['#ff8fb1', '#ff1ed7'], icon: '🛸', tag: 'tutorial', play: 'games/aviator.html?name=JetX3',
    rtp: '97.00%', volatility: 'High', maxWin: '200×+', minBet: '10 FUN',
    how: 'JetX with three jets simultaneously. You place bets on individual jets and cash out independently.',
    rules: ['3 jets crash independently', 'Place up to 3 bets per round', 'Each jet has its own multiplier', 'Strategy diversification possible'],
    strategy: 'Hedge: low cashout on one, high on another. Spreads variance but caps upside on small bankrolls.'
  },
  { id: 'spaceman', cat: 'crash', name: 'Spaceman', provider: 'Pragmatic Play', color: ['#1ec0ff', '#500ecf'], icon: '🧑‍🚀', tag: 'hot', play: 'games/aviator.html?name=Spaceman',
    rtp: '96.50%', volatility: 'High', maxWin: '5,000×', minBet: '10 FUN',
    how: 'An astronaut floats higher, the multiplier climbs. Partial cashout feature lets you secure part of your bet while the rest keeps flying.',
    rules: ['Manual or auto-cashout', 'Partial cashout (50% etc.)', 'Provably fair RNG', '5,000× max win'],
    strategy: 'Partial cashout is the unique edge. Secure profit, ride the rest to higher multipliers risk-free.'
  },
  { id: 'rocketon', cat: 'crash', name: 'Rocketon', provider: 'Galaxsys', color: ['#ff1ed7', '#a4ff2c'], icon: '🚀', tag: 'tutorial', play: 'games/aviator.html?name=Rocketon',
    rtp: '96.00%', volatility: 'High', maxWin: '20,000×', minBet: '10 FUN',
    how: 'Rocket-themed crash. Highest theoretical max win in the crash category. Same single-bet, single-cashout mechanic.',
    rules: ['Single bet per round', 'Manual or auto-cashout', 'Multiplier history visible', 'Live chat with other players'],
    strategy: 'High max win is tempting but extremely rare. Same statistical reality as Aviator — most rounds crash low.'
  },
  { id: 'cash-show', cat: 'crash', name: 'Cash Show', provider: 'Belatra', color: ['#d4a017', '#ff6a00'], icon: '💎', tag: 'tutorial', play: 'games/aviator.html?name=Cash+Show',
    rtp: '96.00%', volatility: 'High', maxWin: '20,000×', minBet: '10 FUN',
    how: 'Gameshow-themed crash. The "show" multiplier rises until the curtain falls. Cash out before showtime ends.',
    rules: ['Standard crash mechanic', 'Auto-cashout supported', 'Round history graph', 'Multi-bet support'],
    strategy: 'Identical math to most crash games. Stick to your auto-cashout discipline.'
  },
  { id: 'crash-x', cat: 'crash', name: 'Crash X', provider: 'Turbo Games', color: ['#a4ff2c', '#1ec0ff'], icon: '💥', tag: 'tutorial', play: 'games/aviator.html?name=Crash+X',
    rtp: '97.00%', volatility: 'High', maxWin: '100×+', minBet: '10 FUN',
    how: 'Stripped-down crash game with a clean UI. No frills — just bet, climb, cashout, repeat.',
    rules: ['Single bet per round', 'Manual/auto cashout', 'Clean minimalist UI', 'History panel of last 50 rounds'],
    strategy: 'Best crash game for total beginners due to clarity of UI. Same math, easier to focus.'
  },
  { id: 'rocket-queen', cat: 'crash', name: 'Rocket Queen', provider: 'Mascot Gaming', color: ['#ff5fde', '#ff1ed7'], icon: '👑', tag: 'tutorial', play: 'games/aviator.html?name=Rocket+Queen',
    rtp: '97.00%', volatility: 'High', maxWin: '20,000×', minBet: '10 FUN',
    how: 'Crash game with a queen riding the rocket. Stylized art direction; identical mechanic to others in category.',
    rules: ['Standard crash mechanics', 'Manual or auto-cashout', 'Provably fair RNG', 'Active social chat'],
    strategy: 'Pick crash games by which UI you find most readable — the math is functionally identical across them.'
  },
  { id: 'plane', cat: 'crash', name: 'Plane', provider: 'Galaxsys', color: ['#1ec0ff', '#a4ff2c'], icon: '✈️', tag: 'tutorial', play: 'games/aviator.html?name=Plane',
    rtp: '96.00%', volatility: 'High', maxWin: '20,000×', minBet: '10 FUN',
    how: 'Simple, no-nonsense plane crash. Same as Aviator but with a different operator and audience.',
    rules: ['Single bet per round', 'Auto-cashout supported', 'Round result history', 'Standard crash math'],
    strategy: 'Same as Aviator. The decision between plane crash games is purely aesthetic.'
  },

  // ===== FAST GAMES (5) =====
  { id: 'mines', cat: 'fast', name: 'Mines', provider: 'Spribe', color: ['#a4ff2c', '#500ecf'], icon: '💎', tag: 'play', play: 'games/mines.html?name=Mines',
    rtp: '97.00%', volatility: 'Variable', maxWin: '24,000×', minBet: '10 FUN',
    how: 'A 5×5 grid hides mines. Pick gems and cash out. Each gem found = bigger multiplier. Pick a mine = lose everything.',
    rules: ['Set number of mines (1–24)', 'More mines = bigger multipliers per pick', 'Cash out any time after at least one gem', 'Click a mine = lose bet'],
    strategy: 'Sweet spot: 3 mines, cash out after 3–5 picks. Going for full clear is a sucker bet — risk grows exponentially.'
  },
  { id: 'plinko', cat: 'fast', name: 'Plinko', provider: 'Spribe', color: ['#ff1ed7', '#a4ff2c'], icon: '🎯', tag: 'play', play: 'games/plinko.html?name=Plinko',
    rtp: '97.00%', volatility: 'Variable', maxWin: '1,000×', minBet: '10 FUN',
    how: 'Ball drops through a peg pyramid, landing in a multiplier bucket. Choose risk level (low/medium/high) and rows (8–16).',
    rules: ['Risk: low/medium/high', 'Rows: 8 to 16', 'Multipliers from 0.2× to 1,000×', 'Center buckets = low, edges = high'],
    strategy: 'Low risk + many rows = small steady wins. High risk + few rows = chase the edges. Plinko is essentially a bell-curve game.'
  },
  { id: 'dice', cat: 'fast', name: 'Dice', provider: 'Spribe', color: ['#1ec0ff', '#ff1ed7'], icon: '🎲', tag: 'play', play: 'games/dice.html?name=Dice',
    rtp: '97.00%', volatility: 'Variable', maxWin: '50×', minBet: '10 FUN',
    how: 'Predict whether a roll (0–100) lands over or under your target. The closer your target to the extremes, the higher the multiplier.',
    rules: ['Set a target (e.g., roll > 50)', 'Multiplier = (100 / win chance) × RTP', 'Manual or auto-bet supported', 'Provably fair RNG'],
    strategy: 'Lower-risk targets (e.g., > 25, ~75% win rate, ~1.3×) give steady gains. Don\'t chase high multipliers — math wins long-term.'
  },
  { id: 'hi-lo', cat: 'fast', name: 'Hi-Lo', provider: 'Spribe', color: ['#d4a017', '#7a4a0d'], icon: '🃏', tag: 'tutorial', play: 'games/dice.html?theme=hilo&name=Hi-Lo',
    rtp: '97.00%', volatility: 'Variable', maxWin: '500×', minBet: '10 FUN',
    how: 'A card is shown. Predict if the next card is higher or lower. Chain consecutive correct guesses for multiplied wins.',
    rules: ['Higher or Lower call each card', 'Chain wins compound multiplier', 'Cash out after any correct guess', 'Equal cards favor the dealer'],
    strategy: 'Card-counting helps — if a 2 is showing, "higher" is nearly guaranteed. Cash out after 3-5 wins, don\'t over-extend.'
  },
  { id: 'goal', cat: 'fast', name: 'Goal', provider: 'Spribe', color: ['#89eb16', '#3a5c10'], icon: '⚽', tag: 'play', play: 'games/penalty.html?name=Goal',
    rtp: '97.00%', volatility: 'Variable', maxWin: '8,000×', minBet: '10 FUN',
    how: 'Path-based soccer game. Pick one of 3 lanes at each step. One lane has a "defender." Get past them — multiplier grows. Cash out anytime.',
    rules: ['Choose difficulty (easy / medium / hard)', 'Easy = 1 defender per row, Hard = 3', 'Multiplier increases each row', 'Hitting a defender = lose'],
    strategy: 'Easy mode: 3 rows then cash out for ~2× steady. Hard mode: only attempt if budget allows multiple losses.'
  },

  // ===== SPORTS (10) =====
  { id: 'cricket-six', cat: 'sports', name: 'Six Hit Challenge', provider: 'Bigtaka Originals', color: ['#89eb16', '#d4a017'], icon: '🏏', tag: 'play', play: 'games/cricket-six.html?name=Six+Hit+Challenge',
    rtp: 'Skill-based', volatility: 'Medium', maxWin: '6× bet per six', minBet: '10 FUN',
    how: 'Time your swing as the ball reaches the bat. Perfect timing = SIX (6× bet). Good timing = 4. Off timing = out.',
    rules: ['6 balls per over', 'Time your tap with the ball', 'Each six = 6× bet payout', 'Hitting "out" ends the over'],
    strategy: 'Practice the rhythm — the ball speed is consistent. Once you find the timing window, you can chain sixes.'
  },
  { id: 'cricket-predictor', cat: 'sports', name: 'Cricket Match Predictor', provider: 'Bigtaka Originals', color: ['#1ec0ff', '#89eb16'], icon: '🏆', tag: 'tutorial', play: '#how-cricket-predictor',
    rtp: 'Variable', volatility: 'Match-based', maxWin: '8×', minBet: '10 FUN',
    how: 'Predict the next ball outcome (dot ball, single, four, six, wicket). Live data from real T20/ODI matches updates odds in real time.',
    rules: ['Each ball is a new prediction round', 'Outcome odds: Dot (1.5×), Single (3×), 4 (5×), 6 (8×), Wicket (8×)', 'Settle instantly when ball is bowled', 'Free play uses simulated match data'],
    strategy: 'Watch the bowler — pace bowlers have higher dot/wicket rates, spinners give up more boundaries. Match context matters.'
  },
  { id: 'boundary-bonanza', cat: 'sports', name: 'Boundary Bonanza', provider: 'Bigtaka Originals', color: ['#ff1ed7', '#89eb16'], icon: '🎯', tag: 'tutorial', play: '#how-boundary',
    rtp: 'Skill-based', volatility: 'High', maxWin: '12×', minBet: '10 FUN',
    how: 'Pick how many boundaries (4s + 6s) the batsman will hit in 10 balls. Lock your guess, then watch the simulated over.',
    rules: ['Pick 0–10 boundaries in the next 10 balls', 'Odds vary by batsman type', 'Closer to actual = bigger payout', 'Exact match = max payout (12×)'],
    strategy: 'Aggressive batsmen average ~4 boundaries per 10 balls. Anchor batsmen ~2. Use the batsman type to inform your pick.'
  },
  { id: 'ipl-fantasy', cat: 'sports', name: 'IPL Fantasy', provider: 'Bigtaka Originals', color: ['#ffe35c', '#c89211'], icon: '🏏', tag: 'new', play: '#how-ipl',
    rtp: 'Skill-based', volatility: 'High', maxWin: '50×', minBet: '20 FUN',
    how: 'Build an IPL squad (captain + 10 players + vice-captain). Each player\'s real-match performance adds points. Top squads win multipliers.',
    rules: ['11 players + captain (2× points) + VC (1.5× points)', 'Salary cap: 100 credits', 'Real player stats convert to fantasy points', 'Daily contests with prize pools'],
    strategy: 'Captain a power-hitter for ceiling, anchor with all-rounders for safety. Avoid stacking from one team — match-day surprises happen.'
  },
  { id: 'penalty-shootout', cat: 'sports', name: 'Penalty Shootout', provider: 'Bigtaka Originals', color: ['#89eb16', '#1ec0ff'], icon: '⚽', tag: 'play', play: 'games/penalty.html?name=Penalty+Shootout',
    rtp: 'Skill-based', volatility: 'Medium', maxWin: '5× per shot', minBet: '10 FUN',
    how: 'Pick a corner (top-left, top-right, bottom-left, bottom-right, center). Goalkeeper picks too — miss them and score. 5 shots per round.',
    rules: ['5 shots per round', 'Each goal scored = 1× bet returned', '5/5 goals = 5× bet bonus', 'Goalkeeper AI adapts to your previous picks'],
    strategy: 'Vary your shot placement. The AI tracks your last 3 shots — if you go corner three times, it learns and dives there.'
  },
  { id: 'champions-predictor', cat: 'sports', name: 'Champions Predictor', provider: 'Bigtaka Originals', color: ['#1ec0ff', '#500ecf'], icon: '🏆', tag: 'tutorial', play: '#how-champions',
    rtp: 'Variable', volatility: 'Match-based', maxWin: '10×', minBet: '10 FUN',
    how: 'Predict the next event in a soccer match: goal, corner, yellow card, free kick, throw-in. Live odds adjust every minute.',
    rules: ['Pick event type within next 5 minutes', 'Odds update with game state', 'Settle when event happens or window closes', 'Free play uses simulated match data'],
    strategy: 'High-press teams generate more corners. Look at the score state — chasing teams attack more, generating events.'
  },
  { id: 'free-kick-master', cat: 'sports', name: 'Free Kick Master', provider: 'Bigtaka Originals', color: ['#ff5a00', '#d4a017'], icon: '⚽', tag: 'tutorial', play: '#how-freekick',
    rtp: 'Skill-based', volatility: 'High', maxWin: '15×', minBet: '10 FUN',
    how: 'Aim and curl a free kick around the wall. Adjust angle, power, and curve. The keeper guesses based on your previous shots.',
    rules: ['3 sliders: angle, power, curve', 'Goal = 3× bet', 'Top-corner goal = 8× bet', 'Bicycle-kick rebounds = 15× bet'],
    strategy: 'Top-bin shots (top-corner) score 8×. Aim high-and-fast with maximum curve for the most consistent goal scoring.'
  },
  { id: 'three-point', cat: 'sports', name: 'Three-Point Showdown', provider: 'Bigtaka Originals', color: ['#ff5a00', '#ffe35c'], icon: '🏀', tag: 'play', play: 'games/three-point.html?name=Three-Point+Showdown',
    rtp: 'Skill-based', volatility: 'Medium', maxWin: '3× per shot', minBet: '10 FUN',
    how: 'Time your shot release as the meter swings. Land in the green zone = swish. Yellow = backboard. Red = miss.',
    rules: ['10 shots per round', 'Green zone = 3 points', 'Yellow zone = 2 points', 'Red = miss = 0 points'],
    strategy: 'The meter speed is consistent. After 2-3 shots you\'ll find the rhythm. 8/10 green = decent player.'
  },
  { id: 'nba-predictor', cat: 'sports', name: 'NBA Game Predictor', provider: 'Bigtaka Originals', color: ['#ff5a00', '#1ec0ff'], icon: '🏀', tag: 'tutorial', play: '#how-nba-predictor',
    rtp: 'Variable', volatility: 'Match-based', maxWin: '20×', minBet: '10 FUN',
    how: 'Predict NBA outcomes: first to 20, quarter winner, player to score next, total threes in a quarter. Live odds.',
    rules: ['Pick from multiple bet types per game', 'Live odds update every possession', 'Settle by quarter or game end', 'Free play uses simulated NBA data'],
    strategy: 'Pace matters more than score. High-pace teams (Pacers, Kings) produce more events. Use team pace stats to inform live picks.'
  },
  { id: 'slam-dunk', cat: 'sports', name: 'Slam Dunk Challenge', provider: 'Bigtaka Originals', color: ['#ff1ed7', '#ff5a00'], icon: '🏀', tag: 'tutorial', play: '#how-slam',
    rtp: 'Skill-based', volatility: 'High', maxWin: '10×', minBet: '10 FUN',
    how: 'Pick a dunk style (windmill, 360, between-legs, free-throw line). Higher difficulty = higher multiplier, lower success rate.',
    rules: ['4 dunk types: standard (2×), windmill (3×), 360 (5×), free-throw line (10×)', 'Difficulty affects success rate', 'Streak bonus: 3 in a row = +50% next dunk', 'Round = 5 dunk attempts'],
    strategy: 'Mix difficulties — alternate easy/hard to build streak bonuses. Free-throw line dunks miss often; don\'t over-bet on them.'
  }
];

// ============ MASCOTS ============
const MASCOTS = {
  boss:   { name: 'Lucky Boss',       emoji: '🤵', color: ['#ffd700', '#500ecf'], role: 'Casino Host' },
  fairy:  { name: 'Slot Fairy',       emoji: '🧚', color: ['#ff8fb1', '#ff1ed7'], role: 'Slots Guide' },
  maya:   { name: 'Live Dealer Maya', emoji: '💃', color: ['#ffd700', '#d4042c'], role: 'Live Casino Host' },
  rafi:   { name: 'Pilot Rafi',       emoji: '🧑‍✈️', color: ['#1ec0ff', '#500ecf'], role: 'Aviator Captain' },
  monkey: { name: 'Speed Monkey',     emoji: '🐒', color: ['#a4ff2c', '#ff8a00'], role: 'Fast Games Champ' }
};

const TIPS = {
  boss: [
    "Welcome to Bigtaka — let's spin some reels, boss!",
    "Try the Daily Spin for free FUN coins.",
    "New slots from Bigtaka Originals just dropped — check 'em out!",
    "Hit 5/5 on Penalty Shootout for a jackpot bonus.",
    "Burned through your coins? Hit the ⟳ — it's all free practice.",
    "Mines + 3 mines + cash out at 3 gems = pro move."
  ],
  fairy: [
    "Sweet Bonanza's tumble feature is your friend ✨",
    "Free Spins is where 1,000×+ wins live!",
    "Buy Bonus 100× bet only if your bankroll can take a few misses.",
    "High volatility = patience. The big win is coming!",
    "Cluster pays games (Sugar Rush, Candy Blast) reward longer sessions."
  ],
  maya: [
    "Welcome to the live floor. Place your bets!",
    "Banker bet in Baccarat has the lowest house edge.",
    "Big/Small in Sic Bo pays 1:1 with only 2.78% house edge.",
    "Dragon Tiger is the easiest live game to learn — pure 50/50.",
    "Crazy Time bonus rounds = your shot at 25,000× wins."
  ],
  rafi: [
    "Captain Rafi here. Auto-cashout 1.5× = steady gains.",
    "Chasing 100× is how bankrolls crash. Be disciplined.",
    "Spaceman's partial cashout = secure profit, ride the rest free.",
    "Watch the crash history — if 3 lows in a row, next round might run.",
    "Practice the timing. The plane WILL crash. Plan your exit."
  ],
  monkey: [
    "Quick rounds, quick decisions! 🐵",
    "Mines: 3 mines + cash out at 3 gems = sweet spot.",
    "Plinko low risk = steady drip. High risk = chase the edges!",
    "Dice under 50 ≈ 50% win rate, 1.94× payout.",
    "Combo streaks in Fast Games = bonus FUN coins!"
  ]
};

const Mascot = {
  // Build a mascot bubble component
  render(target, key, tipIndex = -1) {
    const m = MASCOTS[key];
    if (!m) return;
    const tips = TIPS[key] || ['Welcome!'];
    const tip = tips[tipIndex >= 0 ? tipIndex : Math.floor(Math.random() * tips.length)];
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    el.innerHTML = `
      <div class="mascot-bubble" data-mascot="${key}">
        <div class="mascot-avatar" style="background: linear-gradient(135deg, ${m.color[0]}, ${m.color[1]});">
          <span>${m.emoji}</span>
        </div>
        <div class="mascot-speech">
          <div class="mascot-name">${m.name} <span class="mascot-role">${m.role}</span></div>
          <div class="mascot-text">${tip}</div>
        </div>
        <button class="mascot-close" aria-label="Dismiss">✕</button>
      </div>
    `;
    el.querySelector('.mascot-close')?.addEventListener('click', () => {
      el.classList.add('mascot-hidden');
    });
    // Rotate tip on avatar click
    el.querySelector('.mascot-avatar')?.addEventListener('click', () => {
      const nextIdx = (tips.indexOf(tip) + 1) % tips.length;
      this.render(target, key, nextIdx);
    });
  },

  // Floating mascot bubble (Lucky Boss on hub)
  attachFloating(key = 'boss') {
    if (document.getElementById('floating-mascot')) return;
    const wrap = document.createElement('div');
    wrap.id = 'floating-mascot';
    wrap.className = 'floating-mascot';
    document.body.appendChild(wrap);
    this.render(wrap, key);
  }
};

// ============ PLAYER STATS (XP, Level, Achievements) ============
const STATS_KEY = 'bigtaka_freeplay_stats_v1';
const Player = {
  load() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY)) || this._default(); }
    catch (e) { return this._default(); }
  },
  _default() {
    return {
      xp: 0, level: 1,
      gamesPlayed: 0, wins: 0,
      streak: 0, bestStreak: 0,
      slotsPlayed: [],
      sportsWins: { cricket: 0, soccer: 0, basketball: 0 },
      biggestWin: 0,
      biggestMult: 0,
      lastLogin: null,
      loginStreak: 0,
      missionsCompleted: 0,
      missions: null,
      missionDate: null,
      missionProgress: { spins: 0, cashouts: 0, sportsWin: false },
      badges: []
    };
  },
  save(s) { localStorage.setItem(STATS_KEY, JSON.stringify(s)); this.render(); },
  get() { return this.load(); },

  addXP(amount) {
    const s = this.load();
    s.xp += amount;
    const newLevel = this.levelForXP(s.xp);
    const leveledUp = newLevel > s.level;
    s.level = newLevel;
    this.save(s);
    if (leveledUp) {
      const bonus = newLevel * 500;
      Wallet.add(bonus);
      Sfx.bigWin();
      toast(`⭐ LEVEL UP! Now level ${newLevel} · +${Wallet.format(bonus)} FUN`, 'win');
    }
    return s;
  },

  recordBet(amount) {
    const s = this.load();
    s.gamesPlayed++;
    s.missionProgress = s.missionProgress || { spins: 0, cashouts: 0, sportsWin: false };
    s.missionProgress.spins++;
    this.save(s);
    this.addXP(1);
    this.checkMissions(s);
  },

  recordWin(amount, mult, category) {
    const s = this.load();
    s.wins++;
    s.streak++;
    if (s.streak > s.bestStreak) s.bestStreak = s.streak;
    if (amount > s.biggestWin) s.biggestWin = amount;
    if (mult > s.biggestMult) s.biggestMult = mult;
    if (category === 'sports') {
      s.missionProgress = s.missionProgress || { spins: 0, cashouts: 0, sportsWin: false };
      s.missionProgress.sportsWin = true;
    }
    if (category === 'crash' && mult >= 2) {
      s.missionProgress = s.missionProgress || { spins: 0, cashouts: 0, sportsWin: false };
      s.missionProgress.cashouts++;
    }
    this.save(s);
    this.addXP(5);
    this.checkBadges(s);
    this.checkMissions(s);
    // Trigger the register prompt on any win (once per browser; dismissal flag stops repeats)
    if (typeof RegisterPrompt !== 'undefined') RegisterPrompt.trigger();
  },

  recordLoss() {
    const s = this.load();
    s.streak = 0;
    this.save(s);
  },

  recordSlotPlayed(slotId) {
    const s = this.load();
    if (!s.slotsPlayed.includes(slotId)) {
      s.slotsPlayed.push(slotId);
      this.save(s);
      this.checkBadges(s);
    }
  },

  levelForXP(xp) {
    if (xp < 100) return 1;
    if (xp < 250) return 2;
    if (xp < 500) return 3;
    if (xp < 1000) return 4;
    if (xp < 2000) return 5;
    if (xp < 4000) return 6;
    return 7;
  },

  xpForNextLevel(level) {
    return [0, 100, 250, 500, 1000, 2000, 4000, 8000][level] || 8000;
  },

  // ============ BADGES ============
  BADGES: [
    { id: 'first-win',     emoji: '🎉', name: 'First Win',          desc: 'Win your first game' },
    { id: 'big-spender',   emoji: '💸', name: 'Big Spender',        desc: 'Place a single bet of 1,000+ FUN' },
    { id: 'lucky-streak',  emoji: '🔥', name: 'Lucky Streak',       desc: 'Win 3 games in a row' },
    { id: 'aviator-ace',   emoji: '✈️', name: 'Aviator Ace',        desc: 'Cash out at 5×+ in any crash game' },
    { id: 'slot-master',   emoji: '🎰', name: 'Slot Master',        desc: 'Play 5 different slots' },
    { id: 'sports-champ',  emoji: '🏆', name: 'Sports Champion',    desc: 'Win on cricket, soccer & NBA' },
    { id: 'vip-status',    emoji: '👑', name: 'VIP Status',         desc: 'Reach level 5' },
    { id: 'jackpot-king',  emoji: '💎', name: 'Jackpot King',       desc: 'Hit a 50×+ multiplier' },
    { id: 'login-week',    emoji: '📅', name: 'Week Warrior',       desc: 'Log in 7 days in a row' }
  ],

  checkBadges(s) {
    s = s || this.load();
    const unlocked = [];
    if (s.wins >= 1 && !s.badges.includes('first-win')) unlocked.push('first-win');
    if (s.biggestWin >= 1000 && !s.badges.includes('big-spender')) unlocked.push('big-spender');
    if (s.bestStreak >= 3 && !s.badges.includes('lucky-streak')) unlocked.push('lucky-streak');
    if (s.biggestMult >= 5 && !s.badges.includes('aviator-ace')) unlocked.push('aviator-ace');
    if (s.slotsPlayed.length >= 5 && !s.badges.includes('slot-master')) unlocked.push('slot-master');
    const sw = s.sportsWins || {};
    if ((sw.cricket || 0) > 0 && (sw.soccer || 0) > 0 && (sw.basketball || 0) > 0 && !s.badges.includes('sports-champ')) unlocked.push('sports-champ');
    if (s.level >= 5 && !s.badges.includes('vip-status')) unlocked.push('vip-status');
    if (s.biggestMult >= 50 && !s.badges.includes('jackpot-king')) unlocked.push('jackpot-king');
    if (s.loginStreak >= 7 && !s.badges.includes('login-week')) unlocked.push('login-week');
    if (unlocked.length) {
      s.badges.push(...unlocked);
      this.save(s);
      unlocked.forEach(id => {
        const b = this.BADGES.find(x => x.id === id);
        if (b) {
          Wallet.add(500);
          Sfx.jackpot();
          toast(`🏅 BADGE UNLOCKED: ${b.emoji} ${b.name} · +500 FUN!`, 'win');
        }
      });
    }
  },

  // ============ DAILY MISSIONS ============
  MISSIONS_POOL: [
    { id: 'spin-5',       text: 'Play 5 rounds in any game',        target: 5,  type: 'spins',    reward: 200, emoji: '🎯' },
    { id: 'spin-10',      text: 'Play 10 rounds in any game',       target: 10, type: 'spins',    reward: 400, emoji: '🎯' },
    { id: 'cashout-2x',   text: 'Cash out at 2×+ in a crash game',  target: 1,  type: 'cashouts', reward: 300, emoji: '🚀' },
    { id: 'cashout-3-2x', text: 'Cash out at 2×+ three times',      target: 3,  type: 'cashouts', reward: 600, emoji: '🚀' },
    { id: 'win-sports',   text: 'Win on any sports game',           target: 1,  type: 'sportsWin', reward: 250, emoji: '🏏' }
  ],

  refreshMissions(s) {
    s = s || this.load();
    const today = new Date().toDateString();
    if (s.missionDate !== today) {
      // Rotate 3 random missions
      const shuffled = [...this.MISSIONS_POOL].sort(() => Math.random() - 0.5);
      s.missions = shuffled.slice(0, 3).map(m => ({ ...m, done: false, claimed: false }));
      s.missionDate = today;
      s.missionProgress = { spins: 0, cashouts: 0, sportsWin: false };
      this.save(s);
    }
    return s;
  },

  checkMissions(s) {
    s = this.refreshMissions(s);
    let changed = false;
    s.missions.forEach(m => {
      if (m.done) return;
      let progress = 0;
      if (m.type === 'spins') progress = s.missionProgress.spins || 0;
      else if (m.type === 'cashouts') progress = s.missionProgress.cashouts || 0;
      else if (m.type === 'sportsWin') progress = s.missionProgress.sportsWin ? 1 : 0;
      if (progress >= m.target) {
        m.done = true;
        changed = true;
        s.missionsCompleted++;
        Sfx.win();
        toast(`✓ Mission complete: ${m.text} · claim ${m.reward} FUN!`, 'win');
      }
    });
    if (changed) this.save(s);
    this.renderMissions();
  },

  claimMission(missionId) {
    const s = this.load();
    const m = s.missions?.find(x => x.id === missionId);
    if (!m || !m.done || m.claimed) return;
    m.claimed = true;
    Wallet.add(m.reward);
    Sfx.coin();
    toast(`+${m.reward} FUN claimed!`, 'win');
    this.save(s);
    this.renderMissions();
  },

  // ============ DAILY LOGIN ============
  checkDailyLogin() {
    const s = this.load();
    const today = new Date().toDateString();
    if (s.lastLogin === today) return null; // already claimed
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (s.lastLogin === yesterday) {
      s.loginStreak++;
    } else {
      s.loginStreak = 1;
    }
    s.lastLogin = today;
    const reward = Math.min(s.loginStreak, 7) * 250;
    Wallet.add(reward);
    this.save(s);
    return { reward, streak: s.loginStreak };
  },

  // ============ RENDER ============
  render() {
    const s = this.load();
    const nextXP = this.xpForNextLevel(s.level);
    const prevXP = this.xpForNextLevel(s.level - 1) || 0;
    const pct = Math.min(100, ((s.xp - prevXP) / (nextXP - prevXP)) * 100);

    document.querySelectorAll('[data-player-level]').forEach(el => el.textContent = s.level);
    document.querySelectorAll('[data-player-xp]').forEach(el => el.textContent = s.xp.toLocaleString());
    document.querySelectorAll('[data-player-xp-next]').forEach(el => el.textContent = nextXP.toLocaleString());
    document.querySelectorAll('[data-player-xp-bar]').forEach(el => el.style.width = pct + '%');
    document.querySelectorAll('[data-player-streak]').forEach(el => el.textContent = s.loginStreak || 0);
  },

  renderMissions() {
    const s = this.refreshMissions();
    const wrap = document.getElementById('missions-panel');
    if (!wrap) return;
    wrap.innerHTML = s.missions.map(m => {
      let progress = 0;
      if (m.type === 'spins') progress = Math.min(s.missionProgress.spins || 0, m.target);
      else if (m.type === 'cashouts') progress = Math.min(s.missionProgress.cashouts || 0, m.target);
      else if (m.type === 'sportsWin') progress = s.missionProgress.sportsWin ? 1 : 0;
      const pct = (progress / m.target) * 100;
      const state = m.claimed ? 'claimed' : m.done ? 'done' : '';
      return `
        <div class="mission-card ${state}">
          <div class="mission-emoji">${m.emoji}</div>
          <div class="mission-body">
            <div class="mission-text">${m.text}</div>
            <div class="mission-bar"><div class="mission-fill" style="width:${pct}%"></div></div>
            <div class="mission-meta">${progress}/${m.target} · ${m.reward} FUN</div>
          </div>
          <button class="mission-cta" data-claim="${m.id}" ${!m.done || m.claimed ? 'disabled' : ''}>
            ${m.claimed ? '✓' : m.done ? 'Claim' : '…'}
          </button>
        </div>
      `;
    }).join('');
    wrap.querySelectorAll('[data-claim]').forEach(b => {
      b.addEventListener('click', () => this.claimMission(b.dataset.claim));
    });
  },

  renderBadges() {
    const s = this.load();
    const wrap = document.getElementById('badges-grid');
    if (!wrap) return;
    wrap.innerHTML = this.BADGES.map(b => {
      const unlocked = s.badges.includes(b.id);
      return `
        <div class="badge ${unlocked ? 'unlocked' : 'locked'}" title="${b.desc}">
          <div class="badge-emoji">${b.emoji}</div>
          <div class="badge-name">${b.name}</div>
          <div class="badge-desc">${unlocked ? '✓ Unlocked' : b.desc}</div>
        </div>
      `;
    }).join('');
  }
};

// ============ BD GATE (IP-country cloak for the welcome-bonus affiliate URL) ============
// The Claim Welcome Bonus CTA opens the affiliate link only for Bangladesh visitors.
// Non-BD regions see an inline "available to selected region only" notice so ad-network
// reviewers in US/EU never reach the affiliate URL. The check runs once on page load
// and caches in sessionStorage so the click handler stays synchronous (needed to keep
// window.open() inside the user-gesture window — popup blockers will eat a deferred open).
//
// Robustness rules (do NOT regress — this gate has historically blocked real BD users):
//  1. Multiple geo providers in a fallback chain. Single-provider was the original bug:
//     ipapi.co alone gets 429-rate-limited on BD mobile NAT pools and is on Brave/AdGuard
//     blocklists, so legit BD users were silently dropped into the ERR/block branch.
//  2. Fail-OPEN when every provider fails. The TTrk.io affiliate URL has its own
//     server-side geo routing, so non-BD visitors won't convert even if we let them
//     through — we only lose the cosmetic cloak in the rare full-failure case.
//  3. Bengali browser language is treated as a positive BD signal when geo is unknown.
//     navigator.language starting with `bn` is a near-perfect proxy for BD residency.
const BdGate = {
  AFFILIATE_URL: 'https://rrwkd.ttrk.io/69c7fc1113304dfe90bf3506',
  COUNTRY: null,
  CHECKING: true,
  _pending: [],

  // Providers tried in order. Each returns the ISO-2 country code or '' on failure.
  // Keep them lightweight, key-less, and CORS-friendly. If one starts charging or
  // adding auth, drop it — don't break the page on a 401.
  _providers: [
    {
      url: 'https://ipapi.co/json/',
      pick: d => d && d.country_code
    },
    {
      url: 'https://ipwho.is/?fields=country_code,success',
      pick: d => d && d.success !== false && d.country_code
    },
    {
      url: 'https://get.geojs.io/v1/ip/country.json',
      pick: d => d && d.country
    }
  ],

  init() {
    const cached = sessionStorage.getItem('bigtaka_freeplay_bdgate_v1');
    if (cached) {
      this.COUNTRY = cached;
      this.CHECKING = false;
      return;
    }
    this._tryProviders(0);
  },

  _tryProviders(idx) {
    if (idx >= this._providers.length) {
      // Every provider failed. Mark UNKNOWN — allow() will fail-open below.
      this.COUNTRY = 'UNKNOWN';
      // Don't cache UNKNOWN: a transient blip shouldn't burn the whole session.
      this.CHECKING = false;
      this._flush();
      return;
    }
    const provider = this._providers[idx];
    const controller = new AbortController();
    // 8s timeout (was 4.5s) — BD mobile 3G/EDGE latency frequently exceeds 5s.
    const timer = setTimeout(() => controller.abort(), 8000);
    fetch(provider.url, { signal: controller.signal, cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => {
        clearTimeout(timer);
        const raw = provider.pick(d);
        const code = raw ? String(raw).toUpperCase() : '';
        if (!code) throw new Error('no country in response');
        this.COUNTRY = code;
        sessionStorage.setItem('bigtaka_freeplay_bdgate_v1', this.COUNTRY);
        this.CHECKING = false;
        this._flush();
      })
      .catch(() => {
        clearTimeout(timer);
        this._tryProviders(idx + 1);
      });
  },

  // Fail-OPEN on UNKNOWN, and treat a Bengali browser as a BD signal. This is what
  // unblocks the legit-BD-user case where every geo API got rate-limited or blocked
  // by a privacy extension — without these, the click silently shows the region-block
  // panel even though the user is in Dhaka.
  allow() {
    if (this.COUNTRY === 'BD') return true;
    if (this.COUNTRY === 'UNKNOWN') return true;
    try {
      const lang = ((navigator.language || '') + ' ' + (navigator.languages || []).join(' ')).toLowerCase();
      if (/\bbn(\b|-)/.test(lang)) return true;
    } catch (e) {}
    return false;
  },

  whenReady(cb) {
    if (!this.CHECKING) { cb(); return; }
    this._pending.push(cb);
  },

  _flush() {
    const q = this._pending;
    this._pending = [];
    q.forEach(cb => { try { cb(); } catch (e) {} });
  }
};
BdGate.init();

// ============ SIGNUP MODAL (created on demand, works on any page) ============
const SIGNUP_KEY = 'bigtaka_freeplay_signup_v1';
const Signup = {
  modal: null,
  stored: null,
  userData: null,
  currentStep: 1,

  _loadStored() {
    try { this.stored = JSON.parse(localStorage.getItem(SIGNUP_KEY) || '{}'); }
    catch (e) { this.stored = {}; }
    this.userData = {
      name: this.stored.name || '',
      categories: this.stored.categories || []
    };
  },

  _saveStored() {
    localStorage.setItem(SIGNUP_KEY, JSON.stringify(this.stored));
  },

  _ensure() {
    if (this.modal) return;
    this._loadStored();
    // Asset path is relative to the current page:
    //   /pages/bigtaka_freeplay/index.html      → 'assets/'
    //   /pages/bigtaka_freeplay/m/index.html    → '../assets/'
    //   /pages/bigtaka_freeplay/games/<name>.html → '../assets/'
    const p = location.pathname;
    const assetPath = (p.includes('/games/') || p.includes('/m/')) ? '../assets/' : 'assets/';
    const html = `
      <div id="signup-modal" class="signup-modal" aria-hidden="true">
        <div class="signup-card">
          <div class="signup-logo">
            <img src="${assetPath}bigtaka-freetoplay.png" alt="Bigtaka Free Play" />
          </div>
          <div class="signup-steps">
            <div class="signup-step active"></div>
            <div class="signup-step"></div>
            <div class="signup-step"></div>
          </div>
          <div class="signup-page" data-page="1">
            <div class="signup-emoji">👋</div>
            <h2>Welcome to <span class="hl">Bigtaka</span></h2>
            <p>What should we call you, boss?</p>
            <input id="signup-name" type="text" maxlength="32" placeholder="Your name" autocomplete="given-name" />
            <div class="signup-cta">
              <button class="btn btn-green btn-block" data-signup-next="1">Continue →</button>
            </div>
          </div>
          <div class="signup-page" data-page="2" style="display: none;">
            <div class="signup-emoji">🎮</div>
            <h2>Pick your <span class="hl">favorites</span></h2>
            <p>What games are you most excited to try?<small>Select any — we'll personalize your hub.</small></p>
            <div class="signup-cats">
              <button class="signup-cat" data-cat="slots">🎰 Slots</button>
              <button class="signup-cat" data-cat="live">♠️ Live Casino</button>
              <button class="signup-cat" data-cat="crash">🚀 Aviator</button>
              <button class="signup-cat" data-cat="fast">⚡ Fast Games</button>
              <button class="signup-cat" data-cat="sports" style="grid-column: span 2;">🏏 Sports (Cricket · Soccer · NBA)</button>
            </div>
            <div class="signup-cta">
              <button class="btn btn-ghost" data-signup-back="2">← Back</button>
              <button class="btn btn-green" data-signup-next="2">Continue →</button>
            </div>
          </div>
          <div class="signup-page" data-page="3" style="display: none;">
            <div class="signup-emoji">🎁</div>
            <h2>You're <span class="hl">ready</span>, <span id="signup-greeting">boss</span>!</h2>
            <p>10,000 FUN coins are loaded up. Pick how you want to play.</p>
            <div class="signup-final">
              <a class="btn btn-gold" href="#" rel="noopener noreferrer" data-signup-register>
                <span class="signup-final-emoji">💎</span>
                <span class="signup-final-text">
                  <strong>Claim Welcome Bonus</strong>
                  <small>Bigger prizes, daily rewards & VIP perks</small>
                </span>
              </a>
              <div class="signup-region-block" data-signup-region-block style="display:none;">
                <div class="signup-region-block-icon">🌏</div>
                <strong>Welcome Bonus is available to selected region only.</strong>
                <small>Our bonuses currently launch in available country. You can still keep playing FUN coins here for free.</small>
              </div>
              <button class="btn btn-green" data-signup-play>
                <span class="signup-final-emoji">🎮</span>
                <span class="signup-final-text">
                  <strong>Play Free First</strong>
                  <small>Practice with FUN coins</small>
                </span>
              </button>
              <button class="btn btn-ghost btn-sm" data-signup-back="3">← Back</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    this.modal = document.getElementById('signup-modal');
    this._wire();
    // Pre-fill name + categories
    if (this.stored.name) this.modal.querySelector('#signup-name').value = this.stored.name;
    this.modal.querySelectorAll('[data-cat]').forEach(b => {
      if (this.userData.categories.includes(b.dataset.cat)) b.classList.add('selected');
    });
  },

  _wire() {
    const m = this.modal;
    const self = this;

    m.querySelector('[data-signup-next="1"]').addEventListener('click', () => {
      const input = m.querySelector('#signup-name');
      const name = input.value.trim();
      if (!name) {
        input.style.borderColor = '#ff1ed7';
        input.focus();
        input.placeholder = 'Please enter your name';
        setTimeout(() => { input.style.borderColor = ''; }, 1200);
        return;
      }
      self.userData.name = name;
      self.stored.name = name;
      self._saveStored();
      self._showStep(2);
    });

    m.querySelectorAll('[data-cat]').forEach(b => {
      b.addEventListener('click', () => {
        b.classList.toggle('selected');
        const cat = b.dataset.cat;
        const idx = self.userData.categories.indexOf(cat);
        if (idx >= 0) self.userData.categories.splice(idx, 1);
        else self.userData.categories.push(cat);
      });
    });

    m.querySelector('[data-signup-next="2"]').addEventListener('click', () => {
      self.stored.categories = self.userData.categories;
      self._saveStored();
      m.querySelector('#signup-greeting').textContent = self.userData.name || 'boss';
      self._showStep(3);
    });

    m.querySelectorAll('[data-signup-back]').forEach(b => {
      b.addEventListener('click', () => self._showStep(parseInt(b.dataset.signupBack) - 1));
    });

    m.querySelector('[data-signup-register]').addEventListener('click', (ev) => {
      ev.preventDefault();
      const btn = ev.currentTarget;
      const blockEl = m.querySelector('[data-signup-region-block]');
      const open = () => {
        try { window.open(BdGate.AFFILIATE_URL, '_blank', 'noopener,noreferrer'); }
        catch (e) { location.href = BdGate.AFFILIATE_URL; }
        setTimeout(() => self._finish('register'), 100);
      };
      const block = () => {
        if (blockEl) blockEl.style.display = 'flex';
        btn.classList.add('btn-disabled');
        btn.setAttribute('aria-disabled', 'true');
      };
      const verifying = () => {
        btn.classList.add('btn-loading');
        btn.querySelector('.signup-final-text strong').textContent = 'Verifying region…';
      };
      const restoreLabel = () => {
        btn.classList.remove('btn-loading');
        const strong = btn.querySelector('.signup-final-text strong');
        if (strong) strong.textContent = (window.t ? window.t('Claim Welcome Bonus') : 'Claim Welcome Bonus');
      };
      if (BdGate.CHECKING) {
        verifying();
        BdGate.whenReady(() => {
          restoreLabel();
          if (BdGate.allow()) open(); else block();
        });
      } else {
        if (BdGate.allow()) open(); else block();
      }
    });
    m.querySelector('[data-signup-play]').addEventListener('click', () => self._finish('play'));

    m.querySelector('#signup-name').addEventListener('keydown', e => {
      if (e.key === 'Enter') m.querySelector('[data-signup-next="1"]').click();
    });

    // Backdrop click closes modal
    m.addEventListener('click', e => {
      if (e.target === m) self.close();
    });
  },

  _showStep(n) {
    this.currentStep = n;
    this.modal.querySelectorAll('.signup-page').forEach(p => {
      p.style.display = parseInt(p.dataset.page) === n ? '' : 'none';
    });
    this.modal.querySelectorAll('.signup-step').forEach((s, i) => {
      const pip = i + 1;
      s.classList.toggle('active', pip === n);
      s.classList.toggle('complete', pip < n);
    });
  },

  _finish(action) {
    this.stored.completed = true;
    this.stored.completedAt = new Date().toString();
    this._saveStored();
    this.close();
    if (this.userData.name) {
      setTimeout(() => toast('Welcome to Bigtaka, ' + this.userData.name + '!', 'win'), 600);
    }
  },

  open() {
    this._ensure();
    this._showStep(1);
    this.modal.classList.remove('fade-out');
    this.modal.classList.add('open');
    setTimeout(() => this.modal.querySelector('#signup-name')?.focus(), 300);
  },

  close() {
    if (!this.modal) return;
    this.modal.classList.add('fade-out');
    setTimeout(() => {
      this.modal.classList.remove('open');
      this.modal.classList.remove('fade-out');
    }, 320);
  }
};

window.openSignup = () => Signup.open();
// Expose core modules on window so the `window.Sfx && Sfx.x()` style guards
// scattered through games actually evaluate truthy. (Sfx/Wallet/Player are
// declared as `const`, so without this they live only in the script's
// lexical scope and `window.Sfx` is undefined.)
window.Sfx = Sfx;
window.Wallet = Wallet;
window.Player = Player;

// ============ LIVE CASINO module (shared dealer / feed / reactions / streak) ============
const LiveCasino = {
  DEALERS: [
    { id: 'sofia',  emoji: '💃', name: 'Sofia',  style: 'Elegant VIP',       color: ['#ffd700', '#c80060'],
      greet: 'Welcome, sir. Place your bets.', win: 'Beautiful play, sir!', loss: 'Better luck next round.', big: 'Magnifique! Huge win!' },
    { id: 'maya',   emoji: '🤵', name: 'Maya',   style: 'Classic Hostess',   color: ['#ff1ed7', '#500ecf'],
      greet: 'Hello! Ready to play?',        win: 'Excellent! Well played.', loss: 'Stay sharp, next one is yours.', big: 'Massive win — congrats!' },
    { id: 'raj',    emoji: '🎩', name: 'Raj',    style: 'Game Show Host',    color: ['#a4ff2c', '#ff8a00'],
      greet: 'Welcome, welcome, welcome!',    win: 'YES! That\'s how you do it!', loss: 'Aaalmost! Next one!', big: 'MEGA WIN! Crowd goes wild!' },
    { id: 'luna',   emoji: '🌙', name: 'Luna',   style: 'Mystic Fortune',    color: ['#1ec0ff', '#500ecf'],
      greet: 'The stars favor you tonight…', win: 'Fortune smiles on you.',     loss: 'The wheel turns again.',  big: 'The fates have spoken!' },
    { id: 'kira',   emoji: '⚡', name: 'Kira',   style: 'High Voltage',      color: ['#ffd700', '#ff1ed7'],
      greet: 'Let\'s light it up!',          win: 'Electric play! Sparks fly!', loss: 'Recharge — next round!', big: 'LIGHTNING WIN! ⚡' }
  ],

  current: null,

  pickDealer() {
    return this.DEALERS[Math.floor(Math.random() * this.DEALERS.length)];
  },

  renderDealerCard(target, dealer) {
    if (!dealer) dealer = this.pickDealer();
    this.current = dealer;
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    el.innerHTML = `
      <div class="live-dealer">
        <div class="live-dealer-avatar" style="background: linear-gradient(135deg, ${dealer.color[0]}, ${dealer.color[1]});">
          <span>${dealer.emoji}</span>
          <span class="live-dot"></span>
        </div>
        <div class="live-dealer-info">
          <div class="live-dealer-name">${dealer.name}<span class="live-tag">LIVE</span></div>
          <div class="live-dealer-style">${dealer.style}</div>
          <div class="live-dealer-msg" data-dealer-msg>${dealer.greet}</div>
        </div>
        <div class="live-dealer-stat">
          <div class="ldstat-label">Online</div>
          <div class="ldstat-value">${(2400 + Math.floor(Math.random() * 1200))}</div>
        </div>
      </div>
    `;
    return dealer;
  },

  dealerSay(message) {
    document.querySelectorAll('[data-dealer-msg]').forEach(el => {
      el.textContent = message;
      el.classList.remove('msg-flash');
      void el.offsetWidth;
      el.classList.add('msg-flash');
    });
  },

  // React on a game event — uses current dealer's voice
  react(kind /* 'win' | 'loss' | 'big' | string */) {
    if (!this.current) return;
    const d = this.current;
    let msg = '';
    if (kind === 'win') msg = d.win;
    else if (kind === 'loss') msg = d.loss;
    else if (kind === 'big') msg = d.big;
    else msg = kind; // custom string
    this.dealerSay(msg);
  },

  // Fake live feed
  FEED_TEMPLATES: [
    name => `${name} won ${(Math.floor(Math.random()*9000)+1000).toLocaleString()} FUN`,
    name => `${name} hit a hot streak 🔥`,
    name => `${name} triggered Lightning Multiplier ⚡`,
    name => `${name} cashed out at ${(2+Math.random()*8).toFixed(1)}×`,
    name => `${name} won big on the wheel`,
    name => `${name} just got Bonus Round`,
    name => `🎉 ${name} JACKPOT WIN!`,
    name => `VIP ${name} joined the table`,
    name => `${name} doubled down — won 💰`,
    name => `${name} on a 5× streak`
  ],
  FEED_NAMES: ['Rafi', 'Sumi', 'Tanvir', 'Jahid', 'Mira', 'Aman', 'Niloy', 'Ria', 'Sajid', 'Adi', 'Karim', 'Nayan', 'Zara', 'Pia', 'Ifty', 'Roni'],

  _feedTimer: null,
  startFeedTicker(targetId) {
    const el = document.getElementById(targetId || 'live-feed');
    if (!el) return;
    if (this._feedTimer) clearInterval(this._feedTimer);
    const generate = () => {
      const name = this.FEED_NAMES[Math.floor(Math.random()*this.FEED_NAMES.length)];
      const tpl = this.FEED_TEMPLATES[Math.floor(Math.random()*this.FEED_TEMPLATES.length)];
      const item = document.createElement('div');
      item.className = 'live-feed-item';
      item.textContent = tpl(name);
      el.insertBefore(item, el.firstChild);
      setTimeout(() => item.classList.add('show'), 50);
      while (el.children.length > 4) el.removeChild(el.lastChild);
      setTimeout(() => item.classList.add('fade'), 7000);
      setTimeout(() => item.remove(), 8200);
    };
    generate();
    this._feedTimer = setInterval(generate, 2400);
  },

  REACTIONS: ['🔥', '🎉', '👏', '❤️', '🍀', '💎', '🤯', '👀'],

  renderReactionBar(targetId) {
    const el = document.getElementById(targetId || 'reaction-bar');
    if (!el) return;
    el.innerHTML = `<span class="reaction-label">React:</span>` +
      this.REACTIONS.map(e => `<button class="reaction-btn" data-emoji="${e}" aria-label="React ${e}">${e}</button>`).join('');
    el.addEventListener('click', e => {
      const btn = e.target.closest('[data-emoji]');
      if (!btn) return;
      this.spawnFloatingEmoji(btn.dataset.emoji, btn);
    });
  },

  spawnFloatingEmoji(emoji, originBtn) {
    const rect = originBtn ? originBtn.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0 };
    const startX = rect.left + rect.width / 2;
    const startY = rect.top;
    for (let i = 0; i < 4; i++) {
      const e = document.createElement('div');
      e.className = 'floating-emoji';
      e.textContent = emoji;
      e.style.left = startX + 'px';
      e.style.top = startY + 'px';
      e.style.setProperty('--dx', ((Math.random() - 0.5) * 120).toFixed(0) + 'px');
      e.style.animationDelay = (i * 70) + 'ms';
      document.body.appendChild(e);
      setTimeout(() => e.remove(), 2500);
    }
    if (window.Sfx && Sfx.tick) Sfx.tick();
  },

  // Streak indicator
  streak: 0,
  bumpStreak() { this.streak++; this._renderStreak(); },
  resetStreak() { this.streak = 0; this._renderStreak(); },
  _renderStreak() {
    document.querySelectorAll('[data-streak-count]').forEach(el => el.textContent = this.streak);
    document.querySelectorAll('[data-streak-wrap]').forEach(el => {
      el.classList.toggle('hot', this.streak >= 3);
    });
  },

  // Initialize everything for a live game page
  init(dealerCardSel, feedId, reactionBarId) {
    this.renderDealerCard(dealerCardSel);
    this.startFeedTicker(feedId);
    this.renderReactionBar(reactionBarId);
    this._renderStreak();
  }
};

// ============ BONUS SELECT (between Claim Welcome Bonus → affiliate link) ============
const REGISTER_URL = 'https://rrwkd.ttrk.io/69c7fc1113304dfe90bf3506';
const BONUSES = [
  { id: 'welcome-slot',    emoji: '🎰', name: '100% Welcome Slot Bonus',     value: 'VIP Welcome Pack',    perks: 'Premium slot welcome pack · 30+ top titles · auto-activated',          tag: 'BEST DEAL' },
  { id: 'free-spins',      emoji: '✨', name: '100 Free Spins',              value: '100 Free Spins',    perks: 'On hottest slots · Pragmatic, JILI, PG Soft · top providers',         tag: 'POPULAR' },
  { id: 'megacashback',    emoji: '💰', name: '30% MegaCashback',            value: '30% Weekly',        perks: 'Weekly recovery boost · across every game · auto-activated every Monday',          tag: 'MEGA' },
  { id: 'weekly-pool',     emoji: '🏆', name: 'Weekly Bonus Pool',           value: 'Weekly Premium Pool',  perks: 'Compete for the biggest weekly leaderboard in Bangladesh · play to qualify', tag: 'HUGE' },
  { id: 'vip-rebate',      emoji: '👑', name: 'Exclusive VIP Rebate',        value: 'Tier-based %',      perks: 'Daily VIP boost · climb 5 VIP tiers · personal account manager',    tag: 'EXCLUSIVE' },
  { id: 'live-unlimited',  emoji: '♠️', name: 'Live Casino Unlimited Bonus', value: 'No Wager Cap',     perks: 'Unlimited live-table boosts · Roulette, Baccarat, Blackjack, Dragon Tiger', tag: 'NEW' }
];

const BonusSelect = {
  open() {
    if (document.getElementById('bonus-select')) return;
    const html = `
      <div class="bonus-select-bg" id="bonus-select">
        <div class="bonus-select-card">
          <button class="bonus-select-close" data-bs-close aria-label="Close">✕</button>
          <div class="bonus-select-eyebrow">🎁 Almost there</div>
          <h2>Pick your <span class="hl">welcome bonus</span></h2>
          <p>Choose the bonus that fits how you like to play. You can change it later.</p>
          <div class="bonus-grid">
            ${BONUSES.map(b => `
              <button class="bonus-card${b.tag ? ' has-tag' : ''}" data-bonus="${b.id}">
                ${b.tag ? `<span class="bonus-tag">${b.tag}</span>` : ''}
                <div class="bonus-emoji">${b.emoji}</div>
                <div class="bonus-name">${b.name}</div>
                <div class="bonus-value">${b.value}</div>
                <div class="bonus-perks">${b.perks}</div>
                <div class="bonus-cta">Claim →</div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    const el = document.getElementById('bonus-select');
    function close() {
      el.classList.add('fade-out');
      setTimeout(() => el.remove(), 320);
    }
    el.querySelector('[data-bs-close]').addEventListener('click', close);
    el.addEventListener('click', e => { if (e.target === el) close(); });
    el.querySelectorAll('[data-bonus]').forEach(card => {
      card.addEventListener('click', () => {
        // Store the selected bonus, close bonus screen, open signup modal
        const bonusId = card.dataset.bonus;
        try {
          const stored = JSON.parse(localStorage.getItem(SIGNUP_KEY) || '{}');
          stored.selectedBonus = bonusId;
          localStorage.setItem(SIGNUP_KEY, JSON.stringify(stored));
        } catch (e) {}
        if (window.Sfx && Sfx.coin) Sfx.coin();
        close();
        setTimeout(() => Signup.open(), 280);
      });
    });
    if (window.Sfx && Sfx.open) Sfx.open();
  }
};

window.openBonusSelect = () => BonusSelect.open();

// ============ REGISTER PROMPT (fires on every win) ============
const RegisterPrompt = {
  _lastShownAt: 0,

  // Trigger the prompt on every win — but throttle rapid repeats and skip if currently visible
  trigger() {
    if (document.getElementById('register-prompt')) return; // already on screen
    // Brief throttle: 4s between shows so rapid wins (slot spam, plinko balls) don't stack
    const now = Date.now();
    if (now - this._lastShownAt < 4000) return;
    this._lastShownAt = now;

    // Pull name from signup if available
    let name = 'boss';
    try {
      const su = JSON.parse(localStorage.getItem('bigtaka_freeplay_signup_v1') || '{}');
      if (su.name) name = su.name;
    } catch (e) {}

    // Resolve image path relative to current page
    // Resolve asset path: relative for /games/ and /m/, plain for root hub
    const p = location.pathname;
    const isNested = p.includes('/games/') || p.includes('/m/');
    const coinSrc = (isNested ? '../assets/' : 'assets/') + 'takacoincoin.png';

    const html = `
      <div class="register-prompt-bg open" id="register-prompt" role="dialog" aria-label="Welcome bonus">
        <div class="register-prompt-card">
          <button class="register-prompt-close" data-rp-close aria-label="Dismiss">✕</button>
          <img class="register-prompt-coin" src="${coinSrc}" alt="" />
          <div class="register-prompt-eyebrow">🎁 Welcome Bonus Unlocked</div>
          <h2>Nice win, <span class="hl">${name.replace(/[<>&"']/g, '')}</span>!</h2>
          <p>You're winning with FUN coins. Want real prizes & daily rewards too?</p>
          <div class="register-prompt-actions">
            <button class="btn btn-gold btn-block" data-rp-claim>
              💎 Claim Welcome Bonus
            </button>
            <button class="btn btn-ghost btn-block" data-rp-later>Keep Playing</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    const el = document.getElementById('register-prompt');
    if (window.Sfx && Sfx.coin) Sfx.coin();

    function close() {
      el.classList.add('fade-out');
      setTimeout(() => el.remove(), 320);
    }
    el.querySelector('[data-rp-claim]').addEventListener('click', () => {
      // Open the Signup flow directly (matches the Sign Up tab + the Claim
      // Now CTA on the homepage). The signup card slides up while this
      // non-blocking prompt fades out.
      Signup.open();
      setTimeout(close, 200);
    });
    el.querySelector('[data-rp-later]').addEventListener('click', close);
    el.querySelector('[data-rp-close]').addEventListener('click', close);
  }
};

// Clean up any stale flag from earlier versions
try { localStorage.removeItem('bigtaka_freeplay_register_prompt_v1'); } catch (e) {}

// ============ RECENTLY PLAYED ============
const RECENT_KEY = 'bigtaka_freeplay_recent_v1';
const Recent = {
  list() {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; }
    catch (e) { return []; }
  },
  push(gameId) {
    let arr = this.list().filter(id => id !== gameId);
    arr.unshift(gameId);
    if (arr.length > 8) arr = arr.slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(arr));
    this.render();
  },
  render() {
    const wrap = document.getElementById('recent-grid');
    if (!wrap) return;
    const ids = this.list();
    const section = document.getElementById('recent-section');
    if (!ids.length) { if (section) section.style.display = 'none'; return; }
    if (section) section.style.display = '';
    const games = ids.map(id => GAMES.find(g => g.id === id)).filter(Boolean).slice(0, 6);
    wrap.innerHTML = games.map(g => renderCard(g)).join('');
    bindCardClicks(wrap);
  }
};

// ============ HOT NOW ============
const Hot = {
  render() {
    const wrap = document.getElementById('hot-grid');
    if (!wrap) return;
    // Pick games tagged 'hot' + 'new', curate 8
    const hot = GAMES.filter(g => g.tag === 'hot' || g.tag === 'new').slice(0, 8);
    wrap.innerHTML = hot.map(g => renderCard(g)).join('');
    bindCardClicks(wrap);
  }
};

// ============ COIN BURST ============
function coinBurst(originX = null, originY = null, count = 18) {
  const x = originX !== null ? originX : window.innerWidth / 2;
  const y = originY !== null ? originY : window.innerHeight / 2;
  const wrap = document.createElement('div');
  wrap.className = 'coin-burst';
  wrap.style.left = x + 'px';
  wrap.style.top = y + 'px';
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'coin-burst-coin';
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist = 100 + Math.random() * 220;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 200;
    c.style.setProperty('--dx', dx + 'px');
    c.style.setProperty('--dy', dy + 'px');
    c.style.animationDelay = (Math.random() * 0.15) + 's';
    wrap.appendChild(c);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 1800);
}

// Re-bind helper used by Recent/Hot grids
function bindCardClicks(wrap) {
  wrap.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const play = e.target.closest('[data-play]');
      const learn = e.target.closest('[data-learn]');
      if (play) {
        e.stopPropagation();
        const g = GAMES.find(x => x.id === play.dataset.play);
        if (g && !g.play.startsWith('#')) {
          Recent.push(g.id);
          window.location.href = g.play;
        } else openModal(play.dataset.play);
        return;
      }
      if (learn) { e.stopPropagation(); openModal(learn.dataset.learn); return; }
      openModal(card.dataset.game);
    });
  });
}

// ============ RENDER GAME CARDS ============
function gameArtBg(g) {
  // Brand-colored gradient acts as fallback while the poster loads / if missing.
  // Poster art on top.
  const [c1, c2] = g.color;
  return `
    <div class="game-art-bg" style="background: linear-gradient(135deg, ${c1} 0%, ${c2} 100%);"></div>
    <div class="game-art-bg game-art-poster" style="background-image: url('assets/posters/${g.id}.png');"></div>
  `;
}

function tagLabel(tag) {
  return { play: 'PLAY DEMO', tutorial: 'HOW TO PLAY', hot: '🔥 HOT', new: '✨ NEW' }[tag] || '';
}

function renderCard(g) {
  return `
    <div class="game-card" data-game="${g.id}" data-cat="${g.cat}">
      ${gameArtBg(g)}
      ${g.tag ? `<span class="game-tag tag-${g.tag}">${tagLabel(g.tag)}</span>` : ''}
      ${g.jackpot ? `<span class="jackpot-badge">💎 JACKPOT</span>` : ''}
      <div class="game-meta">
        <div class="game-title">${g.name}</div>
        <div class="game-provider">${g.provider}</div>
      </div>
      <div class="game-hover">
        <button class="btn btn-green btn-sm" data-play="${g.id}">▶ Try Demo</button>
        <button class="btn btn-ghost btn-sm" data-learn="${g.id}">📘 How to Play</button>
      </div>
    </div>
  `;
}

function renderGrid(filter = 'all', search = '') {
  const grid = document.getElementById('game-grid');
  if (!grid) return;
  let list = GAMES;
  if (filter !== 'all') list = list.filter(g => g.cat === filter);
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(g =>
      g.name.toLowerCase().includes(s) ||
      g.provider.toLowerCase().includes(s) ||
      g.cat.toLowerCase().includes(s)
    );
  }
  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;padding:60px 20px;text-align:center;color:var(--text-muted)">No games found. Try another search.</div>`;
    return;
  }
  grid.innerHTML = list.map(renderCard).join('');

  // Count update
  const counter = document.getElementById('game-count');
  if (counter) counter.textContent = `${list.length} game${list.length === 1 ? '' : 's'}`;
}

// ============ MODAL ============
function openModal(gameId) {
  const g = GAMES.find(x => x.id === gameId);
  if (!g) return;
  Sfx.open();

  const m = document.getElementById('modal');
  const body = `
    <div class="modal-head">
      <div class="modal-title-block">
        <div class="modal-eyebrow">${CATEGORIES[g.cat].name}</div>
        <div class="modal-title">${g.name}</div>
        <div class="modal-provider">${g.provider}</div>
      </div>
      <button class="modal-close" data-close>✕</button>
    </div>
    <div class="modal-body">
      <div class="modal-section">
        <h4>How It Works</h4>
        <p>${g.how}</p>
      </div>
      <div class="modal-section">
        <h4>Rules & Features</h4>
        <ul>${g.rules.map(r => `<li>${r}</li>`).join('')}</ul>
      </div>
      <div class="modal-section">
        <h4>Game Info</h4>
        <div class="kv-row"><span class="k">RTP</span><span class="v">${g.rtp}</span></div>
        <div class="kv-row"><span class="k">Volatility</span><span class="v">${g.volatility}</span></div>
        <div class="kv-row"><span class="k">Max Win</span><span class="v">${g.maxWin}</span></div>
        <div class="kv-row"><span class="k">Min Bet</span><span class="v">${g.minBet}</span></div>
      </div>
      <div class="modal-section">
        <div class="tip-card">
          <strong>💡 Strategy tip:</strong> ${g.strategy}
        </div>
      </div>
    </div>
    <div class="modal-foot">
      ${g.play.startsWith('#') ? '' : `<a href="${g.play}" class="btn btn-green">▶ Try Free Demo</a>`}
      <button class="btn btn-ghost" data-close>Close</button>
    </div>
  `;
  m.querySelector('.modal').innerHTML = body;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const m = document.getElementById('modal');
  if (m && m.classList.contains('open')) {
    m.classList.remove('open');
    document.body.style.overflow = '';
    Sfx.close();
  }
}

// ============ INIT ============
function initHub() {
  Wallet.render();
  Sfx.render();
  Player.render();
  Player.renderMissions();
  Player.renderBadges();
  Recent.render();
  Hot.render();

  // Daily login check (only on hub)
  if (document.getElementById('daily-modal')) {
    const result = Player.checkDailyLogin();
    if (result) {
      const dm = document.getElementById('daily-modal');
      dm.querySelector('[data-daily-reward]').textContent = Wallet.format(result.reward);
      dm.querySelector('[data-daily-streak]').textContent = result.streak;
      dm.classList.add('open');
      setTimeout(() => Sfx.coin(), 200);
      dm.querySelector('[data-daily-close]')?.addEventListener('click', () => dm.classList.remove('open'));
    }
  }

  // Floating Lucky Boss mascot on hub
  if (document.getElementById('game-grid')) {
    Mascot.attachFloating('boss');
  }

  // Wallet reset
  document.querySelectorAll('[data-wallet-reset]').forEach(el => {
    el.addEventListener('click', () => Wallet.reset());
  });

  // Sound toggle
  document.querySelectorAll('[data-sfx-btn]').forEach(el => {
    el.addEventListener('click', () => Sfx.toggle());
  });

  // Universal click sound — ALL interactive elements get a soft click
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, a.btn, a, [role="button"], .cat-card, .target-zone, .game-card, .mine-cell, label[for]');
    if (!t) return;
    if (t.matches('[data-sfx-btn], [data-no-click-sfx]')) return;
    if (e.target.matches('input, textarea, select')) return;
    Sfx.click();
  }, true);

  // Signup modal opener — works on any page
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-open-signup]');
    if (trigger) {
      e.preventDefault();
      Signup.open();
    }
  });

  // First user interaction: unlock audio context
  const unlock = () => {
    Sfx._ensure();
    document.removeEventListener('click', unlock, true);
    document.removeEventListener('keydown', unlock, true);
    document.removeEventListener('touchstart', unlock, true);
  };
  document.addEventListener('click', unlock, true);
  document.addEventListener('keydown', unlock, true);
  document.addEventListener('touchstart', unlock, true);

  // Initial grid render
  renderGrid('all');

  // Filter chips
  let currentFilter = 'all';
  let currentSearch = '';
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderGrid(currentFilter, currentSearch);
    });
  });

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderGrid(currentFilter, currentSearch);
    });
  }

  // Card click delegation (hub only)
  const gridEl = document.getElementById('game-grid');
  if (gridEl) gridEl.addEventListener('click', (e) => {
    const play = e.target.closest('[data-play]');
    const learn = e.target.closest('[data-learn]');
    const card = e.target.closest('.game-card');

    if (play) {
      e.stopPropagation();
      const g = GAMES.find(x => x.id === play.dataset.play);
      if (g && !g.play.startsWith('#')) {
        Recent.push(g.id);
        window.location.href = g.play;
      } else {
        openModal(play.dataset.play);
      }
      return;
    }
    if (learn) {
      e.stopPropagation();
      openModal(learn.dataset.learn);
      return;
    }
    if (card) {
      openModal(card.dataset.game);
    }
  });

  // Modal close (hub only)
  const modalEl = document.getElementById('modal');
  if (modalEl) modalEl.addEventListener('click', (e) => {
    if (e.target.matches('[data-close]') || e.target.id === 'modal') closeModal();
  });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Scroll fade
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => en.isIntersecting && en.target.classList.add('in'));
  }, { threshold: 0.12 });
  document.querySelectorAll('.scroll-fade').forEach(el => io.observe(el));

  // Category cards: scroll to filter
  document.querySelectorAll('[data-cat-jump]').forEach(c => {
    c.addEventListener('click', () => {
      const cat = c.dataset.catJump;
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      document.querySelector(`[data-filter="${cat}"]`)?.classList.add('active');
      renderGrid(cat, currentSearch);
      currentFilter = cat;
      document.getElementById('game-library').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

}

// Init when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHub);
} else {
  initHub();
}
