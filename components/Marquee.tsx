import { stack } from "@/lib/content";
import Shuttle from "./Shuttle";
import styles from "./Marquee.module.css";

/** How many times the stack repeats in each half of the track. */
const REPEATS = 4;

export default function Marquee() {
  // Each half of the track must be wider than the screen, or the right edge
  // runs out of words on wide monitors. One pass of the stack is ~1100px, so
  // four passes covers screens up to ~4400px. The two identical halves let
  // the -50% translate loop with no seam.
  const half = Array.from({ length: REPEATS }, () => stack).flat();
  const items = [...half, ...half];

  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className={styles.item}>
            {item}
            <Shuttle className={styles.sep} />
          </span>
        ))}
      </div>
    </div>
  );
}
