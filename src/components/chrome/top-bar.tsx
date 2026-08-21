"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSound } from "@/components/providers/sound-provider";
import { useLocale } from "@/components/providers/locale-provider";

// How long the "open mouth" pose (public/logo-open.svg — hand-drawn by
// the site's artist to match logo.svg's style, honk sound + a small
// burst graphic baked right into the art) stays up before swapping
// back to the resting closed-mouth logo.svg.
const HONK_POSE_MS = 480;

// Shared look for the two icon buttons on the right (mute, theme).
function ToggleButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-transparent text-ink transition-colors hover:border-emerald hover:text-emerald"
    >
      {children}
    </button>
  );
}

// Desktop and mobile alike: just the logo + mute/theme toggles now —
// the site nav itself lives in NavDock (desktop, floating left-center)
// and MobileNavBubbles (mobile, floating bottom-left) instead of here.
export function TopBar() {
  const { muted, toggleMute, playClick } = useSound();
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useLocale();

  // Theme isn't known until after hydration (it depends on localStorage
  // / system preference), so we show a blank placeholder for one render
  // to avoid briefly flashing the wrong icon.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Logo click reaction: swap to the open-mouth pose, hold briefly,
  // swap back — just the image, no motion effects.
  const [mouthOpen, setMouthOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function handleLogoClick() {
    playClick("honk");
    setMouthOpen(true);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMouthOpen(false), HONK_POSE_MS);
  }

  return (
    <div className="relative z-10 shrink-0">
      <div className="flex items-center justify-between px-4 py-5 md:px-10">
        {/* translate-y-1: the traced mark has slightly more empty
            margin below it than above within its own viewBox, so
            centering the image box alone (via the row's items-center)
            still reads a hair high next to the toggle icons — nudged
            down to compensate. unoptimized: local SVGs 400 through
            Next's image optimizer unless images.dangerouslyAllowSVG is
            set in next.config.mjs (it isn't) — skip that pipeline
            entirely rather than reconfigure it for one static icon. */}
        <Link href="/" onClick={handleLogoClick} className="translate-y-1">
          <Image
            src={mouthOpen ? "/logo-open.svg" : "/logo.svg"}
            alt="macdmrk"
            width={52}
            height={52}
            unoptimized
            priority
          />
        </Link>

        <div className="flex gap-2 md:gap-3">
          <ToggleButton
            label={muted ? t.toggles.unmute : t.toggles.mute}
            onClick={() => {
              // `muted` here is the pre-click state, so this picks the
              // variant matching the action the click is about to take
              // — mute if we're currently audible, unmute if we're not.
              playClick(muted ? "unmute" : "mute");
              toggleMute();
            }}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </ToggleButton>
          <ToggleButton
            label={mounted ? (resolvedTheme === "dark" ? t.toggles.light : t.toggles.dark) : t.toggles.loading}
            onClick={() => {
              const next = resolvedTheme === "dark" ? "light" : "dark";
              playClick(next === "light" ? "themeLight" : "themeDark");
              setTheme(next);
            }}
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <span className="block h-4 w-4" />
            )}
          </ToggleButton>
        </div>
      </div>
    </div>
  );
}
