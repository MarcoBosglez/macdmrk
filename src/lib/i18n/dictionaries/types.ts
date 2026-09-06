// The site's two supported languages. Add a new one here (and to both
// dictionaries below) and every component that reads from useLocale()
// picks it up automatically — nothing else needs to change.
export type Locale = "en" | "es";

export const LOCALES: Locale[] = ["en", "es"];

// Small helper for content that lives in data files (projects, FAQs,
// experience) rather than the dictionary above — anywhere a single
// string needs both an English and Spanish version sitting next to
// each other in the same object.
export type Localized = { en: string; es: string };

export function localize(value: Localized, locale: Locale): string {
  return value[locale];
}

// Shape of all translatable UI copy. Deliberately does NOT include the
// terminal "command" text (whoami, ls -la, window titles like work.exe,
// fake filenames like photo.jpg) — those are meant to read as literal
// shell output, so they stay identical in every language on purpose.
export type Dictionary = {
  nav: {
    home: string;
    about: string;
    work: string;
    gallery: string;
    faq: string;
    contact: string;
  };
  toggles: {
    mute: string;
    unmute: string;
    light: string;
    dark: string;
    loading: string;
    crtEnable: string;
    crtDisable: string;
  };
  hero: {
    role: string;
    origin: string;
    description: string;
    ctaWork: string;
    ctaGallery: string;
  };
  work: {
    previewPlaceholder: string;
    linkHint: string;
    categoryLabel: string;
    stackLabel: string;
    statusLabel: string;
  };
  gallery: {
    dragHint: string;
    gridHint: string;
  };
  about: {
    photoPlaceholder: string;
    bio: string;
    skills: string;
    interests: string;
    quirk: string;
    contactCta: string;
    disclaimer: string;
  };
  faq: {
    questionPrefix: string;
    answerPrefix: string;
  };
  contact: {
    heading: string;
    blurb: string;
    form: {
      heading: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      send: string;
      sending: string;
      success: string;
      genericError: string;
      captchaRequired: string;
      captchaLoading: string;
    };
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
