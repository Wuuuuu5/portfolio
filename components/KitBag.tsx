"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Matter from "matter-js";
import { sections, site, skills } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import { SERVICE_CARD } from "./cardStyles";

const { Bodies, Body, Composite, Constraint, Engine, Sleeping } = Matter;

/**
 * closed    → the big zipped bag, waiting to be opened
 * unzipping → the pull runs along the zip and a racket slides up out of the bag
 * leaving   → the bag fades away
 * open      → the bag is gone and a block tower of skills builds up in its place;
 *             every block can be dragged out of the tower
 */
type Phase = "closed" | "unzipping" | "leaving" | "open";

const UNZIP_MS = 750;
// The racket starts rising once the zip is most of the way open, then hangs for a beat.
const RACKET_DELAY_MS = 450;
const RACKET_MS = 900;
const HOLD_MS = 350;
const LEAVE_AT = RACKET_DELAY_MS + RACKET_MS + HOLD_MS;
const LEAVE_MS = 420;

export default function KitBag() {
  const [phase, setPhase] = useState<Phase>("closed");
  const timers = useRef<number[]>([]);
  const zipBack = useRef<HTMLButtonElement>(null);
  const bagButton = useRef<HTMLButtonElement>(null);
  // Only move focus once the visitor has opened or closed the bag themselves.
  const touched = useRef(false);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!touched.current) return;
    if (phase === "open") zipBack.current?.focus({ preventScroll: true });
    if (phase === "closed") bagButton.current?.focus({ preventScroll: true });
  }, [phase]);

  const unzip = () => {
    if (phase !== "closed") return;
    touched.current = true;
    setPhase("unzipping");
    timers.current.push(
      window.setTimeout(() => setPhase("leaving"), LEAVE_AT),
      window.setTimeout(() => setPhase("open"), LEAVE_AT + LEAVE_MS),
    );
  };

  const zipUp = () => {
    touched.current = true;
    setPhase("closed");
  };

  const unzipped = phase !== "closed";
  const open = phase === "open";

  return (
    <section id="skills" className="wrap">
      <SectionHeading {...sections.skills} />

      {/* The bag and the tubes share one grid cell and both stay mounted, so the section
          is always as tall as the taller of the two and nothing below it jumps on open/close. */}
      <div className="grid items-center">
        <div
          key={open ? "bag-away" : "bag"}
          inert={open}
          className={`grid justify-items-center [grid-area:1/1] ${open ? "invisible" : "animate-bag-in"}`}
        >
          <button
            ref={bagButton}
            type="button"
            onClick={unzip}
            aria-label="Unzip the kit bag to see my tech stack"
            className={`group/bag w-[min(100%,46rem)] cursor-pointer rounded-[3rem] transition-[opacity,scale,filter,translate] ease-soft focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent ${
              phase === "leaving"
                ? "scale-110 opacity-0 blur-sm"
                : "duration-300 hover:-translate-y-1"
            }`}
            style={{
              transitionDuration:
                phase === "leaving" ? `${LEAVE_MS}ms` : undefined,
            }}
          >
            <Bag unzipped={unzipped} />
          </button>
          <p
            className={`mt-4 text-[0.9rem] text-fg-dim transition-opacity duration-300 ${unzipped ? "opacity-0" : ""}`}
            aria-hidden="true"
          >
            Unzip the bag to see what&apos;s inside
          </p>
        </div>

        <div
          inert={!open}
          className={`[grid-area:1/1] ${open ? "" : "invisible"}`}
        >
          {/* Keyed on open, so closing the bag puts every dragged block back. */}
          <Tower key={open ? "open" : "closed"} building={open} />
          <div className="mt-6 flex justify-center">
            <button
              ref={zipBack}
              type="button"
              onClick={zipUp}
              className="cursor-pointer rounded-full px-3 py-1 text-[0.85rem] text-fg-faint transition-colors duration-250 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            >
              Zip the bag back up
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A big thermal racket bag, side-on, with the zip running along the top. */
/** Outline of the bag's front face. */
const FRONT =
  "M60 84H540Q564 84 568 108L580 262Q582 284 558 284H42Q18 284 20 262L32 108Q36 84 60 84Z";

function Bag({ unzipped }: { unzipped: boolean }) {
  const move: CSSProperties = {
    transition: `transform ${UNZIP_MS}ms var(--ease-shuttle)`,
  };
  return (
    <svg
      viewBox="0 -75 600 375"
      className="block h-auto w-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        {/* Fixed colours, whatever the theme: a black tour bag with a blue front panel. */}
        <linearGradient id="bag-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f2229" />
          <stop offset="1" stopColor="#07080b" />
        </linearGradient>
        <linearGradient id="bag-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a8ef0" />
          <stop offset="1" stopColor="#0b56b8" />
        </linearGradient>
        {/* The front face: a box that's a touch wider at the base, soft at the corners. */}
        <clipPath id="bag-shape">
          <path d={FRONT} />
        </clipPath>
        {/* Everything above the zip line: the racket only shows once it clears the opening. */}
        <clipPath id="bag-inside">
          <rect x="0" y="-400" width="600" height="500" />
        </clipPath>
        <clipPath id="racket-head">
          <ellipse cx="450" cy="186" rx="38" ry="52" />
        </clipPath>
      </defs>

      {/* Carry handles: webbing loops that come up off the front of the bag. */}
      <path
        d="M205 124V96C205 28 275 28 275 96V124M325 124V96C325 28 395 28 395 96V124"
        fill="none"
        strokeWidth="12"
        strokeLinecap="round"
        stroke="#121419"
      />

      {/* Side panel, so the bag reads as a box seen slightly from the right. */}
      <path
        d="M556 88L588 104Q596 108 596 118L598 260Q598 274 586 278L566 284Z"
        fill="#050608"
      />

      {/* Front face. */}
      <path d={FRONT} fill="url(#bag-body)" />
      <g clipPath="url(#bag-shape)">
        {/* The shard graphic on the black half. */}
        <path
          d="M392 150L478 112L530 196L436 236Z"
          fill="#5b3fd0"
          opacity="0.45"
        />
        <path
          d="M452 206L566 150L600 264L506 290Z"
          fill="#2f86e8"
          opacity="0.35"
        />
        <path
          d="M356 262L430 184L476 290L380 300Z"
          fill="#7c5cff"
          opacity="0.3"
        />
        {/* The big blue panel: its top runs right out to the far corner, then the edge sweeps back down. */}
        <path
          d="M0 132Q20 122 62 122L560 104Q586 104 572 128L330 300H0Z"
          fill="url(#bag-panel)"
        />
      </g>

      {/* Where the handles stitch onto the front. */}
      {[199, 269, 319, 389].map((x) => (
        <rect
          key={x}
          x={x}
          y="96"
          width="12"
          height="34"
          rx="3"
          fill="#121419"
        />
      ))}

      <text
        x="62"
        y="236"
        className="font-display"
        style={{
          fill: "#ffffff",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: "0.03em",
        }}
      >
        {site.handle.toUpperCase()}
      </text>

      {/* The opening: a hairline while zipped, a dark gap once undone. */}
      <rect
        x="60"
        y="92"
        width="480"
        height="16"
        rx="8"
        style={{
          ...move,
          // Always dark, whatever the theme: it's the inside of the bag.
          fill: "#050b1a",
          opacity: 0.85,
          transformBox: "fill-box",
          transformOrigin: "center",
          transform: unzipped ? "scaleY(1)" : "scaleY(0.1)",
        }}
      />
      {/* Zip pull: rides from one end of the zip to the other. */}
      <g
        style={{ ...move, transform: unzipped ? "translateX(470px)" : "none" }}
      >
        <rect x="54" y="93" width="18" height="14" rx="3" fill="#9aa3b2" />
        <rect
          x="58"
          y="105"
          width="10"
          height="24"
          rx="5"
          className="origin-top transition-transform duration-300 group-hover/bag:rotate-[18deg]"
          style={{ fill: "var(--accent)", transformBox: "fill-box" }}
        />
      </g>

      {/* The racket: hidden inside the bag, then it slides diagonally up out of the open zip,
          head first. The tilt sits outside the slide, so it travels along its own length. */}
      <g clipPath="url(#bag-inside)">
        <g transform="rotate(25 450 100)">
          <g
            style={{
              transition: `transform ${RACKET_MS}ms var(--ease-shuttle) ${unzipped ? RACKET_DELAY_MS : 0}ms`,
              transform: unzipped ? "translateY(-181px)" : "none",
            }}
          >
            <Racket x={450} top={130} />
          </g>
        </g>
      </g>
    </svg>
  );
}

/** A badminton racket standing head-up; `top` is the top of the frame. */
function Racket({ x, top }: { x: number; top: number }) {
  const cy = top + 56;
  return (
    <g>
      {/* Strings: a light grid, clipped to the inside of the frame. */}
      <g
        clipPath="url(#racket-head)"
        stroke="#dfe6f0"
        strokeWidth="1.2"
        opacity="0.7"
      >
        {[-28, -14, 0, 14, 28].map((d) => (
          <path key={`v${d}`} d={`M${x + d} ${top}V${top + 112}`} />
        ))}
        {[-36, -18, 0, 18, 36].map((d) => (
          <path key={`h${d}`} d={`M${x - 42} ${cy + d}H${x + 42}`} />
        ))}
      </g>
      {/* One-piece frame: the shaft runs straight into the bottom of the head, no T-joint. */}
      <rect
        x={x - 2.5}
        y={top + 108}
        width="5"
        height="116"
        rx="2.5"
        fill="#1b2230"
      />
      <ellipse
        cx={x}
        cy={cy}
        rx="42"
        ry="56"
        fill="none"
        stroke="#2f86e8"
        strokeWidth="7"
      />
      {/* Handle with a white grip and a dark butt cap. */}
      <rect
        x={x - 8}
        y={top + 222}
        width="16"
        height="74"
        rx="6"
        fill="#f2f4f7"
      />
      <rect
        x={x - 9}
        y={top + 292}
        width="18"
        height="10"
        rx="4"
        fill="#1b2230"
      />
    </g>
  );
}

type Layer =
  | { kind: "group"; label: string; count: number }
  | { kind: "row"; items: (string | null)[] };

/**
 * Top-down: each group's name is a long block lying across the tower, with its skills
 * underneath as rows of three short blocks. Gaps sit where a real tower would have them:
 * a lone block holds the middle, a pair holds the two sides.
 *
 * The short row (if any) goes first, right under the group's long block, which bridges
 * its gaps. A full row stacked on a short one would have nothing under its ends and the
 * physics would drop them.
 */
const LAYERS: Layer[] = skills.flatMap((group) => {
  const rows: Layer[] = [];
  const short = group.items.length % 3;
  // Where each row starts: the short row first, then full rows of three.
  const cuts = short ? [0] : [];
  for (let i = short; i < group.items.length; i += 3) cuts.push(i);
  for (const [n, start] of cuts.entries()) {
    const chunk = group.items.slice(start, cuts[n + 1] ?? group.items.length);
    const items =
      chunk.length === 1
        ? [null, chunk[0], null]
        : chunk.length === 2
          ? [chunk[0], null, chunk[1]]
          : chunk;
    rows.push({ kind: "row", items });
  }
  return [
    { kind: "group", label: group.group, count: group.items.length } as Layer,
    ...rows,
  ];
});

/** Same hover as the Projects and Experience cards: the service line and the hall light. */
const BLOCK = `${SERVICE_CARD} flex items-center rounded-[5px] ring-1 ring-line`;

const BLOCK_H = 44;
const GAP = 3;
const MAX_TOWER_W = 432;
/** Room above the tower to lift blocks into. */
const HEADROOM = 150;
const AREA_H = LAYERS.length * BLOCK_H + HEADROOM;

type Spec = {
  key: string;
  /** Layer counted from the ground up. */
  level: number;
  /** Column in a row of three, or null for a long group block. */
  slot: number | null;
  className: string;
  content: ReactNode;
};

/** Every block, in the order they land: bottom layer first, left to right. */
const SPECS: Spec[] = LAYERS.flatMap((layer, l): Spec[] => {
  const level = LAYERS.length - 1 - l;
  if (layer.kind === "group") {
    return [
      {
        key: `${l}`,
        level,
        slot: null,
        className: `${BLOCK} justify-between px-4 font-mono text-[0.7rem] tracking-[0.2em] uppercase`,
        content: (
          <>
            <span className="text-accent">{layer.label}</span>
            <span className="text-fg-faint tabular-nums">
              {String(layer.count).padStart(2, "0")}
            </span>
          </>
        ),
      },
    ];
  }
  return layer.items.flatMap((item, slot): Spec[] =>
    item
      ? [
          {
            key: `${l}-${slot}`,
            level,
            slot,
            className: `${BLOCK} justify-center px-2 text-center text-[0.84rem] leading-[1.15] text-fg-dim hover:text-fg`,
            content: item,
          },
        ]
      : [],
  );
}).sort((a, b) => a.level - b.level || (a.slot ?? 0) - (b.slot ?? 0));

/**
 * The stack is built one block at a time, from the ground up, each time the bag opens.
 * Then it's a real stack: blocks have weight and friction, so you can pull one out,
 * fling it, or knock the whole thing over.
 */
function Tower({ building }: { building: boolean }) {
  // Bumped on rebuild so the physics world starts again from scratch.
  const [round, setRound] = useState(0);
  const [moved, setMoved] = useState(false);

  return (
    <div className="grid justify-items-center">
      {/* Screen readers get the plain list; the tower itself is decoration. */}
      <ul className="sr-only">
        {skills.map((group) => (
          <li key={group.group}>
            {group.group}: {group.items.join(", ")}
          </li>
        ))}
      </ul>

      <p aria-hidden="true" className="mb-2 text-[0.85rem] text-fg-faint">
        Grab a block and pull it out, or knock the tower over
      </p>

      <PhysicsStack
        key={round}
        building={building}
        onGrab={() => setMoved(true)}
      />
      {/* The table the tower stands on. */}
      <div className="h-px w-full bg-line-strong" />

      <button
        type="button"
        onClick={() => {
          setMoved(false);
          setRound((r) => r + 1);
        }}
        tabIndex={moved ? 0 : -1}
        className={`mt-4 cursor-pointer rounded-full border border-line-strong px-4 py-1.5 text-[0.85rem] text-fg-dim transition-[opacity,color,border-color] duration-300 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent ${
          moved ? "" : "pointer-events-none opacity-0"
        }`}
      >
        Rebuild the tower
      </button>
    </div>
  );
}

/**
 * The physics runs in matter-js. React renders the blocks once, and every frame each
 * block's element is moved to match its body. Dragging pins a spring between the
 * pointer and the spot on the block you grabbed, so blocks swing and shove their
 * neighbours like the real thing.
 */
function PhysicsStack({
  building,
  onGrab,
}: {
  building: boolean;
  onGrab: () => void;
}) {
  const area = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const world = useRef<{
    engine: Matter.Engine;
    bodies: (Matter.Body | null)[];
  } | null>(null);
  const grab = useRef<Matter.Constraint | null>(null);

  useEffect(() => {
    const box = area.current;
    if (!building || !box) return;

    const W = box.clientWidth;
    const towerW = Math.min(W, MAX_TOWER_W);
    const left = (W - towerW) / 2;
    const shortW = (towerW - 2 * GAP) / 3;

    const engine = Engine.create({
      enableSleeping: true,
      positionIterations: 12,
      velocityIterations: 10,
    });
    const bodies: (Matter.Body | null)[] = SPECS.map(() => null);
    world.current = { engine, bodies };

    // A closed box: floor, ceiling and both sides sit just outside the visible area,
    // so no block can leave it. They're thick so a hard fling can't tunnel through.
    const solid = { isStatic: true, friction: 1 };
    const T = 400;
    Composite.add(engine.world, [
      Bodies.rectangle(W / 2, AREA_H + T / 2, W + 2 * T, T, solid),
      Bodies.rectangle(W / 2, -T / 2, W + 2 * T, T, solid),
      Bodies.rectangle(-T / 2, AREA_H / 2, T, AREA_H + 2 * T, solid),
      Bodies.rectangle(W + T / 2, AREA_H / 2, T, AREA_H + 2 * T, solid),
    ]);

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const sizes = SPECS.map((spec) => (spec.slot === null ? towerW : shortW));
    const timers = SPECS.map((spec, i) => {
      const w = sizes[i];
      const x =
        spec.slot === null ? W / 2 : left + w / 2 + spec.slot * (w + GAP);
      const y = AREA_H - spec.level * BLOCK_H - BLOCK_H / 2;
      const el = els.current[i];
      if (el) {
        el.style.width = `${w}px`;
        el.style.height = `${BLOCK_H}px`;
      }
      const spawn = () => {
        const body = Bodies.rectangle(x, reduce ? y : y - 40, w, BLOCK_H, {
          friction: 0.9,
          frictionStatic: 1.5,
          restitution: 0,
          density: 0.002,
          slop: 0.02,
          chamfer: { radius: 4 },
        });
        bodies[i] = body;
        Composite.add(engine.world, body);
        if (el) el.style.visibility = "visible";
      };
      if (reduce) {
        spawn();
        return 0;
      }
      return window.setTimeout(spawn, i * 90);
    });

    let raf = 0;
    const tick = () => {
      Engine.update(engine, 1000 / 60);
      bodies.forEach((body, i) => {
        const el = els.current[i];
        if (!body || !el) return;
        // Safety net: if a block ever does slip out of the box, put it back inside.
        const { x, y } = body.position;
        if (x < 0 || x > W || y < 0 || y > AREA_H) {
          Body.setPosition(body, {
            x: Math.min(Math.max(x, sizes[i] / 2), W - sizes[i] / 2),
            y: Math.min(Math.max(y, BLOCK_H), AREA_H - BLOCK_H),
          });
          Body.setVelocity(body, { x: 0, y: 0 });
          Body.setAngularVelocity(body, 0);
        }
        el.style.transform = `translate(${body.position.x - sizes[i] / 2}px, ${
          body.position.y - BLOCK_H / 2
        }px) rotate(${body.angle}rad)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      world.current = null;
      grab.current = null;
    };
  }, [building]);

  const toWorld = (e: React.PointerEvent) => {
    // Clamped to the box, so dragging past the edge holds the block against the wall
    // instead of yanking it through.
    const rect = area.current!.getBoundingClientRect();
    return {
      x: Math.min(Math.max(e.clientX - rect.left, 0), rect.width),
      y: Math.min(Math.max(e.clientY - rect.top, 0), rect.height),
    };
  };

  const release = () => {
    if (grab.current && world.current) {
      Composite.remove(world.current.engine.world, grab.current);
    }
    grab.current = null;
  };

  return (
    <div
      ref={area}
      aria-hidden="true"
      className="relative w-full overflow-hidden"
      style={{ height: AREA_H }}
    >
      {SPECS.map((spec, i) => (
        <div
          key={spec.key}
          ref={(el) => {
            els.current[i] = el;
          }}
          className={`${spec.className} invisible top-0 left-0 cursor-grab touch-none select-none will-change-transform active:cursor-grabbing`}
          style={{ position: "absolute" }}
          onPointerDown={(e) => {
            const body = world.current?.bodies[i];
            if (!body || !world.current || e.button !== 0) return;
            release();
            e.currentTarget.setPointerCapture(e.pointerId);
            const point = toWorld(e);
            Sleeping.set(body, false);
            grab.current = Constraint.create({
              pointA: point,
              bodyB: body,
              pointB: {
                x: point.x - body.position.x,
                y: point.y - body.position.y,
              },
              stiffness: 0.2,
              damping: 0.1,
              length: 0,
            });
            Composite.add(world.current.engine.world, grab.current);
            onGrab();
          }}
          onPointerMove={(e) => {
            if (grab.current) grab.current.pointA = toWorld(e);
          }}
          onPointerUp={release}
          onPointerCancel={release}
        >
          {spec.content}
        </div>
      ))}
    </div>
  );
}
