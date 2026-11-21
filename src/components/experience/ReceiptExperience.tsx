"use client";

import { useEffect, useRef, useState } from "react";
import { LINKS } from "@/lib/data/links";
import { EXPERIENCE, type Role } from "@/data/experience";
import s from "./receipt.module.css";

const MONTH_YEAR = new Date().toLocaleDateString("en-US", {
  month: "long",
  year: "numeric",
});

// "Apr 2024–May 2026" -> "Apr 2024 to May 2026", for the accessible name.
function readableDates(dates: string) {
  return dates.replace(/\s*–\s*/g, " to ");
}

export function ReceiptExperience() {
  const [openId, setOpenId] = useState<string | null>(EXPERIENCE[0]?.id ?? null);
  const [printing, setPrinting] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPrinting(true);
      return;
    }

    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPrinting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={s.card} ref={wrapRef}>
      <div className={s.printerSlot} aria-hidden="true" />
      <div className={`${s.paper} ${printing ? s.printing : ""}`}>
        <header className={s.paperHeader}>
          <div className={s.brand}>MARCO BOSQUEZ</div>
          <div className={s.tagline}>software engineer · seattle, wa</div>
          <div className={s.orderLine}>order #EXPERIENCE · {MONTH_YEAR} · cashier: pingu</div>
        </header>

        <div className={s.divider} aria-hidden="true" />

        <div className={s.colHeader} aria-hidden="true">
          <span>ITEM</span>
          <span>DATES</span>
        </div>

        <div className={s.itemsScroll}>
          <ul className={s.items}>
            {EXPERIENCE.map((entry) => (
              <ExperienceItem
                key={entry.id}
                entry={entry}
                open={openId === entry.id}
                onToggle={() => setOpenId((id) => (id === entry.id ? null : entry.id))}
              />
            ))}
          </ul>
        </div>

        <div className={s.divider} aria-hidden="true" />

        <div className={s.totals}>
          <div className={s.totalRow}>
            <span>WORK EXPERIENCE</span>
            <span className={s.leader} aria-hidden="true" />
            <span>4+ yrs</span>
          </div>
          <div className={s.totalRow}>
            <span>DEGREES</span>
            <span className={s.leader} aria-hidden="true" />
            <span>1 + 1 in progress</span>
          </div>
          <div className={s.totalRow}>
            <span>PUBLICATIONS</span>
            <span className={s.leader} aria-hidden="true" />
            <span>1 (first author)</span>
          </div>
          <div className={`${s.totalRow} ${s.totalFinal}`}>
            <span>TOTAL</span>
            <span className={s.leader} aria-hidden="true" />
            <span>1 engineer</span>
          </div>
        </div>

        <div className={s.divider} aria-hidden="true" />

        <a href={LINKS.resume} download className={s.tearOff}>
          ✂ keep your receipt · résumé.pdf
        </a>
      </div>
    </div>
  );
}

function ExperienceItem({
  entry,
  open,
  onToggle,
}: {
  entry: Role;
  open: boolean;
  onToggle: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);

  function handleClick() {
    onToggle();
    // The items list has a fixed height so opening a row never moves
    // anything outside it — scroll the row into view within that
    // window instead, in case its notes land below the fold.
    requestAnimationFrame(() => {
      btnRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  return (
    <li className={s.item}>
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-label={`${entry.role}, ${entry.org}, ${readableDates(entry.dates)}`}
        onClick={handleClick}
        className={s.itemButton}
      >
        <span className={s.itemLine} aria-hidden="true">
          <span className={s.sign}>{open ? "−" : "+"}</span>
          <span className={s.roleText}>{entry.role}</span>
          <span className={s.leader} />
          <span className={s.dates}>{entry.dates}</span>
        </span>
        <span className={s.orgLine} aria-hidden="true">
          @ {entry.org}
        </span>
      </button>
      {open ? (
        <ul className={s.notes}>
          {entry.notes.map((note, i) => (
            <li key={i}>- {note}</li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
