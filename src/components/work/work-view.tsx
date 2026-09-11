"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";
import { localize } from "@/lib/i18n/dictionaries";
import { ViewPane } from "@/components/chrome/view-pane";
import type { Project } from "@/lib/data/projects";

function TitleRow({
  project,
  on,
  onHover,
  onLeave,
}: {
  project: Project;
  on: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const { locale } = useLocale();
  const { playClick } = useSound();

  return (
    <Link
      href={`/work/${project.slug}`}
      scroll={false}
      onClick={() => playClick("pageOpen")}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="flex flex-col gap-1 border-t border-line-soft py-2.5"
      style={{
        borderTopColor: on ? "var(--line-hot)" : "var(--line-soft)",
        paddingLeft: on ? 10 : 0,
        transition: "border-color .2s ease, padding-left .22s ease",
      }}
    >
      <span
        style={{
          fontSize: "clamp(18px, 2.4vw, 32px)",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: on ? "var(--accent)" : "var(--ink)",
          // Same width axis on hover — only weight/color shift, so the
          // title's rendered width (and the block around it) stays put.
          fontVariationSettings: on
            ? "'wdth' 84, 'wght' 820"
            : "'wdth' 84, 'wght' 450",
          transition: "font-variation-settings .26s ease, color .2s ease",
        }}
      >
        {localize(project.title, locale)}
      </span>
      <span
        className="flex flex-wrap items-baseline gap-2.5"
        style={{ opacity: on ? 1 : 0.55, transition: "opacity .2s ease" }}
      >
        <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-accent">
          {localize(project.category, locale).toLowerCase()}
        </span>
        <span className="font-mono text-[10px] text-muted">{project.years}</span>
      </span>
    </Link>
  );
}

function Detail({ project }: { project: Project }) {
  const { locale, t } = useLocale();
  const { playClick } = useSound();

  return (
    <div className="flex h-[420px] flex-col gap-3 overflow-y-auto rounded-[24px] border border-line bg-panel px-5 py-5 [backdrop-filter:blur(22px)] [box-shadow:var(--shadow)]">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent">
          {localize(project.role, locale)}
        </span>
        <span className="font-mono text-[10px] text-muted">{project.years}</span>
      </div>

      <div className="flex items-center gap-2.5">
        <h2
          className="text-ink"
          style={{
            fontSize: "clamp(17px, 2.2vw, 25px)",
            fontVariationSettings: "'wght' 700",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          {localize(project.title, locale)}
        </h2>
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playClick("nav")}
            aria-label={t.work.linkHint}
            title={t.work.linkHint}
            className="shrink-0 rounded-full border border-line p-1.5 text-muted transition-colors hover:border-line-hot hover:text-accent"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
      </div>

      <p className="text-[13px] leading-relaxed text-dim">{localize(project.problem, locale)}</p>

      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted">
          {t.work.whatIDid}
        </span>
        {project.did[locale].map((line) => (
          <span key={line} className="font-mono text-[12px] leading-relaxed text-ink">
            → {line}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-dim transition-colors hover:bg-wash"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-baseline gap-2 border-t border-line-soft pt-3">
        <span className="shrink-0 font-mono text-[10px] tracking-[0.14em] uppercase text-muted">
          {t.work.outcomeLabel}
        </span>
        <span className="font-mono text-[12px] leading-snug text-accent">
          {localize(project.outcome, locale)}
        </span>
      </div>
    </div>
  );
}

// Title list + detail panel. Hovering a title previews it; clicking
// routes to /work/<slug>, which becomes the `activeSlug` shown when
// nothing is hovered.
export function WorkView({
  projects,
  activeSlug,
}: {
  projects: Project[];
  activeSlug: string;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);

  const shownSlug = hoverSlug ?? activeSlug;
  const shown = projects.find((p) => p.slug === shownSlug) ?? projects[0];

  return (
    <ViewPane note={{ file: "shipped.log", line: t.work.note }}>
      <div className="flex w-full max-w-[1040px] flex-col gap-2.5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-accent">
            {t.work.eyebrow}
          </span>
          <span className="h-px flex-1 bg-line-soft" />
          <span className="font-mono text-[11px] text-muted">{t.work.range}</span>
        </div>

        <div className="grid gap-3.5 md:[grid-template-columns:minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="flex h-[420px] flex-col justify-end overflow-y-auto rounded-[24px] border border-line bg-glass px-5 pt-3 pb-5 [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)]">
            {projects.map((project) => (
              <TitleRow
                key={project.slug}
                project={project}
                on={project.slug === shownSlug}
                onHover={() => {
                  setHoverSlug(project.slug);
                  router.prefetch(`/work/${project.slug}`);
                }}
                onLeave={() => setHoverSlug(null)}
              />
            ))}
          </div>

          <Detail project={shown} />
        </div>
      </div>
    </ViewPane>
  );
}
