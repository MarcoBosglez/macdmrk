"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";

// Lives outside the bordered window frame (see layout.tsx) rather than
// in the top bar, since switching language isn't part of the "desktop"
// the window chrome is simulating — it's a real site-wide setting.
export function LocaleToggle() {
  const { locale, setLocale } = useLocale();
  const { playClick } = useSound();
  const nextLocale = locale === "en" ? "es" : "en";

  return (
    <button
      onClick={() => {
        playClick();
        setLocale(nextLocale);
      }}
      aria-label={`Switch language to ${nextLocale === "en" ? "English" : "Español"}`}
      className="rounded-full border border-border bg-bg px-3 py-1.5 font-mono text-xs font-bold text-ink transition-colors hover:text-emerald"
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
