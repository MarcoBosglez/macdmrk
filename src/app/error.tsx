"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";

// Next.js renders this in place of a page whenever rendering throws
// beneath it. Must be a Client Component per Next's error-boundary
// convention. Only catches errors below the root layout.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLocale();
  const { playClick } = useSound();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="animate-fade flex h-full items-center justify-center py-1.5">
      <div className="flex max-w-[440px] flex-col items-center gap-3 rounded-[22px] border border-line bg-glass p-8 text-center [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)]">
        <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-accent">
          ~/ cat error.log
        </div>
        <div
          className="text-accent"
          style={{ fontSize: "clamp(22px, 4vw, 32px)", fontVariationSettings: "'wght' 700", lineHeight: 1.1 }}
        >
          {t.errorPage.title}
        </div>
        <p className="text-[13px] leading-relaxed text-dim">{t.errorPage.description}</p>
        <div className="mt-1 flex gap-5">
          <button
            onClick={() => {
              playClick("nav");
              reset();
            }}
            className="font-mono text-[13px] font-bold text-accent hover:underline"
          >
            {t.errorPage.retry}
          </button>
          <Link
            href="/"
            onClick={() => playClick("nav")}
            className="font-mono text-[13px] font-bold text-ink hover:underline"
          >
            {t.errorPage.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
