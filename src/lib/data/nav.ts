// Structural nav data only — hrefs never change between languages.
// The actual visible label comes from the active Dictionary (see
// lib/i18n/dictionaries.ts) via t.nav[key], so TopBar and
// MobileNavBubbles both stay in sync automatically when the language
// toggle is used.
export type NavKey = "about" | "work" | "gallery" | "faq" | "contact";

export type NavItem = {
  key: NavKey;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { key: "about", href: "/about" },
  { key: "work", href: "/work" },
  { key: "gallery", href: "/gallery" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
];
