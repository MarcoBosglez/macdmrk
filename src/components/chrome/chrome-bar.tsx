"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Volume2, VolumeX, Sun, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSound } from "@/components/providers/sound-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { useSwitchEye } from "@/components/hub/switch-eye";
import { NAV_ITEMS, isMinimalChromePage } from "@/lib/data/nav";
import s from "./chrome-bar.module.css";

// How long the logo's "open mouth" honk pose (public/logo-open.svg)
// stays up after a click before swapping back to the resting mark.
const HONK_POSE_MS = 480;

const CAPSULE =
  "flex items-center gap-1.5 rounded-[14px] border border-line bg-glass px-2.5 py-1.5 [backdrop-filter:blur(16px)_saturate(1.3)] sm:gap-2.5 sm:px-3.5 sm:py-2";

// The one bar on top of every view: identity capsule (left), the nav
// pill group (centre, desktop only), and a status/controls capsule
// (right — clock, theme, mute, language).
export function ChromeBar() {
  const pathname = usePathname();
  const reduced = isMinimalChromePage(pathname);
  // /lift is tight on mobile vertical space — the logo and status
  // capsule just eat room there and have nowhere useful to go, so the
  // whole bar is dropped below md; desktop keeps it as-is.
  const hiddenOnMobile = pathname === "/lift";
  const { muted, toggleMute, playClick } = useSound();
  const { locale, setLocale, t } = useLocale();
  const { resolvedTheme, setTheme } = useTheme();
  const { reset: resetEyes } = useSwitchEye();

  // Theme / clock both depend on client-only state, so render neutral
  // until mounted to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [clock, setClock] = useState("");
  useEffect(() => {
    setMounted(true);
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      );
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, []);

  // One-shot flash-ring behind the language toggle on each click — keyed
  // so remounting it replays the animation instead of looping.
  const [langPulse, setLangPulse] = useState(0);

  // Logo honk easter egg — swap to the open-mouth pose, hold, swap back.
  const [mouthOpen, setMouthOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  function handleLogoClick() {
    playClick("honk");
    setMouthOpen(true);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMouthOpen(false), HONK_POSE_MS);
  }

  // Light/dark toggle. Dark is the only "dark" state; everything else
  // (including mint, reached via the eyes) reads as "light" here and
  // flips back to electric → dark. Always wins over the eyes — forcing
  // a theme this way un-lights both of them so the two controls don't
  // fight each other.
  const isLight = mounted && resolvedTheme === "electric";
  function handleThemeToggle() {
    const next = isLight ? "dark" : "electric";
    playClick(next === "electric" ? "themeLight" : "themeDark");
    resetEyes();
    setTheme(next);
  }

  return (
    <div
      id="site-chrome-bar"
      className={`relative z-[5] ${hiddenOnMobile ? "hidden md:flex" : "flex"} shrink-0 flex-nowrap items-center justify-between gap-2 px-3 py-2.5 sm:flex-wrap sm:gap-3 sm:px-4 sm:py-3 md:px-[26px] md:py-4`}
    >
      {/* Left — identity. Simple squash on press. */}
      <Link
        href="/"
        onClick={handleLogoClick}
        aria-label="Home"
        className={`${CAPSULE} ${s.logo} active:scale-90`}
        style={{ transition: "transform .2s cubic-bezier(.34,1.56,.64,1)" }}
      >
        <Image
          src={mouthOpen ? "/logo-open.svg" : "/logo.svg"}
          alt=""
          width={26}
          height={26}
          unoptimized
          priority
          className="h-5 w-5 sm:h-[26px] sm:w-[26px]"
        />
        <span className={`${s.logoText} font-mono tracking-[0.02em] whitespace-nowrap text-ink`}>
          ~\marco.
          <span className="animate-blink text-accent">▌</span>
        </span>
      </Link>

      {/* Centre — nav pills (desktop; mobile uses MobileNavBubbles).
          Dropped entirely on a project's own page — reduced chrome. */}
      <nav
        aria-label="Primary"
        className={`${reduced ? "hidden" : "hidden md:flex"} ${s.navCard} items-center border border-line-soft bg-glass-soft [backdrop-filter:blur(16px)]`}
      >
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => playClick("nav")}
              aria-current={active ? "page" : undefined}
              className={`relative flex items-center justify-center rounded-[10px] transition-[color,font-variation-settings] duration-200 ${s.pill}`}
              style={{
                color: active ? "var(--bg)" : "var(--dim)",
                fontVariationSettings: active
                  ? "'wdth' 118, 'wght' 750"
                  : "'wdth' 88, 'wght' 500",
              }}
              onMouseEnter={(e) => {
                if (active) return;
                e.currentTarget.style.color = "var(--accent)";
                e.currentTarget.style.fontVariationSettings = "'wdth' 118, 'wght' 750";
              }}
              onMouseLeave={(e) => {
                if (active) return;
                e.currentTarget.style.color = "var(--dim)";
                e.currentTarget.style.fontVariationSettings = "'wdth' 88, 'wght' 500";
              }}
            >
              {/* The pill itself — travels between items via a shared
                  layoutId instead of just appearing on the new one.
                  No negative z-index: the Link has `relative` but no
                  z-index of its own, so it doesn't form a stacking
                  context — a negative value on this span would escape
                  it entirely and land behind unrelated page content.
                  Plain DOM order + a positive z-index on the label
                  keeps the pill reliably behind the text instead. */}
              {active && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-[10px] bg-accent"
                  transition={{ type: "spring", stiffness: 520, damping: 38 }}
                />
              )}
              <span className="relative z-10">{t.nav[item.key].toLowerCase()}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right — status + controls */}
      <div className={`${CAPSULE} ${s.statusPill}`}>
        <span className="animate-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
        <span className="hidden font-mono whitespace-nowrap text-accent sm:inline">
          {t.chrome.openToWork}
        </span>
        <span className="font-mono whitespace-nowrap text-muted tabular-nums">
          {mounted ? clock : "--:--"}
        </span>

        <button
          onClick={handleThemeToggle}
          aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
          className="flex h-5 items-center justify-center rounded-[20px] border border-line px-1.5 text-muted hover:text-accent active:scale-90 sm:h-6 sm:px-2"
          style={{ transition: "transform .2s cubic-bezier(.34,1.56,.64,1), color .2s ease" }}
        >
          <span className="relative flex h-3.5 w-3.5 items-center justify-center">
            <Moon
              className="absolute h-3.5 w-3.5 transition-opacity duration-200"
              style={{ opacity: isLight ? 0 : 1 }}
            />
            <Sun
              className="absolute h-3.5 w-3.5 transition-opacity duration-200"
              style={{ opacity: isLight ? 1 : 0 }}
            />
          </span>
        </button>

        <button
          onClick={() => {
            playClick(muted ? "unmute" : "mute");
            toggleMute();
          }}
          aria-label={muted ? "Unmute" : "Mute"}
          className="flex h-5 items-center justify-center rounded-[20px] border border-line px-1.5 text-muted hover:text-accent active:scale-90 sm:h-6 sm:px-2"
          style={{ transition: "transform .2s cubic-bezier(.34,1.56,.64,1), color .2s ease" }}
        >
          <span className="relative flex h-3.5 w-3.5 items-center justify-center">
            <Volume2
              className="absolute h-3.5 w-3.5 transition-opacity duration-200"
              style={{ opacity: muted ? 0 : 1 }}
            />
            <VolumeX
              className="absolute h-3.5 w-3.5 transition-opacity duration-200"
              style={{ opacity: muted ? 1 : 0 }}
            />
          </span>
        </button>

        <button
          onClick={() => {
            playClick("toggle");
            setLocale(locale === "en" ? "es" : "en");
            setLangPulse((k) => k + 1);
          }}
          aria-label={`Switch language to ${locale === "en" ? "Español" : "English"}`}
          className={`relative isolate flex items-center justify-center overflow-hidden rounded-[20px] border border-line font-mono text-[11px] font-bold text-ink hover:scale-110 hover:text-accent active:scale-90 ${s.lang}`}
          style={{ transition: "transform .2s cubic-bezier(.34,1.56,.64,1), color .2s ease" }}
        >
          {langPulse > 0 ? (
            <span
              key={langPulse}
              aria-hidden="true"
              className="animate-flash-pulse absolute inset-0 -z-10 rounded-[20px] bg-accent opacity-0"
            />
          ) : null}
          {locale === "en" ? "ES" : "EN"}
        </button>
      </div>
    </div>
  );
}
