"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { pageTips, type Tip } from "@/data/page-tips";
import styles from "./PageGuide.module.css";

const CLOSED_KEY = "page-guide-closed";
const SHOW_DELAY_MS = 1200;

const TAG_LABEL: Record<Tip["tag"], string> = {
  welcome: "// welcome:",
  "how-to": "// how-to:",
  tip: "// tip:",
};

const TAG_COLOR: Record<Tip["tag"], string> = {
  welcome: "#7dffa8",
  "how-to": "#7fb2ff",
  tip: "#ffb347",
};

function matchTips(pathname: string): Tip[] {
  if (pageTips[pathname]) return pageTips[pathname];
  for (const pattern of Object.keys(pageTips)) {
    if (!pattern.includes("[")) continue;
    const segments = pattern
      .split("/")
      .map((seg) => (seg.startsWith("[") && seg.endsWith("]") ? "[^/]+" : seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    const regex = new RegExp(`^${segments.join("/")}$`);
    if (regex.test(pathname)) return pageTips[pattern];
  }
  return [];
}

function readClosedFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CLOSED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeClosedFlag(value: boolean) {
  try {
    if (value) window.localStorage.setItem(CLOSED_KEY, "1");
    else window.localStorage.removeItem(CLOSED_KEY);
  } catch {
    // Storage unavailable (private mode, etc.) — the guide just won't
    // remember the dismissal across reloads, which is an acceptable
    // fallback rather than something to surface to the visitor.
  }
}

export function PageGuide() {
  const pathname = usePathname();
  const tips = useMemo(() => matchTips(pathname), [pathname]);

  const [closed, setClosed] = useState(readClosedFlag);
  const [readyToShow, setReadyToShow] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [hideForInput, setHideForInput] = useState(false);

  // Only ever waits once, on the very first paint — not re-armed on
  // every client-side navigation.
  useEffect(() => {
    const timer = setTimeout(() => setReadyToShow(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTipIndex(0);
  }, [pathname]);

  // Mobile only: a focused input usually means a keyboard is open, so
  // get out of the way rather than sit on top of it.
  useEffect(() => {
    function isMobileViewport() {
      return window.matchMedia("(max-width: 639px)").matches;
    }
    function onFocusIn(e: FocusEvent) {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const isField = el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
      if (isField && isMobileViewport()) setHideForInput(true);
    }
    function onFocusOut() {
      setHideForInput(false);
    }
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  if (tips.length === 0 || !readyToShow) return null;

  function handleClose() {
    setClosed(true);
    writeClosedFlag(true);
  }

  function handleReopen() {
    setClosed(false);
    writeClosedFlag(false);
    setTipIndex(0);
  }

  function handleNext() {
    setTipIndex((i) => (i + 1) % tips.length);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") handleClose();
  }

  if (closed) {
    return (
      <div className={styles.wrap}>
        <button type="button" aria-label="Show page tips" className={styles.reopenBtn} onClick={handleReopen}>
          ?
        </button>
      </div>
    );
  }

  const safeIndex = tipIndex < tips.length ? tipIndex : 0;
  const current = tips[safeIndex];

  return (
    <div className={styles.wrap}>
      <aside
        key={pathname}
        aria-label="Page tips"
        className={`${styles.bubble} ${styles.enter} ${hideForInput ? styles.hiddenForInput : ""}`}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.topRow}>
          <span className={styles.tag} style={{ color: TAG_COLOR[current.tag] }}>
            {TAG_LABEL[current.tag]}
          </span>
          <div className={styles.topRight}>
            {tips.length > 1 && (
              <span className={styles.counter}>
                {safeIndex + 1}/{tips.length}
              </span>
            )}
            <button type="button" aria-label="Close page tips" className={styles.closeBtn} onClick={handleClose}>
              ×
            </button>
          </div>
        </div>
        <p className={styles.text} aria-live="polite">
          {current.text}
        </p>
        {tips.length > 1 && (
          <button type="button" className={styles.nextBtn} onClick={handleNext}>
            next tip →
          </button>
        )}
      </aside>
    </div>
  );
}
