"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import {
  equipment,
  kitColours,
  racketColours,
  type EquipmentId,
} from "@/lib/setup";
import {
  Blocker,
  CELL,
  FlatMaterial,
  Part,
  VoxelBox,
  type ModelProps,
} from "./parts";

/** Whole voxels → metres, so every block's edges land on the voxel grid. */
const v = (n: number) => n * CELL;

const IDS = equipment.map((e) => e.id);

/* ================= THE POSE: move the racket, the arms follow =================
   All in the torso's voxels, seen from the player: x + their right side /
   - their left, y up from the waist (shoulders are at 9, chin at ~9),
   z + forward toward the net / - back. Both arms bend themselves (reach()
   below): the right hand holds the butt of the grip, the left hand holds the
   shaft. Nothing else needs changing when the racket moves. */

/** Where the right hand holds the racket. */
// RACKET_HAND [x +right/-left, y up from waist, z +forward]
// Out by the right hip at lower-chest height, in front of the body.
// Jump smash (from the stick drawing): hand back behind the body, just above shoulder height.
const RACKET_HAND: [number, number, number] = [5.5, 11.5, -9.5];
/** Which way the racket points from the hand (radians). 0,0,0 = straight up, face to the net. */
// RACKET_ANGLE [tilt +head forward/-back, twist the face, lean +toward their left/-right]
// Diagonal across the chest (~65° off vertical), head up by the left shoulder,
// strings turned partway to the camera.
// Jump smash: racket pointing up, tipped a little forward, strings to the camera.
const RACKET_ANGLE: [number, number, number] = [0.33, 1.57, 0];
/** Racket size: 0.8 keeps it about 40% of the player's height, like a real one. */
const RACKET_SIZE = 0.8;
/** Where on the racket the left hand holds, in voxels up from the right hand: 4.5 = lower shaft, 6 = middle, 7.5 = throat. */
const LEFT_HAND_AT = 7.5;
/** Set to a point to let the left hand off the racket and reach there instead
    (same voxels as RACKET_HAND); null = hold the shaft at LEFT_HAND_AT. */
// LEFT_HAND_FREE [x +right/-left, y up from waist, z +forward] or null
// Jump smash: arm straight out in front, rising toward the shuttle.
const LEFT_HAND_FREE: [number, number, number] | null = [-7, 15.5, 16.5];

/** How high the player is off the floor, in voxels (0 = standing). */
const JUMP = 5;
/** Turns the whole player on the spot (radians): 0 = facing the camera,
    about ±1.57 = side-on. */
const BODY_TURN = -1.5;
/** Turns ONLY the torso (radians) on top of BODY_TURN. The head, racket,
    hands and legs stay where they are; the arms re-bend from the moved
    shoulders. -BODY_TURN = torso square to the camera. */
const TORSO_TURN = 1;
/** Turns both legs together (radians), same direction as TORSO_TURN:
    + toward the camera, - back toward side-on. */
const LEGS_TURN = 1.2;
/** Undoes TORSO_TURN, for things placed in the torso that should stay put. */
const UNTURN = new THREE.Euler(0, -TORSO_TURN, 0);

/** Which way each elbow points: (x +right/-left, y -down/+up, z +forward/-back).
    Bigger x (out to the side) and z (forward) = arms reaching out from the body;
    more -y = elbows tucked down by the ribs. */
// RIGHT_POLE / LEFT_POLE [x out to side, y down, z forward]
// Both elbows bent out to the sides and down, as in the reference grip.
// Jump smash: racket elbow back and down, reaching arm straight.
const RIGHT_POLE = new THREE.Vector3(0, -1, -0.3).normalize();
const LEFT_POLE = new THREE.Vector3(0, -1, 0).normalize();

/** Real item colours (lib/setup.ts), shown when an item lights up. */
const BAG = kitColours.bag;
const SHOES = kitColours.shoes;
const SHORTS = kitColours.shorts;

