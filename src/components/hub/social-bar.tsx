"use client";

import { useState } from "react";
import Link from "next/link";
import { IgIcon, InIcon, MailIcon, DocIcon } from "@/components/chrome/link-icons";
import { LINKS } from "@/lib/data/links";
import { QrCodeButton } from "@/components/hub/qr-code";

// One shared hover for every button here — lift + border-hot + wash.
const GLASS_BTN =
  "rounded-[16px] bg-glass [backdrop-filter:blur(22px)_saturate(1.3)] [box-shadow:var(--shadow)]";

function SocialButton({
  href,
  external,
  title,
  Icon,
}: {
  href: string;
  external?: boolean;
  title: string;
  Icon: (p: { className?: string; strokeWidth?: number }) => React.ReactElement;
}) {
  const [on, setOn] = useState(false);
  return (
    <a
      href={href}
      title={title}
      aria-label={title}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      className={`hub-motion flex h-12 w-12 shrink-0 items-center justify-center ${GLASS_BTN}`}
      style={{
        border: `1px solid ${on ? "var(--line-hot)" : "var(--line)"}`,
        background: on ? "var(--wash)" : undefined,
        transform: on ? "translateY(-3px)" : undefined,
        transition:
          "transform .2s cubic-bezier(.2,.8,.3,1), border-color .18s ease, background .18s ease, box-shadow .22s ease",
      }}
    >
      <Icon className="h-[21px] w-[21px] text-accent" strokeWidth={1.9} />
    </a>
  );
}

function MoreInContact() {
  const [on, setOn] = useState(false);
  return (
    <Link
      href="/contact"
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      className={`hub-motion flex h-12 min-w-0 items-center justify-center gap-1.5 border border-line px-3 @min-[460px]:flex-1 ${GLASS_BTN}`}
      style={{
        background: on ? "var(--wash)" : undefined,
        transform: on ? "translateY(-4px)" : undefined,
        transition: "transform .2s cubic-bezier(.2,.8,.3,1), background .18s ease",
      }}
    >
      <span
        className="truncate font-mono text-[10px] tracking-[0.1em] uppercase"
        style={{ color: on ? "var(--accent)" : "var(--dim)" }}
      >
        more in contact
      </span>
      <span className="shrink-0 text-accent">→</span>
    </Link>
  );
}

// Icons are always icon-only — no in-between labelled state. Below
// ~460px of card width the row can't fit MoreInContact's text next to
// five icons on one line, so icons get their own full-width row
// (`justify-between`, spanning the card edge to edge with no dead air)
// and MoreInContact drops to a full-width row below it. From ~460px up
// there's room for both on one line, so the icon row collapses to
// `contents` and MoreInContact (now `flex-1`) absorbs whatever space is
// left — there's never empty space left over to fill, at any width.
// Measured against the card's own width via a container query (`@`
// variants, see the `@container` on hero.tsx's column), not the
// viewport: the hub's grid caps a desktop column at ~513px, so a
// viewport-based breakpoint would either never reach the one-line mode
// or falsely trigger it right as the grid drops to two columns and the
// card suddenly shrinks.
export function SocialBar() {
  return (
    <div className="flex flex-col gap-2 @min-[460px]:flex-row @min-[460px]:items-stretch">
      <div className="flex items-stretch justify-between gap-2 @min-[460px]:contents">
        <SocialButton href={LINKS.instagram} external title="Instagram — @marcobglz" Icon={IgIcon} />
        <SocialButton href={LINKS.linkedin} external title="LinkedIn — marco-bosquez" Icon={InIcon} />
        <SocialButton href={`mailto:${LINKS.email}`} title="Email" Icon={MailIcon} />
        <SocialButton href={LINKS.resume} external title="Résumé — PDF" Icon={DocIcon} />
        <QrCodeButton />
      </div>
      <MoreInContact />
    </div>
  );
}
