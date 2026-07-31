"use client";

import { useRef } from "react";
import { useThreeStage } from "@/lib/three/use-three-stage";
import { buildIcosahedronScene } from "@/lib/three/icosahedron-scene";

// A plain div that useThreeStage turns into a live, autorotating
// three.js canvas showing the icosahedron built in icosahedron-scene.ts.
export function HeroAvatarStage() {
  const ref = useRef<HTMLDivElement>(null);
  useThreeStage(ref, buildIcosahedronScene, { autorotate: true, cameraDistance: 2.4 });
  return <div ref={ref} className="h-full w-full" />;
}
