import { projects, sections, type Project } from "@/lib/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import styles from "./Projects.module.css";

export default function Projects() {
  return (
    <section id="work" className="wrap">
      <SectionHeading {...sections.work} />
      <div className={`${styles.grid} court-panel`}>
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
  const { name, blurb, learned, tags, year, kind, shot, href } = project;

  // Cards without a link render as a plain block so there's no dead anchor.
  const Tag = href ? "a" : "div";
  const linkProps = href
    ? { href, target: "_blank", rel: "noreferrer noopener" }
    : {};

  return (
    <Tag className={styles.card} {...linkProps}>
      <div className={styles.shot}>
        <span className={styles.shotName}>{shot}</span>
      </div>

      <div className={styles.body}>
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
