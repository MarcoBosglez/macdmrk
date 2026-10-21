"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";
import { localize } from "@/lib/i18n/dictionaries";
import { ProjectCtaButton } from "@/components/work/work-view";
import type { Project } from "@/lib/data/projects";

// A log line: "[tag]  value", tag fixed-width so the stack reads like
// an actual log readout rather than prose with labels stuck on.
function LogLine({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 font-mono text-[14px] leading-relaxed">
      <span className="w-[80px] shrink-0 text-muted">[{tag}]</span>
      <div className="min-w-0 flex-1 text-ink">{children}</div>
    </div>
  );
}

// One project's dedicated page: same visual language as the rest of
// the site, but the content reads like a build log rather than a
// portfolio blurb — every line tagged, the how laid out as sequential
// entries. A left-hand project switcher (plain navigation between
// pages — unlike the work browser's click-to-preview, each entry here
// really is its own page) stays put while only the log body scrolls.
export function ProjectPage({ project, projects }: { project: Project; projects: Project[] }) {
  const { locale, t } = useLocale();
  const { playClick } = useSound();

  return (
    <div className="flex h-full min-h-0 flex-col items-center overflow-y-auto p-4 md:overflow-hidden md:p-8">
    <div className="flex w-full max-w-[1800px] flex-col gap-3 md:flex-row md:gap-4">
      {/* Left — back link + project switcher */}
      <div className="flex shrink-0 flex-col gap-3 md:w-[200px]">
        <Link
          href="/work"
          onClick={() => playClick("nav")}
          className="font-mono text-[12px] font-bold text-muted transition-colors hover:text-accent"
        >
          {t.work.backToWork}
        </Link>
        <div className="flex flex-wrap gap-1.5 md:flex-col md:flex-nowrap md:items-stretch md:gap-1">
          {projects.map((p) => {
            const active = p.slug === project.slug;
            return (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                onClick={() => playClick("nav")}
                aria-current={active ? "page" : undefined}
                className="rounded-full px-3 py-1.5 font-mono text-[11px] font-bold transition-colors md:rounded-[10px] md:px-2.5"
                style={{
                  border: "1px solid var(--line)",
                  borderColor: active ? "var(--accent)" : "var(--line)",
                  color: active ? "var(--bg)" : "var(--dim)",
                  background: active ? "var(--accent)" : "transparent",
                }}
              >
                {localize(p.title, locale)}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right — the log itself. Sized to its content (not stretched
          to fill the column, which left dead space below short
          projects), capped so it never grows past a comfortable
          height — only then does the body scroll. */}
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-line bg-panel [backdrop-filter:blur(22px)_saturate(1.2)] [box-shadow:var(--shadow)] md:max-h-[82vh]">
          <div className="flex shrink-0 items-center gap-1.5 border-b border-line bg-glass-soft px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-line-hot" />
            <span className="h-2 w-2 rounded-full bg-line" />
            <span className="ml-1.5 font-mono text-[11px] text-muted">{project.slug}.log</span>
            <span className="ml-auto font-mono text-[11px] text-muted">{project.years}</span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6 md:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <h1
                  className="text-ink"
                  style={{
                    fontSize: "clamp(24px, 3.8vw, 40px)",
                    fontVariationSettings: "'wght' 750",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {localize(project.title, locale)}
                </h1>
                <ProjectCtaButton project={project} className="self-start" />
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-dim"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {project.image ? (
                <div className="relative h-[140px] w-[200px] shrink-0 overflow-hidden rounded-[14px] border border-line bg-bg sm:h-[150px] sm:w-[220px]">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-3.5 border-t border-line-soft pt-5">
              <LogLine tag={t.work.roleLabel}>{localize(project.role, locale)}</LogLine>
              <LogLine tag={t.work.whyLabel}>
                <p className="leading-relaxed text-dim">{localize(project.problem, locale)}</p>
              </LogLine>
              <LogLine tag={t.work.whatIDid}>
                <div className="flex flex-col gap-1.5">
                  {project.did[locale].map((line) => (
                    <span key={line} className="leading-relaxed text-ink">
                      → {line}
                    </span>
                  ))}
                </div>
              </LogLine>
              <LogLine tag={t.work.outcomeLabel}>
                <span className="text-accent">{localize(project.outcome, locale)}</span>
              </LogLine>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
