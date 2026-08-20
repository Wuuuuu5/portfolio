import { stack } from "@/lib/content";
import Shuttle from "./Shuttle";
import styles from "./Marquee.module.css";

export default function Marquee() {
  // Duplicated so the -50% translate loops seamlessly.
  const items = [...stack, ...stack];

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
