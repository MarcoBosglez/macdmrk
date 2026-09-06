"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BotOff } from "lucide-react";
import { useSound } from "@/components/providers/sound-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { localize, type Locale } from "@/lib/i18n/dictionaries";
import { EXPERIENCE, type ExperienceEntry } from "@/lib/data/experience";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/chrome/social-icons";

// Set this once a real headshot exists at public/about/photo.jpg — the
// placeholder box shows until then.
const PHOTO_SRC: string | null = "/about/profilepic.jpeg";

// Platform names are proper nouns, so they're identical in every
// language and don't need to go through the dictionary. Shown as brand
// icons rather than text so the row stays compact on small screens.
const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/marcobglz/", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/marco-bosquez-5580271a1/", Icon: LinkedinIcon },
  { label: "GitHub", href: "https://github.com/MarcoBosglez", Icon: GithubIcon },
];

export function AboutContent() {
  const { playClick } = useSound();
  const { locale, t } = useLocale();

  return (
    <div className="flex flex-col gap-4 p-5 md:p-10">
      <div className="mb-1 font-mono text-[13px] text-mint">~/ cat about.txt</div>

      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:gap-7 md:text-left">
        <div className="relative flex h-[140px] w-[140px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border font-mono text-[11px] text-muted [background:repeating-linear-gradient(135deg,var(--panel)_0px,var(--panel)_12px,var(--bg)_12px,var(--bg)_24px)] md:h-[200px] md:w-[200px]">
          {PHOTO_SRC ? (
            <Image src={PHOTO_SRC} alt="" fill sizes="(max-width: 768px) 140px, 200px" className="object-cover" />
          ) : (
            t.about.photoPlaceholder
          )}
        </div>
        <div className="flex w-full flex-col gap-2.5 md:max-w-[480px]">
          <p className="text-[14px] leading-relaxed whitespace-pre-line">{t.about.bio}</p>
          <div className="font-mono text-[10px] text-muted">{t.about.skills}</div>
        </div>
      </div>

      <div className="border-t border-border pt-2">
        <div className="mb-2 font-mono text-[13px] text-mint">~/ cat experience.txt</div>
        {EXPERIENCE.map((entry) => (
          <ExperienceRow key={entry.company} entry={entry} locale={locale} />
        ))}
      </div>

      <div className="border-t border-border pt-2">
        <div className="mb-2 font-mono text-[13px] text-mint">~/ cat interests.txt</div>
        <div className="font-mono text-[12px] leading-relaxed text-muted">{t.about.interests}</div>
        <div className="mt-1.5 font-mono text-[12px] text-emerald">{t.about.quirk}</div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 border-t border-border pt-3">
        <div className="flex gap-2">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick("nav")}
              aria-label={link.label}
              title={link.label}
              className="rounded-full border border-border p-2 text-muted transition-colors hover:border-emerald hover:text-emerald"
            >
              <link.Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
        <Link
          href="/contact"
          onClick={() => playClick("nav")}
          className="ml-auto rounded-full bg-emerald px-4 py-2 font-mono text-[13px] font-bold text-bg"
        >
          {t.about.contactCta}
        </Link>
      </div>

      {/* A short, honest disclosure: the site's visuals were designed
          by hand, only the code was AI-assisted. */}
      <div className="flex items-start gap-2.5 rounded-lg border border-border bg-panel/60 p-3">
        <BotOff className="mt-0.5 h-4 w-4 shrink-0 text-emerald" aria-hidden="true" />
        <p className="font-mono text-[11px] leading-relaxed text-muted">{t.about.disclaimer}</p>
      </div>
    </div>
  );
}

// One line of the experience list. Rows that carry a `detail` string
// expand on click to show it — a `[+]` / `[−]` toggle in the same
// directory-listing style as the rest of the terminal chrome. Rows
// without a detail render as a plain, non-interactive line.
function ExperienceRow({
  entry,
  locale,
}: {
  entry: ExperienceEntry;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const detail = entry.detail ? localize(entry.detail, locale) : null;

  return (
    <div className="py-1 font-mono text-[13px]">
      <div
        className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 ${
          detail ? "cursor-pointer select-none" : ""
        }`}
        {...(detail
          ? {
              role: "button",
              tabIndex: 0,
              "aria-expanded": open,
              onClick: () => setOpen((v) => !v),
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen((v) => !v);
                }
              },
            }
          : {})}
      >
        <span className="w-[100px] shrink-0 text-muted">{localize(entry.period, locale)}</span>
        <span className="w-[180px] shrink-0 font-bold">{localize(entry.role, locale)}</span>
        <span className="text-emerald">{entry.company}</span>
        {detail && <span className="text-mint">{open ? "[−]" : "[+]"}</span>}
      </div>
      {detail && open && (
        <p className="mt-1.5 mb-1 max-w-[560px] border-l border-border pl-3 text-[12px] leading-relaxed text-muted md:ml-[116px]">
          {detail}
        </p>
      )}
    </div>
  );
}
