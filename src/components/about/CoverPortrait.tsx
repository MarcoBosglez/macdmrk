import Image from "next/image";
import s from "./CoverPortrait.module.css";

const PHOTO_SRC = "/images/marco-cutout.png";

export function CoverPortrait({ photoReady }: { photoReady: boolean }) {
  return (
    <div className={s.card}>
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
          drop marco-cutout.png
          <br />
          in /public/images
        </div>
      )}

      <div className={s.tags}>
        <span className={s.tag}>software engineer</span>
        <span className={s.tag}>seattle ← cdmx</span>
      </div>
    </div>
  );
}
