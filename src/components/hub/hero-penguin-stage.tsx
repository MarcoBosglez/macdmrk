"use client";

import { useRef } from "react";
import { useThreeStage } from "@/lib/three/use-three-stage";
import { buildPenguinScene } from "@/lib/three/penguin-scene";

// Same idea as HeroAvatarStage, but for the little penguin easter egg.
export function HeroPenguinStage() {
  const ref = useRef<HTMLDivElement>(null);
  useThreeStage(ref, buildPenguinScene, { autorotate: true, cameraDistance: 3 });
  return <div ref={ref} className="h-full w-full" />;
}
