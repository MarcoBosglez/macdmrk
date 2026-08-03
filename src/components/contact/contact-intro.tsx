"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";

// Mirrors about-content.tsx's SOCIAL_LINKS — same accounts, same pill
// button styling — plus the art Instagram account, which about.exe
// doesn't show. Platform names/handles are proper nouns, so they don't
// need translation.
const SOCIAL_LINKS = [
  { label: "Instagram (personal) ↗", href: "https://www.instagram.com/marcobglz/" },
  { label: "Instagram (art) ↗", href: "https://www.instagram.com/macdmrk/" },
  { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/marco-bosquez-5580271a1/" },
  { label: "Github ↗", href: "https://github.com/MarcoBosglez" },
];

// Sits next to ContactForm inside contact.exe (see app/contact/page.tsx)
// — the friendly "here's how to reach me" half, versus the form's
// "send me something directly" half.
export function ContactIntro() {
  const { t } = useLocale();
  const { playClick } = useSound();

  return (
    <div className="shrink-0 overflow-y-auto border-border p-6 md:w-[360px] md:border-r md:p-10">
      <div className="mb-2 font-mono text-[13px] text-mint">~/ cat contact.txt</div>
      <h1 className="mb-2 font-mono text-2xl font-bold text-emerald">{t.contact.heading}</h1>
      <p className="mb-4 text-[13px] leading-relaxed text-muted">
        {t.contact.blurb} <span className="text-ink">mark.bosglez@gmail.com</span>
      </p>
      <div className="flex flex-wrap gap-2.5">
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
    </div>
  );
}
