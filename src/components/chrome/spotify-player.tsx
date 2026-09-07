"use client";

import { useEffect, useRef, useState } from "react";
import { Music, X } from "lucide-react";
import { spotifyEmbedSrc } from "@/lib/data/spotify";

// A site-wide mini music player. Lives in the root layout, so once the
// visitor hits play the track keeps going as they move between pages
// (the layout — and this iframe — never unmounts). Browsers block audio
// autoplay, so it can't start on its own; instead it pops itself open
// once per tab session, just after the intro, so the play button is
// right there. Renders nothing until a playlist id is set in
// src/lib/data/spotify.ts.
const GREETED_KEY = "mb-music-greeted";

export function SpotifyPlayer() {
  const src = spotifyEmbedSrc(true);
  const [open, setOpen] = useState(false);
  // Once the iframe has been shown once, keep it mounted (just hidden)
  // so closing the panel doesn't stop playback.
  const mountedOnce = useRef(false);
  if (open) mountedOnce.current = true;

  useEffect(() => {
    if (!src) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let greeted = true;
    try {
      greeted = sessionStorage.getItem(GREETED_KEY) === "1";
    } catch {
      /* storage blocked — just don't auto-open */
    }
    if (greeted) return;
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(GREETED_KEY, "1");
      } catch {
        /* ignore */
      }
      setOpen(true);
    }, 3000);
    return () => clearTimeout(t);
  }, [src]);

  if (!src) return null;

  return (
    <div className="fixed top-[64px] right-4 z-40 flex flex-col items-end gap-2 md:top-[72px] md:right-[26px]">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Hide music player" : "Show music player"}
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-glass text-accent [backdrop-filter:blur(16px)_saturate(1.3)] transition-transform duration-200 hover:-translate-y-0.5 hover:rotate-6"
      >
        {open ? <X className="h-3.5 w-3.5" /> : <Music className="h-3.5 w-3.5" />}
      </button>

      <div
        hidden={!open && !mountedOnce.current}
        className={`w-[320px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] border border-line bg-panel [backdrop-filter:blur(22px)] [box-shadow:var(--shadow)] ${
          open ? "" : "pointer-events-none absolute h-0 w-0 opacity-0"
        }`}
      >
        <iframe
          title="Spotify — favourites"
          src={src}
          width="100%"
          height={152}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="block border-0"
        />
      </div>
    </div>
  );
}
