"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/sound-provider";
import { NAV_ITEMS } from "@/lib/data/nav";

// Desktop-only site nav, styled as a directory listing rather than a
// row of pills — echoes project-list.tsx's `{slug}/` entries and the
// `~/work/ ls -la` header style already used elsewhere on the site.
// A real flex column (see layout.tsx, which renders it as a sibling of
// the page content inside a shared flex row) rather than an absolutely
// positioned overlay — an earlier version floated on top of page
// content and covered it. Kept narrow (md:w-32) since this steals real
// width from every page's own content — a fixed width also means
// switching the active route never resizes the column and reflows the
// page next to it. Mobile keeps its own nav entirely (see
// MobileNavBubbles) since this doesn't fit a small screen.
//
// Hidden on "/" specifically — the home page embeds this same nav list
// directly inside Hero's own whoami/name/role text block instead (see
// hero.tsx), rather than showing it twice as a separate column.
export function NavDock() {
  const pathname = usePathname();
  const { playClick } = useSound();

  if (pathname === "/") return null;

  return (
    <nav
      aria-label="Primary"
      className="hidden shrink-0 flex-col items-start justify-center gap-2 px-5 font-mono text-[13px] md:flex md:w-32"
    >
      <div className="mb-1 text-[11px] text-mint">~/ ls nav/</div>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => playClick("nav")}
            className={cn(
              "flex items-center gap-1",
              active ? "font-bold text-emerald" : "text-muted hover:text-emerald"
            )}
          >
            {item.key}/{active && <span className="animate-cursor-blink">▌</span>}
          </Link>
        );
      })}
    </nav>
  );
}
