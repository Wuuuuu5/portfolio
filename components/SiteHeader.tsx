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
          aria-label="Toggle light and dark mode"
        >
          {/* Cork down in light mode; flips cork-up for dark (CSS). */}
          <Shuttle className={styles.themeShuttle} />
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

