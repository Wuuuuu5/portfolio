"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { EquipmentId } from "@/lib/setup";
import type { ThemeColors } from "./useThemeColors";

/** Size of one voxel: the player is ~30 voxels tall. */
export const CELL = 0.06;

/** What every model (built-in or GLB) receives from the scene. */
export type ModelProps = {
  active: EquipmentId | null;
  colors: ThemeColors;
  onHover: (id: EquipmentId | null) => void;
  onSelect: (id: EquipmentId) => void;
  /** Where each item's leader line starts, in the model's own space. */
  onAnchors: (anchors: Partial<Record<EquipmentId, [number, number, number]>>) => void;
};

type Handlers = Pick<ModelProps, "onHover" | "onSelect">;

type PartState = { lit: boolean; colors: ThemeColors };

const PartContext = createContext<PartState | null>(null);

function setCursor(value: string) {
  document.body.style.cursor = value;
}

/**
 * One piece of equipment. Pointer events land on the meshes inside it, so
 * hover detection is per item: R3F raycasts every mesh and the nearest hit
 * that has a handler wins.
 */
export function Part({
  id,
  active,
  colors,
  onHover,
  onSelect,
  children,
}: Handlers & {
  id: EquipmentId;
  active: EquipmentId | null;
  colors: ThemeColors;
  children: ReactNode;
}) {
  return (
    <group
      name={id}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(id);
        setCursor("pointer");
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(null);
        setCursor("");
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      <PartContext.Provider value={{ lit: active === id, colors }}>
        {children}
      </PartContext.Provider>
    </group>
  );
}

/**
 * Skin, head and arms. They take part in raycasting only to BLOCK it:
 * pointing at an arm in front of the jersey must not pick the jersey.
 */
export function Blocker({
  colors,
  onHover,
  children,
}: Pick<ModelProps, "onHover" | "colors"> & { children: ReactNode }) {
  return (
    <group
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover(null);
        setCursor("");
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => e.stopPropagation()}
    >
      <PartContext.Provider value={{ lit: false, colors }}>{children}</PartContext.Provider>
    </group>
  );
}

/* ---------- the voxel look ----------
   Instead of thousands of tiny cubes, each block is ONE box whose faces draw
   a grid at voxel spacing. Unlit, it reads as a see-through lattice of cubes;
   lit (its item is active) it fills solid in the accent colour. */

const vertexShader = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vNormal;
  void main() {
    vPos = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uLine;
  uniform vec3 uFill;
  uniform float uLineAlpha;
  uniform float uFillAlpha;
  uniform float uCell;
  uniform vec3 uHalf;
  varying vec3 vPos;
  varying vec3 vNormal;
  void main() {
    vec3 n = abs(vNormal);
    // Offset by the half-size so grid lines land exactly on the box's edges.
    vec3 p = (vPos + uHalf) / uCell;
    vec2 c = n.x > 0.5 ? p.yz : (n.y > 0.5 ? p.xz : p.xy);
    vec2 g = abs(fract(c - 0.5) - 0.5) / fwidth(c);
    float line = 1.0 - min(min(g.x, g.y), 1.0);
    gl_FragColor = vec4(mix(uFill, uLine, line), mix(uFillAlpha, uLineAlpha, line));
  }
`;

/**
 * The voxel material, declared as JSX. Its uniforms are rebuilt from props
 * whenever the item lights up or the theme changes; R3F swaps them in and
 * redraws, so nothing is mutated by hand.
 */
function VoxelMaterial({ size, tone }: { size: [number, number, number]; tone?: string }) {
  const state = useContext(PartContext);
  const lit = state?.lit ?? false;
  const colors = state?.colors;
  const [w, h, d] = size;

  const uniforms = useMemo(() => {
    const dim = new THREE.Color(colors?.fgDim ?? "#4a5b7a");
    // Lit: a solid block in the item's tone with darker voxel seams.
    // Idle: a faint see-through lattice.
    const fill = lit ? new THREE.Color(tone ?? colors?.accent ?? "#1d4ed8") : dim;
    const line = lit ? fill.clone().lerp(new THREE.Color(colors?.fg ?? "#0b1b3a"), 0.35) : dim;
    return {
      uLine: { value: line },
      uFill: { value: fill },
      uLineAlpha: { value: lit ? 0.9 : 0.42 },
      uFillAlpha: { value: lit ? 0.96 : 0.035 },
      uCell: { value: CELL },
      uHalf: { value: new THREE.Vector3(w / 2, h / 2, d / 2) },
    };
  }, [lit, tone, colors, w, h, d]);

  return (
    <shaderMaterial
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent
      depthWrite={lit}
    />
  );
}

/** One voxel block. `size` should be whole multiples of CELL. */
export function VoxelBox({
  size,
  position,
  tone,
}: {
  size: [number, number, number];
  position: [number, number, number];
  /** Fill colour when lit; defaults to the accent. */
  tone?: string;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <VoxelMaterial size={size} tone={tone} />
    </mesh>
  );
}

/** A flat voxel-gridded disc on the floor (lies in its local XY plane). */
export function VoxelDisc({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} raycast={() => null}>
      <circleGeometry args={[radius, 48]} />
      <VoxelMaterial size={[0, 0, 0]} />
    </mesh>
  );
}

/**
 * For the smooth parts (racket frame, strings, shaft): a faint outline colour
 * while idle, solid flat colour while lit.
 */
export function FlatMaterial({ tone, idleOpacity = 0.45 }: { tone: string; idleOpacity?: number }) {
  const state = useContext(PartContext);
  const lit = state?.lit ?? false;
  return (
    <meshBasicMaterial
      color={lit ? tone : state?.colors.fgDim ?? tone}
      transparent
      opacity={lit ? 1 : idleOpacity}
      depthWrite={lit}
      side={THREE.DoubleSide}
    />
  );
}
