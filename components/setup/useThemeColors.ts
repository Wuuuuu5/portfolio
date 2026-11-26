"use client";

import { useEffect, useState } from "react";

/** The site's colour tokens the 3D scene paints with. */
export type ThemeColors = {
  accent: string;
  accent2: string;
  fg: string;
  fgDim: string;
  bg: string;
  bgCourt: string;
  line: string;
};

function read(): ThemeColors {
  const s = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) =>
    s.getPropertyValue(name).trim() || fallback;
  return {
    accent: v("--accent", "#1d4ed8"),
    accent2: v("--accent-2", "#0369a1"),
    fg: v("--fg", "#0b1b3a"),
    fgDim: v("--fg-dim", "#4a5b7a"),
    bg: v("--bg", "#ffffff"),
    bgCourt: v("--bg-court", "#e2ebff"),
    line: v("--line-strong", "#c3d1ea"),
  };
}

/**
 * Reads the CSS colour tokens from globals.css, and re-reads them whenever
 * the light/dark toggle flips <html data-theme>, so the player's kit always
 * matches the rest of the page.
 */
export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(read);

  useEffect(() => {
    const observer = new MutationObserver(() => setColors(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}
