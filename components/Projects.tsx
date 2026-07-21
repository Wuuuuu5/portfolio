import { projects, type Project } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import styles from "./Projects.module.css";

export default function Projects() {
  return (
    <section id="work" className="wrap">
      <SectionHeading
        num="01"
        title="Things I've built"
        note="Each one started as a problem I actually had. Two are still in progress — that's honest, not a disclaimer."
      />
      <div className={styles.grid}>
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
  const { name, blurb, learned, tags, year, kind, href } = project;

  // Cards without a link render as a plain block so there's no dead anchor.
  const Tag = href ? "a" : "div";
  const linkProps = href
    ? { href, target: "_blank", rel: "noreferrer noopener" }
    : {};

  return (
    <Tag className={styles.card} {...linkProps}>
      <div>
        <h3 className={styles.name}>
          {name}
          {href ? (
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          ) : null}
        </h3>
        <p className={styles.blurb}>{blurb}</p>
        <p className={styles.learned}>
          <b>What it taught me:</b> {learned}
        </p>
        <ul className={styles.tags}>
          {tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.meta}>
        {year}
        <br />
        {kind}
      </div>
    </Tag>
  );
}
