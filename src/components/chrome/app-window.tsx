"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useSound } from "@/components/providers/sound-provider";
import { NoiseOverlay } from "@/components/chrome/noise-overlay";

// The bordered "window" chrome every non-hub page renders inside —
// title bar with a close (✕) button that just links back to "/", plus
// a little scale/fade-in animation on mount. Only handles entering,
// not exiting: an earlier version of this animated both ways using
// AnimatePresence around the whole page, which turned out to conflict
// with Next.js's own routing (see git history) and caused pages to
// sometimes render blank. A simple enter-only animation gives nearly
// the same "window opening" feel without that risk.
export function AppWindow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { playClick } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="absolute inset-3 z-10 flex flex-col overflow-hidden rounded-2xl border border-border bg-bg md:inset-5"
    >
      <NoiseOverlay />
      <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-border px-5 py-3.5 md:px-6">
        <span className="font-mono text-xs text-muted">{title}</span>
        <Link
          href="/"
          onClick={playClick}
          className="p-1 font-mono text-base leading-none text-ink transition-transform hover:scale-115 hover:text-emerald"
          aria-label="Close"
        >
          ✕
        </Link>
      </div>
      <div className="relative z-10 flex-1 overflow-y-auto">{children}</div>
    </motion.div>
  );
}
