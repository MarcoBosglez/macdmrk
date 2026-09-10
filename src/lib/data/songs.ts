// The "on repeat" list on the About page. `url` is optional — rows
// without one render as plain text.
export type Song = {
  artist: string;
  title: string;
  url?: string;
};

export const SONGS: Song[] = [
  { artist: "— Steve Lacy", title: "Sunshine" },
  { artist: "— Her's", title: "What Once Was" },
  { artist: "— Bad Bunny", title: "EL CLúB" },
  { artist: "— Malcolm Todd", title: "Roommates" },
];
