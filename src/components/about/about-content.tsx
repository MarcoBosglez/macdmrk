"use client";

import Link from "next/link";
import Image from "next/image";
import { BotOff } from "lucide-react";
import { useSound } from "@/components/providers/sound-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { localize } from "@/lib/i18n/dictionaries";
import { EXPERIENCE } from "@/lib/data/experience";

// Set this once a real headshot exists at public/about/photo.jpg — the
// placeholder box shows until then.
const PHOTO_SRC: string | null = "/about/profilepic.jpeg";

// Platform names are proper nouns, so they're identical in every
// language and don't need to go through the dictionary.
const SOCIAL_LINKS = [
  { label: "Instagram ↗", href: "https://www.instagram.com/marcobglz/" },
  { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/marco-bosquez-5580271a1/" },
  { label: "Github ↗", href: "https://github.com/MarcoBosglez" },
];

export function AboutContent() {
  const { playClick } = useSound();
  const { locale, t } = useLocale();

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-6 md:p-10">
      <div className="mb-1 font-mono text-[13px] text-mint">~/ cat about.txt</div>

      <div className="flex items-center gap-7">
        <div className="relative flex h-[200px] w-[200px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border font-mono text-[11px] text-muted [background:repeating-linear-gradient(135deg,var(--panel)_0px,var(--panel)_12px,var(--bg)_12px,var(--bg)_24px)]">
          {PHOTO_SRC ? (
            <Image src={PHOTO_SRC} alt="" fill sizes="200px" className="object-cover" />
          ) : (
            t.about.photoPlaceholder
          )}
        </div>
        <div className="flex max-w-[480px] flex-col gap-2.5">
          <p className="text-[14px] leading-relaxed whitespace-pre-line">{t.about.bio}</p>
          <div className="font-mono text-[10px] text-muted">{t.about.skills}</div>
        </div>
      </div>

      <div className="border-t border-border pt-2">
        <div className="mb-2 font-mono text-[13px] text-mint">~/ cat experience.txt</div>
        {EXPERIENCE.map((entry) => (
          <div
            key={entry.company}
            className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-1 font-mono text-[13px]"
          >
            <span className="w-[100px] shrink-0 text-muted">{localize(entry.period, locale)}</span>
            <span className="w-[180px] shrink-0 font-bold">{localize(entry.role, locale)}</span>
            <span className="text-emerald">{entry.company}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-2.5">
        <div className="flex gap-3">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick("nav")}
              className="rounded-full border border-border px-3 py-1.5 font-mono text-xs font-bold transition-colors hover:border-emerald hover:text-emerald"
            >
              {link.label}
            </a>
          ))}
        </div>
        <Link
          href="/contact"
          onClick={() => playClick("nav")}
          className="rounded-full bg-emerald px-4.5 py-2 font-mono text-[13px] font-bold text-bg"
        >
          {t.about.contactCta}
        </Link>
      </div>

      {/* A short, honest disclosure: the site's visuals were designed
          by hand, only the code was AI-assisted. */}
      <div className="mt-auto flex items-start gap-2.5 rounded-lg border border-border bg-panel/60 p-3">
        <BotOff className="mt-0.5 h-4 w-4 shrink-0 text-emerald" aria-hidden="true" />
        <p className="font-mono text-[11px] leading-relaxed text-muted">{t.about.disclaimer}</p>
      </div>
    </div>
  );
}
