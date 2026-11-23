import { site } from "@/lib/content";
import Shuttle from "./Shuttle";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line py-[2.2rem] font-mono text-[0.74rem] tracking-[0.04em] text-fg-faint">
      <div className="wrap flex flex-wrap items-center justify-between gap-4">
        <span className="inline-flex items-center gap-[0.55rem]">
          <Shuttle className="h-auto w-3 text-accent opacity-80" />© {new Date().getFullYear()}{" "}
          {site.name}
          <span lang="zh-CN" className="font-sans tracking-normal">
            {site.nameZh}
          </span>
        </span>
      </div>
    </footer>
  );
}
