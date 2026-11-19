"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useSound } from "@/components/providers/sound-provider";

const TRACK_SRC = "/sounds/alex-morgan-jazz-restaurant-music-563578.mp3";
const TARGET_VOLUME = 0.18;
const FADE_MS = 900;

// A quiet ambient loop that plays for as long as the mint theme is
// active (however it was reached — the eyes today, maybe more ways
// later) and fades out the moment it isn't. Respects the site's
// existing mute toggle like every other sound.
export function MintAmbientMusic() {
  const { resolvedTheme } = useTheme();
  const { muted } = useSound();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRaf = useRef<number | null>(null);

  useEffect(() => {
    const audio = new Audio(TRACK_SRC);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    return () => {
      audio.pause();
      if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const shouldPlay = resolvedTheme === "mint" && !muted;

    if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
    if (shouldPlay && audio.paused) {
      void audio.play().catch(() => {});
    }

    const start = performance.now();
    const from = audio.volume;
    const to = shouldPlay ? TARGET_VOLUME : 0;

    function step(now: number) {
      if (!audio) return;
      const k = Math.min(1, (now - start) / FADE_MS);
      audio.volume = from + (to - from) * k;
      if (k < 1) {
        fadeRaf.current = requestAnimationFrame(step);
      } else if (!shouldPlay) {
        audio.pause();
      }
    }
    fadeRaf.current = requestAnimationFrame(step);
  }, [resolvedTheme, muted]);

  return null;
}
