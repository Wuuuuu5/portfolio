import styles from "./NetDivider.module.css";

/**
 * A section break drawn as the net: white tape along the top, mesh hanging
 * below it, fading out toward the edges of the hall. Purely decorative.
 */
export default function NetDivider() {
  return (
    <div className={styles.net} aria-hidden="true">
      <div className={styles.tape} />
      <div className={styles.mesh} />
    </div>
  );
}
