"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { site } from "@/lib/content";
import Shuttle from "./Shuttle";
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

  const [open, setOpen] = useState(false);

  // The menu covers the page, so the page behind it shouldn't scroll — and
  // Escape should always get you out of it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

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
          <Shuttle className={styles.mark} />
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

        <button
          type="button"
          className={styles.menuBtn}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {/* Two strokes that cross into the net posts when open. */}
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </nav>

      <div
        id="mobile-nav"
        className={`${styles.sheet} ${open ? styles.sheetOpen : ""}`}
        hidden={!open}
      >
        {links.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            style={{ animationDelay: `${i * 45}ms` }}
          >
            <span className={styles.sheetNum}>{`0${i + 1}`}</span>
            {link.label}
          </a>
        ))}
      </div>
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
