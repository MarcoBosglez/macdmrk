"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// Every distinct kind of interaction gets its own synthesized tone —
// see SOUND_VARIANTS below for what each one actually sounds like.
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

// Oscillator settings for the plain single-ramp variants. frequency
// always moves from `start` to `end` (exponential ramp), and volume
// always decays from `gain` to silence over `duration` seconds — only
// those numbers and the waveform shape (`type`) differ between
// variants. `nav`, `honk`, `pageOpen`, and `hover` aren't here — they
// use their own dedicated functions below instead of a plain
// single-ramp tone.
const SOUND_VARIANTS: Record<
  Exclude<SoundVariant, "nav" | "honk" | "pageOpen" | "hover">,
  { type: OscillatorType; start: number; end: number; duration: number; gain: number }
> = {
  // Generic binary-state flip (FAQ accordion, mobile menu): a short,
  // neutral tick that rises slightly. Mute and theme now have their
  // own more specific variants below instead of using this one.
  toggle: { type: "triangle", start: 650, end: 900, duration: 0.06, gain: 0.05 },
  // Opening a gallery window: a rising "pop".
  open: { type: "sine", start: 420, end: 880, duration: 0.1, gain: 0.06 },
  // Closing a window: a falling "thud" — the inverse of `open`.
  close: { type: "sine", start: 780, end: 260, duration: 0.1, gain: 0.06 },
  // Maximizing a window: same rising shape as `open` but wider and on
  // a sawtooth (brighter, buzzier) so it reads as "expanding" rather
  // than "appearing" — distinct from open even though both climb.
  maximize: { type: "sawtooth", start: 500, end: 1300, duration: 0.13, gain: 0.05 },
  // Restoring/minimizing: the sawtooth counterpart to `close` — falls
  // instead of rising, pairing with `maximize` the way open/close pair.
  minimize: { type: "sawtooth", start: 950, end: 380, duration: 0.12, gain: 0.045 },
  // Muting: a short downward sweep — sound "powering off".
  mute: { type: "sine", start: 520, end: 160, duration: 0.09, gain: 0.05 },
  // Unmuting: the exact mirror of `mute`, sweeping back up — sound
  // "powering on". This one bypasses the mute gate in playClick below,
  // since otherwise the confirmation that audio is back would itself
  // be the one sound that never plays.
  unmute: { type: "sine", start: 220, end: 640, duration: 0.09, gain: 0.055 },
  // Switching to light mode: brighter and rising, like daylight.
  themeLight: { type: "triangle", start: 380, end: 840, duration: 0.12, gain: 0.05 },
  // Switching to dark mode: lower and falling — the inverse of themeLight.
  themeDark: { type: "triangle", start: 700, end: 300, duration: 0.12, gain: 0.045 },
};

// nav's click — a mechanical "typewriter key" sound (think CS2's menu
// clicks), not a tone. A single oscillator can't produce that
// percussive character, so this layers two things instead:
//  1. A short burst of noise pushed through a bandpass filter, which
//     is what makes noise read as a pitched "tick" instead of static.
//     That's the sharp "clack" of the key striking.
//  2. A very brief low square-wave blip fired a few ms later — the
//     dull "thock" of the mechanism bottoming out right after the clack.
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

// The penguin easter egg's click sound — a cartoonish "honk": a square
// wave that swoops up and then back down in pitch, rather than the
// single-direction ramp the tone-based variants use.
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

// Opening a whole new page (a project, from the work list) — two quick
// rising sine blips in a row, like a page turning, rather than the
// single-tone ramp the other "open"-ish variants use. Meant to feel
// bigger than the plain `nav` typewriter click, since it's marking a
// full page navigation rather than a same-page link.
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

// Hovering over any interactable element — a thin, papery "flip" like
// a mechanical split-flap/flip-clock display, not a "click" character.
// Structurally similar to playTypewriterClick (noise burst + a brief
// settle blip) but with a higher, narrower bandpass for a thinner,
// more plasticky flap, and a much quieter/quicker settle.
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

// Site-wide "does the UI make click sounds" state, plus the function
// that actually makes the sound. This lives at the top of the app
// (see layout.tsx) so any button anywhere — nav pills, window close
// buttons, FAQ items — can call playClick(variant) and have it respect
// whatever the mute toggle is currently set to.
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false);

  // playClick is wrapped in useCallback so it has a stable identity,
  // but it still needs to see the LATEST muted value every time it's
  // called — a plain closure over `muted` would freeze on whatever
  // value existed when the callback was created. mutedRef sidesteps
  // that: we keep it in sync with state on every render, and read the
  // ref (not the state) inside the callback.
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const playClick = useCallback((variant: SoundVariant = "nav") => {
    // `unmute` is the one variant that must always be audible — it IS
    // the confirmation that muted is about to become false, so gating
    // it on the (still-true) current muted state would make it the one
    // sound that can never actually play.
    if (variant !== "unmute" && mutedRef.current) return;
    try {
      // Synthesized rather than an audio file, so there's nothing to
      // load and no asset to manage.
      const ctx = audioCtxRef.current ?? new AudioContext();
      audioCtxRef.current = ctx;

      if (variant === "nav") {
        playTypewriterClick(ctx);
        return;
      }

      if (variant === "honk") {
        playPenguinHonk(ctx);
        return;
      }

      if (variant === "pageOpen") {
        playPageOpen(ctx);
        return;
      }

      if (variant === "hover") {
        playFlipClick(ctx);
        return;
      }

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
      // Web Audio can be blocked (autoplay policy, unsupported browser) — silently no-op.
    }
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  // A single delegated listener covers every interactable element on
  // the site (links, buttons) instead of wiring an onMouseEnter to each
  // one individually. `lastHovered` tracks the current interactive
  // ancestor so moving the pointer between child elements inside the
  // same button/link doesn't refire it — pointerover bubbles on every
  // such crossing. Restricted to real mouse input (pointerType) since
  // touch devices fire pointerover right alongside their click, which
  // would double up with that element's own click sound.
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
