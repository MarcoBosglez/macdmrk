"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import type { Project } from "@/lib/data/projects";
import { ProjectSwitcher } from "@/components/work/project-switcher";
import s from "@/components/work/switcher.module.css";

// Same fixed literal palette as project-page.tsx — this page always
// reads as the dark green terminal regardless of the site's own
// light/dark toggle, so it can't lean on the adaptive tokens.
const BORDER = "#2b5a3f";
const ACCENT = "#7dffa8";

export type NavSection = { anchor: string; num: string; label: string };

// Scroll-spy over the case-study sections. The page's own scroll
// container is tagged [data-project-scroll] (on desktop the window
// never scrolls here, see MainShell's md:overflow-hidden), so that's
// the observer root rather than the document.
function useActiveSection(sections: NavSection[]) {
  const [active, setActive] = useState(sections[0]?.anchor);
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-project-scroll]");
    const els = sections.map((x) => document.getElementById(x.anchor)).filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const top = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        setActive(top.target.id);
      },
      { root, rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);
  return active;
}

// "02 · implementation ▾" — the current section, and a menu to jump to
// any other. Stands in for the old per-section labels row, which took
// a whole extra line.
function SectionMenu({
  sections,
  activeIndex,
  label,
}: {
  sections: NavSection[];
  activeIndex: number;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const current = sections[Math.max(activeIndex, 0)];

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className={`${s.btn} w-full justify-between`}
        style={{ borderColor: "transparent", background: "transparent" }}
      >
        <span className="min-w-0 truncate uppercase tracking-[0.06em]" style={{ color: ACCENT }}>
          <span className="font-bold">{current.num}</span> {current.label}
        </span>
        <span aria-hidden="true" className={`${s.chevron} ${open ? s.chevronOpen : ""}`}>
          ▾
        </span>
      </button>
      {open ? (
        <div role="menu" aria-label={label} className={s.menu} style={{ gridTemplateColumns: "1fr", width: "min(320px, 92vw)" }}>
          {sections.map((x, i) => (
            <a
              key={x.anchor}
              role="menuitem"
              href={`#${x.anchor}`}
              onClick={() => setOpen(false)}
              aria-current={i === activeIndex ? "true" : undefined}
              className={`${s.item} ${i === activeIndex ? s.current : ""}`}
            >
              <span className={s.itemNum}>{x.num}</span>
              <span className={s.itemSlug}>{x.label}</span>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// The site chrome bar renders empty slots on a project page (see
// ChromeBar). Look one up once mounted; retry for a few frames in case
// the chrome bar commits its project layout after this page does.
function useSlot(id: string) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    let raf = 0;
    let tries = 0;
    const find = () => {
      const found = document.getElementById(id);
      if (found) setEl(found);
      else if (tries++ < 60) raf = requestAnimationFrame(find);
    };
    find();
    return () => cancelAnimationFrame(raf);
  }, [id]);
  return el;
}

// A case study's nav, folded into the site chrome bar so the page has
// one box on top: all-work · project switcher · current section ·
// prev/next go into #chrome-project-slot (between the logo and the
// clock/sound/language controls), and the section progress ticks go
// into #chrome-project-progress along the box's bottom edge.
export function ProjectNavBar({
  projects,
  index,
  sections,
  locale,
  t,
  onNav,
}: {
  projects: Project[];
  index: number;
  sections: NavSection[];
  locale: Locale;
  t: Dictionary;
  onNav: () => void;
}) {
  const rowSlot = useSlot("chrome-project-slot");
  const progressSlot = useSlot("chrome-project-progress");
  const active = useActiveSection(sections);
  const activeIndex = sections.findIndex((x) => x.anchor === active);
  const total = projects.length;
  const prev = projects[(index - 1 + total) % total];
  const next = projects[(index + 1) % total];

  const row = (
    <>
      <Link href="/work" onClick={onNav} aria-label={t.work.allWorkBack} title={t.work.allWorkBack} className={s.btn}>
        <LayoutGrid className="h-4 w-4 2xl:hidden" aria-hidden />
        <span className="hidden 2xl:inline">{t.work.allWorkBack}</span>
      </Link>

      <ProjectSwitcher projects={projects} index={index} locale={locale} t={t} onNav={onNav} />

      {sections.length > 1 ? (
        <SectionMenu sections={sections} activeIndex={activeIndex} label={t.work.tocLabel} />
      ) : (
        <span className="flex-1" />
      )}

      <Link
        href={`/work/${prev.slug}`}
        onClick={onNav}
        aria-label={`${t.work.prevProjectLabel}: ${prev.slug}`}
        title={`${t.work.prevProjectLabel}: ${prev.slug}`}
        className={`${s.btn} max-sm:!hidden`}
      >
        ←
      </Link>
      <Link
        href={`/work/${next.slug}`}
        onClick={onNav}
        aria-label={`${t.work.nextProjectLabel}: ${next.slug}`}
        title={`${t.work.nextProjectLabel}: ${next.slug}`}
        className={s.btn}
      >
        →
      </Link>
    </>
  );

  const progress =
    sections.length > 1 ? (
      <div className="flex gap-1 px-1" aria-hidden="true">
        {sections.map((x, i) => (
          <a key={x.anchor} href={`#${x.anchor}`} tabIndex={-1} title={`${x.num} ${x.label}`} className="flex-1 py-1">
            <span
              className="block h-[3px] rounded-full transition-colors"
              style={{ background: i <= activeIndex ? ACCENT : BORDER, opacity: i < activeIndex ? 0.6 : 1 }}
            />
          </a>
        ))}
      </div>
    ) : null;

  return (
    <>
      {rowSlot ? createPortal(row, rowSlot) : null}
      {progressSlot && progress ? createPortal(progress, progressSlot) : null}
    </>
  );
}
