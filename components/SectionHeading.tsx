import Reveal from "./Reveal";

type Props = {
  num: string;
  /** The badminton framing — sits above the plain-English title. */
  kicker: string;
  title: string;
  note?: string;
};

export default function SectionHeading({ num, kicker, title, note }: Props) {
  return (
    <Reveal
      // A chalk baseline under every heading, with the accent segment a
      // service line would have (the ::after).
      className="relative mb-11 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b border-line pb-5 after:absolute after:-bottom-px after:left-0 after:h-[2px] after:w-[84px] after:bg-accent after:content-['']"
    >
      <div className="min-w-0">
        <p className="mb-[0.7rem] flex items-center gap-[0.7rem] font-mono text-[0.72rem] tracking-[0.22em] text-accent uppercase">
          <span className="tracking-[0.1em] text-fg-faint after:ml-[0.7rem] after:inline-block after:h-px after:w-[18px] after:bg-line-strong after:align-middle after:content-['']">
            {num}
          </span>
          {kicker}
        </p>
        <h2 className="font-display text-[clamp(1.85rem,3.6vw,2.75rem)] leading-[1.08] font-semibold tracking-[-0.038em]">
          {title}
        </h2>
      </div>
      {note ? (
        <p className="max-w-[36ch] text-right text-[0.93rem] text-fg-dim max-[760px]:text-left">{note}</p>
      ) : null}
    </Reveal>
  );
}
