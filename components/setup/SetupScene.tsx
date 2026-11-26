"use client";

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { modelUrl, type EquipmentId } from "@/lib/setup";
import PlayerModel from "./PlayerModel";

// The GLTF/Draco/Meshopt loaders are only fetched if a custom model is set,
// so the voxel player's bundle doesn't carry them.
const GLBPlayer = lazy(() => import("./GLBPlayer"));
import { Blocker, VoxelDisc } from "./parts";
import { useThemeColors } from "./useThemeColors";

type Anchors = Partial<Record<EquipmentId, [number, number, number]>>;

/** Screen position (px, relative to the canvas) of the active item, or null. */
export type LeaderPoint = { x: number; y: number } | null;

type Props = {
  active: EquipmentId | null;
  onHover: (id: EquipmentId | null) => void;
  onSelect: (id: EquipmentId) => void;
  /** Called on every drawn frame with where the leader line should start. */
  onLeader: (point: LeaderPoint) => void;
  reducedMotion: boolean;
};

/** Turn the player a little so the first view is three-quarter, not flat on,
    with their racket (right) side toward the camera. */
const START_TURN = 0.45;

/** Camera circling the player: negative = anticlockwise seen from above,
    positive = clockwise. 2 = one lap every 30s. Off for reduced motion. */
const ORBIT_SPEED = -0.4;

/**
 * Projects the active item's anchor to screen pixels each time a frame is
 * drawn, so the leader line follows the item as the player is dragged round.
 */
function LeaderTracker({
  anchor,
  onLeader,
}: {
  anchor: [number, number, number] | undefined;
  onLeader: (point: LeaderPoint) => void;
}) {
  const ref = useRef<THREE.Object3D>(null);
  const v = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!anchor) onLeader(null);
  }, [anchor, onLeader]);

  useFrame(({ camera, size }) => {
    if (!anchor || !ref.current) return;
    ref.current.getWorldPosition(v.current).project(camera);
    onLeader({
      x: ((v.current.x + 1) / 2) * size.width,
      y: ((1 - v.current.y) / 2) * size.height,
    });
  });

  return anchor ? <object3D ref={ref} position={anchor} /> : null;
}

/**
 * The 3D stage. Loaded only when the section nears the viewport (see
 * BadmintonSetup), and it renders on demand: a frame is drawn only when
 * something changes (a drag, a hover, a theme switch), not 60 times a second.
 */
export default function SetupScene({ active, onHover, onSelect, onLeader, reducedMotion }: Props) {
  const colors = useThemeColors();
  const [anchors, setAnchors] = useState<Anchors>({});
  const onAnchors = useCallback((a: Anchors) => setAnchors(a), []);

  const modelProps = { active, colors, onHover, onSelect, onAnchors };

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.15, 5.6], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onPointerMissed={() => onHover(null)}
    >
      {/* Lights only matter for a custom GLB model; the voxel player is unlit. */}
      <hemisphereLight args={["#ffffff", colors.bgCourt, 1.1]} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.6} />

      <group rotation={[0, START_TURN, 0]}>
        <Suspense fallback={null}>
          {modelUrl ? <GLBPlayer url={modelUrl} {...modelProps} /> : <PlayerModel {...modelProps} />}
        </Suspense>
        <LeaderTracker anchor={active ? anchors[active] : undefined} onLeader={onLeader} />
      </group>

      {/* The patch of court the player stands on. */}
      <Blocker colors={colors} onHover={onHover}>
        <VoxelDisc radius={1.05} />
      </Blocker>

      <OrbitControls
        target={[0, 1.05, 0]}
        enablePan={false}
        enableZoom={false}
        enableDamping={!reducedMotion}
        dampingFactor={0.08}
        rotateSpeed={0.7}
        autoRotate={!reducedMotion}
        autoRotateSpeed={ORBIT_SPEED}
        minPolarAngle={Math.PI / 2 - 0.35}
        maxPolarAngle={Math.PI / 2 + 0.05}
      />
    </Canvas>
  );
}
