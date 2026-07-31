import * as THREE from "three";

// Builds the hero avatar: a solid faceted icosahedron (a 20-sided
// die shape) with a slightly larger see-through wireframe copy on top
// of it, which is what gives it that "hologram" look. Returned as a
// plain THREE.Group so useThreeStage can drop it straight into a scene.
export function buildIcosahedronScene(): THREE.Group {
  const group = new THREE.Group();

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.6, 1),
    new THREE.MeshStandardMaterial({
      color: 0x2e9973,
      roughness: 0.45,
      metalness: 0.25,
      flatShading: true,
    })
  );
  core.name = "core";

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.64, 1),
    new THREE.MeshBasicMaterial({
      color: 0x9fe8cc,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    })
  );
  wire.name = "wireframe";

  group.add(core, wire);
  return group;
}
