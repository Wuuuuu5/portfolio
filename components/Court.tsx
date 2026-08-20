"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import { rally } from "@/lib/content";
import Shuttle from "./Shuttle";
import styles from "./Court.module.css";

/**
 * The hero's centrepiece: a badminton court in broadcast perspective, with a
 * shuttle flying a real 3D arc over the net and a tracking overlay riding along
 * with it — a stylised nod to the CV project this whole site opens with.
 *
 * The court is one 3D plane (rotateX). Anything that has to stay readable —
 * the shuttle, its tracking box — is a child that counter-rotates by the same
 * angle, so it billboards toward the camera the way a sprite would in a game
 * engine. Court geometry below is the real thing, scaled at 50 units/metre:
 * 13.4m × 6.1m, net at halfway, short service line 1.98m off the net.
 */

const TILT = 56; // degrees; .billboard counter-rotates by exactly this

export default function Court() {
  const stageRef = useRef<HTMLDivElement>(null);

  // Pointer parallax. Written straight to CSS custom properties rather than
  // React state — this fires on every mouse move and must not re-render.
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const box = stage.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    stage.style.setProperty("--sway-x", `${x * 7}deg`);
    stage.style.setProperty("--sway-y", `${y * -4}deg`);
  };

  const onPointerLeave = () => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--sway-x", "0deg");
    stage.style.setProperty("--sway-y", "0deg");
  };

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      style={{ "--tilt": `${TILT}deg` } as CSSProperties}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* Telemetry bar — the broadcast overlay above the court. */}
      <div className={styles.hud}>
        <span className={styles.chip}>
          <i aria-hidden="true" />
          {rally.label}
        </span>
        <span className={`${styles.chip} ${styles.chipShot}`}>{rally.shot}</span>
      </div>

      <div className={styles.scene}>
        <div className={styles.floor}>
          <svg className={styles.lines} viewBox="-14 -14 333 698" aria-hidden="true">
            {/* playing surface */}
            <rect
              x="0"
              y="0"
              width="305"
              height="670"
              rx="2"
              className={styles.surface}
            />

            {/* Chalk. pathLength="1" normalises every line to the same length,
                so one dash animation paints the whole court on in step. */}
            <g className={styles.chalk}>
              <rect x="0" y="0" width="305" height="670" pathLength={1} />
              {/* singles sidelines, 0.46m in from the doubles line */}
              <path d="M23 0V670M282 0V670" pathLength={1} />
              {/* short service lines, 1.98m off the net */}
              <path d="M0 236H305M0 434H305" pathLength={1} />
              {/* doubles long service lines, 0.76m off the back */}
              <path d="M0 38H305M0 632H305" pathLength={1} />
              {/* centre lines through both service courts */}
              <path d="M152.5 0V236M152.5 434V670" pathLength={1} />
            </g>

            {/* the net, strung a little past the sidelines onto its posts */}
            <rect
              className={styles.net}
              x="-13"
              y="332"
              width="331"
              height="6"
              rx="3"
            />

            {/* The smash projected down onto the court. All the curve in a
                shuttle's flight is height, so its ground track is very nearly
                straight — the dashed line is the prediction, the solid one is
                drawn in as the shuttle tracks it. Endpoints match the rally
                keyframes: (0.24, 0.16) of the court to (0.72, 0.76). */}
            <path className={styles.trailBase} d="M73 107Q140 300 220 509" />
            <path
              className={styles.trail}
              d="M73 107Q140 300 220 509"
              pathLength={1}
            />

            {/* player positions, the way a tracker would mark them */}
            <g className={styles.marker}>
              <circle cx="88" cy="152" r="16" />
              <circle cx="88" cy="152" r="3.5" className={styles.markerDot} />
            </g>
            <g className={`${styles.marker} ${styles.markerNear}`}>
              <circle cx="196" cy="466" r="16" />
              <circle cx="196" cy="466" r="3.5" className={styles.markerDot} />
            </g>

            {/* where the smash is dug up */}
            <circle className={styles.impact} cx="220" cy="509" r="10" />
          </svg>

          {/* The shuttle overlay, split into the two things a tracker measures
              separately: .flight carries the position on the court, .lift
              carries the height above it. Splitting them lets the shadow ride
              the ground track while the shuttle rides the arc — and the gap
              between the two is what reads as height.
              The label is a sibling of the box, not a child: .box is masked
              down to corner ticks, and a mask clips its descendants too. */}
          <div className={styles.flight}>
            <span className={styles.shadow} />
            <div className={styles.lift}>
              <div className={styles.billboard}>
                <div className={styles.box} />
                <span className={styles.boxLabel}>shuttle 0.98</span>
                <Shuttle className={styles.shuttle} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.caption}>{rally.caption}</p>
    </div>
  );
}
