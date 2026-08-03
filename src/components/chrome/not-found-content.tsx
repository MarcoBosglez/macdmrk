"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";

// Split out from not-found.tsx (a server component, so Next can render
// it without shipping a client boundary for routes that never 404)
// purely because this needs useLocale/useSound, which are client-only.
export function NotFoundContent() {
  const { t } = useLocale();
  const { playClick } = useSound();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="font-mono text-sm text-emerald">~/ cat 404.txt</div>
      <div className="font-mono text-[18vw] leading-none font-bold tracking-tight text-emerald md:text-[72px]">
        {t.notFound.title}
      </div>
      <p className="max-w-[360px] text-sm leading-relaxed text-muted">{t.notFound.description}</p>
      <Link
        href="/"
        onClick={() => playClick("nav")}
        className="mt-2 font-mono text-[13px] font-bold text-emerald hover:underline"
      >
        {t.notFound.cta}
      </Link>
    </div>
  );
}
