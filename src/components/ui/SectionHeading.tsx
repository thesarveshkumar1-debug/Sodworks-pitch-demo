type SectionHeadingProps = {
  eyebrow: string;
  heading: string;
  /** Rendered under the heading. */
  children?: React.ReactNode;
};

export function SectionHeading({
  eyebrow,
  heading,
  children,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-[11px] tracking-[0.16em] text-laterite-300 uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.1] font-normal text-balance">
        {heading}
      </h2>
      {children ? (
        <div className="mt-4 text-[15px] leading-relaxed text-bone-300">
          {children}
        </div>
      ) : null}
    </div>
  );
}
