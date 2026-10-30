import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

/**
 * Chrome for the SodWorks showcase itself. Demo pages live outside this
 * group so each one can carry its own identity instead of this dark shell.
 */
export default function ShowcaseLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col bg-ink-900 text-bone-50">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
