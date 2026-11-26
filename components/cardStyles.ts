/**
 * Tailwind classes shared by the Projects and Experience cards, so the two
 * stay identical.
 */

/**
 * The hover treatment: the background lifts, a service line paints down the
 * left edge (::before). Put
 * `group` on the same element so children can react (see TAG).
 */
export const SERVICE_CARD =
  "group relative overflow-hidden bg-bg transition-[background] duration-350 ease-soft hover:bg-bg-elev " +
  "before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:origin-top before:[transform:scaleY(0)] before:bg-accent before:transition-transform before:duration-550 before:ease-soft before:content-[''] hover:before:[transform:scaleY(1)]";

/** A tech tag that warms up when its card is hovered. */
export const TAG =
  "rounded-md border border-line-strong px-[0.62rem] py-[0.24rem] font-mono text-[0.71rem] text-fg-faint transition-colors duration-300 " +
  "group-hover:border-[color-mix(in_srgb,var(--accent-2)_40%,var(--line-strong))] group-hover:text-fg-dim";

/** The row of tags under a card. */
export const TAG_LIST = "mt-[1.2rem] flex list-none flex-wrap gap-[0.45rem]";
