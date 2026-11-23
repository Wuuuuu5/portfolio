"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { equipment, type EquipmentId } from "@/lib/setup";
import { Blocker, CELL, FlatMaterial, Part, VoxelBox, type ModelProps } from "./parts";

/** Whole voxels → metres, so every block's edges land on the voxel grid. */
const v = (n: number) => n * CELL;

const IDS = equipment.map((e) => e.id);

/** Left arm lengths (voxels), matching the racket arm: shoulder→elbow, elbow→hand. */
const UPPER = 7;
const FORE = 6;
/** Which way the left elbow points: (x -out/+in, y -down/+up, z +forward/-back), torso space. */
const POLE = new THREE.Vector3(-0.3, -1, 0).normalize();
const DOWN = new THREE.Vector3(0, -1, 0);

/**
 * Two-bone reach: bend the left arm so its hand lands on `target`. Everything
 * is in the torso's space; each joint's local -y is made to point along its
 * bone. If the target is out of reach the arm stretches straight toward it.
 */
function reach(shoulder: THREE.Object3D, elbow: THREE.Object3D, target: THREE.Vector3) {
  const u = v(UPPER);
  const f = v(FORE);
  const toTarget = target.clone().sub(shoulder.position);
  const dist = THREE.MathUtils.clamp(toTarget.length(), Math.abs(u - f) + 1e-4, u + f - 1e-4);
  const dir = toTarget.normalize();

  // Law of cosines: how far along the shoulder→target line the elbow sits,
  // and how far off it, toward the pole.
  const along = (u * u - f * f + dist * dist) / (2 * dist);
  const off = Math.sqrt(Math.max(u * u - along * along, 0));
  const bend = POLE.clone().addScaledVector(dir, -POLE.dot(dir)).normalize();
  const elbowAt = shoulder.position.clone().addScaledVector(dir, along).addScaledVector(bend, off);

  const upperDir = elbowAt.clone().sub(shoulder.position).normalize();
  shoulder.quaternion.setFromUnitVectors(DOWN, upperDir);

  // The forearm's direction, seen from inside the (now rotated) shoulder.
  const foreDir = shoulder.position.clone().addScaledVector(dir, dist).sub(elbowAt).normalize();
  foreDir.applyQuaternion(shoulder.quaternion.clone().invert());
  elbow.quaternion.setFromUnitVectors(DOWN, foreDir);
}

