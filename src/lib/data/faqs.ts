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
];
