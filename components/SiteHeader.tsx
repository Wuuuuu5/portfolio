"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/lib/content";
import styles from "./SiteHeader.module.css";

const links = [
  { href: "#work", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export default function SiteHeader() {
  // Reading scroll as an external store keeps the border in sync without
  // mirroring browser state into React state.
  const stuck = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 12,
    () => false,
  );

  // The theme lives on <html data-theme>, set before paint by the inline
  // script in layout.tsx. Keeping it out of React state avoids a hydration
  // mismatch; the icons swap in CSS off the same attribute.
  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private browsing — the choice still applies for this session.
    }
  };

  return (
    <header className={`${styles.header} ${stuck ? styles.stuck : ""}`}>
      <nav className={`${styles.nav} wrap`}>
        <a href="#top" className={styles.brand}>
          <span className={styles.dot} aria-hidden="true" />
          {site.handle}
        </a>

        <div className={styles.links}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className={styles.themeBtn}
          onClick={toggleTheme}
          aria-label="Toggle color theme"
        >
          <MoonIcon />
          <SunIcon />
        </button>
      </nav>
    </header>
  );
}

function MoonIcon() {
  return (
    <svg
      className={styles.moon}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      className={styles.sun}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
