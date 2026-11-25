"use client";

import { useRef, useState, type PointerEvent } from "react";
import { site } from "@/lib/content";
import Shuttle from "./Shuttle";

type Flight = { dir: "right" | "left"; id: number };

/** The wipe's timing; must match animate-fly-right/-left in globals.css. */
const WIPE = "transition-[clip-path] duration-1100 ease-[cubic-bezier(0.65,0,0.35,1)]";

/**
 * My name as a rally, seen side-on: a small court sits just below it (a
 * chalk floor line with a low net in the middle, kept clear of the letters),
 * and a shuttle waits on the floor at the left.
 *
 * Hover it (mouse), tap it (touch) or Tab to it / press Enter (keyboard) and
 * the shuttle is hit up over the net to the far baseline, wiping "Joseph Wu"
 * into 吴卓熙 right behind it. It stays there after you leave; the next
 * hover hits it back the other way. Between shots it rests where it landed,
 * so it always shows whose side it's on.
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
      // Each new hover is a fresh shot to the other side; leaving doesn't
      // send it back, so the name stays as the shuttle left it.
      onPointerEnter={(e) => isMouse(e) && show(!zh)}
      // Touch and pen have no hover, so a tap toggles instead.
      onClick={() => lastPointer.current !== "mouse" && show(!zh)}
      // Keyboard focus only: a tap also focuses the name, and would otherwise
      // swap it here and straight back again in onClick.
      onFocus={(e) => e.currentTarget.matches(":focus-visible") && show(!zh)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), show(!zh))}
      className="relative grid cursor-default font-display text-[clamp(3.5rem,13vw,11rem)] leading-none font-semibold tracking-[-0.045em] select-none focus-visible:outline-offset-[0.4em]"
    >
      {/* ---------- the court, behind the letters ---------- */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Floor: a chalk line under the name, with a baseline tick at each end. */}
        <span className="absolute -inset-x-[0.2em] top-[calc(100%+0.42em)] h-[max(2px,0.025em)] bg-line-strong" />
        <span className="absolute -left-[0.2em] top-[calc(100%+0.42em)] h-[0.12em] w-[max(2px,0.025em)] -translate-y-full bg-line-strong" />
        <span className="absolute -right-[0.2em] top-[calc(100%+0.42em)] h-[0.12em] w-[max(2px,0.025em)] -translate-y-full bg-line-strong" />

        {/* Net, side-on: posts, mesh and the white tape along the top. */}
        <span className="absolute left-1/2 top-[calc(100%+0.1em)] h-[0.32em] w-[0.16em] -translate-x-1/2 border-x-[max(2px,0.02em)] border-line-strong opacity-80 [background-image:repeating-linear-gradient(90deg,var(--line-strong)_0_1px,transparent_1px_0.04em),repeating-linear-gradient(0deg,var(--line-strong)_0_1px,transparent_1px_0.04em)]">
          <span className="absolute -inset-x-[max(2px,0.02em)] top-0 h-[max(3px,0.03em)] bg-chalk" />
        </span>
      </span>

      {/* ---------- the two names ---------- */}
      <span
        aria-hidden="true"
        className={`relative col-start-1 row-start-1 px-[0.1em] text-center whitespace-nowrap ${WIPE}`}
        style={{ clipPath: zh ? "inset(-0.2em 0 -0.2em 100%)" : "inset(-0.2em 0 -0.2em 0)" }}
      >
        {site.name}
      </span>
      <span
        aria-hidden="true"
        lang="zh-CN"
        className={`relative col-start-1 row-start-1 px-[0.1em] text-center tracking-[0.02em] whitespace-nowrap text-accent ${WIPE}`}
        style={{ clipPath: zh ? "inset(-0.2em 0 -0.2em 0)" : "inset(-0.2em 100% -0.2em 0)" }}
      >
        {site.nameZh}
      </span>

      {/* ---------- the shuttle ----------
          Outer: where it is across the court, sitting on the floor line.
          Inner: its height above the floor and its tilt. Before the first
          shot it waits at the left, cork up, ready to serve. */}
      <span
        key={flight?.id ?? "rest"}
        aria-hidden="true"
        className={`pointer-events-none absolute top-[calc(100%+0.42em)] [transform:translate(-50%,-50%)] ${
          flight ? (flight.dir === "right" ? "animate-fly-right" : "animate-fly-left") : "left-0"
        }`}
      >
        <Shuttle
          className={`block size-[0.42em] text-accent drop-shadow-[0_0_14px_var(--glow)] ${
            flight
              ? flight.dir === "right"
                ? "animate-arc-right"
                : "animate-arc-left"
              : "[translate:0_-0.2em] rotate-[-135deg]"
          }`}
        />
      </span>
    </h1>
  );
}
