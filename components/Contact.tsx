import { contact, site } from "@/lib/content";
import Reveal from "./Reveal";
import styles from "./Contact.module.css";

// Only links you've actually filled in show up.
const socials = [
  { href: site.github, label: "GitHub" },
  { href: site.linkedin, label: "LinkedIn" },
  { href: site.resume, label: "Résumé" },
  { href: site.writing, label: "Writing" },
].filter((s) => s.href);

export default function Contact() {
  return (
    <section id="contact" className={`${styles.contact} wrap`}>
      <Reveal as="h2" className={styles.heading}>
        {contact.heading}
      </Reveal>
      <Reveal as="p" className={styles.body} delay={70}>
        {contact.body}
      </Reveal>
      <Reveal delay={140}>
        <a href={`mailto:${site.email}`} className={styles.mail}>
          {site.email}
        </a>
      </Reveal>
      {socials.length > 0 ? (
        <Reveal className={styles.socials} delay={210}>
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener">
              {s.label}
            </a>
          ))}
        </Reveal>
      ) : null}
    </section>
  );
}
