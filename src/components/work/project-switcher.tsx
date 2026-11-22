"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Project } from "@/lib/data/projects";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import s from "./switcher.module.css";

// A project reads as "wip" while fewer than 2 of its sections have a
// real headline (not missing, not a "[TODO: …]" placeholder) — a
// simple, self-contained heuristic so this doesn't need its own field.
function isWip(p: Project) {
  const heads = (p.sections ?? []).filter((s) => !s.hidden).map((s) => s.headline?.en);
  const filled = heads.filter((h) => h && !h.startsWith("[TODO")).length;
  return filled < 2;
}

export function ProjectSwitcher({
  projects,
  index,
  t,
  onNav,
}: {
  projects: Project[];
  index: number;
  locale: Locale;
  t: Dictionary;
  onNav: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const current = projects[index];
  const pathname = usePathname();

  // Closes on any route change — covers back/forward nav and anything
  // else that isn't the item's own onClick (which already closes it
  // synchronously for a snappier feel).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  // Move focus into the menu (onto the current project) when it opens.
  useEffect(() => {
    if (!open) return;
    const el = menuRef.current?.querySelector<HTMLAnchorElement>(`.${s.current}`);
    el?.focus();
  }, [open]);

  function onMenuKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) return;
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ?? []);
    if (!items.length) return;
    e.preventDefault();
    const currentIndex = items.indexOf(document.activeElement as HTMLAnchorElement);
    let next = currentIndex;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = currentIndex + 1;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = currentIndex - 1;
    if (next < 0) next = items.length - 1;
    if (next >= items.length) next = 0;
    items[next]?.focus();
  }

  return (
    <div className={s.switcher} ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={t.work.switcherAria}
        onClick={() => setOpen((v) => !v)}
        className={s.btn}
      >
        <span className={s.num}>{String(index + 1).padStart(2, "0")}</span>
        <span className={s.toggleSlug}>{current.slug}</span>
        <span className={s.sep}>/ {projects.length}</span>
        <span aria-hidden="true" className={`${s.chevron} ${open ? s.chevronOpen : ""}`}>
          ▾
        </span>
      </button>

      {open ? (
        <div ref={menuRef} role="menu" aria-label={t.work.switcherAria} className={s.menu} onKeyDown={onMenuKeyDown}>
          {projects.map((p, i) => {
            const active = i === index;
            return (
              <Link
                key={p.slug}
                role="menuitem"
                href={`/work/${p.slug}`}
                onClick={() => {
                  onNav();
                  setOpen(false);
                }}
                aria-current={active ? "page" : undefined}
                className={`${s.item} ${active ? s.current : ""}`}
              >
                <span className={s.itemNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.itemSlug}>{p.slug}</span>
                {p.featured ? (
                  <span aria-hidden="true" title="Featured">
                    ★
                  </span>
                ) : null}
                {isWip(p) ? <span className={s.wip}>{t.work.wipTag}</span> : null}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
