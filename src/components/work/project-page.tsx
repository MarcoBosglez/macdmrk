"use client";

// This page stays a client component — not a true Server Component —
// because `locale`/`t` come from a client-side React Context
// (LocaleProvider) with no server-readable equivalent (no locale
// cookie/segment), and `playClick` needs the SoundProvider context.
// Every other top-level view in this app (Hero, WorkView, AboutContent,
// ContactView) is "use client" for the same reason.
//
// Layout: hero → facts row → TL;DR → the project's own `sections`
// (rendered by project-sections.tsx) → next-project footer. The nav
// (switcher, current section, prev/next, progress) isn't on this page:
// it's portalled into the site chrome bar so there's one bar on top.

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";
import { isGithubUrl } from "@/components/work/work-view";
import { GhIcon } from "@/components/chrome/link-icons";
import { ProjectNavBar } from "@/components/work/progress-nav";
import { ProjectSections, pick, resolveSections } from "@/components/work/project-sections";
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

export function ProjectPage({ project, projects }: { project: Project; projects: Project[] }) {
  const { locale, t } = useLocale();
  const { playClick } = useSound();
  const onNav = () => playClick("nav");

  const index = projects.findIndex((p) => p.slug === project.slug);
  const total = projects.length;
  const nextProject = projects[(index + 1) % total];

  const sections = useMemo(() => resolveSections(project.sections), [project.sections]);
  const navSections = useMemo(
    () => sections.map((s) => ({ anchor: s.anchor, num: s.num, label: pick(s.label, locale) })),
    [sections, locale],
  );

  const L = (c: { en: string; es?: string } | undefined) => pick(c, locale);
  const hasFacts = project.role || project.timeline || project.team || project.status || project.tags.length > 0;

  return (
    <article className="flex h-full min-h-0 w-full justify-center overflow-y-auto" style={{ color: INK }}>
      {/* Renders into the site chrome bar, not here — see ProjectNavBar. */}
      <ProjectNavBar projects={projects} index={index} sections={navSections} locale={locale} t={t} onNav={onNav} />

      <div
        data-project-scroll
        className="flex h-full min-h-0 w-full flex-col overflow-y-auto px-4 md:px-10"
        style={{ fontFamily: MONO }}
      >
        <div className="flex w-full max-w-[1100px] flex-1 flex-col gap-7 self-center py-6">
          {/* ---------- hero ---------- */}
          <section aria-label={L(project.title)} className="grid gap-6 md:grid-cols-2 md:items-center">
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
                {L(project.title)}
                <span style={{ color: ACCENT }}>.</span>
              </h1>
              {project.pitch ? (
                <p className="max-w-[520px] text-[18px] leading-relaxed" style={{ fontFamily: INTER, color: DIM }}>
                  {L(project.pitch)}
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
                  alt={L(project.title)}
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
                  {L(project.role)}
                </FactCell>
              ) : null}
              {project.timeline ? (
                <FactCell label={t.work.timelineLabel} color={BLUE}>
                  {L(project.timeline)}
                </FactCell>
              ) : null}
              {project.team ? (
                <FactCell label={t.work.teamLabel} color="#c792ea">
                  {L(project.team)}
                </FactCell>
              ) : null}
              {project.status ? (
                <FactCell label={t.work.statusLabel} color={ACCENT}>
                  <span style={{ color: ACCENT }}>●</span> {L(project.status)}
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
              <h2 id="tldr-heading" className="font-mono text-[11px] tracking-[0.12em] uppercase" style={{ color: MUTED }}>
                {t.work.tldrSectionLabel}
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <TldrCard n="1" color={RED} bg={RED_BG} label={t.work.tldrProblemLabel} text={L(project.tldr.problem)} />
                <TldrCard n="2" color={BLUE} bg={BLUE_BG} label={t.work.tldrBuiltLabel} text={L(project.tldr.built)} />
                <TldrCard n="3" color={ACCENT} bg={ACCENT_BG} label={t.work.tldrResultLabel} text={L(project.tldr.result)} />
              </div>
            </section>
          ) : null}

          {/* ---------- the project's own sections ---------- */}
          {sections.length ? <ProjectSections sections={sections} locale={locale} t={t} /> : null}

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
                {L(nextProject.title)}{" "}
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
