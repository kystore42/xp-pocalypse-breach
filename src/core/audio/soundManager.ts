// Sound Manager — Web Audio API generated sounds (no files needed)

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientOsc: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
let isMuted = false;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function getMaster(): GainNode {
  getCtx();
  return masterGain!;
}

export function setMuted(muted: boolean) {
  isMuted = muted;
  if (masterGain) {
    masterGain.gain.value = muted ? 0 : 0.3;
  }
}

export function isSoundMuted(): boolean {
  return isMuted;
}

// ---------- Sound effects ----------

/** XP startup chime — ascending C-E-G-C chord */
export function playStartupSound() {
  const ctx = getCtx();
  const master = getMaster();
  const now = ctx.currentTime;

  const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.15);
    gain.gain.linearRampToValueAtTime(0.25, now + i * 0.15 + 0.05);
    gain.gain.linearRampToValueAtTime(0, now + i * 0.15 + 0.6);
    osc.connect(gain);
    gain.connect(master);
    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.7);
  });
}

/** Terminal keypress — short click */
export function playKeyPress() {
  const ctx = getCtx();
  const master = getMaster();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.value = 800 + Math.random() * 400;
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  osc.connect(gain);
  gain.connect(master);
  osc.start(now);
  osc.stop(now + 0.05);
}

/** Alert beep — urgent warning */
export function playAlert() {
  const ctx = getCtx();
  const master = getMaster();
  const now = ctx.currentTime;

  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0, now + i * 0.15);
    gain.gain.linearRampToValueAtTime(0.15, now + i * 0.15 + 0.02);
    gain.gain.linearRampToValueAtTime(0, now + i * 0.15 + 0.1);
    osc.connect(gain);
    gain.connect(master);
    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.12);
  }
}

/** Notification pop — soft ding */
export function playNotification() {
  const ctx = getCtx();
  const master = getMaster();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.linearRampToValueAtTime(900, now + 0.1);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  osc.connect(gain);
  gain.connect(master);
  osc.start(now);
  osc.stop(now + 0.35);
}

/** Process killed — descending whoosh */
export function playProcessKill() {
  const ctx = getCtx();
  const master = getMaster();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  osc.connect(gain);
  gain.connect(master);
  osc.start(now);
  osc.stop(now + 0.3);
}

/** Breach warning — low ominous pulse */
export function playBreachPulse() {
  const ctx = getCtx();
  const master = getMaster();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 80;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
  gain.gain.linearRampToValueAtTime(0, now + 0.8);
  osc.connect(gain);
  gain.connect(master);
  osc.start(now);
  osc.stop(now + 1.0);
}

/** Wave complete — victory fanfare */
export function playWaveComplete() {
  const ctx = getCtx();
  const master = getMaster();
  const now = ctx.currentTime;

  const notes = [392.0, 493.88, 587.33, 783.99]; // G4, B4, D5, G5
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.12);
    gain.gain.linearRampToValueAtTime(0.2, now + i * 0.12 + 0.03);
    gain.gain.linearRampToValueAtTime(0, now + i * 0.12 + 0.4);
    osc.connect(gain);
    gain.connect(master);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.5);
  });
}

/** Achievement unlocked — sparkle sound */
export function playAchievement() {
  const ctx = getCtx();
  const master = getMaster();
  const now = ctx.currentTime;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.08);
    gain.gain.linearRampToValueAtTime(0.18, now + i * 0.08 + 0.02);
    gain.gain.linearRampToValueAtTime(0, now + i * 0.08 + 0.35);
    osc.connect(gain);
    gain.connect(master);
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.4);
  });
}

// ---------- Ambient drone ----------

/** Start ambient drone — distorts based on breach level */
export function startAmbient() {
  const ctx = getCtx();
  const master = getMaster();

  if (ambientOsc) stopAmbient();

  ambientOsc = ctx.createOscillator();
  ambientGain = ctx.createGain();
  ambientOsc.type = 'sine';
  ambientOsc.frequency.value = 55; // Low A
  ambientGain.gain.value = 0.03;
  ambientOsc.connect(ambientGain);
  ambientGain.connect(master);
  ambientOsc.start();
}

/** Update ambient distortion based on breach level (0-100) */
export function updateAmbient(breachLevel: number) {
  if (!ambientOsc || !ambientGain || !audioCtx) return;

  const now = audioCtx.currentTime;
  // Base freq distorts upward with breach
  const freq = 55 + (breachLevel / 100) * 120;
  ambientOsc.frequency.linearRampToValueAtTime(freq, now + 0.5);

  // Volume increases with breach
  const vol = 0.03 + (breachLevel / 100) * 0.07;
  ambientGain.gain.linearRampToValueAtTime(vol, now + 0.5);

  // Switch to sawtooth for high breach for more distorted sound
  if (breachLevel > 60) {
    ambientOsc.type = 'sawtooth';
  } else if (breachLevel > 30) {
    ambientOsc.type = 'triangle';
  } else {
    ambientOsc.type = 'sine';
  }
}

/** Stop ambient drone */
export function stopAmbient() {
  if (ambientOsc) {
    try { ambientOsc.stop(); } catch {}
    ambientOsc = null;
  }
  ambientGain = null;
}

/** BSOD crash sound */
export function playBSOD() {
  const ctx = getCtx();
  const master = getMaster();
  const now = ctx.currentTime;

  // White noise burst
  const bufferSize = ctx.sampleRate * 0.5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  noise.connect(gain);
  gain.connect(master);
  noise.start(now);

  // Low crash tone
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
  oscGain.gain.setValueAtTime(0.15, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  osc.connect(oscGain);
  oscGain.connect(master);
  osc.start(now);
  osc.stop(now + 0.6);
}
