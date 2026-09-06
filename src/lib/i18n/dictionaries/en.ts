import type { Dictionary } from "./types";

export const en: Dictionary = {
  nav: {
    home: "HOME",
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
    crtEnable: "[ crt on ]",
    crtDisable: "[ crt off ]",
  },
  hero: {
    role: "software dev & digital artist",
    origin: "🇲🇽 Mexico City → Seattle, WA",
    description:
      "",
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
    dragHint: "drag the title bar to move",
    gridHint: "maximize a piece to see it at full resolution, no filters",
  },
  about: {
    photoPlaceholder: "photo.jpg",
    bio: "Born in Mexico City, now based in Seattle, WA for my Master's.\n\nSoftware Engineer and Digital Artist pursuing my M.S. in Computer Science at DigiPen, graduating fall 2027. I specialize in backend development, LLM integration, full-stack web development, and digital art.",
    skills: "nodejs · typescript · python · react · rest apis · llm integration · sql · git · clip studio paint · affinity",
    interests: "videogames · drawing · tacos · martial arts · combat-sports superfan",
    quirk: "// trains martial arts, still loses sparring to the penguin",
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
