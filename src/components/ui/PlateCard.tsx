import Link from "next/link";
import type { Concept } from "@/data/concepts";
import { Tag } from "./Tag";

/**
 * One specimen plate in the catalogue.
 *
 * A concept with status "live" and a route renders as a link. A "planned"
 * concept renders as plain, non-interactive content with a visible
 * "In development" marker — it is never clickable and never focusable.
 */
export function PlateCard({ concept }: { concept: Concept }) {
  const isLive = concept.status === "live" && Boolean(concept.route);

  const shell = [
    "group flex h-full flex-col rounded-xl border bg-ink-800 p-5 sm:p-6",
    "transition-colors duration-500 ease-sod",
    isLive
      ? "border-ink-600 hover:border-laterite-500"
      : "border-ink-700/70 text-bone-300",
  ].join(" ");

  const body = (
    <>
      <div
        className={`flex items-baseline justify-between gap-3 border-b pb-2.5 ${
          isLive ? "border-laterite-500" : "border-ink-600"
        }`}
      >
        <span
          className={`font-mono text-[11px] tracking-[0.16em] ${
            isLive ? "text-laterite-300" : "text-bone-300"
          }`}
        >
          Plate {concept.plate}
        </span>
        <span className="font-mono text-[11px] tracking-[0.16em] text-bone-300 uppercase">
          {concept.niche}
        </span>
      </div>

      <h3 className="mt-4 font-display text-[1.35rem] leading-[1.15] font-normal text-bone-50">
        {concept.title}
      </h3>

      <p className="mt-2.5 text-[13.5px] leading-[1.6] text-bone-300">
        {concept.summary}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2 pt-1">
        {isLive ? (
          <>
            {concept.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            <span className="ml-auto font-mono text-[11px] tracking-[0.12em] text-laterite-300 uppercase">
              View
              <span
                aria-hidden="true"
                className="ml-1.5 inline-block transition-transform duration-500 ease-sod group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </span>
          </>
        ) : (
          <span className="rounded-full border border-ink-600 px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] text-bone-300 uppercase">
            In development
          </span>
        )}
      </div>
    </>
  );

  if (!isLive) {
    return (
      <article className={shell} aria-label={`${concept.title} — in development`}>
        {body}
      </article>
    );
  }

  return (
    <Link href={concept.route!} className={`${shell} no-underline`}>
      {body}
    </Link>
  );
}
