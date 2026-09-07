// A short "on repeat" list shown on the About page. `url` is optional
// (Spotify / YouTube / wherever) — rows without one render as plain
// text. These are PLACEHOLDERS — Marco to replace with real picks.
export type Song = {
  artist: string;
  title: string;
  url?: string;
};

export const SONGS: Song[] = [
  { artist: "—", title: "add a favourite" },
  { artist: "—", title: "add a favourite" },
  { artist: "—", title: "add a favourite" },
  { artist: "—", title: "add a favourite" },
];
