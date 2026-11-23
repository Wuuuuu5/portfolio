"use client";

import { useEffect, useRef } from "react";
import Shuttle from "./Shuttle";
import styles from "./ScrollProgress.module.css";

/**
 * The net tape across the top of the page, with the shuttle riding its leading
 * edge to show how far down you are. Writes both transforms directly on each
 * animation frame — this runs on every scroll event, so keeping it out of React
 * state avoids re-rendering the page.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const marker = markerRef.current;
    const rail = bar?.parentElement;
    if (!bar || !marker || !rail) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const raw = scrollable > 0 ? window.scrollY / scrollable : 0;
      const ratio = Math.min(Math.max(raw, 0), 1);
      bar.style.transform = `scaleX(${ratio})`;
      // The shuttle flies cork-first along the bar, with the cork tip on the
      // bar's leading edge. It's measured against the rail rather than 100vw
      // so it can't drift past the bar by the width of the scrollbar.
      // 82% is where the cork tip sits across the (rotated) shuttle's box.
      const x = ratio * rail.clientWidth;
      marker.style.transform = `translate(calc(${x}px - 82%), -50%)`;
      marker.style.opacity = ratio > 0.005 ? "1" : "0";
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={styles.rail} aria-hidden="true">
      <div ref={barRef} className={styles.bar} />
      <div ref={markerRef} className={styles.marker}>
        <Shuttle className={styles.shuttle} />
      </div>
    </div>
  );
}
