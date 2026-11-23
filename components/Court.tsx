import type { CSSProperties } from "react";
import Shuttle from "./Shuttle";
import styles from "./Court.module.css";

/**
 * The hero's centrepiece: a badminton court in broadcast perspective, with a
 * shuttle flying a real 3D arc over the net.
 *
 * The court is one 3D plane (rotateX). Anything that has to stay readable —
 * the shuttle, its tracking box — is a child that counter-rotates by the same
 * angle, so it billboards toward the camera the way a sprite would in a game
 * engine. Court geometry below is the real thing, scaled at 50 units/metre:
 * 13.4m × 6.1m, net at halfway, short service line 1.98m off the net.
 */

const TILT = 56; // degrees; .billboard counter-rotates by exactly this

export default function Court() {
  return (
    <div className={styles.stage} style={{ "--tilt": `${TILT}deg` } as CSSProperties}>
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
                straight; it's drawn in as the shuttle flies it. Endpoints
                match the rally keyframes: (0.24, 0.16) of the court to
                (0.72, 0.76). */}
            <path
              className={styles.trail}
              d="M73 107Q140 300 220 509"
              pathLength={1}
            />
          </svg>

          {/* The shuttle, split in two: .flight carries the position on the
              court, .lift carries the height above it. That lets the shadow
              ride the ground while the shuttle rides the arc, and the gap
              between the two is what reads as height. */}
          <div className={styles.flight}>
            <span className={styles.shadow} />
            <div className={styles.lift}>
              <div className={styles.billboard}>
                <Shuttle className={styles.shuttle} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
