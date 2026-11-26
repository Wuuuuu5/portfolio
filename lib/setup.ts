/**
 * "My Badminton Setup" — everything the 3D section shows lives here.
 * Edit the gear below; the section and its info cards lay it out for you.
 *
 * Anything in [square brackets] is a placeholder for you to replace.
 */

export type EquipmentId = "racket" | "jersey" | "shorts" | "shoes" | "bag";

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
  num: "06",
  kicker: "The gear",
  title: "My Badminton Setup",
  note: "Drag to turn the player around. Point at, or tap, any piece of kit to see what it is and what I think of it.",
} as const;

/**
 * Optional: a real 3D model of you in your kit (.glb), placed in /public.
 * Leave "" to use the built-in stylised player.
 *
 * For hover to work on a custom model, each item must be its own mesh (or a
 * group of meshes) whose name starts with the item's id — "racket",
 * "jersey", "shorts", "shoes", "bag" (e.g. "shoes_left" counts as
 * shoes). Name them that way when you export from Blender.
 */
export const modelUrl = "";

/**
 * My racket's colourway (Yonex Astrox 100 ZZ). Both the 3D racket and the
 * pixel racket on the card are painted from it.
 */
export const racketColourway: keyof typeof racketColourways = "dark-navy";

export const racketColourways = {
  "dark-navy": {
    frame: "#2f4590", // the navy frame
    frameShadow: "#18234d",
    frameHighlight: "#7f9bf0", // gloss along the lit edge
    shaft: "#3a4f96",
    trim: "#d9a441", // gold detailing: shaft rings, grip collar
  },
  kurenai: {
    frame: "#c8102e",
    frameShadow: "#7a0a1d",
    frameHighlight: "#ff5a6e",
    shaft: "#2a2b30",
    trim: "#d9a441",
  },
} as const;

export const racketColours = racketColourways[racketColourway];

/**
 * The real colours of the rest of my kit. The 3D player (when an item
 * lights up) and the pixel icon on its card are both painted from these.
 */
export const kitColours = {
  /** P.R IND Kaleidoscope training shirt, blue colourway: white fading to
      light blue, dark purple brush strokes, orange flecks, black logo. */
  jersey: {
    white: "#f3f5fa",
    blue: "#9dbcf2",
    purple: "#3a2a7c",
    orange: "#f27a3c",
    logo: "#16181d",
  },
  /** Yonex Power Cushion Eclipsion X, the white pair. */
  shoes: {
    upper: "#dfe5ef", // white, tinted grey so it still shows on a light page
    edge: "#b9c3d6",
    sole: "#9aa6bd",
    accent: "#1b2a55", // navy heel tab / side panel
  },
  /** Plain black shorts. */
  shorts: {
    main: "#16181d",
    band: "#33363f", // waistband, a shade lighter so it reads as a seam
  },
  /** Yonex Pro Tournament Bag 92231WEX in Fine Blue. */
  bag: {
    blue: "#3a6fd1",
    navy: "#1b2a55",
    white: "#f3f5fa",
    zip: "#1a1d26",
  },
} as const;

export const equipment: Equipment[] = [
  {
    id: "racket",
    label: "Racket",
    brand: "Yonex",
    model: "Astrox 100 ZZ",
    specs: [
      { label: "Weight", value: "[3U (88g) or 4U (83g)]" },
      { label: "Balance", value: "Head heavy" },
      { label: "Flex", value: "Extra stiff" },
      { label: "String", value: "Yonex BG80 Power" },
      { label: "Tension", value: "[e.g. 26 lbs]" },
    ],
    comment: "[Why you play with this racket, and what it suits in your game.]",
    image: "",
  },
  {
    id: "jersey",
    label: "Jersey",
    brand: "",
    model: "P.R IND KALEIDOSCOPE",
    specs: [],
    comment: "",
    image: "",
  },
  {
    id: "shorts",
    label: "Shorts",
    brand: "Yonex",
    model: "Shorts",
    specs: [],
    comment: "",
    image: "",
  },
  {
    id: "shoes",
    label: "Shoes",
    brand: "Yonex",
    model: "Power Cushion Eclipsion X",
    specs: [
      { label: "Size", value: "[your size]" },
      { label: "Cushioning", value: "Power Cushion" },
      { label: "Grip", value: "[e.g. gum rubber sole]" },
    ],
    comment: "[How they feel on court.]",
    image: "",
  },
  {
    id: "bag",
    label: "Bag",
    brand: "Yonex",
    model: "Pro Tournament Bag 92231WEX",
    specs: [
      { label: "Colour", value: "Fine Blue" },
      { label: "Holds", value: "[e.g. 6 rackets]" },
      { label: "Compartments", value: "[e.g. thermal, shoe pocket]" },
    ],
    comment: "[What you carry in it.]",
    image: "",
  },
];
