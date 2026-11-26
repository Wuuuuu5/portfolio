"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { site } from "@/lib/content";
import Shuttle from "./Shuttle";

// Every section, in page order, so the mobile menu's 01–07 match the
// section numbers on the page.
const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Projects" },
  { href: "#skills", label: "Stack" },
  { href: "#beyond", label: "Beyond" },
  { href: "#setup", label: "Setup" },
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
    <header
      className={`sticky top-0 z-50 animate-drop-in border-b backdrop-blur-[14px] backdrop-saturate-[180%] transition-[border-color,background] duration-300 ${
        // Once it sticks, the bottom edge reads as the net tape stretched across.
        stuck ? "border-line-strong bg-bg/74" : "border-transparent"
      }`}
    >
      <nav className="wrap flex h-[68px] items-center gap-6">
        <a href="#top" className="group/brand flex items-center gap-[0.55rem] font-mono font-semibold tracking-[-0.02em]">
          {/* A flick of the wrist on hover. */}
          <Shuttle className="h-auto w-[17px] text-accent drop-shadow-[0_0_8px_var(--glow)] transition-transform duration-500 ease-flight group-hover/brand:-translate-y-[2px] group-hover/brand:rotate-[-22deg]" />
          {site.handle}
          <span lang="zh-CN" className="font-sans font-normal tracking-normal text-fg-dim">
            {site.nameZh}
          </span>
        </a>

        <div className="ml-auto flex gap-6 text-[0.875rem] text-fg-dim max-[960px]:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative transition-colors duration-250 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-[width] after:duration-300 after:ease-soft after:content-[''] hover:text-fg hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="ml-auto grid size-9 cursor-pointer place-items-center rounded-[10px] border border-line-strong text-fg-dim transition-all duration-250 hover:rotate-[-18deg] hover:border-accent hover:text-fg"
          onClick={toggleTheme}
          aria-label="Toggle light and dark mode"
        >
          {/* Cork down in light mode, flipped cork-up in dark mode. Driven by
              <html data-theme> through the dark: variant, so the button needs
              no React state and can't mismatch on hydrate. */}
          <Shuttle className="size-[17px] text-accent transition-transform duration-600 ease-flight dark:rotate-180" />
        </button>

        {/* Mobile only, where the links above are hidden. */}
        <button
          type="button"
          className="group/menu ml-[0.6rem] hidden size-9 cursor-pointer place-content-center justify-items-center gap-[5px] rounded-[10px] border border-line-strong transition-colors duration-250 hover:border-accent max-[960px]:grid"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {/* Two strokes that cross, like a racket face, when open. */}
          <span className="h-[1.5px] w-[15px] rounded-[2px] bg-fg-dim transition-[translate,rotate,background] duration-350 ease-soft group-aria-expanded/menu:translate-y-[3.25px] group-aria-expanded/menu:rotate-45 group-aria-expanded/menu:bg-accent" />
          <span className="h-[1.5px] w-[15px] rounded-[2px] bg-fg-dim transition-[translate,rotate,background] duration-350 ease-soft group-aria-expanded/menu:-translate-y-[3.25px] group-aria-expanded/menu:-rotate-45 group-aria-expanded/menu:bg-accent" />
        </button>
      </nav>

      {/* Closed, the sheet is `hidden` so its links stay out of the tab order.
          Going from display:none to shown can't be transitioned, so the links
          animate in instead. */}
      <div
        id="mobile-nav"
        className={`hidden flex-col border-t border-line bg-bg/94 px-[var(--gutter)] pt-1 pb-7 backdrop-blur-[14px] ${open ? "max-[960px]:flex" : ""}`}
        hidden={!open}
      >
        {links.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            style={{ animationDelay: `${i * 45}ms` }}
            className={`flex items-baseline gap-[0.9rem] border-b border-line py-3 font-display text-[1.55rem] font-semibold tracking-[-0.03em] ${open ? "animate-sheet-in" : ""}`}
          >
            <span className="font-mono text-[0.7rem] tracking-[0.14em] text-accent">{`0${i + 1}`}</span>
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}

