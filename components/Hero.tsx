import { hero, site } from "@/lib/content";
import Reveal from "./Reveal";
import styles from "./Hero.module.css";

/**
 * How long the intro curtain owns the screen. The hero staggers in behind it
 * so the two read as one motion. Keep in sync with Loader.module.css.
 */
const LOADER_MS = 1250;

export default function Hero() {
  return (
    <div className={`${styles.hero} wrap`} id="top">
      <Reveal as="p" className={styles.eyebrow} delay={LOADER_MS}>
        {site.role}
      </Reveal>

      <Reveal as="h1" className={styles.title} delay={LOADER_MS + 90}>
        {hero.headlineBefore}
        <span className={styles.grad}>{hero.headlineAccent}</span>
        {hero.headlineAfter}
      </Reveal>

      <Reveal as="p" className={styles.lede} delay={LOADER_MS + 180}>
        {hero.lede}
      </Reveal>

      <Reveal className={styles.cta} delay={LOADER_MS + 270}>
        <a href="#work" className={`${styles.btn} ${styles.primary}`}>
          See what I&apos;ve built
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
        <a href={`mailto:${site.email}`} className={`${styles.btn} ${styles.ghost}`}>
          Get in touch
        </a>
      </Reveal>

      <Reveal delay={LOADER_MS + 360}>
        <p className={styles.status}>
          <i aria-hidden="true" />
          {hero.status}
        </p>
      </Reveal>
    </div>
  );
}
