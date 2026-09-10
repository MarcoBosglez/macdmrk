// The site's two supported languages. Add a new one here (and to both
// dictionaries) and every component that reads from useLocale() picks
// it up automatically — nothing else needs to change.
export type Locale = "en" | "es";

export const LOCALES: Locale[] = ["en", "es"];

// Small helper for content that lives in data files (projects,
// experience) rather than the dictionary — anywhere a single string
// needs both an English and Spanish version side by side.
export type Localized = { en: string; es: string };

export function localize(value: Localized, locale: Locale): string {
  return value[locale];
}

// Shape of all translatable UI copy. Text meant to read as literal
// terminal output — the prompt, fake filenames like `today.log` /
// `readme.md` — is intentionally not in here; it stays the same in
// every language.
export type Dictionary = {
  nav: {
    home: string;
    about: string;
    work: string;
    gallery: string;
    contact: string;
  };
  chrome: {
    openToWork: string;
  };
  hub: {
    eyebrow: string;
    role: string;
    // One-line "where I am / where I'm from", mono meta under the role.
    location: string;
    bio: string;
    chips: string[];
    // Typewriter lines for the today.log panel. Kept short — they type
    // out one char every 26ms on mount.
    log: string[];
    // The "→ ..." line in the start_here.txt note strip.
    note: string;
  };
  work: {
    eyebrow: string;
    range: string;
    whatIDid: string;
    outcomeLabel: string;
    linkHint: string;
    note: string;
  };
  gallery: {
    eyebrow: string;
    // Rendered as `{shown} · {archiveTotal}` style — the component
    // supplies the numbers, this is the middle word.
    countJoiner: string;
    // Label for the "show everything" chip in the medium filter row.
    filterAll: string;
    dragHint: string;
    note: string;
  };
  about: {
    eyebrow: string;
    // Lead paragraph. `leadAccent` is the exact substring inside `lead`
    // that gets the accent colour — the component splits on it.
    lead: string;
    leadAccent: string;
    nowLabel: string;
    now: string;
    stackLabel: string;
    stack: string;
    elsewhereLabel: string;
    experienceLabel: string;
    listeningLabel: string;
    interestsLabel: string;
    interests: string;
    quirk: string;
    disclaimer: string;
    note: string;
  };
  contact: {
    eyebrow: string;
    lead: string;
    blurb: string;
    statusLabel: string;
    statusValue: string;
    localTimeLabel: string;
    replyTimeLabel: string;
    replyTimeValue: string;
    elsewhereLabel: string;
    elsewhere: {
      instagram: string;
      linkedin: string;
      resume: string;
    };
    briefs: string[];
    note: string;
  };
  notFound: {
    title: string;
    description: string;
    cta: string;
  };
  errorPage: {
    title: string;
    description: string;
    retry: string;
    cta: string;
  };
};
