import Image from "next/image";
import Link from "next/link";
import { featuredProjects, type FeaturedProject } from "./featured-projects";
import s from "./featured-work.module.css";

export default function FeaturedWork({
  projects = featuredProjects,
  allWorkHref = "/work",
  className,
}: {
  projects?: FeaturedProject[];
  allWorkHref?: string;
  className?: string;
}) {
  if (projects.length === 0) return null;

  return (
    <div className={[s.section, className].filter(Boolean).join(" ")}>
      <div className={s.header}>
        <span className={s.label}>★ featured work</span>
        <span className={s.rule} aria-hidden="true" />
        <Link href={allWorkHref} className={s.allWork}>
          <span>all work</span>
          <span className={s.count}>{projects.length}</span>
          <span className={s.arrow} aria-hidden="true">
            <span className={s.arrowLine} />
            <span>&gt;</span>
          </span>
        </Link>
      </div>

      <div className={s.grid}>
        {projects.map((p, i) => (
          <FeaturedCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </div>
  );
}

function FeaturedCard({ project: p, index }: { project: FeaturedProject; index: number }) {
  return (
    <Link href={p.href} className={s.card}>
      {p.image ? (
        <span className={s.thumb}>
          <Image
            src={p.image.src}
            alt={p.image.alt}
            fill
            sizes="(max-width: 640px) 100vw, 340px"
            className={s.thumbImg}
          />
        </span>
      ) : null}
      <div className={s.body}>
        <div className={s.meta}>
          <span className={s.num}>{String(index + 1).padStart(2, "0")}</span>
          <span className={`${s.pill} ${s[`cat_${p.category}`]}`}>{p.category}</span>
          <span className={s.year}>{p.year}</span>
        </div>
        <div className={s.name}>{p.name}</div>
        <p className={s.desc}>{p.description}</p>
      </div>
    </Link>
  );
}
