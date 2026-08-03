import { notFound } from "next/navigation";
import Image from "next/image";
import { ILLUSTRATIONS } from "@/lib/data/illustrations";
import { AppWindow } from "@/components/chrome/app-window";

// A single illustration also gets its own real, shareable URL — even
// though the main /gallery page shows every piece as a floating
// window instead of separate pages. This is what a shared link (or a
// search engine) actually lands on.
export function generateStaticParams() {
  return ILLUSTRATIONS.map((illustration) => ({ slug: illustration.slug }));
}

export default async function IllustrationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const illustration = ILLUSTRATIONS.find((i) => i.slug === slug);
  if (!illustration) notFound();

  return (
    <AppWindow title={illustration.caption}>
      <div className="flex h-full flex-col p-6 md:p-10">
        <div className="relative mb-5 min-h-[240px] flex-1 overflow-hidden rounded-lg bg-bg">
          {illustration.image ? (
            <Image
              src={illustration.image}
              alt={illustration.caption}
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-contain"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, oklch(65% 0.16 ${illustration.hue}), oklch(55% 0.16 ${
                  illustration.hue + 40
                }))`,
              }}
            />
          )}
        </div>
        <div className="mb-1.5 font-mono text-sm"># {illustration.caption}</div>
        {illustration.description ? (
          <p className="text-sm leading-relaxed text-muted">{illustration.description}</p>
        ) : null}
      </div>
    </AppWindow>
  );
}
