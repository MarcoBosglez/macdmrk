"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GhIcon } from "@/components/chrome/link-icons";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";
import { localize, type Locale, type Dictionary } from "@/lib/i18n/dictionaries";
import { ViewPane } from "@/components/chrome/view-pane";
import type { Project, ProjectCategory, StackKind } from "@/lib/data/projects";

export function isGithubUrl(url: string) {
  try {
    return new URL(url).hostname === "github.com";
  } catch {
    return false;
  }
}

// Same small candy-colour accents used on the project's own page, kept
// consistent across both — personal projects just use the site accent.
const BLUE = "#7fb2ff";
const AMBER = "#ffb347";
const CATEGORY_COLOR: Record<ProjectCategory, string> = {
  personal: "var(--accent)",
  academic: BLUE,
  professional: AMBER,
};
const CATEGORY_LABEL_KEY: Record<ProjectCategory, keyof Dictionary["work"]> = {
  personal: "kindPersonal",
  academic: "kindAcademic",
  professional: "kindProfessional",
};
const STACK_COLOR: Record<StackKind, string> = { lang: BLUE, lib: "#c792ea", tool: "var(--muted)" };

const PER_PAGE = 4;

function CategoryPill({ category, label }: { category: ProjectCategory; label: string }) {
  const color = CATEGORY_COLOR[category];
  return (
    <span
      className="rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-[0.06em] uppercase"
      style={{ borderColor: color, color }}
    >
      {label}
    </span>
  );
}

