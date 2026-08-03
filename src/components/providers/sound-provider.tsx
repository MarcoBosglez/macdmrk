"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

// Every distinct kind of interaction gets its own synthesized tone —
// see SOUND_VARIANTS below for what each one actually sounds like.
export type SoundVariant = "nav" | "toggle" | "open" | "close" | "maximize" | "minimize";

type SoundContextValue = {
  muted: boolean;
  toggleMute: () => void;
  playClick: (variant?: SoundVariant) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

// Oscillator settings for the non-nav variants. frequency always moves
// from `start` to `end` (exponential ramp), and volume always decays
// from `gain` to silence over `duration` seconds — only those numbers
// and the waveform shape (`type`) differ between variants. `nav` isn't
// here — it uses playTypewriterClick below instead of a plain tone.
const SOUND_VARIANTS: Record<
  Exclude<SoundVariant, "nav">,
  { type: OscillatorType; start: number; end: number; duration: number; gain: number }
> = {
  // Flipping a binary state (mute/theme/locale, FAQ accordion, mobile
  // menu): a short, neutral tick that rises slightly.
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
    if (mutedRef.current) return;
    try {
      // Synthesized rather than an audio file, so there's nothing to
      // load and no asset to manage.
      const ctx = audioCtxRef.current ?? new AudioContext();
      audioCtxRef.current = ctx;

      if (variant === "nav") {
        playTypewriterClick(ctx);
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
