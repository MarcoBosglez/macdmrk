"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/chrome/social-icons";

// Mirrors about-content.tsx's SOCIAL_LINKS — same accounts. Shown as
// brand icons rather than text so the row stays compact. The art
// Instagram account lives on the gallery page instead (see art-grid.tsx).
const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/marcobglz/", Icon: InstagramIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/marco-bosquez-5580271a1/", Icon: LinkedinIcon },
  { label: "GitHub", href: "https://github.com/MarcoBosglez", Icon: GithubIcon },
];

// Sits next to ContactForm inside contact.exe (see app/contact/page.tsx)
// — the friendly "here's how to reach me" half, versus the form's
// "send me something directly" half.
export function ContactIntro() {
  const { t } = useLocale();
  const { playClick } = useSound();

  return (
    <div className="shrink-0 border-border p-5 md:w-[340px] md:overflow-y-auto md:border-r md:p-10">
      <div className="mb-2 font-mono text-[13px] text-mint">~/ cat contact.txt</div>
      <h1 className="mb-2 font-mono text-xl font-bold text-emerald md:text-2xl">{t.contact.heading}</h1>
      <p className="mb-4 text-[13px] leading-relaxed text-muted">
        {t.contact.blurb} <span className="break-all text-ink">mark.bosglez@gmail.com</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
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
    </div>
  );
}