// Image with a dashed placeholder fallback — same convention as the
// project's own page, so a card can exist before its cover does.
// Aspect-ratio (not a fixed pixel height) so the image stays
// proportioned to the card's width instead of looking squashed/skinny
// on wide desktop columns. `grow` swaps that for flex-1: used on the
// lead card so its image fills whatever height items-stretch gives it
// to match the two side cards, instead of leaving dead space below.
function Cover({
  project,
  ratio,
  grow,
  sizes,
  priority,
}: {
  project: Project;
  ratio?: string;
  grow?: boolean;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-[12px] border bg-bg p-2 text-center font-mono text-[11px] text-muted ${grow ? "min-h-[160px] flex-1" : ""}`}
      style={{
        aspectRatio: grow ? undefined : ratio,
        borderStyle: project.image ? "solid" : "dashed",
        borderColor: "var(--line)",
      }}
    >
      {project.image ? (
        <Image
          src={project.image}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          priority={priority}
        />
      ) : (
        <span>[ img: {project.slug}/cover.png ]</span>
      )}
    </div>
  );
}

function CodeLink({
  project,
  className,
  onClick,
  children,
}: {
  project: Project;
  className: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  if (!project.url) return null;
  return (
    <a href={project.url} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
      {isGithubUrl(project.url) ? <GhIcon className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
      {children}
    </a>
  );
}

function LeadCard({ project, locale, t, onNav }: { project: Project; locale: Locale; t: Dictionary; onNav: () => void }) {
  return (
    <article className="group flex flex-col gap-3 rounded-[20px] border border-line bg-panel p-2.5 transition-colors md:flex-[2_1_520px] hover:border-line-hot">
      <Cover project={project} grow sizes="(max-width: 900px) 100vw, 680px" priority />
      <div className="flex shrink-0 flex-col gap-2 px-2 pb-1">
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] text-muted">
          <CategoryPill category={project.category} label={t.work[CATEGORY_LABEL_KEY[project.category]]} />
          <span className="text-accent">{localize(project.role, locale)}</span>
          <span>{project.years}</span>
        </div>
        <h3
          className="text-accent"
          style={{ fontSize: "clamp(24px, 3.1vw, 33px)", lineHeight: 1.08, fontWeight: 700, letterSpacing: "-0.03em" }}
        >
          {localize(project.title, locale)}
        </h3>
        <p className="text-[14px] leading-relaxed text-dim">{localize(project.pitch, locale)}</p>
        <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
          {project.stack.slice(0, 5).map((it) => (
            <span key={it.name} className="rounded-full bg-wash px-2.5 py-1" style={{ color: STACK_COLOR[it.kind] }}>
              {it.name}
            </span>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap gap-2.5 pt-1">
          <Link
            href={`/work/${project.slug}`}
            onClick={onNav}
            className="flex h-10 flex-1 basis-[160px] items-center justify-center gap-2 rounded-[14px] bg-accent px-4 font-mono text-[13px] font-bold text-bg transition-[filter] hover:brightness-110"
          >
            {t.work.learnMore} <span aria-hidden="true">→</span>
          </Link>
          <CodeLink
            project={project}
            onClick={onNav}
            className="flex h-10 flex-1 basis-[160px] items-center justify-center gap-2 rounded-[14px] border border-line px-4 font-mono text-[13px] text-ink transition-colors hover:border-line-hot"
          >
            {isGithubUrl(project.url!) ? t.work.viewCode : t.work.viewProject}
          </CodeLink>
        </div>
      </div>
    </article>
  );
}

function SideCard({ project, locale, t, onNav }: { project: Project; locale: Locale; t: Dictionary; onNav: () => void }) {
  return (
    <article className="group flex flex-1 flex-col gap-2 rounded-[20px] border border-line bg-panel p-2.5 transition-colors hover:border-line-hot">
      <Cover project={project} ratio="3 / 1" sizes="(max-width: 900px) 100vw, 340px" />
      <div className="flex flex-1 flex-col gap-1 px-1.5">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
          <CategoryPill category={project.category} label={t.work[CATEGORY_LABEL_KEY[project.category]]} />
          <span>{project.years}</span>
        </div>
        <h3 className="text-[16px] leading-tight font-bold text-ink" style={{ letterSpacing: "-0.02em" }}>
          {localize(project.title, locale)}
        </h3>
        <p className="line-clamp-2 text-[12.5px] leading-snug text-dim">{localize(project.pitch, locale)}</p>
      </div>
      <Link
        href={`/work/${project.slug}`}
        onClick={onNav}
        className="flex h-9 items-center justify-between rounded-[10px] bg-wash px-3 font-mono text-[12px] font-bold text-accent"
      >
        {t.work.learnMore} <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

function GridCard({ project, locale, t, onNav }: { project: Project; locale: Locale; t: Dictionary; onNav: () => void }) {
  return (
    <article className="group animate-fade flex flex-col gap-1.5 rounded-[20px] border border-line bg-panel p-2.5 transition-colors hover:border-line-hot">
      <Cover project={project} ratio="16 / 8" sizes="(max-width: 700px) 100vw, 340px" />
      <div className="flex flex-1 flex-col gap-1 px-1.5">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted">
          <CategoryPill category={project.category} label={t.work[CATEGORY_LABEL_KEY[project.category]]} />
          <span>{localize(project.kindLabel, locale)}</span>
          <span>{project.years}</span>
          {project.featured ? (
            <span style={{ color: AMBER }} aria-label="Featured">★</span>
          ) : null}
        </div>
        <h3 className="text-[15px] leading-tight font-bold text-ink" style={{ letterSpacing: "-0.02em" }}>
          {localize(project.title, locale)}
        </h3>
        <p className="line-clamp-2 text-[12.5px] leading-snug text-dim">{localize(project.pitch, locale)}</p>
        <div className="mt-auto truncate font-mono text-[11px] text-muted">{project.stack.map((it) => it.name).join(" · ")}</div>
      </div>
      <div className="flex gap-2 px-0.5">
        <CodeLink
          project={project}
          onClick={onNav}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-line text-ink transition-colors hover:border-line-hot"
        >
          {""}
        </CodeLink>
        <Link
          href={`/work/${project.slug}`}
          onClick={onNav}
          className="flex h-9 flex-1 items-center justify-between rounded-[10px] bg-wash px-3 font-mono text-[12px] font-bold text-accent"
        >
          {t.work.learnMore} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

// The work browser: a ★ Featured row (big lead card + up to two side
// cards, in `PROJECTS` order among the featured ones) above a filtered,
// paginated grid of everything. Ported structurally from the client's
// own "design I" reference and reskinned onto this site's tokens.
export function WorkView({ projects }: { projects: Project[] }) {
  const { locale, t } = useLocale();
  const { playClick } = useSound();
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all");
  const [page, setPage] = useState(0);

  const featured = useMemo(() => projects.filter((p) => p.featured), [projects]);
  const [lead, ...side] = featured;

  const matching = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter]
  );
  const pageCount = Math.max(1, Math.ceil(matching.length / PER_PAGE));
  const current = Math.min(page, pageCount - 1);
  const start = current * PER_PAGE;
  const visible = matching.slice(start, start + PER_PAGE);

  const countFor = (f: "all" | ProjectCategory) =>
    f === "all" ? projects.length : projects.filter((p) => p.category === f).length;

  const onNav = () => playClick("nav");

  return (
    <ViewPane>
      <div className="flex w-full max-w-[1100px] flex-col gap-5">
        {/* ---------- featured ---------- */}
        {lead ? (
          <section>
            <div className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.1em]">
              <h2 className="m-0 font-bold" style={{ color: AMBER }}>
                ★ {t.work.kindFeatured.toUpperCase()}
              </h2>
              <span className="h-px flex-1 bg-line-soft" />
              <span className="text-muted">
                {featured.length} {t.work.projectsSuffix}
              </span>
            </div>

            <div className="flex flex-wrap items-stretch gap-4">
              <LeadCard project={lead} locale={locale} t={t} onNav={onNav} />
              {side.length > 0 ? (
                <div className="flex flex-1 basis-[300px] flex-col gap-4">
                  {side.slice(0, 2).map((p) => (
                    <SideCard key={p.slug} project={p} locale={locale} t={t} onNav={onNav} />
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* ---------- all work ---------- */}
        <section>
          <div className="mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.1em]">
            <h2 className="m-0 font-bold text-accent">{t.work.allWorkLabel.toUpperCase()}</h2>
            <span className="h-px flex-1 bg-line-soft" />
            <span className="text-muted">{t.work.range}</span>
          </div>

          <div role="group" aria-label="Filter projects" className="mb-4 flex flex-wrap gap-1.5">
            {(["all", "personal", "academic", "professional"] as const).map((f) => {
              const active = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    onNav();
                    setFilter(f);
                    setPage(0);
                  }}
                  className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors"
                  style={{
                    background: active ? "var(--accent)" : "transparent",
                    color: active ? "var(--bg)" : "var(--dim)",
                    borderColor: active ? "var(--accent)" : "var(--line)",
                  }}
                >
                  {f === "all" ? t.work.filterAll : t.work[CATEGORY_LABEL_KEY[f]]}
                  <span style={{ opacity: 0.7 }}>{countFor(f)}</span>
                </button>
              );
            })}
          </div>

          <div
            key={`${filter}-${current}`}
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
          >
            {visible.map((p) => (
              <GridCard key={p.slug} project={p} locale={locale} t={t} onNav={onNav} />
            ))}
          </div>

          {pageCount > 1 ? (
            <nav aria-label="Project pages" className="mt-3 flex flex-wrap justify-center gap-1.5 font-mono text-[12px]">
              <button
                type="button"
                aria-label={t.work.prevPageLabel}
                disabled={current === 0}
                onClick={() => setPage(current - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-line-hot disabled:cursor-default disabled:opacity-35"
              >
                ←
              </button>
              {Array.from({ length: pageCount }, (_, n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${t.work.pageLabel} ${n + 1}`}
                  aria-current={n === current ? "page" : undefined}
                  onClick={() => setPage(n)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border font-bold transition-colors"
                  style={{
                    background: n === current ? "var(--accent)" : "var(--panel)",
                    color: n === current ? "var(--bg)" : "var(--ink)",
                    borderColor: n === current ? "var(--accent)" : "var(--line)",
                  }}
                >
                  {n + 1}
                </button>
              ))}
              <button
                type="button"
                aria-label={t.work.nextPageLabel}
                disabled={current >= pageCount - 1}
                onClick={() => setPage(current + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-line-hot disabled:cursor-default disabled:opacity-35"
              >
                →
              </button>
            </nav>
          ) : null}
          <p className="mt-2 text-center font-mono text-[11px] text-muted">
            {matching.length === 0
              ? t.work.noProjectsYet
              : `${start + 1}–${start + visible.length} ${t.work.rangeOf} ${matching.length} ${t.work.projectsSuffix}`}
          </p>
        </section>
      </div>
    </ViewPane>
  );
}
