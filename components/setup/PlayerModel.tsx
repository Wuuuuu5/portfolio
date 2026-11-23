"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { equipment, type EquipmentId } from "@/lib/setup";
import { Blocker, CELL, FlatMaterial, Part, VoxelBox, type ModelProps } from "./parts";

/** Whole voxels → metres, so every block's edges land on the voxel grid. */
const v = (n: number) => n * CELL;

const IDS = equipment.map((e) => e.id);

/** The raised racket makes the pose taller than the player; this keeps it in frame. */
const SCALE = 0.85;

/**
 * A joint: children are laid out hanging down its local -y, and the whole
 * limb swings by `rotation` (radians, XYZ) about this point.
 */
function Joint({
  at,
  rotation = [0, 0, 0],
  children,
}: {
  at: [number, number, number];
  rotation?: [number, number, number];
  children: ReactNode;
}) {
  return (
    <group position={at} rotation={rotation}>
      {children}
    </group>
  );
}

/**
 * The built-in voxel player in a front-court stance: stepping in on the
 * right leg, racket held up in front of the face ready to net, free arm
 * relaxed at the side. The bag waits on the floor beside them.
 *
 * Limbs are nested joints, so an item can appear in several places (the
 * jersey is the torso plus a sleeve on each arm); each piece is its own
 * <Part> so hover picks exactly that kit. Skin is a <Blocker>.
 */
