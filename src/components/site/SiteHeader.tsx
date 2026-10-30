import Link from "next/link";
import { site } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-700/80 bg-ink-900/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:h-16 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline"
          aria-label={`${site.name} — home`}
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-[1px] bg-laterite-500"
          />
          <span className="font-display text-[1.05rem] leading-none text-bone-50">
            {site.wordmark}
          </span>
        </Link>

        <nav className="flex items-center gap-5 sm:gap-7">
          <a
            href="#catalogue"
            className="font-mono text-[10.5px] tracking-[0.14em] text-bone-300 uppercase transition-colors duration-300 ease-sod hover:text-bone-50"
          >
            Catalogue
          </a>
          <a
            href="#approach"
            className="hidden font-mono text-[10.5px] tracking-[0.14em] text-bone-300 uppercase transition-colors duration-300 ease-sod hover:text-bone-50 sm:inline"
          >
            Approach
          </a>
          <a
            href="#enquiries"
            className="font-mono text-[10.5px] tracking-[0.14em] text-laterite-300 uppercase transition-colors duration-300 ease-sod hover:text-bone-50"
          >
            Enquiries
          </a>
        </nav>
      </div>
    </header>
  );
}
