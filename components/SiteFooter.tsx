import { site } from "@/lib/content";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} wrap`}>
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>Built with Next.js — no templates, no tracking.</span>
      </div>
    </footer>
  );
}
