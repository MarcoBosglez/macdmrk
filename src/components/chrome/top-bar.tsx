"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/providers/sound-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { NAV_ITEMS } from "@/lib/data/nav";

// One pill in the desktop nav row. Highlights itself when the current
// route matches (or is nested under) its own href.
function NavPill({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const { playClick } = useSound();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={() => playClick("nav")}
      className={cn(
        "rounded-full px-4.5 py-2 font-mono text-[13px] font-bold tracking-wide transition-colors",
        active ? "bg-ink text-bg" : "text-ink hover:text-emerald"
      )}
    >
      {label}
    </Link>
  );
}

// Shared look for the two bracket-style buttons on the right (mute,
// theme). Fixed width + whitespace-nowrap keeps them from reflowing
// onto two lines when the label text changes length (e.g. "[ dark ]"
// vs "[ light ]").
function ToggleButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="w-28 shrink-0 rounded-md border border-border bg-transparent px-3.5 py-1.5 text-center font-mono text-xs whitespace-nowrap text-ink transition-colors hover:text-emerald hover:underline underline-offset-4"
    >
      {children}
    </button>
  );
}

// Desktop-only top bar: logo, the pill nav row, and the mute/theme
// toggles. On mobile this collapses down to just the logo + toggles —
// navigation moves to the floating bubble menu (mobile-nav-bubbles.tsx)
// instead, since a horizontally-scrolling pill row was cramped on
// small screens.
export function TopBar() {
  const { muted, toggleMute, playClick } = useSound();
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLocale();

  // Theme isn't known until after hydration (it depends on localStorage
  // / system preference), so we show a neutral placeholder for one
  // render to avoid briefly flashing the wrong label.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative z-10 shrink-0">
      <div className="grid grid-cols-2 items-center gap-4 px-4 py-5 md:grid-cols-[1fr_auto_1fr] md:px-10">
        <Link
          href="/"
          onClick={() => playClick("nav")}
          className="justify-self-start font-mono text-xl font-bold text-emerald"
        >
          [m]
        </Link>

        <div className="hidden justify-self-center gap-2.5 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavPill key={item.href} href={item.href} label={t.nav[item.key]} />
          ))}
        </div>

        <div className="flex justify-self-end gap-2 md:gap-3">
          <ToggleButton
            onClick={() => {
              playClick("toggle");
              toggleMute();
            }}
          >
            {muted ? t.toggles.unmute : t.toggles.mute}
          </ToggleButton>
          <ToggleButton
            onClick={() => {
              playClick("toggle");
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
            }}
          >
            {mounted
              ? resolvedTheme === "dark"
                ? t.toggles.light
                : t.toggles.dark
              : t.toggles.loading}
          </ToggleButton>
        </div>
      </div>
    </div>
  );
}
