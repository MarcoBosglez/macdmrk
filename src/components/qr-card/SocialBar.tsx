import { DocIcon, GhIcon, IgIcon, InIcon, MailIcon } from "@/components/chrome/link-icons";
import { LINKS } from "@/lib/data/links";
import s from "./presentation-card.module.css";

// Always-visible row under the presentation card — five square icon
// buttons plus a wide "more in contact" link. Reuses the site's own
// brand-mark icon set (link-icons.tsx), not a generic icon library —
// lucide-react (the only icon package this project has) dropped all
// brand/logo icons a while back, so link-icons.tsx is "the real brand
// icons" here.
export function SocialBar() {
  return (
    <nav className={s.socBar} aria-label="Socials">
      <a
        className={s.soc}
        href={LINKS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        title="Instagram"
        aria-label="Instagram"
      >
        <IgIcon />
      </a>
      <a
        className={s.soc}
        href={LINKS.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        title="LinkedIn"
        aria-label="LinkedIn"
      >
        <InIcon />
      </a>
      <a
        className={s.soc}
        href={LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub"
        aria-label="GitHub"
      >
        <GhIcon />
      </a>
      <a className={s.soc} href={`mailto:${LINKS.email}`} title="Email" aria-label="Email">
        <MailIcon />
      </a>
      <a
        className={s.soc}
        href={LINKS.resume}
        target="_blank"
        rel="noopener noreferrer"
        title="Résumé"
        aria-label="Résumé"
      >
        <DocIcon />
      </a>
      <a className={s.socMore} href="/contact">
        <span>MORE IN CONTACT</span>
        <span className={s.arr} aria-hidden="true">
          ⟶
        </span>
      </a>
    </nav>
  );
}
