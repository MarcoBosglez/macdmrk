"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type SoundContextValue = {
  muted: boolean;
  toggleMute: () => void;
  playClick: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

// Site-wide "does the UI make click sounds" state, plus the function
// that actually makes the sound. This lives at the top of the app
// (see layout.tsx) so any button anywhere — nav pills, window close
// buttons, FAQ items — can call playClick() and have it respect
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

  const playClick = useCallback(() => {
    if (mutedRef.current) return;
    try {
      // A short, synthesized "blip" — a square wave that quickly drops
      // in pitch and volume — rather than an audio file, so there's
      // nothing to load and no asset to manage.
      const ctx = audioCtxRef.current ?? new AudioContext();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
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
