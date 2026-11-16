"use client";

// This page stays a client component — not a true Server Component —
// because `locale`/`t` come from a client-side React Context
// (LocaleProvider) with no server-readable equivalent (no locale
// cookie/segment), and `playClick` needs the SoundProvider context.
// Every other top-level view in this app (Hero, WorkView, AboutContent,
// ContactView) is "use client" for the same reason. What *is* isolated
// into their own client components, per the brief, are the two genuinely
// interactive pieces: the project switcher popover and the scroll-spy
// progress nav — see project-switcher.tsx / progress-nav.tsx.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";
import { localize } from "@/lib/i18n/dictionaries";
import { isGithubUrl } from "@/components/work/work-view";
import { GhIcon } from "@/components/chrome/link-icons";
import { InlineText, RichText } from "@/components/work/rich-text";
import { ProjectSwitcher } from "@/components/work/project-switcher";
import { ProgressNav } from "@/components/work/progress-nav";
import switcherStyles from "@/components/work/switcher.module.css";
import type { Project } from "@/lib/data/projects";

// Reads the 4-theme tokens (styles/themes.css) like the rest of the
// site now does — this used to be a page-local fixed dark-green
// palette, kept constant regardless of theme; that convention is gone
// now that every theme needs to reach this page too. BLUE/RED stay
// fixed: they're semantic (category identity / problem callouts), not
// part of the per-theme token set.
const BG = "var(--bg)";
const PANEL = "var(--card)";
const BORDER = "var(--line)";
const BORDER_HOT = "var(--acc)";
const INK = "var(--ink)";
const DIM = "var(--ink2)";
const MUTED = "var(--ink2)";
const ACCENT = "var(--acc)";
const ACCENT_BG = "color-mix(in srgb, var(--acc) 12%, transparent)";
const AMBER = "var(--amber)";
const BLUE = "#7fb2ff";
const RED = "#ff8a7a";
const RED_BG = "rgba(255,138,122,0.12)";
const BLUE_BG = "rgba(127,178,255,0.12)";
const INTER = "var(--font-inter-tight, 'Inter Tight', sans-serif)";
const MONO = "var(--font-jetbrains-mono, ui-monospace, monospace)";
const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--acc)]";

