/**
 * Doubles sidelines and tramlines, pinned to the viewport so the whole page
 * reads as if it's laid out on a court. Purely decorative and hidden on narrow
 * screens, where there isn't margin to spare for them.
 */
export default function CourtLines() {
  return (
    <div
      // Fades top and bottom so the lines never fight the content.
      className="pointer-events-none fixed inset-0 -z-1 flex justify-center [mask-image:linear-gradient(transparent,#000_18%,#000_82%,transparent)] max-[1320px]:hidden"
      aria-hidden="true"
    >
      {/* Sideline and tramline, 22px apart; the two pairs sit just outside
          the content width (--maxw). */}
      <span className="h-full w-px bg-chalk-faint" />
      <span className="ml-[22px] h-full w-px bg-chalk-faint opacity-60" />
      <span className="ml-[calc(var(--maxw)-46px)] h-full w-px bg-chalk-faint opacity-60" />
      <span className="ml-[22px] h-full w-px bg-chalk-faint" />
    </div>
  );
}
