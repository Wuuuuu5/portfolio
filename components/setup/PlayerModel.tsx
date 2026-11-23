"use client";

import { useEffect } from "react";
import { Blocker, CELL, FlatMaterial, Part, VoxelBox, type ModelProps } from "./parts";

/** Whole voxels → metres, so every block's edges land on the voxel grid. */
const v = (n: number) => n * CELL;

/**
 * Where each item's leader line starts, in model space (metres, feet at
 * y = 0, facing +z). Kept beside the geometry so they move together.
 */
const ANCHORS = {
  racket: [v(5.5), v(31), v(5)],
  jersey: [v(2), v(20), v(2)],
  shorts: [v(2), v(12.5), v(2)],
  socks: [v(2), v(3.5), v(1.5)],
  shoes: [v(2), v(1), v(3)],
  bag: [v(10), v(3), v(2.5)],
} as const;

/**
 * The built-in voxel player: blocky, ~30 voxels tall, racket held up in
 * front, bag at the feet. Each item is its own <Part> so hover picks exactly
 * that piece of kit; skin is a <Blocker>.
 */
export default function PlayerModel({
  active,
  colors,
  onHover,
  onSelect,
  onAnchors,
}: ModelProps) {
  useEffect(() => {
    onAnchors(ANCHORS as unknown as Parameters<typeof onAnchors>[0]);
  }, [onAnchors]);

  const part = { active, colors, onHover, onSelect };
  const legsX = [-2, 2];
  const white = "#f3f5fa";

  return (
    <group>
      {/* ---------- body (blocks the pointer, never lights up) ---------- */}
      <Blocker colors={colors} onHover={onHover}>
        {/* calves, between socks and shorts */}
        {legsX.map((x) => (
          <VoxelBox key={`calf${x}`} size={[v(3), v(5), v(3)]} position={[v(x), v(7.5), 0]} />
        ))}
        {/* head */}
        <VoxelBox size={[v(5), v(5), v(5)]} position={[0, v(26.5), 0]} />
        {/* free arm (character's left) */}
        <VoxelBox size={[v(3), v(7), v(3)]} position={[v(-5.5), v(17.5), 0]} />
        {/* racket arm: upper arm down, forearm forward, hand */}
        <VoxelBox size={[v(3), v(4), v(3)]} position={[v(5.5), v(19), 0]} />
        <VoxelBox size={[v(3), v(3), v(4)]} position={[v(5.5), v(18.5), v(3.5)]} />
        <VoxelBox size={[v(2), v(3), v(2)]} position={[v(5.5), v(20), v(5)]} />
      </Blocker>

      {/* ---------- shoes ---------- */}
      <Part id="shoes" {...part}>
        {legsX.map((x) => (
          <VoxelBox key={`shoe${x}`} size={[v(3), v(2), v(5)]} position={[v(x), v(1), v(0.5)]} tone={colors.accent} />
        ))}
      </Part>

      {/* ---------- socks ---------- */}
      <Part id="socks" {...part}>
        {legsX.map((x) => (
          <VoxelBox key={`sock${x}`} size={[v(3), v(3), v(3)]} position={[v(x), v(3.5), 0]} tone={white} />
        ))}
      </Part>

      {/* ---------- shorts ---------- */}
      <Part id="shorts" {...part}>
        <VoxelBox size={[v(8), v(5), v(4)]} position={[0, v(12.5), 0]} tone={colors.fg} />
      </Part>

      {/* ---------- jersey: torso and both sleeves ---------- */}
      <Part id="jersey" {...part}>
        <VoxelBox size={[v(8), v(9), v(4)]} position={[0, v(19.5), 0]} />
        <VoxelBox size={[v(3), v(3), v(3)]} position={[v(-5.5), v(22.5), 0]} />
        <VoxelBox size={[v(3), v(3), v(3)]} position={[v(5.5), v(22.5), 0]} />
      </Part>

      {/* ---------- racket, held upright in the hand ---------- */}
      <Part id="racket" {...part}>
        <group position={[v(5.5), 0, v(5)]}>
          {/* grip */}
          <mesh position={[0, v(20.5), 0]}>
            <boxGeometry args={[v(0.8), v(4), v(0.8)]} />
            <FlatMaterial tone={colors.fg} />
          </mesh>
          {/* shaft */}
          <mesh position={[0, v(25), 0]}>
            <boxGeometry args={[v(0.3), v(5), v(0.3)]} />
            <FlatMaterial tone={colors.fg} />
          </mesh>
          {/* head: frame + strings */}
          <group position={[0, v(31), 0]} scale={[1, 1.32, 1]}>
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

      {/* ---------- racket bag beside the feet ---------- */}
      <Part id="bag" {...part}>
        <VoxelBox size={[v(10), v(4), v(4)]} position={[v(10), v(2), v(1)]} tone={colors.accent2} />
        <VoxelBox size={[v(4), v(1), v(1)]} position={[v(10), v(4.5), v(1)]} tone={colors.fg} />
      </Part>
    </group>
  );
}
