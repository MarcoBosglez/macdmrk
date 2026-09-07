"use client";

import { useState } from "react";
import Image from "next/image";
import { BotOff, Music } from "lucide-react";
import { useSound } from "@/components/providers/sound-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { localize, type Locale } from "@/lib/i18n/dictionaries";
import { EXPERIENCE, type ExperienceEntry } from "@/lib/data/experience";
import { SONGS } from "@/lib/data/songs";
import { spotifyEmbedSrc } from "@/lib/data/spotify";
import { ViewPane } from "@/components/chrome/view-pane";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/chrome/social-icons";
import { LINKS } from "@/lib/data/links";

const PHOTO_SRC = "/about/profilepic.jpeg";

// Each social link gets its own hover motion (the site's "no two hovers
// alike" rule): Instagram lifts, LinkedIn slides, GitHub tilts.
const SOCIAL_LINKS = [
  {
    label: "Instagram — @marcobglz",
    href: LINKS.instagram,
    Icon: InstagramIcon,
    hover: "hover:-translate-y-0.5 hover:scale-[1.03]",
  },
  {
    label: "LinkedIn — marco-bosquez",
    href: LINKS.linkedin,
    Icon: LinkedinIcon,
    hover: "hover:translate-x-1.5",
  },
  {
    label: "GitHub — MarcoBosglez",
    href: LINKS.github,
    Icon: GithubIcon,
    hover: "hover:-rotate-3",
  },
];

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-t border-line-soft pt-4">
      <span className="mb-1 font-mono text-[10px] tracking-[0.14em] uppercase text-muted">
        {label}
      </span>
      {children}
    </div>
  );
}

function FooterCol({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">{label}</span>
      {children}
    </div>
  );
}

export function AboutContent() {
  const { playClick } = useSound();
  const { locale, t } = useLocale();

  const [before, after] = t.about.lead.split(t.about.leadAccent);

  return (
    <ViewPane note={{ file: "readme.md", line: t.about.note }}>
      <div className="flex w-full max-w-[940px] flex-col gap-5 overflow-y-auto rounded-[22px] border border-line bg-glass p-6 [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)] md:max-h-full">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-accent">
            {t.about.eyebrow}
          </span>
          <span className="font-mono text-[11px] text-muted">{t.hub.location}</span>
        </div>

        <div className="flex flex-wrap items-start gap-5">
          <div className="relative h-[186px] w-[150px] shrink-0 overflow-hidden rounded-[16px] border border-line transition-transform duration-200 hover:[transform:rotate(-2deg)_scale(1.02)]">
            <Image
              src={PHOTO_SRC}
              alt="Marco Bosquez"
              fill
              sizes="150px"
              className="object-cover"
            />
          </div>
          <p
            className="min-w-[240px] flex-1 text-ink"
            style={{
              fontSize: "clamp(18px, 2.4vw, 30px)",
              fontVariationSettings: "'wght' 600",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {before}
            <span className="text-accent">{t.about.leadAccent}</span>
            {after}
          </p>
        </div>

        <div className="grid gap-5 border-t border-line-soft pt-4 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          <FooterCol label={t.about.nowLabel}>
            <span className="font-mono text-[12px] leading-relaxed text-ink">{t.about.now}</span>
          </FooterCol>
          <FooterCol label={t.about.stackLabel}>
            <span className="font-mono text-[12px] leading-relaxed text-ink">{t.about.stack}</span>
          </FooterCol>
          <FooterCol label={t.about.elsewhereLabel}>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick("nav")}
                className={`flex items-center gap-2 font-mono text-[12px] text-ink transition-transform duration-200 hover:text-accent ${link.hover}`}
              >
                <link.Icon className="h-3.5 w-3.5 shrink-0 text-accent" />
                {link.label}
              </a>
            ))}
          </FooterCol>
        </div>

        <Section label={t.about.experienceLabel}>
          {EXPERIENCE.map((entry) => (
            <ExperienceRow key={entry.company} entry={entry} locale={locale} />
          ))}
        </Section>

        <Section label={t.about.listeningLabel}>
          <ListeningBlock />
        </Section>

        <Section label={t.about.interestsLabel}>
          <span className="font-mono text-[12px] leading-relaxed text-dim">{t.about.interests}</span>
          <span className="font-mono text-[12px] text-accent">{t.about.quirk}</span>
        </Section>

        <div className="flex items-start gap-2.5 rounded-[14px] border border-dashed border-line px-3 py-2.5">
          <BotOff className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
          <p className="font-mono text-[11px] leading-relaxed text-muted">{t.about.disclaimer}</p>
        </div>
      </div>
    </ViewPane>
  );
}

// The "on repeat" block: an embedded Spotify playlist once one is
// configured (src/lib/data/spotify.ts), otherwise the hand-written
// SONGS list.
function ListeningBlock() {
  const { playClick } = useSound();
  const src = spotifyEmbedSrc();

  if (src) {
    return (
      <div className="max-w-[420px] overflow-hidden rounded-[14px] border border-line">
        <iframe
          title="Spotify — favourites"
          src={src}
          width="100%"
          height={352}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="block border-0"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {SONGS.map((song, i) => {
        const text = `${song.artist} — ${song.title}`;
        const row = (
          <span className="flex items-center gap-2 font-mono text-[12px] leading-relaxed">
            <Music className="h-3 w-3 shrink-0 text-accent" aria-hidden="true" />
            <span className="text-ink">{text}</span>
          </span>
        );
        return song.url ? (
          <a
            key={i}
            href={song.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playClick("nav")}
            className="inline-flex w-fit transition-transform duration-200 hover:translate-x-1 hover:text-accent [&_span]:hover:text-accent"
          >
            {row}
          </a>
        ) : (
          <div key={i} className="text-dim [&_span]:text-dim">
            {row}
          </div>
        );
      })}
    </div>
  );
}

// One experience line. Rows with a `detail` expand on click via a
// [+]/[−] toggle; rows without render as a plain line.
function ExperienceRow({ entry, locale }: { entry: ExperienceEntry; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const detail = entry.detail ? localize(entry.detail, locale) : null;

  return (
    <div className="py-1 font-mono text-[12px]">
      <div
        className={`flex flex-wrap items-baseline gap-x-3 gap-y-0.5 ${
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
        <span className="w-[92px] shrink-0 text-muted">{localize(entry.period, locale)}</span>
        <span className="w-[170px] shrink-0 text-ink" style={{ fontVariationSettings: "'wght' 700" }}>
          {localize(entry.role, locale)}
        </span>
        <span className="text-accent">{entry.company}</span>
        {detail && <span className="text-muted">{open ? "[−]" : "[+]"}</span>}
      </div>
      {detail && open && (
        <p className="mt-1 mb-1 max-w-[560px] border-l border-line pl-3 text-[11px] leading-relaxed text-dim md:ml-[104px]">
          {detail}
        </p>
      )}
    </div>
  );
}
