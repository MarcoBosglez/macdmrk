// The single entry point for i18n — components import from here.
export type { Locale, Localized, Dictionary } from "./types";
export { LOCALES, localize } from "./types";

import type { Locale, Dictionary } from "./types";
import { en } from "./en";
import { es } from "./es";

export const DICTIONARIES: Record<Locale, Dictionary> = { en, es };
