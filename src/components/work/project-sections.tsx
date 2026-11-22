"use client";

// Renders a project's `sections` (see lib/data/projects.ts): each
// section is a numbered label, an optional headline and a stack of
// blocks, optionally with an image pinned beside it. Every block type
// lives in `Block` below, so adding a new kind of content means adding
// one case to the ProjectBlock type and one case here.

import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import type { Copy, CopyList, ProjectBlock, ProjectSection } from "@/lib/data/projects";
import { InlineText, RichText } from "@/components/work/rich-text";
import { ProjectFigure } from "@/components/work/project-figure";

// Same theme tokens as project-page.tsx. BLUE/RED stay fixed: they're
// semantic (category identity / problem-fix callouts), not part of the
// per-theme token set.
const PANEL = "var(--card)";
const BORDER = "var(--line)";
const INK = "var(--ink)";
const DIM = "var(--ink2)";
const MUTED = "var(--ink2)";
const ACCENT = "var(--acc)";
const ACCENT_BG = "color-mix(in srgb, var(--acc) 12%, transparent)";
const AMBER = "var(--amber)";
const AMBER_BG = "color-mix(in srgb, var(--amber) 10%, transparent)";
const BLUE = "#7fb2ff";
const BLUE_BG = "rgba(127,178,255,0.1)";
const RED = "#ff8a7a";
const RED_BG = "rgba(255,138,122,0.12)";
const INTER = "var(--font-inter-tight, 'Inter Tight', sans-serif)";
const MONO = "var(--font-jetbrains-mono, ui-monospace, monospace)";

/** Picks the locale's copy, falling back to English when it's empty or missing. */
export function pick(c: Copy | undefined, locale: Locale): string {
  if (!c) return "";
  return (locale === "es" ? c.es : c.en) || c.en;
}
export function pickList(c: CopyList | undefined, locale: Locale): string[] {
  if (!c) return [];
  const list = locale === "es" ? c.es : c.en;
  return list && list.length ? list : c.en;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export type ResolvedSection = ProjectSection & { anchor: string; num: string };

/** Visible sections with their anchors ("#implementation") and numbers ("02"). */
export function resolveSections(sections: ProjectSection[] | undefined): ResolvedSection[] {
  const used = new Set<string>();
  return (sections ?? [])
    .filter((s) => !s.hidden)
    .map((s, i) => {
      // Prefix keeps anchors from colliding with page/chrome element ids.
      let anchor = `s-${s.id || slugify(s.label.en) || String(i + 1)}`;
      while (used.has(anchor)) anchor += "-2";
      used.add(anchor);
      return { ...s, anchor, num: String(i + 1).padStart(2, "0") };
    });
}

function BlockTitle({ text }: { text: string }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: MUTED, fontFamily: MONO }}>
      {text}
    </div>
  );
}

const BULLET_MARK = { check: "✓", dot: "•", arrow: "→" } as const;