function HeroButton({
  href,
  primary,
  onClick,
  children,
}: {
  href: string;
  primary?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] px-5 text-[14px] font-bold transition-[filter] hover:brightness-110 ${FOCUS_RING}`}
      style={{
        fontFamily: INTER,
        background: primary ? ACCENT : "transparent",
        color: primary ? BG : ACCENT,
        border: primary ? "none" : `1px solid ${ACCENT}`,
      }}
    >
      {children}
    </a>
  );
}

function FactCell({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div className="px-3.5 py-3">
      <dt className="font-mono text-[10px] tracking-[0.1em] uppercase" style={{ color, fontFamily: MONO }}>
        {label}
      </dt>
      <dd className="mt-1 text-[14px]" style={{ color: INK, fontFamily: INTER }}>
        {children}
      </dd>
    </div>
  );
}

function TldrCard({
  n,
  color,
  bg,
  label,
  text,
}: {
  n: string;
  color: string;
  bg: string;
  label: string;
  text: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-[14px] border p-3.5" style={{ borderColor: BORDER, background: PANEL }}>
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-[13px] font-bold"
        style={{ color, background: bg, fontFamily: MONO }}
      >
        {n}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: MUTED, fontFamily: MONO }}>
        {label}
      </span>
      <p className="text-[17px] leading-snug" style={{ color: INK, fontFamily: INTER }}>
        {text}
      </p>
    </div>
  );
}

function SectionLabel({ id, num, label }: { id: string; num: string; label: string }) {
  return (
    <span
      id={`${id}-tag`}
      className="font-mono text-[11px] tracking-[0.1em] uppercase"
      style={{ color: MUTED, fontFamily: MONO }}
    >
      {num} · {label}
    </span>
  );
}

function SectionHeadline({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={`${id}-heading`}
      className="text-[21px] font-bold sm:text-[25px]"
      style={{ color: INK, fontFamily: INTER, letterSpacing: "-0.01em", lineHeight: 1.2 }}
    >
      {children}
    </h2>
  );
}

// why / did: two columns (text + optional image) that alternate sides.
// With no image (the common case right now — none of the data has
// section images yet), this is just the text column, full width.
function StoryRow({
  id,
  num,
  label,
  headline,
  image,
  imageAlt,
  imageOnLeft,
  children,
}: {
  id: string;
  num: string;
  label: string;
  headline: string;
  image?: string;
  imageAlt: string;
  imageOnLeft: boolean;
  children: React.ReactNode;
}) {
  const text = (
    <div className="flex min-w-0 flex-1 flex-col gap-2.5">
      <SectionLabel id={id} num={num} label={label} />
      <SectionHeadline id={id}>{headline}</SectionHeadline>
      {children}
    </div>
  );
  const img = (
    <div
      className="relative w-full shrink-0 overflow-hidden rounded-[16px] border md:w-[280px]"
      style={{ aspectRatio: "4 / 3", borderColor: BORDER, background: BG }}
    >
      {image ? (
        <Image src={image} alt={imageAlt} fill sizes="(max-width: 900px) 100vw, 280px" className="object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center p-3 text-center font-mono text-[11px]" style={{ color: MUTED }}>
          [ image ]
        </div>
      )}
    </div>
  );

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-20 flex flex-col gap-5 md:flex-row md:items-start"
    >
      {imageOnLeft ? img : null}
      {text}
      {!imageOnLeft ? img : null}
    </section>
  );
}

export function ProjectPage({ project, projects }: { project: Project; projects: Project[] }) {
  const { locale, t } = useLocale();
  const { playClick } = useSound();
  const onNav = () => playClick("nav");

  // The top bar wraps to two rows on narrow screens, so the progress
  // nav's sticky offset (it sits lower in the DOM, right before the
  // sections) has to track the bar's real height rather than a
  // hardcoded pixel guess.
  const headerRef = useRef<HTMLElement>(null);
  const [headerH, setHeaderH] = useState(0);
  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setHeaderH(el.offsetHeight));
    ro.observe(el);
    setHeaderH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  const index = projects.findIndex((p) => p.slug === project.slug);
  const total = projects.length;
  const prevProject = projects[(index - 1 + total) % total];
  const nextProject = projects[(index + 1) % total];

  const challengeItems = project.challenges?.items ?? [];

  const sectionDefs = [
    project.why ? { id: "why", label: t.work.sectionWhy } : null,
    project.did ? { id: "did", label: t.work.sectionDid } : null,
    project.how ? { id: "how", label: t.work.sectionHow } : null,
    challengeItems.length ? { id: "challenges", label: t.work.sectionChallenges } : null,
    project.outcome ? { id: "outcome", label: t.work.sectionOutcome } : null,
  ].filter((s): s is { id: string; label: string } => s !== null);
  const sectionNum = (id: string) => String(sectionDefs.findIndex((s) => s.id === id) + 1).padStart(2, "0");

  const hasFacts = project.role || project.timeline || project.team || project.status || project.tags.length > 0;

  return (
    <article
      className="flex h-full min-h-0 w-full justify-center overflow-y-auto"
      style={{ color: INK }}
    >
      <div
        data-project-scroll
        className="flex h-full min-h-0 w-full flex-col overflow-y-auto px-4 md:px-10"
        style={{ fontFamily: MONO }}
      >
        {/* ---------- top bar ---------- */}
        <header
          ref={headerRef}
          className="sticky top-3 z-20 mx-auto flex w-full max-w-[1100px] flex-wrap items-center justify-between gap-2.5 rounded-[16px] border px-4 py-3 md:px-6"
          style={{
            borderColor: BORDER,
            background: "color-mix(in srgb, var(--bg) 92%, transparent)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <Link href="/work" onClick={onNav} className={switcherStyles.btn}>
              {t.work.allWorkBack}
            </Link>

            <ProjectSwitcher projects={projects} index={index} locale={locale} t={t} onNav={onNav} />
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/work/${prevProject.slug}`}
              onClick={onNav}
              aria-label={`${t.work.prevProjectLabel}: ${prevProject.slug}`}
              className={switcherStyles.btn}
            >
              ←
            </Link>
            <Link href={`/work/${nextProject.slug}`} onClick={onNav} className={switcherStyles.btn}>
              {t.work.nextProjectLabel}: {nextProject.slug} →
            </Link>
          </div>
        </header>

        <div className="flex w-full max-w-[1100px] flex-1 flex-col gap-7 self-center py-6">
          {/* ---------- hero ---------- */}
          <section aria-label={localize(project.title, locale)} className="grid gap-6 md:grid-cols-2 md:items-center">
            <div className="flex min-w-0 flex-col gap-3.5">
              <span className="font-mono text-[11px] tracking-[0.08em]" style={{ color: AMBER }}>
                {String(index + 1).padStart(2, "0")} · {project.slug} · {project.years}
              </span>
              <h1
                className="font-extrabold"
                style={{
                  fontFamily: INTER,
                  fontSize: "clamp(34px, 7vw, 54px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                  color: INK,
                }}
              >
                {localize(project.title, locale)}
                <span style={{ color: ACCENT }}>.</span>
              </h1>
              {project.pitch ? (
                <p className="max-w-[520px] text-[18px] leading-relaxed" style={{ fontFamily: INTER, color: DIM }}>
                  {localize(project.pitch, locale)}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-3 pt-1">
                {project.demoUrl ? (
                  <HeroButton href={project.demoUrl} primary onClick={onNav}>
                    {t.work.heroLiveLabel} ↗
                  </HeroButton>
                ) : null}
                {project.url ? (
                  <HeroButton href={project.url} onClick={onNav}>
                    {isGithubUrl(project.url) ? <GhIcon className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                    {t.work.viewCode}
                  </HeroButton>
                ) : null}
              </div>
            </div>

            <div
              className="relative w-full overflow-hidden rounded-[20px] border"
              style={{ aspectRatio: "4 / 3", borderColor: BORDER, background: PANEL }}
            >
              {project.heroImage ? (
                <Image
                  src={project.heroImage}
                  alt={localize(project.title, locale)}
                  fill
                  sizes="(max-width: 900px) 100vw, 480px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center font-mono text-[12px]" style={{ color: MUTED }}>
                  [ hero image ]
                </div>
              )}
            </div>
          </section>

          {/* ---------- facts row ---------- */}
          {hasFacts ? (
            <dl className="grid grid-cols-2 divide-y divide-dashed divide-[var(--line)] rounded-[10px] border border-dashed border-[var(--acc)] sm:grid-cols-5 sm:divide-x sm:divide-y-0">
              {project.role ? (
                <FactCell label={t.work.roleLabel} color={AMBER}>
                  {localize(project.role, locale)}
                </FactCell>
              ) : null}
              {project.timeline ? (
                <FactCell label={t.work.timelineLabel} color={BLUE}>
                  {localize(project.timeline, locale)}
                </FactCell>
              ) : null}
              {project.team ? (
                <FactCell label={t.work.teamLabel} color="#c792ea">
                  {localize(project.team, locale)}
                </FactCell>
              ) : null}
              {project.status ? (
                <FactCell label={t.work.statusLabel} color={ACCENT}>
                  <span style={{ color: ACCENT }}>●</span> {localize(project.status, locale)}
                </FactCell>
              ) : null}
              {project.tags.length ? (
                <div className="px-3.5 py-3">
                  <dt className="font-mono text-[10px] tracking-[0.1em] uppercase" style={{ color: MUTED }}>
                    {t.work.stackLabel}
                  </dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-2 py-0.5 font-mono text-[11px]"
                        style={{ background: "color-mix(in srgb, var(--acc) 8%, transparent)", color: AMBER }}
                      >
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          {/* ---------- the story in 30 seconds ---------- */}
          {project.tldr ? (
            <section aria-labelledby="tldr-heading" className="flex flex-col gap-3">
              <h2
                id="tldr-heading"
                className="font-mono text-[11px] tracking-[0.12em] uppercase"
                style={{ color: MUTED }}
              >
                {t.work.tldrSectionLabel}
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <TldrCard n="1" color={RED} bg={RED_BG} label={t.work.tldrProblemLabel} text={localize(project.tldr.problem, locale)} />
                <TldrCard n="2" color={BLUE} bg={BLUE_BG} label={t.work.tldrBuiltLabel} text={localize(project.tldr.built, locale)} />
                <TldrCard n="3" color={ACCENT} bg={ACCENT_BG} label={t.work.tldrResultLabel} text={localize(project.tldr.result, locale)} />
              </div>
            </section>
          ) : null}

          {/* ---------- progress nav + sections ---------- */}
          <ProgressNav sections={sectionDefs} topOffset={headerH + 20} />

          <div className="flex flex-col gap-8">
            {project.why ? (
              <StoryRow
                id="why"
                num={sectionNum("why")}
                label={t.work.sectionWhy}
                headline={localize(project.why.headline, locale)}
                image={project.why.image}
                imageAlt={`${localize(project.title, locale)} — why`}
                imageOnLeft={false}
              >
                <RichText
                  className="text-[15px] leading-relaxed"
                  style={{ fontFamily: INTER, color: DIM }}
                  text={localize(project.why.body, locale)}
                />
                {project.why.before || project.why.goal ? (
                  <div className="overflow-hidden rounded-[10px] border text-[13px]" style={{ borderColor: BORDER }}>
                    {project.why.before ? (
                      <div className="px-3.5 py-2.5" style={{ background: RED_BG, color: RED }}>
                        − {t.work.beforeLabel}: <InlineText text={localize(project.why.before, locale)} />
                      </div>
                    ) : null}
                    {project.why.goal ? (
                      <div className="px-3.5 py-2.5" style={{ background: ACCENT_BG, color: ACCENT }}>
                        + {t.work.goalLabel}: <InlineText text={localize(project.why.goal, locale)} />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </StoryRow>
            ) : null}

            {project.did ? (
              <StoryRow
                id="did"
                num={sectionNum("did")}
                label={t.work.sectionDid}
                headline={localize(project.did.headline, locale)}
                image={project.did.image}
                imageAlt={`${localize(project.title, locale)} — what I did`}
                imageOnLeft={true}
              >
                <ul className="flex flex-col gap-1.5">
                  {project.did.bullets[locale].map((line) => (
                    <li key={line} className="flex gap-2.5 text-[15px]" style={{ fontFamily: INTER, color: INK }}>
                      <span className="shrink-0" style={{ color: ACCENT }} aria-hidden="true">
                        ✓
                      </span>
                      <span>
                        <InlineText text={line} />
                      </span>
                    </li>
                  ))}
                </ul>
              </StoryRow>
            ) : null}

            {project.how ? (
              <section id="how" aria-labelledby="how-heading" className="scroll-mt-20 flex flex-col gap-3">
                <SectionLabel id="how" num={sectionNum("how")} label={t.work.sectionHow} />
                <SectionHeadline id="how">{localize(project.how.headline, locale)}</SectionHeadline>
                <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
                  {project.how.steps[locale].map((step, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1.5 rounded-[12px] border p-3.5"
                      style={{ borderColor: BORDER, background: PANEL }}
                    >
                      <span className="font-mono text-[16px] font-bold" style={{ color: AMBER }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[13px] leading-relaxed" style={{ fontFamily: INTER, color: DIM }}>
                        <InlineText text={step} />
                      </p>
                    </div>
                  ))}
                </div>
                <div
                  className="relative w-full overflow-hidden rounded-[16px] border"
                  style={{ aspectRatio: "16 / 9", borderColor: BORDER, background: BG }}
                >
                  {project.how.image ? (
                    <Image
                      src={project.how.image}
                      alt={`${localize(project.title, locale)} — how`}
                      fill
                      sizes="(max-width: 900px) 100vw, 900px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-3 text-center font-mono text-[11px]" style={{ color: MUTED }}>
                      [ image ]
                    </div>
                  )}
                </div>
              </section>
            ) : null}

            {project.challenges && challengeItems.length ? (
              <section id="challenges" aria-labelledby="challenges-heading" className="scroll-mt-20 flex flex-col gap-3">
                <SectionLabel id="challenges" num={sectionNum("challenges")} label={t.work.sectionChallenges} />
                <SectionHeadline id="challenges">{localize(project.challenges.headline, locale)}</SectionHeadline>
                <div className="flex flex-col gap-2.5">
                  {challengeItems.map((c, i) => (
                    <div key={i} className="flex flex-col items-stretch gap-0 sm:flex-row sm:items-stretch">
                      <div
                        className="flex-1 rounded-[12px] border px-3.5 py-2.5 sm:rounded-r-none"
                        style={{ borderColor: RED, background: RED_BG }}
                      >
                        <div className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: RED }}>
                          {t.work.problemLabel}
                        </div>
                        <div className="mt-1 text-[14px] leading-relaxed" style={{ color: RED, fontFamily: INTER }}>
                          <InlineText text={localize(c.problem, locale)} />
                        </div>
                      </div>
                      <span
                        aria-hidden="true"
                        className="flex items-center justify-center py-1 sm:px-1"
                        style={{ color: MUTED }}
                      >
                        <span className="sm:hidden">↓</span>
                        <span className="hidden sm:inline">→</span>
                      </span>
                      <div
                        className="flex-1 rounded-[12px] border px-3.5 py-2.5 sm:rounded-l-none"
                        style={{ borderColor: ACCENT, background: ACCENT_BG }}
                      >
                        <div className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: ACCENT }}>
                          {t.work.fixLabel}
                        </div>
                        <div className="mt-1 text-[14px] leading-relaxed" style={{ color: ACCENT, fontFamily: INTER }}>
                          <InlineText text={localize(c.fix, locale)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {project.outcome ? (
              <section id="outcome" aria-labelledby="outcome-heading" className="scroll-mt-20 flex flex-col gap-2.5">
                <SectionLabel id="outcome" num={sectionNum("outcome")} label={t.work.sectionOutcome} />
                <div className="flex flex-col gap-3 rounded-[16px] border p-4" style={{ borderColor: BORDER, background: PANEL }}>
                  <h2
                    id="outcome-heading"
                    className="text-[20px] font-bold"
                    style={{ fontFamily: INTER, color: INK, lineHeight: 1.2 }}
                  >
                    {localize(project.outcome.headline, locale)}
                  </h2>
                  <RichText
                    className="text-[14px] leading-relaxed"
                    style={{ fontFamily: INTER, color: DIM }}
                    text={localize(project.outcome.body, locale)}
                  />
                  {project.outcome.stats?.length ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {project.outcome.stats.map((s, i) => (
                        <div key={i} className="rounded-[10px] border px-3 py-2.5" style={{ borderColor: BORDER }}>
                          <div className="text-[22px] font-bold" style={{ color: ACCENT, fontFamily: INTER }}>
                            {s.value}
                          </div>
                          <div className="font-mono text-[11px]" style={{ color: MUTED }}>
                            {localize(s.label, locale)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>

          {/* ---------- footer: next project ---------- */}
          <section aria-label="Next project" className="border-t pt-6" style={{ borderColor: BORDER }}>
            <Link
              href={`/work/${nextProject.slug}`}
              onClick={onNav}
              className={`group flex flex-col gap-1.5 rounded-[16px] border p-5 transition-colors ${FOCUS_RING}`}
              style={{ borderColor: BORDER }}
            >
              <span className="font-mono text-[11px] tracking-[0.1em] uppercase" style={{ color: MUTED }}>
                {t.work.nextProjectCta} · {String(((index + 1) % total) + 1).padStart(2, "0")}
              </span>
              <span className="text-[24px] font-bold" style={{ fontFamily: INTER, color: ACCENT }}>
                {localize(nextProject.title, locale)}{" "}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none"
                >
                  →
                </span>
              </span>
            </Link>
          </section>
        </div>
      </div>
    </article>
  );
}
