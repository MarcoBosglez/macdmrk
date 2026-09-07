// Marco's public "favourites" playlist

export const SPOTIFY_ID = "37i9dQZF1Epow51SXCzR80";
export const SPOTIFY_TYPE: "playlist" | "track" | "album" | "artist" = "playlist";

export function spotifyEmbedSrc(compact = false): string | null {
  if (!SPOTIFY_ID) return null;
  const params = new URLSearchParams({ utm_source: "generator", theme: "0" });
  return `https://open.spotify.com/embed/${SPOTIFY_TYPE}/${SPOTIFY_ID}?${params}${
    compact ? "&view=list" : ""
  }`;
}
