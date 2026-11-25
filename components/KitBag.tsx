"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { sections, site, skills } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import { SERVICE_CARD } from "./cardStyles";

/**
 * closed    → the big zipped bag, waiting to be opened
 * unzipping → the pull runs along the zip and a racket slides up out of the bag
 * leaving   → the bag fades away
 * open      → the bag is gone and a block tower of skills builds up in its place
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
          <Tower building={open} />
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
 */
const LAYERS: Layer[] = skills.flatMap((group) => {
  const rows: Layer[] = [];
  for (let i = 0; i < group.items.length; i += 3) {
    const chunk = group.items.slice(i, i + 3);
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

/** The order blocks land in: bottom layer first, left to right. */
const DROP_ORDER = (() => {
  const order = new Map<string, number>();
  let n = 0;
  for (let l = LAYERS.length - 1; l >= 0; l--) {
    const layer = LAYERS[l];
    if (layer.kind === "group") order.set(`${l}`, n++);
    else layer.items.forEach((item, s) => item && order.set(`${l}-${s}`, n++));
  }
  return order;
})();

/** Same hover as the Projects and Experience cards: the service line and the hall light. */
const BLOCK = `${SERVICE_CARD} flex h-11 items-center rounded-[5px] ring-1 ring-line`;

/** The stack is built one block at a time, from the ground up, each time the bag opens. */
function Tower({ building }: { building: boolean }) {
  const drop = (key: string) => ({
    className: building ? "animate-block-drop" : "",
    style: { "--i": DROP_ORDER.get(key) } as CSSProperties,
  });

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

      <div aria-hidden="true" className="grid w-[min(100%,27rem)] gap-[3px]">
        {LAYERS.map((layer, l) =>
          layer.kind === "group" ? (
            <div key={l} {...drop(`${l}`)}>
              <div
                className={`${BLOCK} justify-between px-4 font-mono text-[0.7rem] tracking-[0.2em] uppercase`}
              >
                <span className="text-accent">{layer.label}</span>
                <span className="text-fg-faint tabular-nums">
                  {String(layer.count).padStart(2, "0")}
                </span>
              </div>
            </div>
          ) : (
            <div key={l} className="grid grid-cols-3 gap-[3px]">
              {layer.items.map((item, s) =>
                item ? (
                  <div key={s} {...drop(`${l}-${s}`)}>
                    <div
                      className={`${BLOCK} justify-center px-2 text-center text-[0.84rem] leading-[1.15] text-fg-dim hover:text-fg`}
                    >
                      {item}
                    </div>
                  </div>
                ) : (
                  <span key={s} />
                ),
              )}
            </div>
          ),
        )}
      </div>
      {/* The table the tower stands on. */}
      <div className="mt-1 h-px w-[min(100%,32rem)] bg-line-strong" />
    </div>
  );
}
