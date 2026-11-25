import { contact, site } from "@/lib/content";
import Reveal from "./Reveal";
import Shuttle from "./Shuttle";

// Only links you've actually filled in show up.
const socials = [
  { href: site.github, label: "GitHub" },
  { href: site.linkedin, label: "LinkedIn" },
  { href: site.resume, label: "CV" },
  { href: site.writing, label: "Writing" },
].filter((s) => s.href);

export default function Contact() {
  return (
    <section
      id="contact"
      // Half a court receding into the dark behind the closing pitch (::before).
      className="relative overflow-hidden py-[clamp(5rem,14vh,9rem)] before:pointer-events-none before:absolute before:inset-x-0 before:-bottom-[35%] before:-z-1 before:h-[70%] before:bg-[radial-gradient(50%_60%_at_50%_100%,var(--glow),transparent_70%)] before:opacity-55 before:blur-[24px] before:content-['']"
    >
      <div className="wrap grid justify-items-center text-center">
        <Reveal
          as="p"
          className="mb-[1.4rem] inline-flex items-center gap-[0.6rem] font-mono text-[0.72rem] tracking-[0.24em] text-accent uppercase"
        >
          <Shuttle className="h-auto w-[15px] drop-shadow-[0_0_8px_var(--glow)]" />
          {contact.kicker}
        </Reveal>

        <Reveal
          as="h2"
          className="max-w-[15ch] font-display text-[clamp(2.1rem,6vw,3.8rem)] leading-[1.03] font-semibold tracking-[-0.04em] text-balance"
          delay={60}
        >
          {contact.heading}
        </Reveal>

        <Reveal as="p" className="mt-[1.4rem] mb-[2.6rem] max-w-[46ch] text-fg-dim" delay={120}>
          {contact.body}
        </Reveal>

        <Reveal delay={180}>
          <a
            href={`mailto:${site.email}`}
            className="group/mail inline-flex items-center gap-[0.7rem] rounded-full border border-line-strong bg-bg-elev/65 px-[1.6rem] py-[0.85rem] font-mono text-[clamp(0.9rem,2vw,1.1rem)] transition-all duration-350 ease-flight hover:-translate-y-[3px] hover:border-accent hover:text-accent hover:shadow-[0_16px_40px_-18px_var(--accent)]"
          >
            <span>{site.email}</span>
            <svg
              className="size-4 transition-transform duration-350 ease-flight group-hover/mail:translate-x-1"
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
          <Reveal className="mt-[2.6rem] flex flex-wrap justify-center gap-[1.8rem] text-[0.88rem] text-fg-dim" delay={240}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                // An accent underline draws in from the left on hover (::after).
                className="relative transition-colors duration-250 after:absolute after:-bottom-[5px] after:left-0 after:h-px after:w-0 after:bg-accent after:transition-[width] after:duration-350 after:ease-soft after:content-[''] hover:text-accent hover:after:w-full"
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
