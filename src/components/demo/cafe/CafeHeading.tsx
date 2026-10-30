type CafeHeadingProps = {
  eyebrow: string;
  heading: string;
  children?: React.ReactNode;
};

export function CafeHeading({ eyebrow, heading, children }: CafeHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-[11px] tracking-[0.18em] text-cafe-ember uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-cafe-display text-[clamp(1.9rem,5vw,3rem)] leading-[1.05] font-semibold text-balance text-cafe-char">
        {heading}
      </h2>
      {children ? (
        <div className="mt-4 font-cafe-body text-[16px] leading-[1.7] text-cafe-muted">
          {children}
        </div>
      ) : null}
    </div>
  );
}
