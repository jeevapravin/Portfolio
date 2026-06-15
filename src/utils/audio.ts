/**
 * Web Audio API based Synthesizer for Aerospace-grade Telemetry and Keyclicks.
 * Features highly dampened high-frequency frequencies, micro-durations, and low volume
 * to guarantee an ultra-polished, non-intrusive sensory layout.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    // Lazy initialize to bypass browser autoplay rules before interaction
    // @ts-ignore
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

/**
 * Triggers a tiny high-frequency physical tactile click.
 */
export function playKeyClick() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;

  try {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    // Muted high frequency crisp sensor beep
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, ctx.currentTime);

    // Dynamic micro envelope
    gainNode.gain.setValueAtTime(0.015, ctx.currentTime); // very quiet
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (error) {
    // Graceful catch for any edge environmental constraints
  }
}

/**
 * Triggers a subtle telemetry check response (slightly lower, warmer sine cascade).
 */
export function playTelemetryCheck() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;

  try {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1440, ctx.currentTime + 0.12);

    gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch (error) {
    // Fail silently
  }
}

/**
 * Triggers a crisp warning chime when processing or transmission nodes fail.
 */
export function playTelemetryWarning() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;

  try {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.setValueAtTime(110, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch (err) {
    // Fail silently
  }
}
