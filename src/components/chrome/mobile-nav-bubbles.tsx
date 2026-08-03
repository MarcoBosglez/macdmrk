"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/sound-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { NAV_ITEMS } from "@/lib/data/nav";

// On small screens the desktop pill nav (see TopBar) gets too cramped
// to use comfortably, so mobile gets its own nav entirely: a single
// round button fixed at the bottom-left corner that pops open a stack
// of "bubble" links directly above it. Hidden above the md breakpoint,
// where TopBar's own nav takes over instead.
//
// This uses AnimatePresence for the open/close animation, which is
// safe here (unlike the page-transition bug fixed earlier) because
// "open" is plain local component state, not something layered on
// top of Next.js's own page routing.
export function MobileNavBubbles() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { playClick } = useSound();
  const { t } = useLocale();

  function closeAfterNavigating() {
    playClick("nav");
    setOpen(false);
  }

  // Reversed so the first nav item ends up nearest the button (bottom
  // of the popup stack) and the last one ends up furthest away (top).
  const itemsNearestFirst = [...NAV_ITEMS].reverse();

  return (
    // This wrapper is only ever as big as the button itself — the
    // popup list below is positioned absolutely, so it doesn't add to
    // the wrapper's size. That's what keeps the button fixed in place
    // instead of drifting as the list opens and closes.
    <div className="fixed bottom-6 left-6 z-30 md:hidden">
      <div className="pointer-events-none absolute bottom-full left-0 mb-2.5 flex flex-col items-start gap-2.5">
        <AnimatePresence>
          {open &&
            itemsNearestFirst.map((item, index) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, scale: 0.6, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6, y: 16 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                  className="pointer-events-auto"
                >
                  <Link
                    href={item.href}
                    onClick={closeAfterNavigating}
                    className={cn(
                      "block rounded-full border px-4 py-2 font-mono text-xs font-bold whitespace-nowrap shadow-lg",
                      active
                        ? "border-emerald bg-emerald text-bg"
                        : "border-border bg-panel text-ink"
                    )}
                  >
                    {t.nav[item.key]}
                  </Link>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      <button
        onClick={() => {
          playClick("toggle");
          setOpen((wasOpen) => !wasOpen);
        }}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-panel text-lg text-ink shadow-lg"
      >
        {open ? "✕" : "☰"}
      </button>
    </div>
  );
}