function Block({
  block,
  locale,
  t,
  figNum,
}: {
  block: ProjectBlock;
  locale: Locale;
  t: Dictionary;
  figNum: string;
}) {
  switch (block.type) {
    case "text":
      return (
        <RichText
          className="text-[15px] leading-relaxed"
          style={{ fontFamily: INTER, color: DIM }}
          text={pick(block.text, locale)}
        />
      );

    case "bullets": {
      const style = block.style ?? "check";
      const items = pickList(block.items, locale);
      return (
        <div className="flex flex-col gap-2">
          {block.title ? <BlockTitle text={pick(block.title, locale)} /> : null}
          <ul className="flex flex-col gap-1.5">
            {items.map((line, i) => (
              <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed" style={{ fontFamily: INTER, color: INK }}>
                <span
                  className="shrink-0"
                  style={{ color: style === "number" ? AMBER : ACCENT, fontFamily: style === "number" ? MONO : undefined }}
                  aria-hidden="true"
                >
                  {style === "number" ? String(i + 1).padStart(2, "0") : BULLET_MARK[style]}
                </span>
                <span>
                  <InlineText text={line} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    case "steps":
      return (
        <div className="flex flex-col gap-2">
          {block.title ? <BlockTitle text={pick(block.title, locale)} /> : null}
          <ol className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
            {pickList(block.items, locale).map((step, i) => (
              <li
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
              </li>
            ))}
          </ol>
        </div>
      );

    case "timeline":
      return (
        <div className="flex flex-col gap-2">
          {block.title ? <BlockTitle text={pick(block.title, locale)} /> : null}
          <ol className="flex flex-col">
            {block.items.map((item, i) => (
              <li key={i} className="relative flex gap-4 pb-4 last:pb-0">
                {/* rail + dot */}
                <span className="relative flex w-3 shrink-0 justify-center" aria-hidden="true">
                  <span
                    className="absolute top-[18px] bottom-[-4px] w-px"
                    style={{ background: i === block.items.length - 1 ? "transparent" : BORDER }}
                  />
                  <span className="mt-[6px] h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: ACCENT, background: PANEL }} />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-mono text-[12px] font-bold" style={{ color: AMBER }}>
                    {item.when}
                  </span>
                  <RichText
                    className="text-[14px] leading-relaxed"
                    style={{ fontFamily: INTER, color: DIM }}
                    text={pick(item.text, locale)}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      );

    case "beforeAfter": {
      const goal = block.goal;
      const goals = !goal ? [] : Array.isArray(goal.en) ? pickList(goal as CopyList, locale) : [pick(goal as Copy, locale)];
      const before = pick(block.before, locale);
      if (!before && !goals.length) return null;
      const goalLabel = block.goalLabel ? pick(block.goalLabel, locale) : goals.length > 1 ? t.work.goalsLabel : t.work.goalLabel;
      return (
        <div className="overflow-hidden rounded-[10px] border text-[13px]" style={{ borderColor: BORDER }}>
          {before ? (
            <div className="px-3.5 py-2.5" style={{ background: RED_BG, color: RED }}>
              − {block.beforeLabel ? pick(block.beforeLabel, locale) : t.work.beforeLabel}: <InlineText text={before} />
            </div>
          ) : null}
          {goals.length ? (
            <div className="px-3.5 py-2.5" style={{ background: ACCENT_BG, color: ACCENT }}>
              {goals.length === 1 ? (
                <>
                  + {goalLabel}: <InlineText text={goals[0]} />
                </>
              ) : (
                <>
                  + {goalLabel}:
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {goals.map((line, i) => (
                      <li key={i} className="flex gap-2 pl-3">
                        <span className="shrink-0" aria-hidden="true">
                          •
                        </span>
                        <span>
                          <InlineText text={line} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ) : null}
        </div>
      );
    }

    case "challenges":
      return (
        <div className="flex flex-col gap-2.5">
          {block.items.map((c, i) => (
            <div key={i} className="flex flex-col items-stretch gap-0 sm:flex-row sm:items-stretch">
              <div className="flex-1 rounded-[12px] border px-3.5 py-2.5 sm:rounded-r-none" style={{ borderColor: RED, background: RED_BG }}>
                <div className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: RED }}>
                  {t.work.problemLabel}
                </div>
                <div className="mt-1 text-[14px] leading-relaxed" style={{ color: RED, fontFamily: INTER }}>
                  <InlineText text={pick(c.problem, locale)} />
                </div>
              </div>
              <span aria-hidden="true" className="flex items-center justify-center py-1 sm:px-1" style={{ color: MUTED }}>
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
                  <InlineText text={pick(c.fix, locale)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      );

    case "stats":
      return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {block.items.map((s, i) => (
            <div key={i} className="rounded-[10px] border px-3 py-2.5" style={{ borderColor: BORDER }}>
              <div className="text-[22px] font-bold" style={{ color: ACCENT, fontFamily: INTER }}>
                {s.value}
              </div>
              <div className="font-mono text-[11px]" style={{ color: MUTED }}>
                {pick(s.label, locale)}
              </div>
            </div>
          ))}
        </div>
      );

    case "figure": {
      const caption = pick(block.caption, locale) || undefined;
      return (
        <ProjectFigure
          src={block.src}
          alt={pick(block.alt, locale) || caption || ""}
          num={figNum}
          caption={caption}
          sizes="(max-width: 900px) 100vw, 1000px"
          enlargeLabel={t.work.enlargeLabel}
          closeLabel={t.work.closeLabel}
        />
      );
    }

    case "callout": {
      const tone = block.tone ?? "note";
      const [color, bg] = tone === "win" ? [ACCENT, ACCENT_BG] : tone === "warn" ? [AMBER, AMBER_BG] : [BLUE, BLUE_BG];
      return (
        <div className="flex flex-col gap-1 rounded-[12px] border-l-[3px] px-4 py-3" style={{ borderColor: color, background: bg }}>
          {block.title ? (
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color }}>
              {pick(block.title, locale)}
            </div>
          ) : null}
          <RichText className="text-[14px] leading-relaxed" style={{ fontFamily: INTER, color: INK }} text={pick(block.text, locale)} />
        </div>
      );
    }

    case "code":
      return (
        <figure className="flex flex-col gap-1.5">
          {/* A code block reads as its own little terminal, so it uses
              the --tbg/--tfg pair (same surface as ask_marco.sh) rather
              than --card/--ink — those two pairs can diverge (aurora
              flips --tbg to a light panel), so mixing them risks
              low-contrast text, same bug class pingu-chat's bubbles hit. */}
          <div className="overflow-hidden rounded-[12px] border" style={{ borderColor: BORDER, background: "var(--tbg)" }}>
            {block.file ? (
              <div className="border-b px-3.5 py-1.5 font-mono text-[11px]" style={{ borderColor: BORDER, color: "var(--tfg)" }}>
                {block.file}
              </div>
            ) : null}
            <pre className="overflow-x-auto px-3.5 py-3 text-[12.5px] leading-relaxed" style={{ fontFamily: MONO, color: "var(--tfg)" }}>
              <code>{block.code}</code>
            </pre>
          </div>
          {block.caption ? (
            <figcaption className="text-[12px]" style={{ fontFamily: MONO, color: MUTED }}>
              {pick(block.caption, locale)}
            </figcaption>
          ) : null}
        </figure>
      );

    case "quote":
      return (
        <figure className="flex flex-col gap-1.5 border-l-2 pl-4" style={{ borderColor: AMBER }}>
          <blockquote className="text-[18px] leading-snug" style={{ fontFamily: INTER, color: INK }}>
            <InlineText text={pick(block.text, locale)} />
          </blockquote>
          {block.by ? (
            <figcaption className="font-mono text-[12px]" style={{ color: MUTED }}>
              — {block.by}
            </figcaption>
          ) : null}
        </figure>
      );
  }
}

export function ProjectSections({
  sections,
  locale,
  t,
}: {
  sections: ResolvedSection[];
  locale: Locale;
  t: Dictionary;
}) {
  // Figures are numbered in reading order across the whole page: each
  // section's figure blocks first, then its aside. Done up front because
  // child components render after this one, so a counter bumped during
  // their render would number asides before every block figure.
  let fig = 0;
  const next = () => String(++fig).padStart(2, "0");
  const nums = sections.map((s) => {
    const visible = s.blocks.filter((b) => !b.hidden);
    const blockNums = visible.map((b) => (b.type === "figure" ? next() : ""));
    return { visible, blockNums, aside: s.aside ? next() : "" };
  });

  return (
    <div className="flex flex-col gap-10">
      {sections.map((s, si) => {
        const headingId = `${s.anchor}-heading`;
        const blocks = (
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {nums[si].visible.map((b, i) => (
              <Block key={i} block={b} locale={locale} t={t} figNum={nums[si].blockNums[i]} />
            ))}
          </div>
        );
        const aside = s.aside ? (
          <div className="w-full shrink-0 md:w-[40%]">
            {(() => {
              const caption = pick(s.aside.caption, locale) || undefined;
              return (
                <ProjectFigure
                  src={s.aside.src}
                  alt={pick(s.aside.alt, locale) || caption || ""}
                  num={nums[si].aside}
                  caption={caption}
                  sizes="(max-width: 900px) 100vw, 440px"
                  enlargeLabel={t.work.enlargeLabel}
                  closeLabel={t.work.closeLabel}
                />
              );
            })()}
          </div>
        ) : null;
        const asideLeft = s.aside?.side === "left";

        return (
          <section
            key={s.anchor}
            id={s.anchor}
            aria-labelledby={s.headline ? headingId : `${s.anchor}-tag`}
            className={`scroll-mt-6 flex flex-col gap-3 ${s.panel ? "rounded-[16px] border p-4 sm:p-5" : ""}`}
            style={s.panel ? { borderColor: BORDER, background: PANEL } : undefined}
          >
            <span
              id={`${s.anchor}-tag`}
              className="font-mono text-[11px] uppercase tracking-[0.1em]"
              style={{ color: MUTED, fontFamily: MONO }}
            >
              {s.num} · {pick(s.label, locale)}
            </span>
            {s.headline ? (
              <h2
                id={headingId}
                className="text-[21px] font-bold sm:text-[25px]"
                style={{ color: INK, fontFamily: INTER, letterSpacing: "-0.01em", lineHeight: 1.2 }}
              >
                {pick(s.headline, locale)}
              </h2>
            ) : null}
            {aside ? (
              <div className={`flex flex-col gap-5 md:items-start ${asideLeft ? "md:flex-row-reverse" : "md:flex-row"}`}>
                {blocks}
                {aside}
              </div>
            ) : (
              blocks
            )}
          </section>
        );
      })}
    </div>
  );
}
