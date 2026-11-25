import { site } from "@/lib/content";
import Shuttle from "./Shuttle";

// Any link left as "" in content.ts is dropped, same as elsewhere on the site.
const socials = [
  { href: site.github, label: "GitHub" },
  { href: site.linkedin, label: "LinkedIn" },
  { href: site.email && `mailto:${site.email}`, label: "Email" },
  { href: site.resume, label: "CV" },
].filter((s) => s.href);

const linkClass = "transition-colors duration-250 hover:text-accent";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line py-5 font-mono text-[0.74rem] tracking-[0.04em] text-fg-faint">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <span className="inline-flex items-center gap-[0.55rem]">
          <Shuttle className="h-auto w-3 text-accent opacity-80" />© {new Date().getFullYear()} {site.name}
          <span lang="zh-CN" className="font-sans tracking-normal">
            {site.nameZh}
          </span>
        </span>

        <nav aria-label="Elsewhere" className="flex gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className={linkClass}
              {...(s.href.startsWith("http") && { target: "_blank", rel: "noreferrer" })}
            >
              {s.label}
            </a>
          ))}
        </nav>

        {/* Back to the hero, where the rally started. */}
        <a href="#top" className={`group/top inline-flex items-center gap-2 ${linkClass}`}>
          Back to serve
          <Shuttle className="h-auto w-3 text-accent transition-transform duration-500 ease-flight group-hover/top:-translate-y-[3px] group-hover/top:rotate-180" />
        </a>
      </div>
    </footer>
  );
}
