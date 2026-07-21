import { site } from "@/lib/content";
import styles from "./Loader.module.css";

/**
 * Intro curtain. Deliberately CSS-only — no state, no effects, no JS timers —
 * so it can't mismatch on hydration and costs nothing on the client. It lifts
 * itself away on a timeline and stops catching pointer events when it's gone.
 *
 * Timing here is the source of truth for LOADER_MS in Hero.tsx.
 */
export default function Loader() {
  const letters = [...site.name];

  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.inner}>
        <div className={styles.name}>
          {letters.map((char, i) => (
            <span
              key={i}
              className={styles.letter}
              style={{ animationDelay: `${i * 45}ms` }}
            >
              {char === " " ? " " : char}
            </span>
          ))}
        </div>
        <div className={styles.track}>
          <div className={styles.fill} />
        </div>
      </div>
    </div>
  );
}
