// Nav Sections
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
