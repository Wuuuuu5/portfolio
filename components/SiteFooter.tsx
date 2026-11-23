import { site } from "@/lib/content";
import Shuttle from "./Shuttle";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} wrap`}>
        <span className={styles.brand}>
          <Shuttle className={styles.mark} />© {new Date().getFullYear()}{" "}
          {site.name}
        </span>
      </div>
    </footer>
  );
}