const JERSEY = kitColours.jersey;

/**
 * The Kaleidoscope shirt's front, one letter per voxel, top row first
 * (8 wide, 9 tall). w white, b light blue, p purple, o orange, k logo.
 * Runs of the same letter in a row become one box through the whole torso.
 */
const JERSEY_PATTERN = [
  "bwwwwppp",
  "wwwwpppo",
  "wkkwwppw",
  "wwwwpopb",
  "bwwwwbpw",
  "pbwwwwbw",
  "bpbwwbob",
  "bbbpbbbb",
  "bbbbbbbb",
];
const JERSEY_TONES: Record<string, string> = {
  w: JERSEY.white,
  b: JERSEY.blue,
  p: JERSEY.purple,
  o: JERSEY.orange,
  k: JERSEY.logo,
};

/** The torso's boxes, from JERSEY_PATTERN. */
function jerseyBoxes() {
  const boxes: ReactNode[] = [];
  JERSEY_PATTERN.forEach((row, r) => {
    const y = JERSEY_PATTERN.length - 1 - r;
    for (let i = 0; i < row.length;) {
      let j = i;
      while (j + 1 < row.length && row[j + 1] === row[i]) j++;
      const len = j - i + 1;
      boxes.push(
        <VoxelBox
          key={`${y}-${i}`}
          size={[v(len), v(1), v(4)]}
          position={[v(-4 + i + len / 2), v(y + 0.5), 0]}
          tone={JERSEY_TONES[row[i]]}
        />,
      );
      i = j + 1;
    }
  });
  return boxes;
}

/** A sleeve: top voxel, then light blue, then a light blue cuff. */
function sleeve(top: string) {
  return (
    <>
      <VoxelBox
        size={[v(3), v(1), v(3)]}
        position={[0, v(-0.5), 0]}
        tone={top}
      />
      <VoxelBox
        size={[v(3), v(2), v(3)]}
        position={[0, v(-2), 0]}
        tone={JERSEY.blue}
      />
    </>
  );
}

/** Arm lengths (voxels): shoulder→elbow, elbow→hand. */
const UPPER = 7;
const FORE = 6;
const DOWN = new THREE.Vector3(0, -1, 0);

/**
 * Two-bone reach: bend an arm so its hand lands on `target`, with the elbow
 * bending toward `pole`. Everything is in the torso's space; each joint's
 * local -y is made to point along its bone. If the target is out of reach
 * the arm stretches straight toward it.
 */
