/**
 * The shuttlecock. Drawn side-on with the cork leading (down), because that's
 * the only way one ever actually flies. Inherits currentColor so callers can
 * tint it; the cork is filled, the feather skirt is stroked.
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
      {/* feather skirt */}
      <path d="M4.6 4.4 12.6 20h6.8L27.4 4.4" />
      {/* the open rim at the top of the skirt */}
      <ellipse cx="16" cy="4.4" rx="11.4" ry="3.3" />
      {/* individual feathers */}
      <path
        d="M16 7.7v12.3M10.1 6.4 13.5 20M21.9 6.4 18.5 20"
        strokeWidth="1.1"
        opacity="0.5"
      />
      {/* cork */}
      <path
        d="M12.6 20h6.8v2.7a3.4 3.4 0 0 1-6.8 0z"
        fill="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
