import type { Localized } from "@/lib/i18n/dictionaries";

export type Faq = {
  q: Localized;
  a: Localized;
};

export const FAQS: Faq[] = [
  {
    q: { en: "Do you take freelance work?", es: "¿Aceptas trabajo freelance?" },
    a: {
      en: "Yes, I take freelance work for Web Development & Design alike.",
      es: "Si, tomo trabajo freelance para desarrollo web y diseño igual.",
    },
  },
  {
    q: { en: "What stack do you build with?", es: "¿Con qué stack trabajas?" },
    a: {
      en: "TypeScript, Python, and whatever the problem actually needs. I have a full-stack profile",
      es: "TypeScript, Python, y lo que el problema realmente necesite. Tengo un perfil full-stack",
    },
  },
  {
    q: { en: "Do you take art commissions?", es: "¿Aceptas comisiones de arte?" },
    a: {
      en: "Yes, mostly character work. See gallery if you like my style!",
      es: "Sí, sobre todo diseño de personajes. Revisa la galería para ver si te gusta mi estilo!",
    },
  },
  {
    q: { en: "Where can I see more of your art?", es: "¿Dónde puedo ver más de tu arte?" },
    a: {
      en: "Instagram and Twitter, linked in the 'about' section.",
      es: "Instagram y Twitter, enlazados en la sección 'sobre mí'.",
    },
  },
  // Drafted — review/edit before treating as final copy.
  {
    q: { en: "How long does a typical project take?", es: "¿Cuánto tarda un proyecto típico?" },
    a: {
      en: "Depends on scope — a small site or a single illustration is usually 1-2 weeks, bigger builds take longer. I'll give you a real estimate once I know what you need.",
      es: "Depende del alcance — un sitio pequeño o una sola ilustración normalmente toma 1-2 semanas, proyectos más grandes toman más tiempo. Te doy un estimado real en cuanto sepa qué necesitas.",
    },
  },
  {
    q: { en: "How much do you charge?", es: "¿Cuánto cobras?" },
    a: {
      en: "It varies by project — reach out with what you have in mind and I'll put together a quote.",
      es: "Varía según el proyecto — cuéntame qué tienes en mente y te preparo una cotización.",
    },
  },
  {
    q: { en: "Do you work with clients outside Mexico/the US?", es: "¿Trabajas con clientes fuera de México/EE.UU.?" },
    a: {
      en: "Yes, everything's remote-friendly — I've worked with clients across time zones before.",
      es: "Sí, todo lo puedo hacer remoto — ya he trabajado con clientes en distintas zonas horarias.",
    },
  },
  {
    q: { en: "How fast do you respond to messages?", es: "¿Qué tan rápido respondes mensajes?" },
    a: {
      en: "Usually within a day or two. Use the contact form and I'll get back to you.",
      es: "Normalmente en uno o dos días. Usa el formulario de contacto y te respondo.",
    },
  },
];
