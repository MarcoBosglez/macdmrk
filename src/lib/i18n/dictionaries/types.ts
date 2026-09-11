// Supporting two languages (english, spanish)
// TODO: Add italian when I'm fluent with it
export type Locale = "en" | "es";

export const LOCALES: Locale[] = ["en", "es"];

// Small helper variable type for english/spanish descriptions
export type Localized = { en: string; es: string };

export function localize(value: Localized, locale: Locale): string {
  return value[locale];
}

// Dictionary of all translatable texts/objects.
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
    location: string;
    bio: string;
    chips: string[];
    // The "→ ..." line in the start_here.txt note
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
    countJoiner: string;
    filterAll: string;
    dragHint: string;
    note: string;
  };
  about: {
    eyebrow: string;
    lead: string;
    leadAccent: string;
    stackChips: string[];
    elsewhereCta: string;
    experienceLabel: string;
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
    basedInLabel: string;
    basedInValue: string;
    basedInSub: string;
    elsewhereLabel: string;
    elsewhere: {
      linkedin: string;
      github: string;
      instagram: string;
      altEmail: string;
      phone: string;
      resume: string;
    };
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
