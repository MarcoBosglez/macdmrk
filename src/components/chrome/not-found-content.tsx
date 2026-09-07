"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";

export function NotFoundContent() {
  const { t } = useLocale();
  const { playClick } = useSound();

  return (
    <div className="animate-fade flex h-full items-center justify-center py-1.5">
      <div className="flex max-w-[440px] flex-col items-center gap-3 rounded-[22px] border border-line bg-glass p-8 text-center [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)]">
        <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-accent">
          ~/ cat 404.txt
        </div>
        <div
          className="text-accent"
          style={{ fontSize: "clamp(48px, 12vw, 72px)", fontVariationSettings: "'wght' 800", lineHeight: 1 }}
        >
          {t.notFound.title}
        </div>
        <p className="text-[13px] leading-relaxed text-dim">{t.notFound.description}</p>
        <Link
          href="/"
          onClick={() => playClick("nav")}
          className="mt-1 font-mono text-[13px] font-bold text-accent hover:underline"
        >
          {t.notFound.cta}
        </Link>
      </div>
    </div>
  );
}