function reach(
  shoulder: THREE.Object3D,
  elbow: THREE.Object3D,
  target: THREE.Vector3,
  pole: THREE.Vector3,
) {
  const u = v(UPPER);
  const f = v(FORE);
  const toTarget = target.clone().sub(shoulder.position);
  const dist = THREE.MathUtils.clamp(
    toTarget.length(),
    Math.abs(u - f) + 1e-4,
    u + f - 1e-4,
  );
  const dir = toTarget.normalize();

  // Law of cosines: how far along the shoulder→target line the elbow sits,
  // and how far off it, toward the pole.
  const along = (u * u - f * f + dist * dist) / (2 * dist);
  const off = Math.sqrt(Math.max(u * u - along * along, 0));
  const bend = pole.clone().addScaledVector(dir, -pole.dot(dir)).normalize();
  const elbowAt = shoulder.position
    .clone()
    .addScaledVector(dir, along)
    .addScaledVector(bend, off);

  const upperDir = elbowAt.clone().sub(shoulder.position).normalize();
  shoulder.quaternion.setFromUnitVectors(DOWN, upperDir);

  // The forearm's direction, seen from inside the (now rotated) shoulder.
  const foreDir = shoulder.position
    .clone()
    .addScaledVector(dir, dist)
    .sub(elbowAt)
    .normalize();
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
 * The built-in voxel player in a ready stance: stepping in on the right leg,
 * racket held out in front of the body, left hand steadying it by the shaft.
 * The bag waits on the floor beside them.
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
  const rightShoulder = useRef<THREE.Group>(null);
  const rightElbow = useRef<THREE.Group>(null);
  const grip = useRef<THREE.Object3D>(null);
  const invalidate = useThree((s) => s.invalidate);

  // Both arms are bent to the racket after every render (no deps on purpose),
  // so changing RACKET_HAND / RACKET_ANGLE carries both hands along. Runs
  // before the anchors below so the sleeves are in place when they're measured.
  useLayoutEffect(() => {
    const ls = leftShoulder.current;
    const le = leftElbow.current;
    const rs = rightShoulder.current;
    const re = rightElbow.current;
    const torso = ls?.parent;
    if (!ls || !le || !rs || !re || !torso || !grip.current || !root.current)
      return;
    root.current.updateWorldMatrix(true, true);
    // Hands and elbow directions are given unturned, so undo TORSO_TURN to
    // keep them in the same place however the torso is turned.
    const rightTarget = new THREE.Vector3(...RACKET_HAND.map(v)).applyEuler(
      UNTURN,
    );
    reach(rs, re, rightTarget, RIGHT_POLE.clone().applyEuler(UNTURN));
    const leftTarget = LEFT_HAND_FREE
      ? new THREE.Vector3(...LEFT_HAND_FREE.map(v)).applyEuler(UNTURN)
      : torso.worldToLocal(grip.current.getWorldPosition(new THREE.Vector3()));
    reach(ls, le, leftTarget, LEFT_POLE.clone().applyEuler(UNTURN));
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
   * Thigh → knee → shin, then the ankle and shoe. `foot` is the sole's
   * angle to the floor (radians): 0 is flat, positive lifts the heel onto the
   * toes. The ankle undoes the hip and knee angles first, so it's measured
   * against the floor, not the shin.
   */
  const leg = (x: number, hip: number, knee: number, foot: number) => (
    <Joint key={x} at={[v(x), 0, 0]} rotation={[hip, 0, 0]}>
      {skin(<VoxelBox size={[v(3), v(4), v(3)]} position={[0, v(-2), 0]} />)}
      <Joint at={[0, v(-4), 0]} rotation={[knee, 0, 0]}>
        {skin(<VoxelBox size={[v(3), v(6), v(3)]} position={[0, v(-3), 0]} />)}
        <Joint at={[0, v(-6), 0]} rotation={[foot - (hip + knee), 0, 0]}>
          {/* Shoe (white Eclipsion X): grey sole, white upper that stops
              short of the toe, navy heel tab. */}
          <Part id="shoes" {...part}>
            <VoxelBox
              size={[v(3), v(1), v(5)]}
              position={[0, v(-1.5), v(1)]}
              tone={SHOES.sole}
            />
            <VoxelBox
              size={[v(3), v(1), v(4)]}
              position={[0, v(-0.5), v(0.5)]}
              tone={SHOES.upper}
            />
            <VoxelBox
              size={[v(3), v(1), v(1)]}
              position={[0, v(0.5), v(-1)]}
              tone={SHOES.accent}
            />
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
      <group position={[0, v(11.5 + JUMP), 0]} rotation={[0, BODY_TURN, 0]}>
        {/* +x is the racket side, which the mirror makes the player's right:
            right leg stepping forward with the foot flat, left leg behind up on
            its toes. Lifting that heel drops the toes, so its knee bends a
            little more to keep them on the floor. */}
        {/* leg(side, hip, knee, foot): hip -forward/+back · knee bigger = more bent · foot 0 flat, + heel up */}
        {/* Jump smash scissor kick: racket-side leg swung back and bent,
            left leg driven forward with the knee up. */}
        <group rotation={[0, LEGS_TURN, 0]}>
          {leg(2, -0.25, 1.82, 1.4)}
          {leg(-2, 0.28, 0.4, 0.6)}
        </group>

        {/* Shorts turn with the torso (TORSO_TURN); the legs stay put. */}
        <Part id="shorts" {...part}>
          {/* Shorts: plain black, waistband a shade lighter. */}
          <group rotation={[0, TORSO_TURN, 0]}>
            <VoxelBox
              size={[v(8), v(4), v(4)]}
              position={[0, v(2), 0]}
              tone={SHORTS.main}
            />
            <VoxelBox
              size={[v(8), v(1), v(4)]}
              position={[0, v(4.5), 0]}
              tone={SHORTS.band}
            />
          </group>
        </Part>

        {/* Torso: a slight lean in, racket shoulder turned forward. */}
        {/* torso [lean +forward/-back, twist +/-, tilt sideways] */}
        {/* Jump smash: spine straight up. */}
        <Joint at={[0, v(5), 0]} rotation={[0, TORSO_TURN, 0]}>
          {/* Jersey: P.R IND Kaleidoscope, painted from JERSEY_PATTERN. */}
          <Part id="jersey" {...part}>
            {jerseyBoxes()}
          </Part>

          {/* Head, eyes level on the shuttle. */}
          {/* head [nod +down/-up, turn left/right, tilt sideways] */}
          {/* Jump smash: looking up at the shuttle. */}
          {/* The outer group undoes TORSO_TURN so the head stays put. */}
          <group position={[0, v(9), 0]} rotation={[0, -TORSO_TURN, 0]}>
            <Joint at={[0, 0, 0]} rotation={[-0.2, 0, 0]}>
              {skin(
                <VoxelBox
                  size={[v(5), v(5), v(5)]}
                  position={[0, v(2.5), 0]}
                />,
              )}
            </Joint>
          </group>

          {/* Both arms: NO numbers to set here, they bend themselves to the
              racket (move it with RACKET_HAND / RACKET_ANGLE at the top). */}
          <group ref={leftShoulder} position={[v(-5.5), v(9), 0]}>
            {/* sleeve: white shoulder, light blue below */}
            <Part id="jersey" {...part}>
              {sleeve(JERSEY.white)}
            </Part>
            {skin(
              <VoxelBox size={[v(3), v(4), v(3)]} position={[0, v(-5), 0]} />,
            )}
            <group ref={leftElbow} position={[0, v(-UPPER), 0]}>
              {skin(
                <>
                  <VoxelBox
                    size={[v(3), v(5), v(3)]}
                    position={[0, v(-2.5), 0]}
                  />
                  <VoxelBox
                    size={[v(2), v(2), v(2)]}
                    position={[0, v(-FORE), 0]}
                  />
                </>,
              )}
            </group>
          </group>

          <group ref={rightShoulder} position={[v(5.5), v(9), 0]}>
            {/* sleeve: purple brush stroke on the shoulder, light blue below */}
            <Part id="jersey" {...part}>
              {sleeve(JERSEY.purple)}
            </Part>
            {skin(
              <VoxelBox size={[v(3), v(4), v(3)]} position={[0, v(-5), 0]} />,
            )}
            <group ref={rightElbow} position={[0, v(-UPPER), 0]}>
              {skin(
                <>
                  <VoxelBox
                    size={[v(3), v(5), v(3)]}
                    position={[0, v(-2.5), 0]}
                  />
                  <VoxelBox
                    size={[v(2), v(2), v(2)]}
                    position={[0, v(-FORE), 0]}
                  />
                </>,
              )}
            </group>
          </group>

          {/* The racket: placed by RACKET_HAND / RACKET_ANGLE (top of file).
              Laid out pointing up from the right hand: grip, shaft, head.
              Twist is applied first, then lean, then tilt ("XZY"). */}
          <Part id="racket" {...part}>
            {/* undoes TORSO_TURN so the racket stays put */}
            <group rotation={[0, -TORSO_TURN, 0]}>
              <group
                position={RACKET_HAND.map(v) as [number, number, number]}
                rotation={[...RACKET_ANGLE, "XZY"]}
                scale={RACKET_SIZE}
              >
                <mesh position={[0, v(1.5), 0]}>
                  <boxGeometry args={[v(0.8), v(4), v(0.8)]} />
                  <FlatMaterial tone={colors.fg} />
                </mesh>
                {/* Shaft and frame in my 100 ZZ's colourway (lib/setup.ts). */}
                <mesh position={[0, v(6), 0]}>
                  <boxGeometry args={[v(0.3), v(5), v(0.3)]} />
                  <FlatMaterial tone={racketColours.shaft} />
                </mesh>
                {/* gold ring where the grip meets the shaft */}
                <mesh position={[0, v(3.55), 0]}>
                  <boxGeometry args={[v(0.9), v(0.12), v(0.9)]} />
                  <FlatMaterial tone={racketColours.trim} />
                </mesh>
                {/* where the left hand holds (LEFT_HAND_AT) */}
                <object3D ref={grip} position={[0, v(LEFT_HAND_AT), 0]} />
                <group position={[0, v(11.9), 0]} scale={[1, 1.32, 1]}>
                  <mesh>
                    <torusGeometry args={[v(2.6), v(0.22), 8, 48]} />
                    <FlatMaterial
                      tone={racketColours.frame}
                      idleOpacity={0.6}
                    />
                  </mesh>
                  <mesh>
                    <circleGeometry args={[v(2.5), 40]} />
                    <FlatMaterial tone={white} idleOpacity={0.08} />
                  </mesh>
                </group>
              </group>
            </group>
          </Part>
        </Joint>
      </group>

      {/* ---------- racket bag, left on the floor ----------
          Yonex Pro Tournament Bag 92231WEX in Fine Blue: a long blue body
          on a navy base, navy end pockets, a navy front pocket with a white
          band, a zip along the top and a carry handle. All in whole voxels,
          centred on x 10 / z 1. */}
      <Part id="bag" {...part}>
        {/* base */}
        <VoxelBox
          size={[v(12), v(1), v(5)]}
          position={[v(10), v(0.5), v(1)]}
          tone={BAG.navy}
        />
        {/* main body */}
        <VoxelBox
          size={[v(12), v(4), v(5)]}
          position={[v(10), v(3), v(1)]}
          tone={BAG.blue}
        />
        {/* end pockets */}
        <VoxelBox
          size={[v(1), v(5), v(5)]}
          position={[v(3.5), v(2.5), v(1)]}
          tone={BAG.navy}
        />
        <VoxelBox
          size={[v(1), v(5), v(5)]}
          position={[v(16.5), v(2.5), v(1)]}
          tone={BAG.navy}
        />
        {/* front pocket and its white band, on the camera side */}
        <VoxelBox
          size={[v(8), v(2), v(1)]}
          position={[v(10), v(2), v(4)]}
          tone={BAG.navy}
        />
        <VoxelBox
          size={[v(8), v(1), v(1)]}
          position={[v(10), v(3.5), v(4)]}
          tone={BAG.white}
        />
        {/* zip along the top */}
        <VoxelBox
          size={[v(10), v(1), v(1)]}
          position={[v(10), v(5.5), v(1)]}
          tone={BAG.zip}
        />
        {/* carry handle: two posts and the grip */}
        <VoxelBox
          size={[v(1), v(1), v(1)]}
          position={[v(8), v(6.5), v(1)]}
          tone={BAG.zip}
        />
        <VoxelBox
          size={[v(1), v(1), v(1)]}
          position={[v(12), v(6.5), v(1)]}
          tone={BAG.zip}
        />
        <VoxelBox
          size={[v(5), v(1), v(1)]}
          position={[v(10), v(7.5), v(1)]}
          tone={BAG.zip}
        />
      </Part>
    </group>
  );
}
