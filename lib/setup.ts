/**
 * "My Badminton Setup" — everything the 3D section shows lives here.
 * Edit the gear below; the section and its info cards lay it out for you.
 *
 * Anything in [square brackets] is a placeholder for you to replace.
 */

export type EquipmentId =
  | "racket"
  | "jersey"
  | "shorts"
  | "shoes"
  | "socks"
  | "bag";

export type Equipment = {
  id: EquipmentId;
  /** Short name on the buttons and the card's heading. */
  label: string;
  brand: string;
  model: string;
  /** Shown as a two-column list on the card. Keep values short. */
  specs: { label: string; value: string }[];
  /** Your own take — why you use it, what it's good or bad at. */
  comment: string;
  /**
   * Optional product photo. Put the file in /public (e.g. /public/setup/racket.webp)
   * and write "/setup/racket.webp" here. Leave "" to show no image.
   */
  image?: string;
};

export const setupSection = {
  num: "05",
  kicker: "Kit bag",
  title: "My Badminton Setup",
  note: "Drag to turn the player around. Point at, or tap, any piece of kit to see what it is and what I think of it.",
} as const;

/**
 * Optional: a real 3D model of you in your kit (.glb), placed in /public.
 * Leave "" to use the built-in stylised player.
 *
 * For hover to work on a custom model, each item must be its own mesh (or a
 * group of meshes) whose name starts with the item's id — "racket",
 * "jersey", "shorts", "shoes", "socks", "bag" (e.g. "shoes_left" counts as
 * shoes). Name them that way when you export from Blender.
 */
export const modelUrl = "";

export const equipment: Equipment[] = [
  {
    id: "racket",
    label: "Racket",
    brand: "[Racket brand]",
    model: "[Racket model]",
    specs: [
      { label: "Weight", value: "[e.g. 4U, 83g]" },
      { label: "Balance", value: "[e.g. head heavy]" },
      { label: "Flex", value: "[e.g. stiff]" },
      { label: "String", value: "[string, tension]" },
    ],
    comment: "[Why you play with this racket, and what it suits in your game.]",
    image: "",
  },
  {
    id: "jersey",
    label: "Jersey",
    brand: "[Jersey brand]",
    model: "[Jersey model]",
    specs: [
      { label: "Fit", value: "[e.g. regular]" },
      { label: "Fabric", value: "[e.g. quick-dry polyester]" },
    ],
    comment: "[What you like about it.]",
    image: "",
  },
  {
    id: "shorts",
    label: "Shorts",
    brand: "[Shorts brand]",
    model: "[Shorts model]",
    specs: [
      { label: "Fit", value: "[e.g. regular]" },
      { label: "Length", value: "[e.g. 7 inch]" },
    ],
    comment: "[What you like about them.]",
    image: "",
  },
  {
    id: "shoes",
    label: "Shoes",
    brand: "[Shoe brand]",
    model: "[Shoe model]",
    specs: [
      { label: "Size", value: "[your size]" },
      { label: "Cushioning", value: "[e.g. Power Cushion]" },
      { label: "Grip", value: "[e.g. gum rubber sole]" },
    ],
    comment: "[How they feel on court.]",
    image: "",
  },
  {
    id: "socks",
    label: "Socks",
    brand: "[Sock brand]",
    model: "[Sock model]",
    specs: [{ label: "Type", value: "[e.g. crew, cushioned sole]" }],
    comment: "[Why these.]",
    image: "",
  },
  {
    id: "bag",
    label: "Bag",
    brand: "[Bag brand]",
    model: "[Bag model]",
    specs: [
      { label: "Holds", value: "[e.g. 6 rackets]" },
      { label: "Compartments", value: "[e.g. thermal, shoe pocket]" },
    ],
    comment: "[What you carry in it.]",
    image: "",
  },
];
