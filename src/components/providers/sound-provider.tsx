"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type SoundVariant =
  | "nav"
  | "toggle"
  | "open"
  | "close"
  | "maximize"
  | "minimize"
  | "honk"
  | "mute"
  | "unmute"
  | "themeLight"
  | "themeDark"
  | "pageOpen"
  | "hover";

type SoundContextValue = {
  muted: boolean;
  toggleMute: () => void;
  playClick: (variant?: SoundVariant) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

// Single-ramp oscillator tones: frequency sweeps start→end while the
// volume decays from `gain` to silence over `duration` seconds. The
// short phrase on each is roughly what it sounds like. (nav / honk /
// pageOpen / hover are richer and have their own functions below.)
const SOUND_VARIANTS: Record<
  Exclude<SoundVariant, "nav" | "honk" | "pageOpen" | "hover">,
  { type: OscillatorType; start: number; end: number; duration: number; gain: number }
> = {
  toggle: { type: "triangle", start: 650, end: 900, duration: 0.06, gain: 0.05 }, // neutral tick
  open: { type: "sine", start: 420, end: 880, duration: 0.1, gain: 0.06 }, // rising pop
  close: { type: "sine", start: 780, end: 260, duration: 0.1, gain: 0.06 }, // falling thud
  maximize: { type: "sawtooth", start: 500, end: 1300, duration: 0.13, gain: 0.05 }, // buzzy expand
  minimize: { type: "sawtooth", start: 950, end: 380, duration: 0.12, gain: 0.045 }, // buzzy collapse
  mute: { type: "sine", start: 520, end: 160, duration: 0.09, gain: 0.05 }, // power down
  unmute: { type: "sine", start: 220, end: 640, duration: 0.09, gain: 0.055 }, // power up
  themeLight: { type: "triangle", start: 380, end: 840, duration: 0.12, gain: 0.05 }, // bright rise
  themeDark: { type: "triangle", start: 700, end: 300, duration: 0.12, gain: 0.045 }, // dim fall
};

// A mechanical keyboard "clack": a filtered noise burst (the key
// striking) plus a brief low square-wave blip a few ms later (the
// mechanism bottoming out). Used for nav clicks.
function playTypewriterClick(ctx: AudioContext) {
  const now = ctx.currentTime;

  const noiseDuration = 0.03;
  const noiseBuffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * noiseDuration), ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 3200;
  bandpass.Q.value = 1.8;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.12, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);
  noise.connect(bandpass);
  bandpass.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + noiseDuration);

  const thockDelay = 0.004;
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(200, now + thockDelay);
  osc.frequency.exponentialRampToValueAtTime(100, now + thockDelay + 0.02);
  oscGain.gain.setValueAtTime(0.05, now + thockDelay);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + thockDelay + 0.025);
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(now + thockDelay);
  osc.stop(now + thockDelay + 0.03);
}

// Cartoon "honk": a square wave that swoops up in pitch then back down.
function playPenguinHonk(ctx: AudioContext) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(560, now + 0.06);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.24);
}

// Two quick rising sine blips in a row, like a page turning — marks a
// full-page navigation (opening a project from the work list).
function playPageOpen(ctx: AudioContext) {
  const now = ctx.currentTime;
  [
    { freq: 480, at: 0 },
    { freq: 720, at: 0.07 },
  ].forEach(({ freq, at }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + at);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + at + 0.05);
    gain.gain.setValueAtTime(0.0001, now + at);
    gain.gain.exponentialRampToValueAtTime(0.055, now + at + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + at + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + at);
    osc.stop(now + at + 0.09);
  });
}

// A thin, papery "flip" (split-flap display) for hovering anything —
// same shape as playTypewriterClick but higher, narrower and much
// quieter.
function playFlipClick(ctx: AudioContext) {
  const now = ctx.currentTime;

  const noiseDuration = 0.022;
  const noiseBuffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * noiseDuration), ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 4600;
  bandpass.Q.value = 2.6;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.045, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);
  noise.connect(bandpass);
  bandpass.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + noiseDuration);

  const settleDelay = 0.013;
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(320, now + settleDelay);
  osc.frequency.exponentialRampToValueAtTime(150, now + settleDelay + 0.014);
  oscGain.gain.setValueAtTime(0.03, now + settleDelay);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + settleDelay + 0.018);
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(now + settleDelay);
  osc.stop(now + settleDelay + 0.02);
}

// Site-wide mute state + playClick(). Mounted at the app root so any
// button anywhere can make a sound; everything is synthesized, so there
// are no audio files to load.
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false);

  // playClick keeps a stable identity (useCallback) but must read the
  // live `muted` value on every call — hence the ref kept in sync.
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const playClick = useCallback((variant: SoundVariant = "nav") => {
    // `unmute` must play even while still muted — it's the "sound is
    // back on" confirmation.
    if (variant !== "unmute" && mutedRef.current) return;
    try {
      const ctx = audioCtxRef.current ?? new AudioContext();
      audioCtxRef.current = ctx;

      if (variant === "nav") return playTypewriterClick(ctx);
      if (variant === "honk") return playPenguinHonk(ctx);
      if (variant === "pageOpen") return playPageOpen(ctx);
      if (variant === "hover") return playFlipClick(ctx);

      const { type, start, end, duration, gain: peakGain } = SOUND_VARIANTS[variant];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(start, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(end, ctx.currentTime + duration * 0.6);
      gain.gain.setValueAtTime(peakGain, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration * 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Web Audio can be blocked (autoplay policy / unsupported) — no-op.
    }
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  // One delegated listener plays the hover sound for every link/button
  // on the page. `lastHovered` stops it refiring as the pointer moves
  // between a button's children; mouse only, since touch fires
  // pointerover alongside the tap.
  useEffect(() => {
    let lastHovered: Element | null = null;
    function handlePointerOver(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const target = e.target as Element | null;
      const interactive = target?.closest('a, button, [role="button"]') ?? null;
      if (interactive === lastHovered) return;
      lastHovered = interactive;
      if (interactive && !(interactive as HTMLButtonElement).disabled) playClick("hover");
    }
    document.addEventListener("pointerover", handlePointerOver);
    return () => document.removeEventListener("pointerover", handlePointerOver);
  }, [playClick]);

  return (
    <SoundContext.Provider value={{ muted, toggleMute, playClick }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
