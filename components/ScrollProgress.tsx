"use client";

import { useEffect, useRef } from "react";
import Shuttle from "./Shuttle";

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

  // The bar runs along the bottom edge of the 68px header. The rail is 14px
  // tall with the 2px line centred in it (68 - 7 = 61), leaving room for the
  // shuttle's feathers on both sides of the line.
  //
  // The bar and marker use plain `transform` (not Tailwind's scale-x-* /
  // translate-*, which set the separate `scale`/`translate` properties)
  // because the effect above writes `transform` inline every frame.
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[61px] z-60 h-[14px]" aria-hidden="true">
      <div
        ref={barRef}
        className="absolute top-[6px] left-0 h-[2px] w-full origin-left [transform:scaleX(0)] bg-[linear-gradient(90deg,var(--accent-2),var(--accent))]"
      />
      {/* Rides the leading edge of the bar, centred on the line (6px + 1px). */}
      <div
        ref={markerRef}
        className="absolute top-[7px] left-0 leading-none opacity-0 transition-opacity duration-300 ease-soft max-[640px]:hidden"
      >
        {/* Drawn cork-down; turned -90° so the cork leads to the right. */}
        <Shuttle className="size-4 rotate-[-90deg] text-accent" />
      </div>
    </div>
  );
}
