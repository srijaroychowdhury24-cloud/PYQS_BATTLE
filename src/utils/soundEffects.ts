// Lightweight Web Audio API sound effects for instant quiz feedback (zero external audio dependencies)

let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedCtx) {
    sharedCtx = new AudioCtx();
  }
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume().catch(() => {});
  }
  return sharedCtx;
}

function playTone(
  ctx: AudioContext,
  freq: number,
  startOffset: number,
  duration: number,
  type: OscillatorType,
  peakGain: number
) {
  const now = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(peakGain, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export function playCorrectSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  // Bright ascending major triad chime (C5 -> E5 -> G5)
  playTone(ctx, 523.25, 0, 0.14, 'triangle', 0.12);
  playTone(ctx, 659.25, 0.07, 0.16, 'triangle', 0.13);
  playTone(ctx, 783.99, 0.14, 0.24, 'sine', 0.14);
}

export function playWrongSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  // Soft descending game tone (A3 -> E3)
  playTone(ctx, 220, 0, 0.14, 'triangle', 0.11);
  playTone(ctx, 164.81, 0.11, 0.22, 'sine', 0.12);
}

export function playStreakSound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  // Energetic 4-note ascending streak sparkle (C5 -> E5 -> G5 -> C6)
  playTone(ctx, 523.25, 0, 0.12, 'triangle', 0.11);
  playTone(ctx, 659.25, 0.07, 0.12, 'triangle', 0.11);
  playTone(ctx, 783.99, 0.14, 0.14, 'triangle', 0.12);
  playTone(ctx, 1046.5, 0.21, 0.3, 'sine', 0.15);
}

export function playVictorySound(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  playTone(ctx, 523.25, 0, 0.12, 'triangle', 0.12);
  playTone(ctx, 659.25, 0.1, 0.12, 'triangle', 0.12);
  playTone(ctx, 783.99, 0.2, 0.12, 'triangle', 0.12);
  playTone(ctx, 1046.5, 0.3, 0.36, 'sine', 0.15);
}
