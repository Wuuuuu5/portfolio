import { contact, site } from "@/lib/content";
import Reveal from "./Reveal";
import Shuttle from "./Shuttle";
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
    <section id="contact" className={styles.contact}>
      <div className={`${styles.inner} wrap`}>
        <Reveal as="p" className={styles.kicker}>
          <Shuttle className={styles.mark} />
          {contact.kicker}
        </Reveal>

        <Reveal as="h2" className={styles.heading} delay={60}>
          {contact.heading}
        </Reveal>

        <Reveal as="p" className={styles.body} delay={120}>
          {contact.body}
        </Reveal>

        <Reveal delay={180}>
          <a href={`mailto:${site.email}`} className={styles.mail}>
            <span>{site.email}</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </Reveal>

        {socials.length > 0 ? (
          <Reveal className={styles.socials} delay={240}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                {s.label}
              </a>
            ))}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
