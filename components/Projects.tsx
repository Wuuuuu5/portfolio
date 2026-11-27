import { projects, sections, type Project } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { SERVICE_CARD, TAG, TAG_LIST } from "./cardStyles";

export default function Projects() {
  return (
    <section id="work" className="wrap">
      <SectionHeading {...sections.work} />
      {/* Layout comes from .court-panel in globals: 1px gaps over a
          line-coloured background draw the dividers between cards. */}
      <div className="court-panel">
        {projects.map((project, i) => (
          <Reveal key={project.name} delay={i * 70}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { name, blurb, tags, year, kind, shot, href } = project;

  // Cards without a link render as a plain block so there's no dead anchor.
  const Tag = href ? "a" : "div";
  const linkProps = href
    ? { href, target: "_blank", rel: "noreferrer noopener" }
    : {};

  return (
    <Tag
      className={`${SERVICE_CARD} grid h-full grid-cols-[7rem_minmax(0,1fr)_auto] items-start gap-6 p-[clamp(1.6rem,3vw,2.5rem)] max-[880px]:grid-cols-[minmax(0,1fr)_auto] max-[600px]:grid-cols-[minmax(0,1fr)]`}
      {...linkProps}
    >
      {/* Shot label: its own row above the content on narrower screens. */}
      <div className="relative pt-[0.3rem] max-[880px]:col-span-full max-[880px]:pt-0">
        <span className="inline-block border-b border-accent/35 pb-[0.45rem] font-mono text-[0.72rem] tracking-[0.2em] text-accent uppercase">
          {shot}
        </span>
      </div>

      <div className="min-w-0">
        <h3 className="flex items-center gap-[0.6rem] font-display text-[clamp(1.25rem,2vw,1.5rem)] leading-[1.2] font-semibold tracking-[-0.025em]">
          {name}
          {href ? (
            <span
              className="text-fg-faint transition-[translate,color] duration-350 ease-flight group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
              aria-hidden="true"
            >
              ↗
            </span>
          ) : null}
        </h3>
        {/* A blank line in the blurb starts a new paragraph. */}
        {blurb.split("\n\n").map((para, i) => (
          <p
            key={i}
            className={`${i ? "mt-3" : "mt-[0.7rem]"} max-w-[62ch] text-[0.98rem] text-fg-dim`}
          >
            {para}
          </p>
        ))}
        <ul className={TAG_LIST}>
          {tags.map((tag) => (
            <li key={tag} className={TAG}>
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-[0.3rem] text-right font-mono text-[0.75rem] leading-[1.7] whitespace-nowrap text-fg-faint max-[600px]:pt-0 max-[600px]:text-left">
        {year}
        <br />
        {kind}
      </div>
    </Tag>
  );
}
