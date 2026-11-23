"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/** Height of the sticky header (see SiteHeader.module.css). */
const HEADER_HEIGHT = 68;

/**
 * Eased, inertial scrolling for mouse wheels and trackpads. Touch screens
 * keep their native scrolling, which already feels right on phones.
 *
 * Lenis still moves the real window scroll position, so everything that
 * listens for `scroll` (the progress bar, the sticky header) keeps working.
 */
export default function SmoothScroll() {
  useEffect(() => {
    // People who ask for less motion get the browser's normal scrolling.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      // In-page links (#work, #contact…) glide too, and stop below the
      // sticky header instead of underneath it.
      anchors: { offset: -HEADER_HEIGHT },
    });

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
