import Link from "next/link";

/**
 * The SodWorks frame around a client demo. Deliberately dark and slim so it
 * reads as the gallery's label card, not as part of the business below it.
 */
export function DemoBar({ sample = true }: { sample?: boolean }) {
  return (
    <div className="bg-ink-900 text-bone-50">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-5 py-2.5 sm:px-8">
        <Link
          href="/#catalogue"
          className="group flex items-center gap-2 font-mono text-[10.5px] tracking-[0.14em] text-bone-50 uppercase no-underline"
        >
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-500 ease-sod group-hover:-translate-x-1"
          >
            &larr;
          </span>
          <span className="h-1.5 w-1.5 rounded-[1px] bg-laterite-500" aria-hidden="true" />
          SodWorks
        </Link>

        {sample ? (
          <p className="font-mono text-[10px] tracking-[0.1em] text-bone-300 uppercase">
            Concept demo &middot; sample content throughout
          </p>
        ) : null}
      </div>
    </div>
  );
}
