/**
 * Everything you need to edit lives in this file.
 * Change the data here; the components lay it out for you.
 */

export const site = {
  name: "Joseph Wu",
  /** The hero swaps to this on hover; also beside the name in the header,
      footer and browser tab. */
  nameZh: "吴卓熙",
  /** One line under the name in the hero. */
  tagline: "Computer Science Student @ University of Auckland",
  /** Small line above the hero buttons. Leave "" to hide it. */
  availability: "Based in Auckland, New Zealand",
  handle: "joseph.wu",
  email: "josephwu5354@gmail.com",
  // Any link left as "" is hidden automatically.
  github: "https://github.com/Wuuuuu5",
  linkedin: "https://www.linkedin.com/in/josephwu02/",
  resume: "/cv.pdf",
  writing: "",
} as const;

/** Scrolls across the page under the hero. Only what you'd defend in an interview. */
export const stack: string[] = [
  "Python",
  "TypeScript",
  "React",
  "Node.js",
  "Express",
  "PostgreSQL",
  "Java",
  "Git",
];

/**
 * Section headers. `kicker` is the badminton framing, `title` is the plain-English
 * one — the theme sits on top of the content, never in place of it.
 */
export const sections = {
  work: {
    num: "03",
    kicker: "The rally",
    title: "Projects",
    note: "",
  },
  experience: {
    num: "02",
    kicker: "Match play",
    title: "Experience",
    note: "Shipping alongside other engineers, to a real client, on a deadline.",
  },
  about: {
    num: "01",
    kicker: "The player",
    title: "About",
    note: "",
  },
  skills: {
    num: "04",
    kicker: "Kit bag",
    title: "Tech stack",
    note: "",
  },
  beyond: {
    num: "05",
    kicker: "Off court",
    title: "Beyond the code",
    note: "Study, plus the years of captaining teams that taught me most of what I know about working with people.",
  },
} as const;

export type Project = {
  name: string;
  /** What it does, then the hardest part and how you solved it. */
  blurb: string;
  tags: string[];
  year: string;
  kind: string;
  /** Two-word badminton shot name used as the card's index label. */
  shot: string;
  /** Repo or live demo. Leave "" and the card renders without a link. */
  href?: string;
};

export const projects: Project[] = [
  {
    name: "WEB3 UoA",
    blurb:
      "Built the official website for the University of Auckland's Web3 and Blockchain Club as part of a 10-person WDCC team. Members can connect their crypto wallets to sign in. I initially worked on the frontend, including navigation, dark and light mode, and redesigning the About, Events, Partners and wallet pages.\n\n" +
      "I later moved on to backend features, including a QR code check-in system where admins can scan members' personal QR codes using their phone cameras to record attendance. I also worked on the admin management system, adding user search and an audit trail to track who granted or revoked admin access.",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    year: "2026",
    kind: "WDCC · Team of 10",
    shot: "Drop",
    href: "https://github.com/UoaWDCC/web3",
  },
  {
    name: "AI Badminton Shot & Rally Analysis",
    blurb:
      "A computer vision project that uses a fine-tuned YOLOv8 model to detect and track shuttlecock movement in badminton match footage. I'm also working on player tracking and shot detection to get more insight into what's happening during a match. The idea came from my own experience playing competitive badminton. I wanted to build a tool that could analyse matches and provide insights that are difficult to pick up just by watching courtside.",
    tags: ["Python", "OpenCV", "YOLOv8"],
    year: "2025 — present",
    kind: "Personal · In progress",
    shot: "Smash",
    href: "https://github.com/Wuuuuu5/badminton_ai",
  },
  {
    name: "Travelog",
    blurb:
      "A hotel price comparison app focused on helping people find and compare accommodation across New Zealand. Users can search by destination, dates and number of guests, with the aim of comparing prices across different booking providers in one place. I originally built it as a Vite and Express prototype before rebuilding it from scratch using Next.js App Router. I moved the backend into route handlers, switched to strict TypeScript, added Supabase email authentication and set up GitHub Actions to automatically build, type-check and lint every pull request. I'm currently working on the results page, live pricing and map view.",
    tags: ["Next.js", "TypeScript", "Supabase", "GitHub Actions"],
    year: "2025 — present",
    kind: "Personal · In progress",
    shot: "Clear",
    href: "https://github.com/Wuuuuu5/Travelog",
  },
];

export type Role = {
  title: string;
  org: string;
  when: string;
  blurb: string;
  tags: string[];
};

export const experience: Role[] = [
  {
    title: "Software Engineer",
    org: "WDCC — Web Development for Community & Clients",
    when: "2025",
    blurb:
      "Part of an eight-person engineering team working with a project manager to build a product for a real client. I mainly worked on the frontend, rebuilding it with React and TypeScript. I also built an internal QR code scanner that admins could use for event check-ins and attendance tracking. I had the chance to work directly with the client, show them our progress, explain technical decisions and make changes based on their feedback.",
    tags: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Badminton Coach",
    org: "Auckland Badminton Association",
    when: "2025 — present",
    blurb:
      "Help coach the Under-15 national squad, running training drills and working with players to improve their technique and footwork. I also support the head coach by identifying areas where individual players can improve. A big part of coaching is finding different ways to explain things so each player can understand and put them into practice.",
    tags: [],
  },
];

export const about: string[] = [
  "Hi, I'm Joseph — a Computer Science student at the University of Auckland, finishing in 2027.",
  "I like building things that are slightly beyond what I can already do, then sticking with them until they work. Most of my projects start from something I actually care about, like the badminton analysis tool I built to get answers about my own game.",
  "In my spare time I'm usually playing badminton, coaching it, or coding something new.",
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Languages",
    items: ["Python", "Java", "TypeScript", "JavaScript", "SQL", "HTML", "CSS"],
  },
  {
    group: "Frameworks",
    items: ["React", "Node.js", "Express", "Tailwind CSS"],
  },
  { group: "Databases", items: ["PostgreSQL", "SQLite"] },
  {
    group: "Tools & Practices",
    items: ["Git", "GitHub", "REST APIs", "Agile", "Responsive design"],
  },
];

/** The things that aren't code but say something about how you work. */
export const beyond: { label: string; body: string }[] = [
  {
    label: "Studying",
    body: "BSc in Computer Science at the University of Auckland, expected 2027.",
  },
  {
    label: "Captaining",
    body: "Team captain of a national-level badminton team for three years.",
  },
  {
    label: "Competing",
    body: "Captain of a five-person competitive Valorant team, calling strategy and comms through tournaments.",
  },
];

export const contact = {
  kicker: "Let's connect",
  heading: "Say hello.",
  body: "Whether it's a project, a question about something I've built, or a game of badminton, my inbox is always open.",
} as const;
