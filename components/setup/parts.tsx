"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
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

/** A shader uniform shared by every material in one item: the world height
    the colour has filled up to. Below it is lit, above it is idle. */
/** Nothing filled. */
const EMPTY = -1e4;

class Level {
  value = EMPTY;
  set(value: number) {
    this.value = value;
  }
}

const NEVER_LIT = new Level();

/** How long the colour takes to rise from the bottom of an item to the top. */
const RISE_MS = 900;
/** Height of the bright edge riding on top of the rising colour (metres). */
const GLOW_BAND = 0.12;

type PartState = { lit: boolean; colors: ThemeColors; level: Level };

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
  const lit = active === id;
  const group = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  // One object for the item's lifetime: every material in it holds this same
  // uniform, so moving the level here moves the colour in all of them.
  const [level] = useState(() => new Level());
  const rise = useRef<{ start: number; from: number; to: number } | null>(null);

  // On hover, measure the item's height in the world and start the rise.
  useEffect(() => {
    if (!lit || !group.current) {
      rise.current = null;
      level.set(EMPTY);
      invalidate();
      return;
    }
    const box = new THREE.Box3().setFromObject(group.current);
    // Past the top, plus the biggest random box delay, plus the flash.
    const to = box.max.y + CELL * 2 + GLOW_BAND * 2;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      level.set(to);
    } else {
      rise.current = { start: performance.now(), from: box.min.y - GLOW_BAND, to };
      level.set(rise.current.from);
    }
    invalidate();
  }, [lit, level, invalidate]);

  // Frames are drawn on demand, so keep asking for one until the rise is done.
  useFrame(() => {
    const r = rise.current;
    if (!r) return;
    const t = Math.min((performance.now() - r.start) / RISE_MS, 1);
    const eased = 1 - (1 - t) ** 3;
    level.set(r.from + (r.to - r.from) * eased);
    if (t < 1) invalidate();
    else rise.current = null;
  });

  return (
    <group
      ref={group}
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
      <PartContext.Provider value={{ lit, colors, level }}>
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
      <PartContext.Provider value={{ lit: false, colors, level: NEVER_LIT }}>
        {children}
      </PartContext.Provider>
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
  varying float vWorldY;
  void main() {
    vPos = position;
    vNormal = normal;
    vWorldY = (modelMatrix * vec4(position, 1.0)).y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* Shared by both materials. Each box lights at its own height `y`: lit once
   the fill level passes it, and flashing bright for a moment after. */
const fillGlsl = /* glsl */ `
  uniform float uLevel;
  uniform float uBand;
  uniform vec3 uGlow;
  varying float vWorldY;
  float litAt(float y) { return step(y, uLevel); }
  vec3 withGlow(vec3 color, float lit, float y) {
    float flash = lit * (1.0 - smoothstep(0.0, uBand, uLevel - y));
    return mix(color, uGlow, flash * 0.65);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uLineIdle;
  uniform vec3 uFillIdle;
  uniform vec3 uLineLit;
  uniform vec3 uFillLit;
  uniform float uLineAlphaIdle;
  uniform float uFillAlphaIdle;
  uniform float uLineAlphaLit;
  uniform float uFillAlphaLit;
  uniform float uCell;
  uniform vec3 uHalf;
  uniform mat4 modelMatrix;
  varying vec3 vPos;
  varying vec3 vNormal;
  ${fillGlsl}
  void main() {
    vec3 n = abs(vNormal);
    // Offset by the half-size so grid lines land exactly on the box's edges.
    vec3 p = (vPos + uHalf) / uCell;
    vec2 c = n.x > 0.5 ? p.yz : (n.y > 0.5 ? p.xz : p.xy);
    vec2 g = abs(fract(c - 0.5) - 0.5) / fwidth(c);
    float line = 1.0 - min(min(g.x, g.y), 1.0);

    // Which voxel this pixel belongs to, and that voxel's height in the
    // world, so a whole box lights at once. A little random delay per box
    // makes them pop on one by one instead of in flat rows.
    vec3 cell = clamp(floor(p), vec3(0.0), max(uHalf * 2.0 / uCell - 1.0, vec3(0.0)));
    vec3 centre = (modelMatrix * vec4((cell + 0.5) * uCell - uHalf, 1.0)).xyz;
    float delay = fract(sin(dot(centre, vec3(127.1, 311.7, 74.7))) * 43758.5453);
    float y = centre.y + delay * uCell * 2.0;

    float lit = litAt(y);
    vec3 fill = mix(uFillIdle, uFillLit, lit);
    vec3 seam = mix(uLineIdle, uLineLit, lit);
    float fillA = mix(uFillAlphaIdle, uFillAlphaLit, lit);
    float seamA = mix(uLineAlphaIdle, uLineAlphaLit, lit);
    gl_FragColor = vec4(withGlow(mix(fill, seam, line), lit, y), mix(fillA, seamA, line));
  }
`;

const flatFragmentShader = /* glsl */ `
  uniform vec3 uIdle;
  uniform vec3 uLit;
  uniform float uIdleAlpha;
  uniform float uCell;
  ${fillGlsl}
  void main() {
    // No voxels on the racket, so it lights in voxel-high steps instead.
    float y = floor(vWorldY / uCell) * uCell;
    float lit = litAt(y);
    gl_FragColor = vec4(withGlow(mix(uIdle, uLit, lit), lit, y), mix(uIdleAlpha, 1.0, lit));
  }
`;

const GLOW = new THREE.Color("#ffffff");

/**
 * Gives a shader material ONE uniforms object for its whole life. three.js
 * keeps the object it compiled the shader with and ignores replacements, so
 * values are changed in place instead: `update` re-runs whenever `deps`
 * change (theme, tone), and the item's fill level is copied in every frame.
 */
function useStableUniforms<U extends Record<string, THREE.IUniform>>(
  create: () => U,
  update: (u: U) => void,
  deps: unknown[],
  level: Level,
) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const [uniforms] = useState(create);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const u = material.current?.uniforms as U | undefined;
    if (!u) return;
    update(u);
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `deps` lists what `update` reads
  }, deps);

  useFrame(() => {
    const u = material.current?.uniforms.uLevel;
    if (u) writeUniform(u, level.value);
  });

  return { material, uniforms };
}

