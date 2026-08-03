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
    maximize: string;
    restore: string;
    dragHint: string;
    gridHint: string;
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
    origin: "🇲🇽 Mexico City → Seattle, WA",
    description:
      "martial arts practitioner, videogame enthusiast",
    ctaWork: "→ view_work",
    ctaGallery: "→ view_gallery",
  },
  work: {
    previewPlaceholder: "// preview.png",
    linkHint: "click the link to open the project",
    categoryLabel: "CATEGORY",
    stackLabel: "STACK",
    statusLabel: "STATUS",
  },
  gallery: {
    maximize: "[ maximize ]",
    restore: "[ restore ]",
    dragHint: "drag the title bar to move",
    gridHint: "maximize a piece to see it at full resolution, no filters",
  },
  about: {
    photoPlaceholder: "photo.jpg",
    bio: "Born in Mexico City, now based in Seattle, WA for my Master's.\n\nSoftware Engineer and Digital Artist pursuing my M.S. in Computer Science at DigiPen. I specialize in backend development, AI integration, full-stack web development, and digital art.",
    skills: "nodejs · typescript · python · react · clip studio paint · affinity",
    contactCta: "→ contact_me",
    disclaimer:
      "Every visual aspect of this portfolio—including its design, illustrations, and layout—was designed and created by me. AI tools were used exclusively to assist with software development and code generation",
  },
  faq: {
    questionPrefix: "Q:",
    answerPrefix: "A:",
  },
  contact: {
    heading: "Wanna talk?",
    blurb: "Send me a message and let's get in touch, or find me directly:",
    form: {
      heading: "~/ ./send_message.sh",
      nameLabel: "NAME",
      namePlaceholder: "Your name",
      emailLabel: "EMAIL",
      emailPlaceholder: "you@example.com",
      messageLabel: "MESSAGE",
      messagePlaceholder: "What's up?",
      send: "→ send",
      sending: "sending...",
      success: "Message sent — I'll get back to you soon.",
      genericError: "Something went wrong. Please try again.",
      captchaRequired: "Please complete the CAPTCHA.",
      captchaLoading: "loading captcha...",
    },
  },
  notFound: {
    title: "404",
    description: "This page doesn't exist — the file was moved, deleted, or never here.",
    cta: "→ back_home",
  },
  errorPage: {
    title: "something broke",
    description: "An unexpected error occurred. You can try again, or head back home.",
    retry: "→ try_again",
    cta: "→ back_home",
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
    origin: "🇲🇽 Ciudad de México → Seattle, WA",
    description:
      "practicante de artes marciales y entusiaste de videojuegos.",
    ctaWork: "→ ver_trabajo",
    ctaGallery: "→ ver_galeria",
  },
  work: {
    previewPlaceholder: "// vista_previa.png",
    linkHint: "haz clic en el enlace para abrir el proyecto",
    categoryLabel: "CATEGORÍAS",
    stackLabel: "STACK",
    statusLabel: "ESTADO",
  },
  gallery: {
    maximize: "[ maximizar ]",
    restore: "[ restaurar ]",
    dragHint: "arrastra la barra de título para mover",
    gridHint: "maximiza una pieza para verla en resolución completa, sin filtros",
  },
  about: {
    photoPlaceholder: "photo.jpg",
    bio: "Nací en la Ciudad de México, ahora estoy en Seattle WA por mi maestria.\n\nDesarrollador de Software y Artista Digital. Persiguiendo una Maestría en Ciencias de Computación en DigiPen. Me especializo en desarrollo backend, integración con IA, desarrollo full stack y arte digital.",
    skills: "nodejs · typescript · python · react · clip studio paint · affinity",
    contactCta: "→ contacta_me",
    disclaimer:
      "Todos los aspectos visuales de este portafolio, incluyendo su diseño, ilustraciones y composición, fueron diseñados y creados por mí. Las herramientas de IA se utilizaron exclusivamente como apoyo para el desarrollo de software y la generación de código.",
 },
  faq: {
    questionPrefix: "P:",
    answerPrefix: "R:",
  },
  contact: {
    heading: "¿Quieres platicar?",
    blurb: "Envíame un mensaje y hagamos contacto, o encuéntrame directamente:",
    form: {
      heading: "~/ ./enviar_mensaje.sh",
      nameLabel: "NOMBRE",
      namePlaceholder: "Tu nombre",
      emailLabel: "CORREO",
      emailPlaceholder: "tu@ejemplo.com",
      messageLabel: "MENSAJE",
      messagePlaceholder: "¿Qué tal?",
      send: "→ enviar",
      sending: "enviando...",
      success: "Mensaje enviado — te responderé pronto.",
      genericError: "Algo salió mal. Por favor intenta de nuevo.",
      captchaRequired: "Por favor completa el CAPTCHA.",
      captchaLoading: "cargando captcha...",
    },
  },
  notFound: {
    title: "404",
    description: "Esta página no existe — el archivo fue movido, eliminado, o nunca existió.",
    cta: "→ volver_al_inicio",
  },
  errorPage: {
    title: "algo se rompió",
    description: "Ocurrió un error inesperado. Puedes intentar de nuevo, o volver al inicio.",
    retry: "→ intentar_de_nuevo",
    cta: "→ volver_al_inicio",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { en, es };
