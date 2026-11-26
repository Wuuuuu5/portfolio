"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { equipment, type EquipmentId } from "@/lib/setup";
import type { ModelProps } from "./parts";

const IDS = equipment.map((e) => e.id);

/** The item a mesh belongs to: its own name, or the nearest named ancestor's. */
function itemFor(object: THREE.Object3D | null): EquipmentId | null {
  for (let o = object; o; o = o.parent) {
    const name = o.name.toLowerCase();
    const id = IDS.find((candidate) => name.startsWith(candidate));
    if (id) return id;
  }
  return null;
}

/**
 * A custom .glb of the player (set `modelUrl` in lib/setup.ts). Meshes are
 * matched to items by name; anything unnamed (skin, hair) blocks the pointer
 * the same way the built-in model's body does.
 */
export default function GLBPlayer({
  url,
  active,
  colors,
  onHover,
  onSelect,
  onAnchors,
}: ModelProps & { url: string }) {
  const { scene } = useGLTF(url);

  // Our own copy, scaled to 1.8m tall with the feet on the floor, and with
  // its own materials so highlighting never leaks into the cached original.
  const model = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        o.material = Array.isArray(o.material)
          ? o.material.map((m) => m.clone())
          : o.material.clone();
      }
    });
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const scale = size.y > 0 ? 1.8 / size.y : 1;
    root.scale.setScalar(scale);
    const center = box.getCenter(new THREE.Vector3());
    root.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
    return root;
  }, [scene]);

  // Pin each card to the centre of its item.
  useEffect(() => {
    model.updateMatrixWorld(true);
    const boxes: Partial<Record<EquipmentId, THREE.Box3>> = {};
    model.traverse((o) => {
      const id = o instanceof THREE.Mesh ? itemFor(o) : null;
      if (!id) return;
      (boxes[id] ??= new THREE.Box3()).expandByObject(o);
    });
    const anchors: Partial<Record<EquipmentId, [number, number, number]>> = {};
    for (const [id, box] of Object.entries(boxes)) {
      const c = box.getCenter(new THREE.Vector3());
      anchors[id as EquipmentId] = [c.x, c.y, c.z];
    }
    onAnchors(anchors);
  }, [model, onAnchors]);

  // Glow the active item's materials in the accent colour.
  useEffect(() => {
    const accent = new THREE.Color(colors.accent);
    model.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const lit = itemFor(o) === active;
      const materials = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of materials) {
        if ("emissive" in m && m.emissive instanceof THREE.Color) {
          m.emissive.copy(accent);
          (m as THREE.MeshStandardMaterial).emissiveIntensity = lit ? 0.45 : 0;
        }
      }
    });
  }, [model, active, colors.accent]);

  return (
    <primitive
      object={model}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        const id = itemFor(e.object);
        onHover(id);
        document.body.style.cursor = id ? "pointer" : "";
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        const id = itemFor(e.object);
        if (id) onSelect(id);
      }}
    />
  );
}
