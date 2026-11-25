"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { equipment, setupSection, type Equipment, type EquipmentId } from "@/lib/setup";
import SectionHeading from "./SectionHeading";
import PixelIcon from "./setup/PixelIcon";
import type { LeaderPoint } from "./setup/SetupScene";

// The 3D bundle (three.js, R3F, drei) is kept out of the first page load and
// never rendered on the server. It's fetched in the background once the page
// is idle (see below), so it's usually cached before the section arrives.
const loadScene = () => import("./setup/SetupScene");
const SetupScene = dynamic(loadScene, {
  ssr: false,
  loading: () => <StageMessage>Loading the player…</StageMessage>,
});

/** Run `fn` once the page has loaded and the browser has a quiet moment. */
function whenIdle(fn: () => void) {
  let idleId: number | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const schedule = () => {
    if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(fn, { timeout: 3000 });
    else timer = setTimeout(fn, 1500);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timer !== undefined) clearTimeout(timer);
  };
}

/** Wide screen with a real mouse: card docks inside the stage with a leader line. */
const WIDE_QUERY = "(min-width: 900px) and (hover: hover) and (pointer: fine)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

const ignoreHover = () => {};

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * "My Badminton Setup": a voxel player in my kit. Hover (or tap) any item to
 * light it up and see its details. All the gear lives in lib/setup.ts.
 */
export default function BadmintonSetup() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  const [near, setNear] = useState(false);
  const [hovered, setHovered] = useState<EquipmentId | null>(null);
  const [selected, setSelected] = useState<EquipmentId>(equipment[0].id);

  const wide = useMediaQuery(WIDE_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_QUERY);

  // Download the 3D code in the background as soon as the page is idle.
  useEffect(() => whenIdle(() => void loadScene()), []);

  // Mount the scene (WebGL setup, shader compile) well before the section
  // arrives, so the player is already drawn when it scrolls into view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "1200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Leaving mid-hover shouldn't strand a pointer cursor.
  useEffect(() => () => void (document.body.style.cursor = ""), []);

  // Drawn straight onto the SVG on each 3D frame: no React re-render per frame.
  const onLeader = useCallback(
    (point: LeaderPoint) => {
      const line = lineRef.current;
      const dot = dotRef.current;
      const stage = stageRef.current;
      const card = cardRef.current;
      if (!line || !dot) return;
      const show = Boolean(point && wide && stage && card);
      line.style.opacity = dot.style.opacity = show ? "1" : "0";
      if (!show || !point || !stage || !card) return;
      const s = stage.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      line.setAttribute("x1", String(point.x));
      line.setAttribute("y1", String(point.y));
      line.setAttribute("x2", String(c.left - s.left));
      line.setAttribute("y2", String(c.top - s.top + 36));
      dot.setAttribute("cx", String(point.x));
      dot.setAttribute("cy", String(point.y));
    },
    [wide],
  );

  const activeId = hovered ?? selected;
  const active = equipment.find((e) => e.id === activeId) ?? equipment[0];

  return (
    <section id="setup" ref={sectionRef} className="wrap">
      <SectionHeading {...setupSection} />

      <div
        ref={stageRef}
        className="relative h-[clamp(480px,74vh,740px)] overflow-hidden rounded-[18px] border border-line bg-bg-elev max-[640px]:h-[460px]"
      >
        <div className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing">
          <StageBoundary>
            {near ? (
              <SetupScene
                active={activeId}
                // Touch screens fire a "hover" on tap that never clears, so
                // there the tap (onSelect) alone decides what's shown.
                onHover={wide ? setHovered : ignoreHover}
                onSelect={setSelected}
                onLeader={onLeader}
                reducedMotion={reducedMotion}
              />
            ) : (
              <StageMessage>Loading the player…</StageMessage>
            )}
          </StageBoundary>
        </div>

        {/* Leader line from the active item to the card. */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <line ref={lineRef} stroke="var(--accent)" strokeWidth="1.25" style={{ opacity: 0 }} className="transition-opacity duration-200" />
          <circle ref={dotRef} r="3.5" fill="var(--accent)" style={{ opacity: 0 }} className="transition-opacity duration-200" />
        </svg>

        {wide ? (
          <div ref={cardRef} className="absolute right-6 top-6 w-[270px]" aria-live="polite">
            <EquipmentCard item={active} />
          </div>
        ) : null}

        {/* Works without a mouse or WebGL: keyboard, touch and screen readers. */}
        <div
          className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2 sm:inset-x-6 sm:bottom-6"
          role="group"
          aria-label="Choose a piece of equipment"
        >
          {equipment.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === activeId}
              onClick={() => setSelected(item.id)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(item.id)}
              onBlur={() => setHovered(null)}
              className="min-h-11 cursor-pointer rounded-md border border-line-strong bg-bg/80 px-4 text-sm text-fg-dim backdrop-blur-sm transition-colors hover:border-accent hover:text-fg aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-accent-ink"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {wide ? null : (
        <div className="mt-4 flex justify-center" aria-live="polite">
          <div className="w-full max-w-[460px]">
            <EquipmentCard item={active} />
          </div>
        </div>
      )}

      <p className="mt-4 text-[0.8rem] text-fg-faint">
        The voxel player was inspired by{" "}
        <a
          href="https://youyangfu.com"
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          Frank Fu&apos;s portfolio
        </a>
        .
      </p>
    </section>
  );
}

export function EquipmentCard({ item }: { item: Equipment }) {
  return (
    <article className="rounded-md border border-line-strong bg-bg/90 p-5 text-left text-fg shadow-[0_18px_40px_-24px_var(--fg)] backdrop-blur-md">
      {/* The racket is long and detailed, so it gets a taller frame. */}
      <div className={`mb-4 flex items-center justify-center ${item.id === "racket" ? "h-52" : "h-32"}`}>
        {item.image ? (
          // Plain <img>: product shots are small, optional and user-supplied.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="max-h-full max-w-full object-contain" src={item.image} alt={`${item.brand} ${item.model}`} loading="lazy" />
        ) : (
          <PixelIcon key={item.id} id={item.id} className="h-full w-auto" />
        )}
      </div>

      <p className="flex items-center gap-2 text-xs text-fg-dim">
        <span className="size-2 bg-accent" aria-hidden="true" />
        {item.label}
      </p>
      <h3 className="mt-1 font-display text-lg leading-snug font-semibold tracking-tight">
        {item.brand} {item.model}
      </h3>

      <dl className="mt-3 grid gap-1 border-t border-line pt-3">
        {item.specs.map((spec) => (
          <div key={spec.label} className="grid grid-cols-[6.5rem_1fr] gap-3 text-[0.8rem]">
            <dt className="text-fg-faint">{spec.label}</dt>
            <dd className="text-fg">{spec.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[0.82rem] leading-relaxed text-fg-dim">{item.comment}</p>
    </article>
  );
}

function StageMessage({ children }: { children: ReactNode }) {
  return <div className="absolute inset-0 grid place-items-center p-8 text-center text-[0.95rem] text-fg-dim">{children}</div>;
}

/** If WebGL isn't available, keep the section useful: the buttons and card still work. */
class StageBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <StageMessage>3D isn&apos;t available in this browser. Pick an item below to see its details.</StageMessage>
    ) : (
      this.props.children
    );
  }
}
