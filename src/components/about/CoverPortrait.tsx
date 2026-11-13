import Image from "next/image";
import { GhIcon, InIcon, IgIcon, MailIcon, DocIcon } from "@/components/chrome/link-icons";
import { LINKS } from "@/lib/data/links";
import s from "./CoverPortrait.module.css";

const PHOTO_SRC = "/images/marco-cutout.webp";

export function CoverPortrait({ photoReady }: { photoReady: boolean }) {
  return (
    <div className={s.card}>
      <div className={s.front}>
        <div className={s.nameWrap} aria-hidden="true">
          <span className={s.nameLine1}>MARCO</span>
          <span className={s.nameLine2}>BOSQUEZ</span>
        </div>

        {photoReady ? (
          <div className={s.photoWrap}>
            <Image
              src={PHOTO_SRC}
              alt="Marco Bosquez"
              fill
              sizes="(max-width: 640px) 70vw, 340px"
              className={s.photo}
              priority
            />
          </div>
        ) : (
          <div className={s.placeholder} aria-hidden="true">
            drop marco-cutout.webp
            <br />
            in /public/images
          </div>
        )}

        <div className={s.hintWrap}>
          <span className={s.hint}>hover for more →</span>
        </div>
      </div>

      <div className={s.back}>
        <span className={s.backEyebrow}>about</span>
        <h3 className={s.backGreeting}>Hi, my name is Marco.</h3>
        <div className={s.backMeta}>
          <span className={s.backMetaTag}>software engineer</span>
          <span className={s.backMetaTag}>seattle ← cdmx</span>
        </div>
        <p className={s.backLead}>
          Software Engineer &amp; Hobbyist Digital Artist, currently pursuing my{" "}
          <span className={s.backAccent}>M.S. in Computer Science</span> at Digipen Institute of Technology.
        </p>

        <div className={s.backSection}>
          <span className={s.backLabel}>off the clock</span>
          <p className={s.backInterests}>videogames · drawing · mixed martial arts</p>
          <p className={s.backQuirk}>{"// my favorite color is green if you can't tell"}</p>
        </div>

        <div className={s.backSection}>
          <span className={s.backLabel}>elsewhere</span>
          <div className={s.backLinks}>
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={s.backLinkBtn}>
              <GhIcon className={s.backLinkIcon} />
            </a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={s.backLinkBtn}>
              <InIcon className={s.backLinkIcon} />
            </a>
            <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={s.backLinkBtn}>
              <IgIcon className={s.backLinkIcon} />
            </a>
            <a href={`mailto:${LINKS.email}`} aria-label="Email" className={s.backLinkBtn}>
              <MailIcon className={s.backLinkIcon} />
            </a>
            <a href={LINKS.resume} target="_blank" rel="noopener noreferrer" aria-label="Résumé" className={s.backLinkBtn}>
              <DocIcon className={s.backLinkIcon} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
