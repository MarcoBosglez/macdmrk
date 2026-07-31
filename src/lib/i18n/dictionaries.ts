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
  };
  hero: {
    role: string;
    description: string;
    ctaWork: string;
    ctaGallery: string;
  };
  work: {
    previewPlaceholder: string;
    categoryLabel: string;
    stackLabel: string;
    statusLabel: string;
  };
  gallery: {
    maximize: string;
    restore: string;
    dragHint: string;
  };
  about: {
    photoPlaceholder: string;
    bio: string;
    skills: string;
    contactCta: string;
    disclaimer: string;
  };
  faq: {
    questionPrefix: string;
    answerPrefix: string;
  };
  contact: {
    emailLabel: string;
    instagramLabel: string;
    linkedinLabel: string;
    githubLabel: string;
  };
};

const en: Dictionary = {
  nav: {
    about: "ABOUT",
    work: "WORK",
    gallery: "GALLERY",
    faq: "FAQ",
    contact: "CONTACT",
  },
  toggles: {
    mute: "[ mute ]",
    unmute: "[ unmute ]",
    light: "[ light ]",
    dark: "[ dark ]",
    loading: "[ ... ]",
  },
  hero: {
    role: "software dev & digital artist",
    description:
      "martial arts practitioner, videogame enthusiast",
    ctaWork: "→ view_work",
    ctaGallery: "→ view_gallery",
  },
  work: {
    previewPlaceholder: "// preview.png",
    categoryLabel: "CATEGORY",
    stackLabel: "STACK",
    statusLabel: "STATUS",
  },
  gallery: {
    maximize: "[ maximize ]",
    restore: "[ restore ]",
    dragHint: "drag the title bar to move",
  },
  about: {
    photoPlaceholder: "photo.jpg",
    bio: "Born in Mexico based in Seattle, WA. Software Engineer and Digital Artist pursuing my M.S. in Computer Science at DigiPen. I specialize in backend development, AI integration, full-stack web development, and digital art.",
    skills: "nodejs · typescript · python · react · clip studio paint · affinity",
    contactCta: "→ contact_me",
    disclaimer:
      "Disclaimer: Design, Illustration, Layout was made by me. AI tools were only used to help write code.",
  },
  faq: {
    questionPrefix: "Q:",
    answerPrefix: "A:",
  },
  contact: {
    emailLabel: "EMAIL",
    instagramLabel: "INSTAGRAM",
    linkedinLabel: "LINKEDIN",
    githubLabel: "GITHUB",
  },
};

const es: Dictionary = {
  nav: {
    about: "SOBRE MÍ",
    work: "TRABAJO",
    gallery: "GALERÍA",
    faq: "FAQ",
    contact: "CONTACTO",
  },
  toggles: {
    mute: "[ silenciar ]",
    unmute: "[ activar ]",
    light: "[ claro ]",
    dark: "[ oscuro ]",
    loading: "[ ... ]",
  },
  hero: {
    role: "desarrollador de software & artista digital",
    description:
      "practicante de artes marciales y entusiaste de videojuegos.",
    ctaWork: "→ ver_trabajo",
    ctaGallery: "→ ver_galeria",
  },
  work: {
    previewPlaceholder: "// vista_previa.png",
    categoryLabel: "CATEGORÍAS",
    stackLabel: "STACK",
    statusLabel: "ESTADO",
  },
  gallery: {
    maximize: "[ maximizar ]",
    restore: "[ restaurar ]",
    dragHint: "arrastra la barra de título para mover",
  },
  about: {
    photoPlaceholder: "photo.jpg",
    bio: "Desarrollador de Software y Artista Digital. Persiguiendo una Maestría en Ciencias de Computación en DigiPen. Me especializo en desarrollo backend, integración con IA, desarrollo full stack y arte digital.",
    skills: "nodejs · typescript · python · react · clip studio paint · affinity",
    contactCta: "→ contacta_me",
    disclaimer:
      "Disclaimer: Diseño, Ilustraciones y Layout hechos por mi. Herramientas de IA solo fueron usadas para ayudar a escribir código.",
 },
  faq: {
    questionPrefix: "P:",
    answerPrefix: "R:",
  },
  contact: {
    emailLabel: "CORREO",
    instagramLabel: "INSTAGRAM",
    linkedinLabel: "LINKEDIN",
    githubLabel: "GITHUB",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { en, es };
