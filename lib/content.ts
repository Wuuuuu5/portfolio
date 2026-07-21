/**
 * Everything you need to edit lives in this file.
 * Change the data here; the components lay it out for you.
 */

export const site = {
  name: "Joseph Wu",
  handle: "joseph.wu",
  role: "CS Student · Auckland, New Zealand",
  email: "josephwu5354@gmail.com",
  // Any link left as "" is hidden automatically.
  github: "https://github.com/Wuuuuu5",
  linkedin: "https://linkedin.com/in/josephwu",
  resume: "",
  writing: "",
} as const;

export const hero = {
  // The words wrapped in the gradient. Keep it short — two or three words.
  headlineBefore: "I build things ",
  headlineAccent: "end to end",
  headlineAfter: ", then keep going until they work.",
  lede: "Computer Science student at the University of Auckland, graduating 2026. I work across React and TypeScript on the front end and Node, Python and PostgreSQL behind it — and I'm looking for a backend or full-stack internship where I'll get my code properly reviewed.",
  status: "Seeking 2026 SWE internships",
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

export type Project = {
  name: string;
  /** What it does, then the hardest part and how you solved it. */
  blurb: string;
  /** The thing you understand now that you didn't before. */
  learned: string;
  tags: string[];
  year: string;
  kind: string;
  /** Repo or live demo. Leave "" and the card renders without a link. */
  href?: string;
};

export const projects: Project[] = [
  {
    name: "AI Badminton Shot & Rally Analysis",
    blurb:
      "A computer vision system that detects and tracks shuttlecock trajectory from match footage, with player movement and shot detection built on a fine-tuned YOLOv8 model. It came out of my own competitive badminton — I wanted the analysis I could never get courtside.",
    learned:
      "That tracking a small, fast object through occlusion and motion blur is a data problem long before it's a model problem.",
    tags: ["Python", "OpenCV", "YOLOv8"],
    year: "2025 — present",
    kind: "Personal · In progress",
    href: "",
  },
  {
    name: "Trip Planning Website",
    blurb:
      "Full-stack travel planner covering destination search, personalised itineraries and hotel booking. I designed the REST API in Node and Express over a normalised PostgreSQL schema, and built user authentication plus itinerary management with interactive maps.",
    learned:
      "How much downstream pain a normalised schema saves — getting the travel data model right first made the API almost fall out of it.",
    tags: ["React", "Node.js", "Express", "PostgreSQL"],
    year: "2025 — present",
    kind: "Personal · In progress",
    href: "",
  },
  {
    name: "Food Ingredient Search",
    blurb:
      "Ingredient search platform built with two others over a semester, with user accounts, authentication, and a favouriting and comment system. We split the work and iterated in sprints across the build.",
    learned:
      "Working in a three-person codebase — that agreeing on interfaces early is what keeps parallel work from colliding at merge time.",
    tags: ["Python", "HTML", "CSS"],
    year: "2025",
    kind: "University · Team of 3",
    href: "",
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
      "Built a client-facing crypto wallet address search platform with a project manager and seven other engineers in an Agile team. I worked on the React and TypeScript front end, implementing wallet address search and lookup, and presented live demos to client stakeholders — explaining technical decisions, gathering feedback, and folding it into the UI across sprints.",
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
  heading: "Looking for a 2026 internship.",
  body: "Backend or full-stack, in Auckland or remote. If you've got a team that reviews code carefully, I'd like to talk.",
} as const;
