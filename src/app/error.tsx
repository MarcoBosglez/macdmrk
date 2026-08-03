"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AppWindow } from "@/components/chrome/app-window";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";

// Next.js renders this in place of a page whenever rendering throws
// beneath it — a bad fetch, a null-ref, anything uncaught. It must be
// a Client Component per Next's error-boundary convention. This only
// catches errors below the root layout; a crash in layout.tsx itself
// would need app/global-error.tsx instead, which is a bigger change
// (it replaces the whole <html>, since the layout it'd normally sit
// inside is what failed) and isn't added here.
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
    <AppWindow title="error.exe">
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="font-mono text-sm text-emerald">~/ cat error.log</div>
        <div className="font-mono text-2xl font-bold tracking-tight text-emerald md:text-[32px]">
          {t.errorPage.title}
        </div>
        <p className="max-w-[360px] text-sm leading-relaxed text-muted">{t.errorPage.description}</p>
        <div className="mt-2 flex gap-5">
          <button
            onClick={() => {
              playClick("nav");
              reset();
            }}
            className="font-mono text-[13px] font-bold text-emerald hover:underline"
          >
            {t.errorPage.retry}
          </button>
          <Link
            href="/"
            onClick={() => playClick("nav")}
            className="font-mono text-[13px] font-bold text-mint hover:underline"
          >
            {t.errorPage.cta}
          </Link>
        </div>
      </div>
    </AppWindow>
  );
}
