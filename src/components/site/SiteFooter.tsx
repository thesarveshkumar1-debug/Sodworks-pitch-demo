import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink-700 sm:mt-32">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-[1px] bg-laterite-500"
              />
              <span className="font-display text-[1.05rem] leading-none text-bone-50">
                {site.wordmark}
              </span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-bone-300">
              {site.footer.note}
            </p>
          </div>

          <div className="font-mono text-[11px] tracking-[0.08em] text-bone-300">
            <p className="text-bone-50 uppercase">{site.studio.location}</p>
            <p className="mt-1.5">{site.studio.discipline}</p>
          </div>
        </div>

        <p className="mt-10 font-mono text-[10px] tracking-[0.1em] text-bone-300/70 uppercase">
          Concept catalogue &middot; Sample content throughout
        </p>
      </div>
    </footer>
  );
}
