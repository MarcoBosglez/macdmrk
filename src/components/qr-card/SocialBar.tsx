import { DocIcon, GhIcon, IgIcon, InIcon, MailIcon } from "@/components/chrome/link-icons";
import { IconTooltip } from "@/components/chrome/icon-tooltip";
import { LINKS } from "@/lib/data/links";
import s from "./presentation-card.module.css";

// Always-visible row under the presentation card — five square icon
// buttons plus a wide "more in contact" link. Reuses the site's own
// brand-mark icon set (link-icons.tsx), not a generic icon library —
// lucide-react (the only icon package this project has) dropped all
// brand/logo icons a while back, so link-icons.tsx is "the real brand
// icons" here. Each one gets a hover/focus tooltip (see IconTooltip)
// since the icon alone doesn't always say what a click will do — the
// résumé link in particular downloads a PDF, not just "more info".
export function SocialBar() {
  return (
    <nav className={s.socBar} aria-label="Socials">
      <IconTooltip label="Instagram">
        <a className={s.soc} href={LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <IgIcon />
        </a>
      </IconTooltip>
      <IconTooltip label="LinkedIn">
        <a className={s.soc} href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <InIcon />
        </a>
      </IconTooltip>
      <IconTooltip label="GitHub">
        <a className={s.soc} href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <GhIcon />
        </a>
      </IconTooltip>
      <IconTooltip label="Email">
        <a className={s.soc} href={`mailto:${LINKS.email}`} aria-label="Email">
          <MailIcon />
        </a>
      </IconTooltip>
      <IconTooltip label="Résumé — PDF download">
        <a className={s.soc} href={LINKS.resume} target="_blank" rel="noopener noreferrer" aria-label="Résumé">
          <DocIcon />
        </a>
      </IconTooltip>
      <a className={s.socMore} href="/contact">
        <span>MORE IN CONTACT</span>
        <span className={s.arr} aria-hidden="true">
          ⟶
        </span>
      </a>
    </nav>
  );
}
