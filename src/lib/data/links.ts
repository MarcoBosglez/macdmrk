// The off-site links, in one place so the hub tiles, the about
// "elsewhere" column and the contact rows stay in sync. The résumé
// points at /public/resume.pdf.
export const LINKS = {
  instagram: "https://www.instagram.com/marcobglz/",
  instagramArt: "https://www.instagram.com/macdmrk/",
  linkedin: "https://www.linkedin.com/in/marco-bosquez-5580271a1/",
  github: "https://github.com/MarcoBosglez",
  email: "mark.bosglez@gmail.com",
  resume: "/resume.pdf",
} as const;

// Short display values for the hub link tiles.
export const LINK_VALUES = {
  instagram: "@marcobglz",
  linkedin: "marco-bosquez",
} as const;
