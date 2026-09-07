import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ILLUSTRATIONS } from "@/lib/data/illustrations";

// Each illustration also gets its own real, shareable URL, even though
// the main /gallery page shows every piece as a floating window. This
// is what a shared link (or a crawler) lands on.
export function generateStaticParams() {
  return ILLUSTRATIONS.map((illustration) => ({ slug: illustration.slug }));
}

export const dynamicParams = false;

export default async function IllustrationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const illustration = ILLUSTRATIONS.find((i) => i.slug === slug);
  if (!illustration) notFound();

  return (
    <div className="animate-fade flex h-full items-center justify-center py-1.5">
      <div className="flex h-full max-h-[820px] w-full max-w-[900px] flex-col overflow-hidden rounded-[22px] border border-line bg-panel [backdrop-filter:blur(22px)_saturate(1.2)] [box-shadow:var(--shadow)]">
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-3">
          <span className="font-mono text-[12px] text-muted">
            {illustration.caption} · {illustration.medium}
          </span>
          <Link
            href="/gallery"
            className="p-1 font-mono text-sm leading-none text-ink transition-colors hover:text-accent"
            aria-label="Back to gallery"
          >
            ✕
          </Link>
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-5">
          <div className="relative min-h-[200px] flex-1 overflow-hidden rounded-[12px] bg-bg">
            <Image
              src={illustration.image!}
              alt={illustration.caption}
              fill
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-contain"
            />
          </div>
          {illustration.description ? (
            <p className="mt-3 shrink-0 text-[13px] leading-relaxed text-dim">
              {illustration.description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
