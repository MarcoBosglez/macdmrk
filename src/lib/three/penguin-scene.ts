import * as THREE from "three";

// Builds the penguin easter egg out of basic primitives (spheres for
// the body/head/belly/feet, a cone for the beak) rather than a loaded
// 3D model file — keeps the site from needing to ship/load a model
// asset for one small decorative detail. A distinct head (separate
// from the torso, with the face/eyes/beak on it) is what actually
// sells "cute mascot" instead of "blob with a cone stuck on it" — the
// original version put everything on one sphere and read as goofy.
export function buildPenguinScene(): THREE.Group {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x172b22, roughness: 0.55, metalness: 0.1 });
  const bellyMat = new THREE.MeshStandardMaterial({ color: 0xf2ede0, roughness: 0.6, metalness: 0.05 });
  const beakMat = new THREE.MeshStandardMaterial({ color: 0x55c79a, roughness: 0.45 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x020d08, roughness: 0.25 });
  const eyeHighlightMat = new THREE.MeshStandardMaterial({
    color: 0xf2ede0,
    roughness: 0.2,
    emissive: 0xf2ede0,
    emissiveIntensity: 0.15,
  });

  // Torso — squat and slightly egg-shaped, shifted down to leave room
  // for a separate head on top instead of merging into one big sphere.
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 18), bodyMat);
  body.scale.set(0.82, 0.95, 0.82);
  body.position.set(0, -0.2, 0);
  body.name = "body";

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 16), bellyMat);
  belly.scale.set(0.72, 1.15, 0.55);
  belly.position.set(0, -0.08, 0.3);
  belly.name = "belly";

  // Head — a distinct, proportionally large sphere (cute-mascot ratio)
  // rather than the beak/eyes sitting directly on the torso.
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 22, 16), bodyMat);
  head.scale.set(0.95, 0.92, 0.95);
  head.position.set(0, 0.36, 0.02);
  head.name = "head";

  // Small face patch so the cream belly color reads as continuing up
  // onto the chin, the way a real penguin's coloring does.
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 14), bellyMat);
  face.scale.set(0.75, 0.8, 0.62);
  face.position.set(0, 0.28, 0.24);
  face.name = "face";

  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.17, 12), beakMat);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.35, 0.42);
  beak.name = "beak";

  const eyeGeo = new THREE.SphereGeometry(0.048, 12, 10);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.13, 0.42, 0.32);
  eyeL.name = "eyeL";
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.13;
  eyeR.name = "eyeR";

  // Tiny catchlight on each eye — cheap trick that makes a flat matte
  // sphere read as a glossy, alive-looking eye instead of a black dot.
  const highlightGeo = new THREE.SphereGeometry(0.014, 8, 8);
  const highlightL = new THREE.Mesh(highlightGeo, eyeHighlightMat);
  highlightL.position.set(-0.11, 0.445, 0.355);
  highlightL.name = "eyeHighlightL";
  const highlightR = highlightL.clone();
  highlightR.position.x = 0.15;
  highlightR.name = "eyeHighlightR";

  // Wings — slimmer and swept back against the body instead of the
  // original wide, flat paddles sticking straight out.
  const wingGeo = new THREE.SphereGeometry(0.28, 14, 10);
  const wingL = new THREE.Mesh(wingGeo, bodyMat);
  wingL.scale.set(0.18, 0.8, 0.32);
  wingL.position.set(-0.46, -0.22, -0.02);
  // Negative: the wing's top (the "shoulder", near the body) tucks
  // toward the torso while the bottom (the free tip) swings slightly
  // away — the positive sign had that backward, reading as an
  // upside-down/inverted wing.
  wingL.rotation.z = -0.55;
  wingL.rotation.x = -0.15;
  wingL.name = "wingL";
  const wingR = wingL.clone();
  wingR.position.x = 0.46;
  wingR.rotation.z = 0.55;
  wingR.name = "wingR";

  // Feet — tucked closer under the body (the old -0.86 left a visible
  // gap below the torso), rotated 90° about X so the flat "sole" faces
  // forward instead of down (rotating swaps which world axis the thin
  // 0.38 vs long 1.5 scale lands on), and pushed out in front of the
  // belly/beak (z ≈ 0.5 at their frontmost) rather than tucked
  // underneath, like legs stretched out in a seated pose.
  const footGeo = new THREE.SphereGeometry(0.13, 12, 8);
  const footL = new THREE.Mesh(footGeo, beakMat);
  footL.scale.set(1, 1.5, 1.5);
  footL.position.set(-0.14, -0.44, 0.42);
  footL.rotation.x = Math.PI / 2;
  footL.name = "footL";
  const footR = footL.clone();
  footR.position.x = 0.14;
  footR.name = "footR";

  group.add(
    body,
    belly,
    head,
    face,
    beak,
    eyeL,
    eyeR,
    highlightL,
    highlightR,
    wingL,
    wingR,
    footL,
    footR
  );
  return group;
}

// Resting wing pose from buildPenguinScene above (wingR is always the
// mirror of wingL, negated).
const WING_REST_Z = -0.55;
const WING_UP_Z = -0.05;
const WING_DOWN_Z = -0.95;

// Click reaction: a quick raise-then-slap-down flap, then settle back
// to the resting pose — driven by its own short-lived rAF loop rather
// than the shared per-frame render loop in use-three-stage.ts, since
// that loop only knows how to spin the whole group and has no notion
// of individual parts. `group.userData.flapToken` lets a new click
// cancel an in-flight flap instead of two loops fighting over the same
// rotation value.
export function flapPenguinWings(group: THREE.Object3D) {
  const wingL = group.getObjectByName("wingL");
  const wingR = group.getObjectByName("wingR");
  if (!wingL || !wingR) return;

  const token = Symbol("flap");
  group.userData.flapToken = token;

  const start = performance.now();
  const upMs = 90;
  const downMs = 140;
  const settleMs = 220;
  const total = upMs + downMs + settleMs;

  function tick(now: number) {
    if (group.userData.flapToken !== token) return;
    const elapsed = now - start;

    let z: number;
    if (elapsed < upMs) {
      z = THREE.MathUtils.lerp(WING_REST_Z, WING_UP_Z, elapsed / upMs);
    } else if (elapsed < upMs + downMs) {
      z = THREE.MathUtils.lerp(WING_UP_Z, WING_DOWN_Z, (elapsed - upMs) / downMs);
    } else if (elapsed < total) {
      z = THREE.MathUtils.lerp(WING_DOWN_Z, WING_REST_Z, (elapsed - upMs - downMs) / settleMs);
    } else {
      z = WING_REST_Z;
    }

    wingL!.rotation.z = z;
    wingR!.rotation.z = -z;

    if (elapsed < total) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
