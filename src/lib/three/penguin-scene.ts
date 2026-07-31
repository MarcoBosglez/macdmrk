import * as THREE from "three";

// Builds the penguin easter egg out of basic primitives (spheres for
// the body/belly/feet, a cone for the beak) rather than a loaded 3D
// model file — keeps the site from needing to ship/load a model asset
// for one small decorative detail.
export function buildPenguinScene(): THREE.Group {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x172b22, roughness: 0.6, metalness: 0.1 });
  const bellyMat = new THREE.MeshStandardMaterial({ color: 0xedefec, roughness: 0.6, metalness: 0.05 });
  const beakMat = new THREE.MeshStandardMaterial({ color: 0x55c79a, roughness: 0.5 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x020d08, roughness: 0.3 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 16), bodyMat);
  body.scale.set(0.85, 1.15, 0.85);
  body.name = "body";

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 16), bellyMat);
  belly.scale.set(0.8, 1.05, 0.6);
  belly.position.set(0, -0.05, 0.28);
  belly.name = "belly";

  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 12), beakMat);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.32, 0.52);
  beak.name = "beak";

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), eyeMat);
  eyeL.position.set(-0.16, 0.42, 0.42);
  eyeL.name = "eyeL";
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.16;
  eyeR.name = "eyeR";

  const wingGeo = new THREE.SphereGeometry(0.3, 14, 10);
  const wingL = new THREE.Mesh(wingGeo, bodyMat);
  wingL.scale.set(0.25, 0.9, 0.5);
  wingL.position.set(-0.52, -0.05, 0);
  wingL.rotation.z = 0.4;
  wingL.name = "wingL";
  const wingR = wingL.clone();
  wingR.position.x = 0.52;
  wingR.rotation.z = -0.4;
  wingR.name = "wingR";

  const footGeo = new THREE.SphereGeometry(0.14, 12, 8);
  const footL = new THREE.Mesh(footGeo, beakMat);
  footL.scale.set(1, 0.4, 1.4);
  footL.position.set(-0.18, -0.72, 0.1);
  footL.name = "footL";
  const footR = footL.clone();
  footR.position.x = 0.18;
  footR.name = "footR";

  group.add(body, belly, beak, eyeL, eyeR, wingL, wingR, footL, footR);
  return group;
}
