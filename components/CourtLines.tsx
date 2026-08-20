import styles from "./CourtLines.module.css";

/**
 * Doubles sidelines and tramlines, pinned to the viewport so the whole page
 * reads as if it's laid out on a court. Purely decorative and hidden on narrow
 * screens, where there isn't margin to spare for them.
 */
export default function CourtLines() {
  return (
    <div className={styles.lines} aria-hidden="true">
      <span className={styles.outer} />
      <span className={styles.inner} />
      <span className={styles.inner} />
      <span className={styles.outer} />
    </div>
  );
}
