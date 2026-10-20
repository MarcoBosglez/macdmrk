"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GhIcon } from "@/components/chrome/link-icons";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";
import { localize } from "@/lib/i18n/dictionaries";
import { ViewPane } from "@/components/chrome/view-pane";
import type { Project } from "@/lib/data/projects";

export function isGithubUrl(url: string) {
  try {
    return new URL(url).hostname === "github.com";
  } catch {
    return false;
  }
}

// GitHub link gets the GitHub mark + "view code" (what it actually is);
// anything else (a write-up, a LinkedIn post, a live site) gets a plain
// external-link icon + "view project" — a bare icon with no label was
// the thing recruiters found confusing.
export function ProjectCtaButton({ project, className = "" }: { project: Project; className?: string }) {
  const { t } = useLocale();
  const { playClick } = useSound();
  if (!project.url) return null;
  const github = isGithubUrl(project.url);
  const Icon = github ? GhIcon : ExternalLink;

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.stopPropagation();
        playClick("nav");
      }}
      title={t.work.linkHint}
      className={`hub-motion flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-glass-soft px-3 py-1.5 font-mono text-[11px] font-bold text-ink transition-colors hover:border-line-hot hover:text-accent ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={1.9} />
      {github ? t.work.viewCode : t.work.viewProject}
    </a>
  );
}

// Purely a visual affordance (colour + a small indent) so the list
// reads as clickable — selecting a project is still a deliberate
// click, this never swaps the detail panel on its own.
function TitleRow({
  project,
  on,
  onSelect,
}: {
  project: Project;
  on: boolean;
  onSelect: () => void;
}) {
  const { locale } = useLocale();
  const { playClick } = useSound();
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        if (on) return;
        playClick("nav");
        onSelect();
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex w-full flex-col gap-1 border-t border-line-soft py-2.5 text-left"
      style={{
        borderTopColor: on ? "var(--line-hot)" : hover ? "var(--line-soft)" : "var(--line-soft)",
        background: !on && hover ? "var(--wash)" : undefined,
        paddingLeft: on || hover ? 10 : 0,
        transition: "border-color .2s ease, padding-left .18s ease, background .18s ease",
      }}
    >
      <span
        style={{
          fontSize: "clamp(18px, 2.4vw, 32px)",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: on ? "var(--accent)" : hover ? "var(--accent)" : "var(--ink)",
          fontVariationSettings:
            on || hover ? "'wdth' 84, 'wght' 820" : "'wdth' 84, 'wght' 450",
          transition: "font-variation-settings .18s ease, color .18s ease",
        }}
      >
        {localize(project.title, locale)}
      </span>
      <span className="flex flex-wrap items-baseline gap-2.5" style={{ opacity: on || hover ? 1 : 0.55 }}>
        <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-accent">
          {localize(project.category, locale).toLowerCase()}
        </span>
        <span className="font-mono text-[10px] text-muted">{project.years}</span>
      </span>
    </button>
  );
}

// Compact preview: role/title/CTA, image, and a one-paragraph "why" —
// everything pinned to its own fixed-height slot so switching between
// a short and a long project title/description never shifts the rest
// of the panel around. The full write-up lives on the project's own
// page, one click away via "learn more".
function Detail({ project }: { project: Project }) {
  const { locale, t } = useLocale();
  const [learnMoreOn, setLearnMoreOn] = useState(false);

  return (
    <div className="flex flex-col gap-3 rounded-[24px] border border-line bg-panel px-5 py-5 [backdrop-filter:blur(22px)] [box-shadow:var(--shadow)] md:h-[420px]">
      <div className="flex h-4 flex-wrap items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-accent">
          {localize(project.role, locale)}
        </span>
        <span className="font-mono text-[10px] text-muted">{project.years}</span>
      </div>

      <div className="flex min-h-[52px] flex-col gap-2">
        <h2
          className="text-ink"
          style={{
            fontSize: "clamp(17px, 2.2vw, 22px)",
            fontVariationSettings: "'wght' 700",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {localize(project.title, locale)}
        </h2>
        <ProjectCtaButton project={project} className="self-start" />
      </div>

      <div className="relative h-[150px] w-full shrink-0 overflow-hidden rounded-[14px] border border-line bg-bg">
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover"
          />
        ) : null}
      </div>

      <p className="min-h-0 flex-1 overflow-y-auto text-[13px] leading-relaxed text-dim">
        {localize(project.problem, locale)}
      </p>

      <Link
        href={`/work/${project.slug}`}
        onMouseEnter={() => setLearnMoreOn(true)}
        onMouseLeave={() => setLearnMoreOn(false)}
        className="hub-motion mt-auto flex shrink-0 items-center justify-center gap-1.5 self-stretch rounded-[14px] bg-accent px-4 py-2.5 font-mono text-[12px] font-bold text-bg"
        style={{
          transform: learnMoreOn ? "translateY(-2px)" : undefined,
          boxShadow: learnMoreOn ? "0 10px 24px -8px var(--accent)" : undefined,
          transition: "transform .2s cubic-bezier(.2,.8,.3,1), box-shadow .2s ease",
        }}
      >
        {t.work.learnMore} →
      </Link>
    </div>
  );
}

// Title list + detail panel. Clicking a title selects it instantly —
// pure local state, no route change, no re-mount. "Learn more" is a
// real navigation to that project's own page (see project-page.tsx).
export function WorkView({
  projects,
  activeSlug,
}: {
  projects: Project[];
  activeSlug: string;
}) {
  const { t } = useLocale();
  const [selectedSlug, setSelectedSlug] = useState(activeSlug);

  const shown = projects.find((p) => p.slug === selectedSlug) ?? projects[0];

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
          <div className="flex flex-col justify-end rounded-[24px] border border-line bg-glass px-5 pt-3 pb-5 [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)] md:h-[420px] md:overflow-y-auto">
            {projects.map((project) => (
              <TitleRow
                key={project.slug}
                project={project}
                on={project.slug === selectedSlug}
                onSelect={() => setSelectedSlug(project.slug)}
              />
            ))}
          </div>

          <Detail project={shown} />
        </div>
      </div>
    </ViewPane>
  );
}
