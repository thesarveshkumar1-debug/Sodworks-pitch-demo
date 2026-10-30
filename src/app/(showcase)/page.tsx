import { Button } from "@/components/ui/Button";
import { PlateCard } from "@/components/ui/PlateCard";
import { Rule } from "@/components/ui/Rule";
import { SampleBadge } from "@/components/ui/SampleBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { concepts } from "@/data/concepts";
import { site } from "@/data/site";

const container = "mx-auto w-full max-w-6xl px-5 sm:px-8";

export default function Home() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className={`${container} pt-16 pb-20 sm:pt-24 sm:pb-28`}>
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.16em] text-laterite-300 uppercase">
            {site.hero.eyebrow}
            <span className="mx-2.5 text-ink-600">/</span>
            <span className="text-bone-300">{site.studio.location}</span>
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.25rem,7.5vw,4.5rem)] leading-[1.04] font-normal text-balance">
            {site.hero.headline}
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-8 max-w-xl">
            <Rule accent />
            <p className="mt-5 text-[15px] leading-relaxed text-bone-300 sm:text-base">
              {site.hero.standfirst}
            </p>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={site.hero.primaryCta.href}>
              {site.hero.primaryCta.label}
            </Button>
            <Button href={site.hero.secondaryCta.href} variant="ghost">
              {site.hero.secondaryCta.label}
            </Button>
          </div>
        </Reveal>
      </section>

      {/* ----------------------------------------------------------- Catalogue */}
      <section id="catalogue" className={`${container} scroll-mt-20 py-16 sm:py-20`}>
        <Reveal>
          <SectionHeading eyebrow="The catalogue" heading="Concepts, plate by plate">
            <p>
              Each plate is one business and one product. Concepts still in
              build are listed here so the direction is visible, and are
              marked plainly rather than hidden behind an empty page.
            </p>
          </SectionHeading>
        </Reveal>

        <Reveal delay={80}>
          <p className="mt-8 font-mono text-[11px] tracking-[0.14em] text-bone-300 uppercase">
            {String(concepts.length).padStart(2, "0")} concepts
          </p>
          <div className="mt-4">
            <Rule />
          </div>
        </Reveal>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {concepts.map((concept, index) => (
            <li key={concept.id} className="h-full">
              <Reveal delay={index * 70} className="h-full">
                <PlateCard concept={concept} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------------ Approach */}
      <section id="approach" className={`${container} scroll-mt-20 py-16 sm:py-20`}>
        <Reveal>
          <SectionHeading
            eyebrow={site.approach.eyebrow}
            heading={site.approach.heading}
          />
        </Reveal>

        <ol className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          {site.approach.steps.map((step, index) => (
            <li key={step.title}>
              <Reveal delay={index * 90}>
                <p className="font-mono text-[11px] tracking-[0.16em] text-laterite-300">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="mt-3">
                  <Rule />
                </div>
                <h3 className="mt-4 font-display text-[1.3rem] leading-tight font-normal">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-[1.65] text-bone-300">
                  {step.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* ----------------------------------------------------------- Enquiries */}
      <section id="enquiries" className={`${container} scroll-mt-20 py-16 sm:py-20`}>
        <Reveal>
          <div className="rounded-2xl border border-ink-700 bg-ink-800 p-6 sm:p-10">
            <SectionHeading
              eyebrow={site.contact.eyebrow}
              heading={site.contact.heading}
            >
              <p>{site.contact.body}</p>
            </SectionHeading>

            <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <dt className="font-mono text-[10px] tracking-[0.14em] text-bone-300 uppercase">
                  Email
                </dt>
                <dd className="mt-1.5 text-[14px] break-words text-bone-50">
                  {site.contact.email}
                  <SampleBadge />
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.14em] text-bone-300 uppercase">
                  Phone
                </dt>
                <dd className="mt-1.5 text-[14px] text-bone-50">
                  {site.contact.phone}
                  <SampleBadge />
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.14em] text-bone-300 uppercase">
                  Instagram
                </dt>
                <dd className="mt-1.5 text-[14px] text-bone-50">
                  {site.contact.instagram}
                  <SampleBadge />
                </dd>
              </div>
            </dl>

            <p className="mt-7 font-mono text-[10.5px] leading-relaxed tracking-[0.08em] text-bone-300/80 uppercase">
              Replace these in src/data/site.ts, then set showSampleMarkers to
              false to clear the badges.
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
