"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

// Thin re-export of next-themes' provider. It exists as our own
// component (rather than importing next-themes directly in
// layout.tsx) purely so every "provider" the app uses lives under the
// same components/providers/ folder and follows the same import
// pattern as SoundProvider and LocaleProvider.
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
