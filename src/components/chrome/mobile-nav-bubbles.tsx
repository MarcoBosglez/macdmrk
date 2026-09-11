"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/sound-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { NAV_ITEMS } from "@/lib/data/nav";

// The mobile nav: a single round button fixed at the bottom-left that
// pops open a stack of "bubble" links above it. Hidden at md and up,
// where the ChromeBar pill nav takes over.
export function MobileNavBubbles() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { playClick } = useSound();
  const { t } = useLocale();

  function closeAfterNavigating() {
    playClick("nav");
    setOpen(false);
  }

  // Reversed so the first nav item sits nearest the button.
  const itemsNearestFirst = [...NAV_ITEMS].reverse();

  return (
    // Wrapper stays button-sized (the popup list is absolute) so the
    // button doesn't shift as the list opens/closes.
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
                        ? "border-accent bg-accent text-bg"
                        : "border-line bg-panel text-ink"
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
        className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-panel text-lg text-ink shadow-lg"
      >
        {open ? "✕" : "☰"}
      </button>
    </div>
  );
}
