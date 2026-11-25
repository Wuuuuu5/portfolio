/**
 * The shuttlecock. Drawn side-on with the cork leading (down), because that's
 * the only way one ever actually flies. Inherits currentColor so callers can
 * tint it; the cork is filled, the feather skirt is stroked.
 *
 * Detail, back to front: the far half of the rim, the feather shafts running
 * down into the cork, the two rows of binding thread, the scalloped feather
 * tips along the near rim, then the cork with its leather collar.
 */
export default function Shuttle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* far half of the rim, seen through the open skirt */}
      <path
        d="M4.6 4.4A11.4 3.3 0 0 1 27.4 4.4"
        strokeWidth="1.1"
        opacity="0.55"
      />

      {/* feather shafts, fanning from the rim down into the cork */}
      <path
        d="M6.1 6 12.9 20M10.3 7.3 14.3 20M16 7.7V20M21.7 7.3 17.7 20M25.9 6 19.1 20"
        strokeWidth="0.8"
        opacity="0.45"
      />

      {/* the two rows of thread that bind the feathers together */}
      <path
        d="M8.5 12Q16 14.6 23.5 12M10.6 16Q16 17.8 21.4 16"
        strokeWidth="1"
        opacity="0.8"
      />

      {/* sides of the skirt */}
      <path d="M4.6 4.4 12.6 20M27.4 4.4 19.4 20" />

      {/* near rim: one rounded tip per feather */}
      <path
        d="M4.6 4.4Q5 6 6.1 6Q8 7.6 10.3 7.3Q13 8.6 16 7.7Q19 8.6 21.7 7.3Q24 7.6 25.9 6Q27 6 27.4 4.4"
        strokeWidth="1.3"
      />

      {/* the tape band where the feathers seat into the cork: left hollow so it
          reads as a separate ring between the skirt and the cork */}
      <path d="M12.6 20h6.8v2.3h-6.8z" strokeWidth="1.1" />
      {/* cork */}
      <path
        d="M12.9 23.5h6.2v0.3a3.1 3.1 0 0 1-6.2 0z"
        fill="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
