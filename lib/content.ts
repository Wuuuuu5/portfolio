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
    num: "01",
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
    num: "03",
    kicker: "The player",
    title: "About",
    note: "",
  },
  beyond: {
    num: "04",
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
    name: "WEB3UOA Club Platform",
    blurb:
      "The official site for the University of Auckland's Web3 and blockchain club, built in a WDCC team of ten, where members sign in with their crypto wallet. I started on the front end — navigation, the dark/light theme, and redesigns of the About, Events, Partners and wallet pages — then moved to the backend: QR event check-in, where every member has a personal QR code that admins scan with their phone camera to mark attendance, and admin management with user search and an audit trail of who granted or revoked access.",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    year: "2026",
    kind: "WDCC · Team of 10",
    shot: "Drop",
    href: "https://github.com/UoaWDCC/web3",
  },
  {
    name: "AI Badminton Shot & Rally Analysis",
    blurb:
      "A computer vision system that detects and tracks shuttlecock trajectory from match footage, with player movement and shot detection built on a fine-tuned YOLOv8 model. It came out of my own competitive badminton — I wanted the analysis I could never get courtside.",
    tags: ["Python", "OpenCV", "YOLOv8"],
    year: "2025 — present",
    kind: "Personal · In progress",
    shot: "Smash",
    href: "https://github.com/Wuuuuu5/badminton_ai",
  },
  {
    name: "Travelog",
    blurb:
      "A hotel price comparison app for New Zealand travel: search a destination, dates and guests, and compare prices across booking providers side by side. It started as a Vite and Express prototype, which I rebuilt from scratch on the Next.js App Router, moving the backend into route handlers, converting everything to strict TypeScript, and adding Supabase email sign-in. A GitHub Actions pipeline builds, type-checks and lints every pull request before it can merge. Next up: the results page, live pricing and a map view.",
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
      "I worked full stack as one of eight engineers, plus a project manager, building for a real client. Most of my time went into rebuilding the front end in React and TypeScript, and I built an internal QR code scanner that admins used to check people in and take attendance. I also worked directly with the client: I ran demos, talked them through why we'd built things the way we had, and took their feedback into the next sprint.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Agile"],
  },
];

export const about: string[] = [
  "I'm a Computer Science student at the University of Auckland, finishing in 2026.",
  "Most of what I know came from building something slightly beyond what I could already do and refusing to stop until it ran. The badminton analysis tool is the clearest example — I picked up computer vision because I wanted an answer about my own game that no existing tool would give me.",
  "The rest comes from working with other people: seven engineers and a real client at WDCC, a three-person team at university. What I want next is the part I can't get on my own — a codebase bigger than my head, and reviewers who'll tell me when I'm doing it the hard way.",
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
    body: "BSc in Computer Science at the University of Auckland, expected 2026.",
  },
  {
    label: "Captaining",
    body: "Team captain and head coach of a national-level badminton team for three years, running the training programmes for two of them.",
  },
  {
    label: "Competing",
    body: "Captain of a five-person competitive Valorant team, calling strategy and comms through tournaments.",
  },
];

export const contact = {
  kicker: "Let's connect",
  heading: "Looking for a 2026 internship.",
  body: "Backend or full-stack, in Auckland or remote. If you've got a team that reviews code carefully, I'd like to talk.",
} as const;
