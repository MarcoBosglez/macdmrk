"use client";

import { useState } from "react";
import Link from "next/link";
import { IgIcon, InIcon, MailIcon, DocIcon } from "@/components/chrome/link-icons";
import { LINKS } from "@/lib/data/links";

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
      className={`hub-motion flex h-12 min-w-0 flex-1 items-center justify-center gap-1.5 border border-line px-3 ${GLASS_BTN}`}
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

export function SocialBar() {
  return (
    <div className="flex items-stretch gap-2">
      <SocialButton href={LINKS.instagram} external title="Instagram — @marcobglz" Icon={IgIcon} />
      <SocialButton href={LINKS.linkedin} external title="LinkedIn — marco-bosquez" Icon={InIcon} />
      <SocialButton href={`mailto:${LINKS.email}`} title="Email" Icon={MailIcon} />
      <SocialButton href={LINKS.resume} external title="Résumé — PDF" Icon={DocIcon} />
      <MoreInContact />
    </div>
  );
}
