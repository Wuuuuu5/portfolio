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
    if (!bar || !marker) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const raw = scrollable > 0 ? window.scrollY / scrollable : 0;
      const ratio = Math.min(Math.max(raw, 0), 1);
      bar.style.transform = `scaleX(${ratio})`;
      // The marker travels the viewport width, offset back by half its own
      // size so it sits centred on the bar's leading edge.
      marker.style.transform = `translateX(calc(${ratio * 100}vw - 50%))`;
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
