// Nav Sections
export type NavKey = "home" | "work" | "gallery" | "about" | "contact";

export type NavItem = {
  key: NavKey;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/" },
  { key: "work", href: "/work" },
  { key: "about", href: "/about" },
  { key: "gallery", href: "/gallery" },
  { key: "contact", href: "/contact" },
];

// Routes that run a reduced chrome bar — no section nav, no mobile nav
// bubble — because the page either carries its own navigation (a
// project's dedicated page) or isn't part of the portfolio's section
// flow at all (the private /lift and /meal tools, which also aren't
// in NAV_ITEMS above).
export function isMinimalChromePage(pathname: string) {
  return /^\/work\/[^/]+$/.test(pathname) || pathname === "/lift" || pathname === "/meal";
}
