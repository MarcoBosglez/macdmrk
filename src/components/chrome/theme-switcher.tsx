"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import s from "./theme-switcher.module.css";

type ThemeKey = "dark" | "mint" | "aurora" | "electric";

// Swatches identify each option regardless of which theme is active
// right now, so these are fixed — not read from the live tokens.
const THEMES: { key: ThemeKey; label: string; dot: string }[] = [
  { key: "dark", label: "dark", dot: "#0a1a12" },
  { key: "mint", label: "mint", dot: "#9afb98" },
  { key: "aurora", label: "aurora", dot: "#7b5cff" },
  { key: "electric", label: "electric", dot: "#2440ff" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Avoid a hydration mismatch: next-themes only knows the persisted
  // theme on the client, same reasoning as ChromeBar's clock/mute.
  useEffect(() => setMounted(true), []);

  const current = (mounted ? theme : "dark") as ThemeKey;

  function focusIndex(i: number) {
    const el = btnRefs.current[(i + THEMES.length) % THEMES.length];
    el?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      focusIndex(i + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      focusIndex(i - 1);
    }
  }

  return (
    <div role="radiogroup" aria-label="Theme" className={s.panel}>
      {THEMES.map((t, i) => {
        const on = current === t.key;
        return (
          <button
            key={t.key}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => setTheme(t.key)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`${s.option} ${on ? s.on : ""}`}
          >
            <span className={s.dot} aria-hidden="true" style={{ background: t.dot }} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
