"use client";

import { useEffect, type RefObject } from "react";
import * as THREE from "three";

type Options = {
  autorotate?: boolean;
  cameraDistance?: number;
};

// Mounts a plain (non-React) three.js scene into a container div and
// keeps it rendering until the component unmounts.
//
// This is intentionally NOT @react-three/fiber. An earlier version of
// this site used that library and it crashed Next.js's server render
// ("Cannot read properties of undefined (reading 'ReactCurrentOwner')")
// because @react-three/fiber pokes at React internals that don't exist
// during server-side rendering. Driving three.js by hand inside a
// useEffect sidesteps the whole problem: none of this code runs until
// after the component has mounted in a real browser.
//
// `buildObject` should be a stable function reference (defined at
// module scope, not inline) — it's a dependency of the effect below,
// so a new function identity on every render would tear down and
// rebuild the whole scene every render instead of just once.
export function useThreeStage(
  containerRef: RefObject<HTMLDivElement | null>,
  buildObject: () => THREE.Object3D,
  { autorotate = true, cameraDistance = 2.6 }: Options = {}
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, cameraDistance);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(3, 4, 5);
    scene.add(dirLight);

    const object = buildObject();
    scene.add(object);

    // The container's size isn't known until layout has actually run,
    // and it can change later (window resize, responsive breakpoints),
    // so we measure it now and keep re-measuring via ResizeObserver
    // rather than relying on a single fixed size.
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let raf = 0;
    const animate = () => {
      if (autorotate) object.rotation.y += 0.006;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup runs when the component unmounts (or before the effect
    // re-runs) — without this, navigating away and back would leak a
    // new renderer/canvas every time instead of replacing the old one.
    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [containerRef, buildObject, autorotate, cameraDistance]);
}
