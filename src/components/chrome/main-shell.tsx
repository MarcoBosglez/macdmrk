"use client";

import { usePathname } from "next/navigation";
import { isMinimalChromePage } from "@/lib/data/nav";

// <main>'s bottom padding exists to clear MobileNavBubbles on mobile.
// MobileNavBubbles is hidden on reduced-chrome routes (the private
// tools, a project's own page), so that padding becomes dead space at
// the bottom of the page there instead — most visible on /lift, where
// it ate into the scrollable content and pushed the fixed save bar
// away from the content above it.
export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = isMinimalChromePage(pathname);
  // Reduced-chrome routes (/lift, /meal, a project's own /work/<slug>
  // page) all set their own side padding already — main's own px-4/
  // md:px-[26px] was stacking on top of that at every breakpoint,
  // quietly eating back the width those pages were trying to use.
  // Confirmed on /work/<slug>: ~58px of dead margin per side at
  // desktop from the two paddings compounding.

  return (
    <main
      className={`relative z-[2] min-h-0 flex-1 overflow-x-hidden overflow-y-auto md:overflow-hidden md:pt-1.5 ${
        reduced ? "px-0 md:px-0 pb-0 md:pb-0" : "px-4 md:px-[26px] pb-24 md:pb-[22px]"
      }`}
    >
      {children}
    </main>
  );
}
