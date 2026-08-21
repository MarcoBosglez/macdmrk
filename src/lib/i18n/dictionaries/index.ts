// Barrel: every component imports from "@/lib/i18n/dictionaries" (this
// file) rather than reaching into en.ts/es.ts directly, so adding a
// third language only means adding its file here and to LOCALES/
// DICTIONARIES below — no call site needs to change.
export type { Locale, Localized, Dictionary } from "./types";
export { LOCALES, localize } from "./types";

import type { Locale, Dictionary } from "./types";
import { en } from "./en";
import { es } from "./es";

export const DICTIONARIES: Record<Locale, Dictionary> = { en, es };
