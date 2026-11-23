"use client";

import { useRef, useState, type PointerEvent } from "react";
import { site } from "@/lib/content";
import Shuttle from "./Shuttle";

type Flight = { dir: "right" | "left"; id: number };

/** The wipe's easing; must match animate-fly-right/-left in globals.css. */
const WIPE = "transition-[clip-path] duration-900 ease-[cubic-bezier(0.65,0,0.35,1)]";

/**
 * My name, huge. Hover it (mouse), tap it (touch) or Tab to it (keyboard)
 * and a shuttle flies across, wiping "Joseph Wu" into 吴卓熙 right behind
 * it. Leave and it flies back.
 *
 * Both names sit in the same grid cell and fill its full width, so their
 * clip-path percentages and the shuttle's `left` all measure the same box
 * and stay in step.
 */
export default function NameSwap() {
  const [zh, setZh] = useState(false);
  const [flight, setFlight] = useState<Flight | null>(null);
  const lastPointer = useRef<string>("mouse");

  const show = (next: boolean) => {
    if (next === zh) return;
    setZh(next);
    // A new id remounts the shuttle, restarting its animation mid-flight too.
    setFlight({ dir: next ? "right" : "left", id: Date.now() });
  };

  const isMouse = (e: PointerEvent) => e.pointerType === "mouse";

  return (
    <h1
      tabIndex={0}
      aria-label={`${site.name}, ${site.nameZh}`}
      onPointerDown={(e) => (lastPointer.current = e.pointerType)}
      onPointerEnter={(e) => isMouse(e) && show(true)}
      onPointerLeave={(e) => isMouse(e) && show(false)}
      // Touch and pen have no hover, so a tap toggles instead.
      onClick={() => lastPointer.current !== "mouse" && show(!zh)}
      // Keyboard focus only: a tap also focuses the name, and would otherwise
      // swap it here and straight back again in onClick.
      onFocus={(e) => e.currentTarget.matches(":focus-visible") && show(true)}
      onBlur={() => show(false)}
      className="relative grid cursor-default font-display text-[clamp(3.5rem,13vw,11rem)] leading-none font-semibold tracking-[-0.045em] select-none focus-visible:outline-offset-8"
    >
      <span
        aria-hidden="true"
        className={`col-start-1 row-start-1 px-[0.1em] text-center whitespace-nowrap ${WIPE}`}
        style={{ clipPath: zh ? "inset(0 0 0 100%)" : "inset(0 0 0 0)" }}
      >
        {site.name}
      </span>
      <span
        aria-hidden="true"
        lang="zh-CN"
        className={`col-start-1 row-start-1 px-[0.1em] text-center tracking-[0.02em] whitespace-nowrap text-accent ${WIPE}`}
        style={{ clipPath: zh ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
      >
        {site.nameZh}
      </span>

      {flight ? (
        <span
          key={flight.id}
          aria-hidden="true"
          // Outer: rides the wipe edge across (left: 0% → 100%), centred on it.
          className={`pointer-events-none absolute top-1/2 [transform:translate(-50%,-50%)] motion-reduce:hidden ${
            flight.dir === "right" ? "animate-fly-right" : "animate-fly-left"
          }`}
        >
          {/* Inner: fades in and out and lifts mid-flight. Drawn cork-down,
              so it's turned to lead cork-first in the direction of travel. */}
          <Shuttle
            className={`block size-[0.42em] animate-flight text-accent opacity-0 drop-shadow-[0_0_14px_var(--glow)] ${
              flight.dir === "right" ? "rotate-[-90deg]" : "rotate-90"
            }`}
          />
        </span>
      ) : null}
    </h1>
  );
}
