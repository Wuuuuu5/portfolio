/**
 * A section break drawn as the net: white tape along the top, mesh hanging
 * below it, fading out toward the edges of the hall. Purely decorative.
 */
export default function NetDivider() {
  return (
    <div
      // Strung between two posts: solid in the middle, gone at the walls.
      className="pointer-events-none relative h-[58px] [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]"
      aria-hidden="true"
    >
      <div className="h-[3px] bg-chalk opacity-55" />
      {/* Two crossed gradients make the square mesh; it fades as it hangs. */}
      <div className="h-[calc(100%-3px)] opacity-75 [background-image:repeating-linear-gradient(90deg,var(--line-strong)_0_1px,transparent_1px_11px),repeating-linear-gradient(0deg,var(--line-strong)_0_1px,transparent_1px_11px)] [mask-image:linear-gradient(#000,transparent_92%)]" />
    </div>
  );
}