function writeUniform(uniform: THREE.IUniform, value: unknown) {
  uniform.value = value;
}

/** Idle: a faint see-through lattice. Lit: a solid block in the item's tone
    with darker voxel seams. */
function voxelColours(tone: string | undefined, colors: ThemeColors | undefined) {
  const dim = new THREE.Color(colors?.fgDim ?? "#4a5b7a");
  const fill = new THREE.Color(tone ?? colors?.accent ?? "#1d4ed8");
  const seam = fill.clone().lerp(new THREE.Color(colors?.fg ?? "#0b1b3a"), 0.35);
  return { dim, fill, seam };
}

/**
 * The voxel material. The colour climbs from idle to lit box by box as the
 * item's fill level rises past each voxel.
 */
function VoxelMaterial({
  size,
  tone,
  cell = CELL,
}: {
  size: [number, number, number];
  tone?: string;
  cell?: number;
}) {
  const state = useContext(PartContext);
  const lit = state?.lit ?? false;
  const colors = state?.colors;
  const [w, h, d] = size;

  const { material, uniforms } = useStableUniforms(
    () => {
      const { dim, fill, seam } = voxelColours(tone, colors);
      return {
        uLineIdle: { value: dim },
        uFillIdle: { value: dim.clone() },
        uLineLit: { value: seam },
        uFillLit: { value: fill },
        uLineAlphaIdle: { value: 0.42 },
        uFillAlphaIdle: { value: 0.035 },
        uLineAlphaLit: { value: 0.9 },
        uFillAlphaLit: { value: 0.96 },
        uCell: { value: cell },
        uHalf: { value: new THREE.Vector3(w / 2, h / 2, d / 2) },
        uLevel: { value: EMPTY },
        uBand: { value: GLOW_BAND },
        uGlow: { value: GLOW },
      };
    },
    (u) => {
      const { dim, fill, seam } = voxelColours(tone, colors);
      u.uLineIdle.value.copy(dim);
      u.uFillIdle.value.copy(dim);
      u.uLineLit.value.copy(seam);
      u.uFillLit.value.copy(fill);
      u.uHalf.value.set(w / 2, h / 2, d / 2);
      u.uCell.value = cell;
    },
    [tone, colors, w, h, d, cell],
    state?.level ?? NEVER_LIT,
  );

  return (
    <shaderMaterial
      ref={material}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent
      depthWrite={lit}
    />
  );
}

/** One voxel block. `size` should be whole multiples of `cell`. */
export function VoxelBox({
  size,
  position,
  tone,
  cell,
}: {
  size: [number, number, number];
  position: [number, number, number];
  /** Fill colour when lit; defaults to the accent. */
  tone?: string;
  /** Voxel size for the grid lines (metres); defaults to CELL. Smaller
      voxels let one item carry finer detail, like the bag's print. */
  cell?: number;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <VoxelMaterial size={size} tone={tone} cell={cell} />
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
  const idle = state?.colors.fgDim ?? tone;

  const { material, uniforms } = useStableUniforms(
    () => ({
      uIdle: { value: new THREE.Color(idle) },
      uLit: { value: new THREE.Color(tone) },
      uIdleAlpha: { value: idleOpacity },
      uCell: { value: CELL },
      uLevel: { value: EMPTY },
      uBand: { value: GLOW_BAND },
      uGlow: { value: GLOW },
    }),
    (u) => {
      u.uIdle.value.set(idle);
      u.uLit.value.set(tone);
      u.uIdleAlpha.value = idleOpacity;
    },
    [idle, tone, idleOpacity],
    state?.level ?? NEVER_LIT,
  );

  return (
    <shaderMaterial
      ref={material}
      vertexShader={vertexShader}
      fragmentShader={flatFragmentShader}
      uniforms={uniforms}
      transparent
      depthWrite={lit}
      side={THREE.DoubleSide}
    />
  );
}
