"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Construction } from "lucide-react";
import { useSound } from "@/components/providers/sound-provider";
import { useLocale } from "@/components/providers/locale-provider";

// The 3D scene touches the browser's WebGL canvas, which doesn't exist
// during server rendering — dynamic(..., { ssr: false }) skips it on
// the server entirely and only mounts it once we're in the browser.
const HeroPenguinStage = dynamic(
  () => import("@/components/hub/hero-penguin-stage").then((m) => m.HeroPenguinStage),
  { ssr: false }
);

// The home page content. "whoami" and "MARCO" are left untranslated on
// purpose — the first reads as a literal terminal command and the
// second is a proper name, so neither should change with language.
export function Hero() {
  const { playClick } = useSound();
  const { t } = useLocale();

  return (
    <div className="relative flex h-full flex-col gap-10 overflow-y-auto p-6 pb-10 md:absolute md:inset-0 md:block md:overflow-visible md:p-14">
      <div className="md:absolute md:top-10 md:left-14">
        <div className="mb-2 font-mono text-sm text-emerald">whoami</div>
        <h1 className="font-mono text-[15vw] leading-none font-bold tracking-tight md:text-[46px]">
          MARCO
        </h1>
      </div>

      {/* Temporary notice while the visual design is still being
          worked on — remove once the hero has real content here. */}
      <div className="relative mx-auto flex flex-col items-center gap-2 text-center md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
        <Construction className="h-8 w-8 text-emerald" aria-hidden="true" />
        <span className="font-mono text-sm font-bold text-emerald">WIP</span>
        <span className="max-w-[200px] font-mono text-xs text-muted">
          working on the design of this page
        </span>
      </div>

      {/* Easter egg — anchored to the corner of the whole hero area,
          not the avatar box, so it reads as its own little mascot. */}
      <div className="animate-penguin-bob absolute right-3 bottom-3 z-10 h-14 w-14 md:right-6 md:bottom-6 md:h-[110px] md:w-[110px]">
        <HeroPenguinStage />
      </div>

      <div className="max-w-[340px] md:absolute md:bottom-10 md:left-14">
        <div className="mb-3.5 flex items-center gap-1.5">
          <span className="font-mono text-base text-muted">{t.hero.role}</span>
          <span className="animate-cursor-blink font-mono text-base text-emerald">▌</span>
        </div>
        <p className="mb-4.5 text-sm leading-relaxed">{t.hero.description}</p>
        <div className="flex gap-5">
          <Link
            href="/work"
            onClick={playClick}
            className="font-mono text-[13px] font-bold text-emerald hover:underline"
          >
            {t.hero.ctaWork}
          </Link>
          <Link
            href="/gallery"
            onClick={playClick}
            className="font-mono text-[13px] font-bold text-mint hover:underline"
          >
            {t.hero.ctaGallery}
          </Link>
        </div>
      </div>
    </div>
  );
}
