import { LINKS } from "@/lib/data/links";

// A little QR pointing at the live site — scan it off the screen to open
// the portfolio on your phone. The path was generated once for LINKS.site;
// regenerate with:
//   npx qrcode -t svg -e M -q 1 "https://macdmrk.vercel.app"
// and paste the new `d`. `currentColor` lets it follow the theme.
const QR_PATH =
  "M1 1.5h7m3 0h1m5 0h1m1 0h7M1 2.5h1m5 0h1m2 0h3m2 0h2m2 0h1m5 0h1M1 3.5h1m1 0h3m1 0h1m1 0h1m1 0h2m2 0h1m1 0h1m1 0h1m1 0h3m1 0h1M1 4.5h1m1 0h3m1 0h1m1 0h3m2 0h4m1 0h1m1 0h3m1 0h1M1 5.5h1m1 0h3m1 0h1m1 0h2m4 0h1m1 0h1m1 0h1m1 0h3m1 0h1M1 6.5h1m5 0h1m1 0h1m1 0h1m2 0h1m1 0h1m2 0h1m5 0h1M1 7.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M9 8.5h3m5 0h1M1 9.5h1m1 0h5m2 0h1m1 0h4m3 0h5M4 10.5h1m1 0h1m1 0h1m2 0h2m7 0h1m3 0h1M2 11.5h1m1 0h1m2 0h1m1 0h6m1 0h2m1 0h2m1 0h1m1 0h2M3 12.5h1m1 0h1m3 0h2m1 0h1m2 0h1m2 0h4m3 0h1M7 13.5h1m5 0h3m2 0h2m1 0h1m1 0h3M1 14.5h1m1 0h1m4 0h1m2 0h1m1 0h1m3 0h1m2 0h1m1 0h1m1 0h1M1 15.5h1m1 0h2m1 0h3m2 0h1m1 0h1m1 0h2m2 0h4m1 0h2M1 16.5h1m4 0h1m1 0h3m2 0h1m1 0h1m2 0h1m1 0h2m3 0h1M1 17.5h1m1 0h2m2 0h4m3 0h8m1 0h1M9 18.5h1m1 0h2m1 0h1m2 0h1m3 0h2M1 19.5h7m2 0h1m2 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3M1 20.5h1m5 0h1m1 0h1m3 0h1m3 0h1m3 0h2M1 21.5h1m1 0h3m1 0h1m1 0h1m4 0h1m1 0h6m1 0h1M1 22.5h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1m3 0h2m1 0h5M1 23.5h1m1 0h3m1 0h1m1 0h3m2 0h2m1 0h1m4 0h2m1 0h1M1 24.5h1m5 0h1m2 0h1m2 0h1m2 0h7m2 0h1M1 25.5h7m1 0h1m3 0h3m3 0h7";

export function QrCode() {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <a
        href={LINKS.site}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open this site — or scan it with your phone"
        className="hub-motion group block h-[132px] w-[132px] rounded-[11px] border border-line bg-bg p-2.5 transition-transform duration-200 hover:-translate-y-0.5 hover:rotate-3 hover:border-line-hot"
      >
        <svg
          viewBox="0 0 27 27"
          shapeRendering="crispEdges"
          className="block h-full w-full text-ink transition-colors group-hover:text-accent"
        >
          <path stroke="currentColor" strokeWidth={1} d={QR_PATH} />
        </svg>
      </a>
      <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-muted">
        scan → this page
      </span>
    </div>
  );
}
