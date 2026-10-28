"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { useSound } from "@/components/providers/sound-provider";
import { localize, type Locale } from "@/lib/i18n/dictionaries";
import { isGithubUrl } from "@/components/work/work-view";
import { GhIcon } from "@/components/chrome/link-icons";
import type { Project, Figure, StackItem, StackKind } from "@/lib/data/projects";

// Small candy-colour accents borrowed from the client's "design D"
// case-study reference — kept as literal hex (like the site's existing
// PROT_COLOR/amber badge in the lift log) rather than themed tokens,
// since they're meant to read as fixed terminal syntax-highlight
// colours, not something that should shift with the site's theme.
const AMBER = "#ffb347";
const BLUE = "#7fb2ff";
const PURPLE = "#c792ea";
const RED = "#ff8a7a";
const RED_BG = "rgba(255,138,122,0.12)";
const AMBER_BG = "rgba(255,179,71,0.12)";
const GREEN_BG = "color-mix(in srgb, var(--accent) 12%, transparent)";

const KIND_COLOR: Record<StackKind, string> = { lang: BLUE, lib: PURPLE, tool: "var(--muted)" };

function usageBar(n: number) {
  const v = Math.max(0, Math.min(10, Math.round(n)));
  return `[${"|".repeat(v)}${" ".repeat(10 - v)}]`;
}

// "## 03 section title" heading, straight from the reference's
// terminal-doc styling.
function SectionHeading({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <h2 className="flex items-baseline gap-2 font-mono text-[15px] font-bold text-accent">
      <span className="text-muted">##</span>
      <span style={{ color: AMBER }}>{num}</span>
      <span>{children}</span>
    </h2>
  );
}

// Image + caption; unset `src` renders the dashed TODO placeholder so
// a step/section can exist before the real screenshot does.
function FigureBox({
  figure,
  locale,
  ratio = "16 / 9",
  sizes = "(max-width: 900px) 100vw, 800px",
}: {
  figure: Figure;
  locale: Locale;
  ratio?: string;
  sizes?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="relative overflow-hidden rounded-[8px] border border-dashed border-line bg-bg"
        style={{ aspectRatio: ratio }}
      >
        {figure.src ? (
          <Image src={figure.src} alt={localize(figure.alt, locale)} fill sizes={sizes} className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center p-2 text-center font-mono text-[10px] text-muted">
            TODO — {localize(figure.alt, locale)}
          </div>
        )}
      </div>
      {figure.caption ? (
        <span className="font-mono text-[11px] text-muted">{localize(figure.caption, locale)}</span>
      ) : null}
    </div>
  );
}

function MetaCell({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div className="px-3.5 py-2.5">
      <div className="font-mono text-[10px] tracking-[0.1em] uppercase" style={{ color }}>
        {label}
      </div>
      <div className="mt-0.5 text-[13px] text-ink">{children}</div>
    </div>
  );
}

