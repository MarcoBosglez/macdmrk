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

  return (
    <main
      className={`relative z-[2] min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 md:overflow-hidden md:px-[26px] md:pt-1.5 ${
        reduced ? "pb-0 md:pb-0" : "pb-24 md:pb-[22px]"
      }`}
    >
      {children}
    </main>
  );
}