/** The raised racket makes the pose taller than the player; this keeps it in frame. */
// SCALE: overall size of the player (bigger = larger in frame)
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
 * right leg, racket held up in front of the face, left hand steadying it by
 * the shaft. The bag waits on the floor beside them.
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
  const leftShoulder = useRef<THREE.Group>(null);
  const leftElbow = useRef<THREE.Group>(null);
  const grip = useRef<THREE.Object3D>(null);
  const invalidate = useThree((s) => s.invalidate);

  // The left hand holds the racket's shaft. It's solved after every render
  // (no deps on purpose), so tweaking the right arm's numbers carries the
  // left hand along with the racket. Runs before the anchors below so the
  // sleeve is in place when they're measured.
  useLayoutEffect(() => {
    const shoulder = leftShoulder.current;
    const elbow = leftElbow.current;
    const torso = shoulder?.parent;
    if (!shoulder || !elbow || !torso || !grip.current || !root.current) return;
    root.current.updateWorldMatrix(true, true);
    const target = torso.worldToLocal(grip.current.getWorldPosition(new THREE.Vector3()));
    reach(shoulder, elbow, target);
    invalidate();
  });

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

  /**
   * Thigh → knee → shin, sock, then the ankle and shoe. `foot` is the sole's
   * angle to the floor (radians): 0 is flat, positive lifts the heel onto the
   * toes. The ankle undoes the hip and knee angles first, so it's measured
   * against the floor, not the shin.
   */
  const leg = (x: number, hip: number, knee: number, foot: number) => (
    <Joint key={x} at={[v(x), 0, 0]} rotation={[hip, 0, 0]}>
      {skin(<VoxelBox size={[v(3), v(4), v(3)]} position={[0, v(-2), 0]} />)}
      <Joint at={[0, v(-4), 0]} rotation={[knee, 0, 0]}>
        {skin(<VoxelBox size={[v(3), v(3), v(3)]} position={[0, v(-1.5), 0]} />)}
        <Part id="socks" {...part}>
          <VoxelBox size={[v(3), v(3), v(3)]} position={[0, v(-4.5), 0]} tone={white} />
        </Part>
        <Joint at={[0, v(-6), 0]} rotation={[foot - (hip + knee), 0, 0]}>
          <Part id="shoes" {...part}>
            <VoxelBox size={[v(3), v(2), v(5)]} position={[0, v(-1), v(1)]} tone={colors.accent} />
          </Part>
        </Joint>
      </Joint>
    </Joint>
  );

  return (
    // Mirrored in x: the player faces the camera (+z), so their right hand is
    // on the -x side. Everything below is laid out with the racket side at +x;
    // the flip puts the racket in their RIGHT hand. (three.js flips face
    // winding for negative scale, so nothing renders inside out.)
    <group ref={root} scale={[-SCALE, SCALE, SCALE]}>
      {/* ---------- the player: hips raised so both feet land on the floor ---------- */}
      {/* v(11.5) = hip height: raise if a foot sinks into the floor, lower if one floats */}
      <group position={[0, v(11.5), 0]}>
        {/* +x is the racket side, which the mirror makes the player's right:
            right leg stepping forward with the foot flat, left leg behind up on
            its toes. Lifting that heel drops the toes, so its knee bends a
            little more to keep them on the floor. */}
        {/* leg(side, hip, knee, foot): hip -forward/+back · knee bigger = more bent · foot 0 flat, + heel up */}
        {leg(2, -0.38, 0.15, 0)}
        {leg(-2, 0.3, 0.36, 0.3)}

        <Part id="shorts" {...part}>
          <VoxelBox size={[v(8), v(5), v(4)]} position={[0, v(2.5), 0]} tone={colors.fg} />
        </Part>

        {/* Torso: a slight lean in, racket shoulder turned forward. */}
        {/* torso [lean +forward/-back, twist +/-, tilt sideways] */}
        <Joint at={[0, v(5), 0]} rotation={[0.1, -0.2, 0]}>
          <Part id="jersey" {...part}>
            <VoxelBox size={[v(8), v(9), v(4)]} position={[0, v(4.5), 0]} />
          </Part>

          {/* Head, eyes level on the shuttle. */}
          {/* head [nod +down/-up, turn left/right, tilt sideways] */}
          <Joint at={[0, v(9), 0]} rotation={[-0.05, 0.15, 0]}>
            {skin(<VoxelBox size={[v(5), v(5), v(5)]} position={[0, v(2.5), 0]} />)}
          </Joint>

          {/* left arm: NO numbers to set, it bends itself so the hand holds the
              racket's shaft (see reach() above; change UPPER/FORE/POLE there) */}
          <group ref={leftShoulder} position={[v(-5.5), v(9), 0]}>
            <Part id="jersey" {...part}>
              <VoxelBox size={[v(3), v(3), v(3)]} position={[0, v(-1.5), 0]} />
            </Part>
            {skin(<VoxelBox size={[v(3), v(4), v(3)]} position={[0, v(-5), 0]} />)}
            <group ref={leftElbow} position={[0, v(-UPPER), 0]}>
              {skin(
                <>
                  <VoxelBox size={[v(3), v(5), v(3)]} position={[0, v(-2.5), 0]} />
                  <VoxelBox size={[v(2), v(2), v(2)]} position={[0, v(-FORE), 0]} />
                </>,
              )}
            </group>
          </group>

          {/* Racket arm: elbow down in front of the chest, forearm up so the
              racket sits by the face. */}
          {/* right shoulder [swing -forward,up/+back, twist, +out to side/-across body] */}
          <Joint at={[v(5.5), v(9), 0]} rotation={[-0.85, 0, -0.15]}>
            <Part id="jersey" {...part}>
              <VoxelBox size={[v(3), v(3), v(3)]} position={[0, v(-1.5), 0]} />
            </Part>
            {skin(<VoxelBox size={[v(3), v(4), v(3)]} position={[0, v(-5), 0]} />)}

            {/* right elbow [bend 0 straight/-3 fully folded, twist racket face, -hand toward face/+out] */}
            <Joint at={[0, v(-7), 0]} rotation={[-1.65, 0, -0.35]}>
              {skin(
                <>
                  <VoxelBox size={[v(3), v(5), v(3)]} position={[0, v(-2.5), 0]} />
                  <VoxelBox size={[v(2), v(2), v(2)]} position={[0, v(-6), 0]} />
                </>,
              )}

              {/* Racket, from the hand, head tipped back over the shoulder. */}
              <Part id="racket" {...part}>
                {/* racket in hand [tilt -head back/+forward, twist, lean sideways] */}
                <group position={[0, v(-6), 0]} rotation={[-0.3, 0.8, 0]}>
                  <mesh position={[0, v(-1.5), 0]}>
                    <boxGeometry args={[v(0.8), v(4), v(0.8)]} />
                    <FlatMaterial tone={colors.fg} />
                  </mesh>
                  <mesh position={[0, v(-6), 0]}>
                    <boxGeometry args={[v(0.3), v(5), v(0.3)]} />
                    <FlatMaterial tone={colors.fg} />
                  </mesh>
                  {/* where the left hand grabs: -4.5 = lower shaft, -6 = middle (more negative = nearer the head) */}
                  <object3D ref={grip} position={[0, v(-4.5), 0]} />
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