function StackTable({
  stack,
  label,
  cmdLabel,
  typeLabel,
  usageLabel,
}: {
  stack: StackItem[];
  label: string;
  cmdLabel: string;
  typeLabel: string;
  usageLabel: string;
}) {
  return (
    <div className="rounded-[8px] border border-dashed border-line-soft px-3.5 py-3">
      <div className="mb-2 font-mono text-[11px] text-muted">--{label}</div>
      <div className="grid grid-cols-[minmax(0,1fr)_64px_110px] gap-x-3 gap-y-1 font-mono text-[12px]">
        <span className="w-fit rounded-[2px] bg-wash px-1.5 py-0.5 text-accent uppercase">{cmdLabel}</span>
        <span className="w-fit rounded-[2px] bg-wash px-1.5 py-0.5 text-accent uppercase">{typeLabel}</span>
        <span className="w-fit rounded-[2px] bg-wash px-1.5 py-0.5 text-accent uppercase">{usageLabel}</span>
        {stack.map((t) => (
          <div key={t.name} className="contents">
            <span className="truncate text-ink">{t.name}</span>
            <span style={{ color: KIND_COLOR[t.kind] }}>{t.kind}</span>
            <span className="whitespace-pre text-accent">{usageBar(t.usage)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Bigger, bolder action buttons matching the reference's primary
// (filled) / ghost (outlined) pair — not reusing the compact pill
// ProjectCtaButton here since its own classes would fight these on
// specificity. `demoUrl` is optional on purpose: not every project has
// a repo *and* a separate live demo, sometimes neither.
function ActionButton({
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
      className="flex min-h-[44px] items-center justify-center gap-2 rounded-[4px] px-5 text-[13px] font-bold transition-[filter,background] duration-150 hover:brightness-110"
      style={{
        background: primary ? "var(--accent)" : "transparent",
        color: primary ? "var(--bg)" : "var(--accent)",
        border: primary ? "none" : "1px solid var(--accent)",
      }}
    >
      {children}
    </a>
  );
}

function ThemesBox({ tags, label }: { tags: string[]; label: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-0.5 py-1 font-mono text-[12px]">
      <span className="text-muted">--{label}</span>
      {tags.map((tag) => (
        <span key={tag} className="rounded-[3px] bg-wash px-2 py-1 text-[11px]" style={{ color: AMBER }}>
          #{tag}
        </span>
      ))}
    </div>
  );
}

// One project's dedicated page: the client's own "design D" case-study
// reference, ported structurally as-is and reskinned onto this site's
// glass/mono-green tokens — window chrome, project tabs (replacing the
// old left sidebar), sticky table of contents, meta grid, stack table,
// diff/checklist/diagram/process/challenges/outcome sections, and the
// prev/next pager all come straight from that reference. Home stays
// the site's own top-left logo, so there's no separate "cd ~" link in
// the window itself.
export function ProjectPage({ project, projects }: { project: Project; projects: Project[] }) {
  const { locale, t } = useLocale();
  const { playClick } = useSound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[index - 1];
  const next = projects[index + 1];

  const TOC = [
    { id: "tldr", label: t.work.tldrLabel },
    { id: "why", label: t.work.whyLabel },
    { id: "role", label: t.work.contributionsLabel },
    { id: "how", label: t.work.whatIDid },
    { id: "process", label: t.work.processLabel },
    { id: "challenges", label: t.work.challengesLabel },
    { id: "outcome", label: t.work.outcomeLabel },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col items-center overflow-y-auto p-4 font-mono md:overflow-hidden md:p-8">
      <div className="flex w-full max-w-[1800px] flex-col">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-[24px] border border-line bg-panel [backdrop-filter:blur(22px)_saturate(1.2)] [box-shadow:var(--shadow)] md:max-h-[86vh]">
          {/* ---------- title bar ---------- */}
          <div className="flex shrink-0 items-center gap-2 border-b border-line bg-glass-soft px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-line-hot" />
            <span className="h-2 w-2 rounded-full bg-line" />
            <span className="ml-1.5 text-[11px] text-muted">
              marco@portfolio: ~/projects/{project.slug}
            </span>
          </div>

          {/* ---------- project tabs ---------- */}
          {/* overflow-x-auto with a visible scrollbar, not hidden —
              this is a real nav (more projects will land here later),
              so it needs the affordance telling you there's more. */}
          <nav
            aria-label="Projects"
            className="flex shrink-0 items-stretch overflow-x-auto border-b border-line bg-glass-soft text-[12px]"
          >
            {projects.map((p, i) => {
              const active = p.slug === project.slug;
              return (
                <Link
                  key={p.slug}
                  href={`/work/${p.slug}`}
                  onClick={() => playClick("nav")}
                  aria-current={active ? "page" : undefined}
                  className="flex shrink-0 items-center gap-2 border-r border-line px-4 py-2.5 whitespace-nowrap transition-colors"
                  style={{
                    color: active ? "var(--accent)" : "var(--dim)",
                    borderTop: active ? "2px solid var(--accent)" : "2px solid transparent",
                  }}
                >
                  <span style={{ color: active ? AMBER : "var(--muted)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p.slug}
                </Link>
              );
            })}
            <Link
              href="/work"
              onClick={() => playClick("nav")}
              className="ml-auto flex shrink-0 items-center gap-1.5 border-l border-line px-4 py-2.5 whitespace-nowrap text-muted transition-colors hover:text-accent"
            >
              cd ../ ← {t.work.allProjects}
            </Link>
          </nav>

          <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto p-6 md:p-10">
            {/* ---------- header ---------- */}
            <div className="flex flex-col gap-4">
              <div className="text-[12px] text-muted">
                <span style={{ color: "var(--accent)" }}>marco@portfolio</span>:
                <span style={{ color: BLUE }}>~/projects</span>$ cat ./{project.slug}/README.md
              </div>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                  <span className="text-[11px] tracking-[0.08em]" style={{ color: AMBER }}>
                    {`// ${project.slug} · ${project.years}`}
                  </span>
                  <h1
                    className="uppercase text-accent"
                    style={{
                      fontSize: "clamp(28px, 5vw, 48px)",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.05,
                    }}
                  >
                    {localize(project.title, locale)}
                    <span className="animate-blink text-accent">_</span>
                  </h1>
                  <p className="max-w-[560px] text-[14px] leading-relaxed text-dim">
                    {localize(project.pitch, locale)}
                  </p>
                </div>

                {project.url || project.demoUrl ? (
                  <div className="flex shrink-0 flex-col gap-2 sm:w-[220px]">
                    {project.url ? (
                      <ActionButton href={project.url} primary onClick={() => playClick("nav")}>
                        {isGithubUrl(project.url) ? <GhIcon className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                        {isGithubUrl(project.url) ? t.work.viewCode : t.work.viewProject}
                      </ActionButton>
                    ) : null}
                    {project.demoUrl ? (
                      <ActionButton href={project.demoUrl} onClick={() => playClick("nav")}>
                        ./run --demo ↗
                      </ActionButton>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {project.backstory ? (
                <p className="text-[12px] leading-relaxed text-dim">
                  <span className="text-muted">{`// {t.work.backstoryLabel}`}:</span>{" "} 
                  {localize(project.backstory, locale)}
                </p>
              ) : null}

              <div className="grid grid-cols-2 divide-y divide-dashed divide-line-soft rounded-[8px] border border-dashed border-line-soft sm:grid-cols-4 sm:divide-x sm:divide-y-0">
                <MetaCell label={t.work.roleLabel} color={AMBER}>
                  {localize(project.role, locale)}
                </MetaCell>
                <MetaCell label={t.work.timelineLabel} color={BLUE}>
                  {localize(project.timeline, locale)}
                </MetaCell>
                <MetaCell label={t.work.teamLabel} color={PURPLE}>
                  {localize(project.team, locale)}
                </MetaCell>
                <MetaCell label={t.work.statusLabel} color="var(--accent)">
                  <span style={{ color: "var(--accent)" }}>●</span> {localize(project.status, locale)}
                </MetaCell>
              </div>

              <StackTable
                stack={project.stack}
                label={t.work.stackLabel}
                cmdLabel={t.work.cmdLabel}
                typeLabel={t.work.typeLabel}
                usageLabel={t.work.usageLabel}
              />

              {project.tags.length ? <ThemesBox tags={project.tags} label={t.work.themeLabel} /> : null}

              {project.image ? (
                <div className="relative overflow-hidden rounded-[10px] border border-line bg-bg" style={{ aspectRatio: "21 / 9" }}>
                  <Image
                    src={project.image}
                    alt={localize(project.title, locale)}
                    fill
                    sizes="(max-width: 1200px) 100vw, 1300px"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : null}
            </div>

            {/* ---------- body: TOC + sections ---------- */}
            <div className="flex flex-col gap-8 border-t border-line-soft pt-6 md:flex-row md:items-start md:gap-10">
              <nav aria-label="Sections" className="flex shrink-0 flex-col gap-1.5 text-[12px] md:sticky md:top-0 md:w-[160px]">
                <div className="mb-1 text-[10px] tracking-[0.12em] text-muted uppercase">{t.work.tocLabel}</div>
                <div className="flex flex-col border-l border-line">
                  {TOC.map(({ id, label }, i) => (
                    <a key={id} href={`#${id}`} className="px-3 py-1.5 text-dim transition-colors hover:text-accent">
                      <span style={{ color: AMBER }}>{String(i + 1).padStart(2, "0")}</span> {label}
                    </a>
                  ))}
                </div>
              </nav>

              <div className="flex min-w-0 flex-1 flex-col gap-8">
                {/* ---------- tl;dr ---------- */}
                <section id="tldr" className="flex scroll-mt-4 flex-col gap-2.5">
                  <SectionHeading num="01">{t.work.tldrLabel}</SectionHeading>
                  <div className="rounded-[8px] border border-line-soft bg-glass-soft px-4 py-3 text-[13px] leading-relaxed text-ink">
                    {localize(project.tldr, locale)}
                  </div>
                </section>

                {/* ---------- why ---------- */}
                <section id="why" className="flex scroll-mt-4 flex-col gap-2.5">
                  <SectionHeading num="02">{t.work.whyLabel}</SectionHeading>
                  <p className="text-[13px] leading-relaxed text-dim">{localize(project.why.problem, locale)}</p>
                  <div className="overflow-hidden rounded-[8px] border border-line-soft text-[12.5px]">
                    <div className="px-3.5 py-2" style={{ background: RED_BG, color: RED }}>
                      − {t.work.beforeLabel}: {localize(project.why.before, locale)}
                    </div>
                    <div className="px-3.5 py-2" style={{ background: GREEN_BG, color: "var(--accent)" }}>
                      + {t.work.goalLabel}: {localize(project.why.goal, locale)}
                    </div>
                  </div>
                </section>

                {/* ---------- role & contributions ---------- */}
                <section id="role" className="flex scroll-mt-4 flex-col gap-2.5">
                  <SectionHeading num="03">{t.work.contributionsLabel}</SectionHeading>
                  <p className="text-[13px] leading-relaxed text-dim">
                    {localize(project.contributions.summary, locale)}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {project.contributions.done[locale].map((line) => (
                      <li key={line} className="flex gap-3 text-[13px] text-ink">
                        <span className="shrink-0 text-accent">[x]</span>
                        <span>{line}</span>
                      </li>
                    ))}
                    {project.contributions.others?.[locale].map((line) => (
                      <li key={line} className="flex gap-3 text-[13px] text-muted">
                        <span className="shrink-0">[ ]</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* ---------- how ---------- */}
                <section id="how" className="flex scroll-mt-4 flex-col gap-3">
                  <SectionHeading num="04">{t.work.whatIDid}</SectionHeading>
                  <p className="text-[13px] leading-relaxed text-dim">{localize(project.how.summary, locale)}</p>
                  <div className="flex flex-wrap items-stretch gap-2 rounded-[8px] border border-line-soft bg-glass-soft p-4">
                    {(
                      [
                        { label: t.work.inputLabel, value: project.how.diagram.input },
                        { label: t.work.coreLabel, value: project.how.diagram.core },
                        { label: t.work.outputLabel, value: project.how.diagram.output },
                      ] satisfies { label: string; value: Project["title"] }[]
                    ).map((node, i, arr) => (
                      <div key={node.label} className="flex flex-1 items-center gap-2" style={{ minWidth: 140 }}>
                        <div className="flex-1 rounded-[6px] border border-line px-3 py-2 text-center">
                          <div className="text-[10px] text-muted">{node.label}</div>
                          <div className="mt-0.5 text-[12px] text-ink">{localize(node.value, locale)}</div>
                        </div>
                        {i < arr.length - 1 ? <span className="shrink-0 text-muted">──▶</span> : null}
                      </div>
                    ))}
                  </div>
                </section>

                {/* ---------- process ---------- */}
                <section id="process" className="flex scroll-mt-4 flex-col gap-2.5">
                  <SectionHeading num="05">{t.work.processLabel}</SectionHeading>
                  <ol className="flex flex-col">
                    {project.process.map((step, i) => (
                      <li key={i} className="flex gap-4 border-t border-dashed border-line-soft py-3.5 first:border-t-0">
                        <span className="w-[32px] shrink-0 text-[18px] font-bold" style={{ color: AMBER }}>
                          {String(i).padStart(2, "0")}
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <h3 className="text-[13px] font-semibold text-ink">{localize(step.title, locale)}</h3>
                          <p className="text-[12.5px] leading-relaxed text-dim">{localize(step.body, locale)}</p>
                          {step.image ? (
                            <div className="max-w-[320px]">
                              <FigureBox figure={step.image} locale={locale} ratio="16 / 9" sizes="320px" />
                            </div>
                          ) : null}
                          {step.beforeAfter ? (
                            <div className="grid max-w-[460px] grid-cols-2 gap-2.5">
                              <FigureBox figure={step.beforeAfter.before} locale={locale} ratio="4 / 3" sizes="220px" />
                              <FigureBox figure={step.beforeAfter.after} locale={locale} ratio="4 / 3" sizes="220px" />
                            </div>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>

                {/* ---------- challenges ---------- */}
                <section id="challenges" className="flex scroll-mt-4 flex-col gap-2.5">
                  <SectionHeading num="06">{t.work.challengesLabel}</SectionHeading>
                  <div className="flex flex-col gap-2.5">
                    {project.challenges.map((c, i) => (
                      <div key={i} className="overflow-hidden rounded-[8px] border border-line-soft">
                        <div
                          className="px-3.5 py-2 text-[12.5px]"
                          style={{
                            background: c.level === "error" ? RED_BG : AMBER_BG,
                            color: c.level === "error" ? RED : AMBER,
                          }}
                        >
                          {c.level === "error" ? "✗ " : "⚠ "}
                          {localize(c.problem, locale)}
                        </div>
                        <div className="px-3.5 py-2.5 text-[12.5px] leading-relaxed text-ink">
                          <span className="font-bold text-accent">✓ {t.work.fixLabel}:</span>{" "}
                          {localize(c.fix, locale)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ---------- outcome ---------- */}
                <section id="outcome" className="flex scroll-mt-4 flex-col gap-3">
                  <SectionHeading num="07">{t.work.outcomeLabel}</SectionHeading>
                  {project.outcome.metrics.length ? (
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {project.outcome.metrics.map((m, i) => (
                        <div key={i} className="rounded-[8px] border border-line-soft px-3.5 py-3">
                          <div className="text-[22px] font-bold text-accent">{m.value}</div>
                          <div className="text-[11px] text-muted">{localize(m.label, locale)}</div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <p className="text-[13px] leading-relaxed text-ink">{localize(project.outcome.summary, locale)}</p>
                  {project.outcome.figure ? (
                    <div className="max-w-[420px]">
                      <FigureBox figure={project.outcome.figure} locale={locale} ratio="16 / 9" />
                    </div>
                  ) : null}
                </section>

                {/* ---------- prev / next ---------- */}
                {prev || next ? (
                  <nav aria-label="More projects" className="grid gap-2.5 border-t border-line-soft pt-6 sm:grid-cols-2">
                    {prev ? (
                      <Link
                        href={`/work/${prev.slug}`}
                        onClick={() => playClick("nav")}
                        className="rounded-[8px] border border-line-soft px-4 py-3 transition-colors hover:border-line-hot"
                      >
                        <div className="text-[11px] text-muted">← cd ../{prev.slug}</div>
                        <div className="mt-1 text-[14px] font-semibold text-ink">{localize(prev.title, locale)}</div>
                        <div className="mt-0.5 text-[12px] text-dim">{localize(prev.pitch, locale)}</div>
                      </Link>
                    ) : null}
                    {next ? (
                      <Link
                        href={`/work/${next.slug}`}
                        onClick={() => playClick("nav")}
                        className="rounded-[8px] border px-4 py-3 text-right transition-colors"
                        style={{ borderColor: "var(--accent)" }}
                      >
                        <div className="text-[11px]" style={{ color: "var(--accent)" }}>
                          cd ../{next.slug} →
                        </div>
                        <div className="mt-1 text-[14px] font-semibold text-ink">{localize(next.title, locale)}</div>
                        <div className="mt-0.5 text-[12px] text-dim">{localize(next.pitch, locale)}</div>
                      </Link>
                    ) : null}
                  </nav>
                ) : null}

                <div className="text-[12px] text-muted">
                  <span style={{ color: "var(--accent)" }}>marco@portfolio</span>:
                  <span style={{ color: BLUE }}>~/projects</span>${" "}
                  <span
                    className="animate-blink inline-block h-[1em] w-[0.55em] align-middle"
                    style={{ background: "var(--accent)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
