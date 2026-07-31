import type { Metadata } from "next";
import { Space_Mono, Work_Sans } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { SoundProvider } from "@/components/providers/sound-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { TopBar } from "@/components/chrome/top-bar";
import { NoiseOverlay } from "@/components/chrome/noise-overlay";
import { LocaleToggle } from "@/components/chrome/locale-toggle";
import { MobileNavBubbles } from "@/components/chrome/mobile-nav-bubbles";

// Space Mono carries the "terminal" identity (nav, headers, code-like
// labels); Work Sans is used for actual paragraph copy so long text
// stays readable instead of monospace-cramped.
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: "macdmrk",
  description: "Marco Bosquez — Software Developer & Digital Artist",
  // favicon.svg lives in public/ rather than src/app/ — Next's
  // automatic favicon detection only recognizes files literally named
  // "icon.svg" in the app directory, so a file named "favicon.svg"
  // needs to be wired up explicitly here instead.
  icons: {
    icon: "/favicon.svg",
  },
};

// Every page on the site renders inside this layout, which is why the
// window chrome (top bar, bordered "desktop" frame) only has to be
// built once here instead of being repeated on every route.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceMono.variable} ${workSans.variable}`}
    >
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SoundProvider>
            <LocaleProvider>
              {/* Outer padded area — the dark/light margin around the
                  window frame. The language toggle sits here, outside
                  the bordered panel, since it's a real site-wide
                  setting rather than part of the "desktop" illusion. */}
              <div className="relative flex h-screen w-screen p-3 md:p-7">
                <div className="absolute top-1 right-3 z-20 md:top-3 md:right-6">
                  <LocaleToggle />
                </div>

                {/* The bordered "window frame" — everything a visitor
                    would call the actual site lives inside this box. */}
                <div className="relative flex flex-1 flex-col overflow-hidden rounded-[10px] border border-ink">
                  <NoiseOverlay />
                  <TopBar />
                  <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
                </div>

                {/* Mobile-only floating nav; the desktop pill nav lives
                    inside TopBar instead. */}
                <MobileNavBubbles />
              </div>
            </LocaleProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