export default function PlayerModel({
  active,
  colors,
  onHover,
  onSelect,
  onAnchors,
}: ModelProps) {
  const root = useRef<THREE.Group>(null);

  // The pose rotates most items, so measure where each one ended up rather
  // than hard-coding anchors: the centre of everything named after the item,
  // in the parent's space (where the scene places the leader tracker).
  useLayoutEffect(() => {
    const model = root.current;
    const parent = model?.parent;
    if (!model || !parent) return;
    parent.updateWorldMatrix(true, true);
    const boxes: Partial<Record<EquipmentId, THREE.Box3>> = {};
    model.traverse((o) => {
      const id = IDS.find((candidate) => candidate === o.name);
      if (id) (boxes[id] ??= new THREE.Box3()).expandByObject(o);
    });
    const anchors: Partial<Record<EquipmentId, [number, number, number]>> = {};
    for (const [id, box] of Object.entries(boxes)) {
      const c = parent.worldToLocal(box.getCenter(new THREE.Vector3()));
      anchors[id as EquipmentId] = [c.x, c.y, c.z];
    }
    onAnchors(anchors);
  }, [onAnchors]);

  const part = { active, colors, onHover, onSelect };
  const skin = (children: ReactNode) => (
    <Blocker colors={colors} onHover={onHover}>
      {children}
    </Blocker>
  );
  const white = "#f3f5fa";

  /** Thigh → knee → shin, sock and shoe. */
  const leg = (x: number, hip: number, knee: number) => (
    <Joint key={x} at={[v(x), 0, 0]} rotation={[hip, 0, 0]}>
      {skin(<VoxelBox size={[v(3), v(4), v(3)]} position={[0, v(-2), 0]} />)}
      <Joint at={[0, v(-4), 0]} rotation={[knee, 0, 0]}>
        {skin(<VoxelBox size={[v(3), v(3), v(3)]} position={[0, v(-1.5), 0]} />)}
        <Part id="socks" {...part}>
          <VoxelBox size={[v(3), v(3), v(3)]} position={[0, v(-4.5), 0]} tone={white} />
        </Part>
        <Part id="shoes" {...part}>
          <VoxelBox size={[v(3), v(2), v(5)]} position={[0, v(-7), v(1)]} tone={colors.accent} />
        </Part>
      </Joint>
    </Joint>
  );

  return (
    <group ref={root} scale={SCALE}>
      {/* ---------- the player: hips raised so both feet land on the floor ---------- */}
      <group position={[0, v(11.5), 0]}>
        {/* Right leg (+x, the racket side) stepping forward, left leg behind
            with the heel up. */}
        {leg(2, -0.38, 0.15)}
        {leg(-2, 0.3, 0.05)}

        <Part id="shorts" {...part}>
          <VoxelBox size={[v(8), v(5), v(4)]} position={[0, v(2.5), 0]} tone={colors.fg} />
        </Part>

        {/* Torso: a slight lean in, racket shoulder turned forward. */}
        <Joint at={[0, v(5), 0]} rotation={[0.1, -0.2, 0]}>
          <Part id="jersey" {...part}>
            <VoxelBox size={[v(8), v(9), v(4)]} position={[0, v(4.5), 0]} />
          </Part>

          {/* Head, eyes level on the shuttle. */}
          <Joint at={[0, v(9), 0]} rotation={[-0.05, 0.15, 0]}>
            {skin(<VoxelBox size={[v(5), v(5), v(5)]} position={[0, v(2.5), 0]} />)}
          </Joint>

          {/* Free arm: relaxed, hanging a little back and out. */}
          <Joint at={[v(-5.5), v(9), 0]} rotation={[0.35, 0, -0.2]}>
            <Part id="jersey" {...part}>
              <VoxelBox size={[v(3), v(3), v(3)]} position={[0, v(-1.5), 0]} />
            </Part>
            {skin(<VoxelBox size={[v(3), v(7), v(3)]} position={[0, v(-6.5), 0]} />)}
          </Joint>

          {/* Racket arm: elbow down in front of the chest, forearm up so the
              racket sits by the face. */}
          <Joint at={[v(5.5), v(9), 0]} rotation={[-0.5, 0, 0.2]}>
            <Part id="jersey" {...part}>
              <VoxelBox size={[v(3), v(3), v(3)]} position={[0, v(-1.5), 0]} />
            </Part>
            {skin(<VoxelBox size={[v(3), v(4), v(3)]} position={[0, v(-5), 0]} />)}

            <Joint at={[0, v(-7), 0]} rotation={[-2.4, 0, -0.3]}>
              {skin(
                <>
                  <VoxelBox size={[v(3), v(5), v(3)]} position={[0, v(-2.5), 0]} />
                  <VoxelBox size={[v(2), v(2), v(2)]} position={[0, v(-6), 0]} />
                </>,
              )}

              {/* Racket, from the hand, head tipped back over the shoulder. */}
              <Part id="racket" {...part}>
                <group position={[0, v(-6), 0]} rotation={[-0.4, 0, 0]}>
                  <mesh position={[0, v(-1.5), 0]}>
                    <boxGeometry args={[v(0.8), v(4), v(0.8)]} />
                    <FlatMaterial tone={colors.fg} />
                  </mesh>
                  <mesh position={[0, v(-6), 0]}>
                    <boxGeometry args={[v(0.3), v(5), v(0.3)]} />
                    <FlatMaterial tone={colors.fg} />
                  </mesh>
                  <group position={[0, v(-11.9), 0]} scale={[1, 1.32, 1]}>
                    <mesh>
                      <torusGeometry args={[v(2.6), v(0.22), 8, 48]} />
                      <FlatMaterial tone={colors.accent} idleOpacity={0.6} />
                    </mesh>
                    <mesh>
                      <circleGeometry args={[v(2.5), 40]} />
                      <FlatMaterial tone={white} idleOpacity={0.08} />
                    </mesh>
                  </group>
                </group>
              </Part>
            </Joint>
          </Joint>
        </Joint>
      </group>

      {/* ---------- racket bag, left on the floor ---------- */}
      <Part id="bag" {...part}>
        <VoxelBox size={[v(10), v(4), v(4)]} position={[v(10), v(2), v(1)]} tone={colors.accent2} />
        <VoxelBox size={[v(4), v(1), v(1)]} position={[v(10), v(4.5), v(1)]} tone={colors.fg} />
      </Part>
    </group>
  );
}
