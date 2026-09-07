import type { Dictionary } from "./types";

export const es: Dictionary = {
  nav: {
    home: "inicio",
    about: "sobre mí",
    work: "trabajo",
    gallery: "galería",
    contact: "contacto",
  },
  chrome: {
    openToWork: "disponible",
  },
  toggles: {
    mute: "silenciar",
    unmute: "activar",
    light: "claro",
    dark: "oscuro",
    loading: "...",
  },
  hub: {
    eyebrow: "tarjeta de presentación",
    role: "desarrollador de software & artista digital",
    // BORRADOR — Marco puede ajustar.
    bio: "Construyo el backend y luego pinto lo que ese backend renderiza. Años entre backend, integración de LLMs y full-stack — y un cuaderno de bocetos que nunca se cerró. Todo lo que hago, y dónde encontrarme, está aquí.",
    chips: ["TypeScript", "Python", "pintura digital"],
    // BORRADOR — registro de actividad de ejemplo; Marco puede ajustar.
    log: [
      "[09:14] shipped   endpoints del gateway llm",
      "[13:02] painted   estudio de retrato",
      "[16:40] fixed     race condition en una cola",
      "[21:55] sketched  ciudad de noche",
    ],
    note: "→ todo está a un clic. pasa el cursor por cualquier cosa — nada se comporta igual dos veces.",
  },
  work: {
    eyebrow: "trabajo seleccionado",
    range: "2020 — 2026",
    whatIDid: "lo que hice",
    outcomeLabel: "resultado",
    linkHint: "abre el proyecto en una pestaña nueva",
    note: "→ pasa el cursor por un título para leer la historia completa: el problema, mi parte, y qué salió.",
  },
  gallery: {
    eyebrow: "galería",
    countJoiner: "mostradas",
    filterAll: "todo",
    dragHint: "arrastra la barra de título para mover · maximiza para resolución completa",
    note: "→ tinta · gouache · digital. cada marco reacciona a su manera.",
  },
  about: {
    eyebrow: "sobre mí",
    // BORRADOR — Marco puede ajustar.
    lead: "Software de oficio, imágenes por compulsión. La ingeniería mantiene honesto al arte; el arte mantiene interesante a la ingeniería.",
    leadAccent: "imágenes por compulsión",
    nowLabel: "ahora",
    // BORRADOR
    now: "Maestría en Ciencias de la Computación en DigiPen · tomando comisiones",
    stackLabel: "stack",
    stack: "TypeScript · Python · React · Node · Postgres · integración de LLMs",
    elsewhereLabel: "en otros lados",
    experienceLabel: "experiencia",
    interestsLabel: "fuera de horario",
    interests: "videojuegos · dibujo · tacos · artes marciales · fanático de los deportes de contacto",
    quirk: "// entreno artes marciales y aún así el pingüino me gana en el sparring",
    photoPlaceholder: "[ foto mía ]",
    disclaimer:
      "Todo el aspecto visual de este portafolio — su diseño, ilustraciones y composición — lo hice yo. Las herramientas de IA se usaron solo como apoyo para el desarrollo de software y la generación de código.",
    note: "→ años de backend. cuaderno de bocetos desde siempre. dos ramas, un repo.",
  },
  contact: {
    eyebrow: "contacto",
    // BORRADOR — Marco puede ajustar.
    lead: "Comisiones abiertas. Roles de ingeniería también.",
    blurb:
      "Cuéntame qué estás construyendo o qué quieres que dibuje. Respondo en uno o dos días.",
    statusLabel: "estado",
    statusValue: "disponible",
    localTimeLabel: "hora local",
    replyTimeLabel: "tiempo de respuesta",
    replyTimeValue: "~24–48h",
    elsewhereLabel: "en otros lados",
    elsewhere: {
      instagram: "@marcobglz — los dibujos",
      linkedin: "marco-bosquez — la experiencia",
      resume: "pdf — una página",
    },
    // BORRADOR
    briefs: [
      "→ contrato de backend / infra / LLM",
      "→ ilustración o comisión de portada",
      "→ tooling para un equipo de arte o de juegos",
    ],
    note: "→ entre más claro el brief, más rápida la respuesta. cuéntame la forma de lo que necesitas.",
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
    cta: "→ volver al inicio",
  },
  errorPage: {
    title: "algo se rompió",
    description: "Ocurrió un error inesperado. Puedes intentar de nuevo, o volver al inicio.",
    retry: "→ intentar de nuevo",
    cta: "→ volver al inicio",
  },
};
