// Marco's public "favourites" playlist, embedded via Spotify's own
// iframe (no API keys, updates itself whenever the playlist changes).
//
// To wire it up: make a PUBLIC playlist on Spotify, hit Share → Copy
// link, and paste just the id here — the part after /playlist/ and
// before the "?". e.g.
//   https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
//                                     ^^^^^^^^^^^^^^^^^^^^^^ this
// A single track works too — set TYPE to "track" and use a track id.
// While this is empty the About page falls back to the plain SONGS
// list and the chrome-bar player button is hidden.
export const SPOTIFY_ID = "";
export const SPOTIFY_TYPE: "playlist" | "track" | "album" | "artist" = "playlist";

export function spotifyEmbedSrc(compact = false): string | null {
  if (!SPOTIFY_ID) return null;
  const params = new URLSearchParams({ utm_source: "generator", theme: "0" });
  return `https://open.spotify.com/embed/${SPOTIFY_TYPE}/${SPOTIFY_ID}?${params}${
    compact ? "&view=list" : ""
  }`;
}
