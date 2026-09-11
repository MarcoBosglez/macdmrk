import type { Metadata } from "next";
import Script from "next/script";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { SoundProvider } from "@/components/providers/sound-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import { CursorProvider } from "@/components/providers/cursor-provider";
import { AuroraField } from "@/components/chrome/aurora-field";
import { ChromeBar } from "@/components/chrome/chrome-bar";
import { MobileNavBubbles } from "@/components/chrome/mobile-nav-bubbles";
import { StartupAnimation } from "@/components/chrome/startup-animation";
import { FloatyField } from "@/components/chrome/floaty-field";

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
      className={`no-js ${archivo.variable} ${jetBrainsMono.variable}`}
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SoundProvider>
            <LocaleProvider>
              <CursorProvider>
                <div className="relative flex h-dvh w-screen flex-col overflow-hidden">
                  <AuroraField />
                  <FloatyField />
                  <ChromeBar />
                  <main className="relative z-[2] min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-5 md:overflow-hidden md:px-[26px] md:pb-[22px] md:pt-1.5">
                    {children}
                  </main>
                  <MobileNavBubbles />
                </div>
              </CursorProvider>
            </LocaleProvider>
          </SoundProvider>
        </ThemeProvider>
        <StartupAnimation />
      </body>
    </html>
  );
}
