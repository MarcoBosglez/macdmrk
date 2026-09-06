import type { Dictionary } from "./types";

export const es: Dictionary = {
  nav: {
    home: "INICIO",
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
    crtEnable: "[ crt on ]",
    crtDisable: "[ crt off ]",
  },
  hero: {
    role: "desarrollador de software & artista digital",
    origin: "🇲🇽 Ciudad de México → Seattle, WA",
    description:
      "",
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
    dragHint: "arrastra la barra de título para mover",
    gridHint: "maximiza una pieza para verla en resolución completa, sin filtros",
  },
  about: {
    photoPlaceholder: "photo.jpg",
    bio: "Nací en la Ciudad de México, ahora estoy en Seattle WA por mi maestría.\n\nDesarrollador de Software y Artista Digital cursando una Maestría en Ciencias de la Computación en DigiPen, con graduación en otoño de 2027. Me especializo en desarrollo backend, integración de LLMs, desarrollo full stack y arte digital.",
    skills: "nodejs · typescript · python · react · rest apis · llm integration · sql · git · clip studio paint · affinity",
    interests: "videojuegos · dibujo · tacos · artes marciales · fanático de los deportes de contacto",
    quirk: "// entreno artes marciales y aún así el pingüino me gana en el sparring",
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
