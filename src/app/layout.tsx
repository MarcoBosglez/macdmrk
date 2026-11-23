import type { Metadata } from "next";
import Script from "next/script";
import { Archivo, JetBrains_Mono, Inter_Tight, Silkscreen } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { SoundProvider } from "@/components/providers/sound-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { CursorProvider } from "@/components/providers/cursor-provider";
import { AuroraField } from "@/components/chrome/aurora-field";
import { ChromeBar } from "@/components/chrome/chrome-bar";
import { MainShell } from "@/components/chrome/main-shell";
import { MobileNavBubbles } from "@/components/chrome/mobile-nav-bubbles";
import { PrivateToolsButton } from "@/components/chrome/private-tools-button";
import { CopyrightMark } from "@/components/chrome/copyright-mark";
import { StartupAnimation } from "@/components/chrome/startup-animation";
import { PageGuide } from "@/components/page-guide/PageGuide";
import { SwitchEyeProvider } from "@/components/hub/switch-eye";

// Archivo as a variable font (wdth + wght axes live) — the kinetic type
// animates font-variation-settings, not size. JetBrains Mono is the
// terminal / meta face.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Used for the About page's magazine-cover hero (800) and, since the
// 4-theme system, as the mint/dark/aurora themes' display font for the
// hub name, nav pills, etc. (--disp/--hlfont) — hence the wider weight
// range now.
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter-tight",
  display: "swap",
});

// Mint theme's highlight-letter font (--hlfont), used nowhere else.
const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-silkscreen",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marco Bosquez",
  description: "Marco Bosquez — software developer & digital artist.",
  icons: {
    icon: "/logo.svg",
  },
};

// The whole site is one fixed-viewport shell: an aurora field behind, a
// glass chrome bar on top, and a "stage" that each route renders into
// with a cross-fade. Below ~900px the stage scrolls and the pill nav is
// replaced by MobileNavBubbles.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`no-js ${archivo.variable} ${jetBrainsMono.variable} ${interTight.variable} ${silkscreen.variable}`}
    >
      <body>
        {/* Runs before paint: drop the no-js guard, and if the startup
            intro already played this tab session, hide it via CSS now so
            repeat navigations never flash it (the component also checks,
            this just wins the race). */}
        <Script id="startup-check" strategy="beforeInteractive">
          {`document.documentElement.classList.remove("no-js");
            try {
              if (sessionStorage.getItem("mb-booted")) {
                document.documentElement.classList.add("mb-skip-startup");
              }
            } catch (e) {}`}
        </Script>
        <ThemeProvider
          attribute={["class", "data-theme"]}
          themes={["dark", "mint", "aurora", "electric"]}
          defaultTheme="dark"
        >
          <SoundProvider>
            <LocaleProvider>
              <CursorProvider>
                <SwitchEyeProvider>
                  <div className="relative flex h-dvh w-screen flex-col overflow-hidden">
                    <AuroraField />
                    <ChromeBar />
                    <MainShell>{children}</MainShell>
                    <MobileNavBubbles />
                    <PrivateToolsButton />
                    <CopyrightMark />
                    <PageGuide />
                  </div>
                </SwitchEyeProvider>
              </CursorProvider>
            </LocaleProvider>
          </SoundProvider>
        </ThemeProvider>
        <StartupAnimation />
      </body>
    </html>
  );
}
