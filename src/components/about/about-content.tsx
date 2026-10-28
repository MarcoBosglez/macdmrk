"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BotOff } from "lucide-react";
import { useSound } from "@/components/providers/sound-provider";
import { useLocale } from "@/components/providers/locale-provider";
import { localize, type Locale } from "@/lib/i18n/dictionaries";
import { EXPERIENCE, type ExperienceEntry } from "@/lib/data/experience";
import { ViewPane } from "@/components/chrome/view-pane";

const PHOTO_SRC = "/about/profilepic.jpeg";
const CARD = "flex flex-col gap-4 rounded-[22px] border border-line bg-glass p-6 [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)]";

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

// Two cards, same split as the contact page: the person (photo, a
// plain "hi, my name is", a short line on what he does, off the
// clock, stack) on the left; the resume side (experience, then a
// pointer to the work section) on the right — kept lean so both
// cards land at roughly the same height.
export function AboutContent() {
  const { playClick } = useSound();
  const { locale, t } = useLocale();

  const [before, after] = t.about.lead.split(t.about.leadAccent);

  return (
    <ViewPane>
      <div className="grid w-full max-w-[1000px] items-stretch gap-3.5 md:grid-cols-2">
        {/* Left — the person */}
        <div className={CARD}>
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
            <div className="flex min-w-[200px] flex-1 flex-col gap-2.5">
              <h1
                className="text-ink"
                style={{
                  fontSize: "clamp(20px, 2.6vw, 28px)",
                  fontVariationSettings: "'wght' 700",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                {t.about.greeting}
              </h1>
              <p className="text-[13px] leading-relaxed text-dim">
                {before}
                <span className="text-accent">{t.about.leadAccent}</span>
                {after}
              </p>
              <Link
                href="/contact"
                onClick={() => playClick("nav")}
                className="flex items-center justify-center self-start rounded-[14px] border border-line bg-glass-soft px-4 py-2.5 font-mono text-[13px] text-ink transition-[transform,background,border-color] duration-200 hover:-translate-y-0.5 hover:border-line-hot hover:bg-wash"
              >
                {t.about.elsewhereCta}
              </Link>
            </div>
          </div>

          <Section label={t.about.interestsLabel}>
            <span className="font-mono text-[12px] leading-relaxed text-dim">{t.about.interests}</span>
            <span className="font-mono text-[12px] text-accent">{t.about.quirk}</span>
          </Section>

          <Section label={t.about.stackLabel}>
            <div className="flex flex-wrap gap-2 pt-1">
              {t.about.stackChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-line px-2.5 py-1.5 font-mono text-[11px] text-dim transition-[transform,background] duration-200 hover:-translate-y-0.5 hover:bg-wash"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Section>

          <div className="mt-auto flex items-start gap-2.5 rounded-[14px] border border-dashed border-line px-3 py-2.5">
            <BotOff className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
            <p className="font-mono text-[11px] leading-relaxed text-muted">{t.about.disclaimer}</p>
          </div>
        </div>

        {/* Right — experience, then a pointer to /work */}
        <div className={CARD}>
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-accent">
            {t.about.experienceLabel}
          </span>

          <div className="flex flex-col">
            {EXPERIENCE.map((entry) => (
              <ExperienceRow key={entry.company} entry={entry} locale={locale} />
            ))}
          </div>

          <Link
            href="/work"
            onClick={() => playClick("nav")}
            className="mt-auto flex items-center justify-center self-start rounded-[14px] border border-line bg-glass-soft px-4 py-2.5 font-mono text-[13px] text-ink transition-[transform,background,border-color] duration-200 hover:-translate-y-0.5 hover:border-line-hot hover:bg-wash"
          >
            {t.about.workCta}
          </Link>
        </div>
      </div>
    </ViewPane>
  );
}

// One experience line. Rows with a `detail` expand on click via a
// [+]/[−] toggle; rows without render as a plain line.
function ExperienceRow({ entry, locale }: { entry: ExperienceEntry; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const detail = entry.detail ? localize(entry.detail, locale) : null;

  return (
    <div className="border-b border-line-soft py-2.5 font-mono text-[12px] last:border-b-0">
      <div
        className={`flex items-start justify-between gap-3 ${
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
        <div className="flex flex-col gap-0.5">
          <span className="text-muted">{localize(entry.period, locale)}</span>
          <span className="text-ink" style={{ fontVariationSettings: "'wght' 700" }}>
            {localize(entry.role, locale)}
          </span>
          <span className="text-accent">{entry.company}</span>
        </div>
        {detail && <span className="shrink-0 text-muted">{open ? "[−]" : "[+]"}</span>}
      </div>
      {detail && open && (
        <p className="mt-1.5 max-w-[560px] border-l border-line pl-3 text-[11px] leading-relaxed text-dim">
          {detail}
        </p>
      )}
    </div>
  );
}
