// Structural nav data only — hrefs never change between languages. The
// visible label comes from the active Dictionary via t.nav[key], so the
// ChromeBar pill group and MobileNavBubbles stay in sync when the
// language toggle is used. The "home" pill is labelled "hub".
export type NavKey = "home" | "work" | "gallery" | "about" | "contact";

export type NavItem = {
  key: NavKey;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/" },
  { key: "work", href: "/work" },
  { key: "gallery", href: "/gallery" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];
