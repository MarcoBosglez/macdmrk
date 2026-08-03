"use client";

import { useCallback, useRef } from "react";
import type { Object3D } from "three";
import { useThreeStage } from "@/lib/three/use-three-stage";
import { buildPenguinScene, flapPenguinWings } from "@/lib/three/penguin-scene";
import { useSound } from "@/components/providers/sound-provider";

// Same idea as HeroAvatarStage, but for the little penguin easter egg.
export function HeroPenguinStage() {
  const ref = useRef<HTMLDivElement>(null);
  const { playClick } = useSound();

  // Memoized so its identity stays stable across renders — it's a
  // dependency of useThreeStage's effect below, and a fresh function
  // reference every render (e.g. from `muted` toggling, since playClick
  // comes from context) would otherwise tear down and rebuild the whole
  // three.js scene on every unrelated re-render.
  const handleClick = useCallback(
    (object: Object3D) => {
      playClick("honk");
      flapPenguinWings(object);
    },
    [playClick]
  );

  useThreeStage(ref, buildPenguinScene, {
    autorotate: true,
    cameraDistance: 3,
    onClick: handleClick,
  });

  return <div ref={ref} className="h-full w-full cursor-pointer" />;
}
