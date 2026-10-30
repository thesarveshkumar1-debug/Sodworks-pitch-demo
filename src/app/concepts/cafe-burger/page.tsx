import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { BurgerScene } from "@/components/demo/cafe/BurgerScene";
import { PizzaScene } from "@/components/demo/cafe/PizzaScene";
import { IngredientList } from "@/components/demo/cafe/IngredientList";
import { CafeHeading } from "@/components/demo/cafe/CafeHeading";
import { MenuBoard } from "@/components/demo/cafe/MenuBoard";
import { SampleBadge } from "@/components/ui/SampleBadge";
import { cafe, isSample } from "@/data/cafe";

const container = "mx-auto w-full max-w-5xl px-5 sm:px-8";

export default function CafeBurgerDemo() {
  return (
    <>
      {/* The hero is the product story: the name, then the burger coming
          apart. Nothing sits between the two — no tagline, no buttons. The
          café's own introduction waits until the sequence is over. */}
      <BurgerScene />

      {/* The café's second food moment, directly below the burger. Same dark
          language, its own dish. */}
      <PizzaScene />

      {/* ------------------------------------------------------------ Intro */}
      <section className={`${container} pt-16 pb-14 sm:pt-20 sm:pb-16`}>
        <Reveal>
          <h2 className="max-w-2xl font-cafe-display text-[clamp(1.9rem,5vw,3rem)] leading-[1.05] font-semibold text-balance text-cafe-char">
            {cafe.identity.tagline}
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-7 max-w-xl">
            <div className="h-px bg-cafe-ember" />
            <p className="mt-5 font-cafe-body text-[16.5px] leading-[1.7] text-cafe-muted">
              {cafe.identity.blurb}
            </p>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#menu"
              className="inline-flex items-center rounded-full bg-cafe-char px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] text-cafe-paper uppercase no-underline transition-colors duration-300 ease-sod hover:bg-cafe-ember"
            >
              See the menu
            </a>
            <a
              href="#visit"
              className="inline-flex items-center rounded-full border border-cafe-paper-edge px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] text-cafe-char uppercase no-underline transition-colors duration-300 ease-sod hover:border-cafe-ember hover:text-cafe-ember"
            >
              Find us
            </a>
          </div>
        </Reveal>
      </section>

      {/* -------------------------------------------------------- Signature */}
      <section
        id="signature"
        className="scroll-mt-4 border-y border-cafe-paper-edge bg-cafe-paper-deep/40"
      >
        <div className={`${container} py-16 sm:py-20`}>
          <Reveal>
            <CafeHeading
              eyebrow={cafe.burger.eyebrow}
              heading={cafe.burger.name}
            >
              <p>{cafe.burger.standfirst}</p>
            </CafeHeading>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-10">
              <IngredientList />
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------- From the oven */}
      <section id="pizza" className={`${container} scroll-mt-4 py-16 sm:py-20`}>
        <Reveal>
          <CafeHeading
            eyebrow={cafe.pizza.eyebrow}
            heading={cafe.pizza.name}
          >
            <p>{cafe.pizza.standfirst}</p>
          </CafeHeading>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10">
            <IngredientList
              layers={cafe.pizza.layers}
              title="What goes on, top to bottom"
            />
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------- Menu */}
      <section id="menu" className={`${container} scroll-mt-4 py-16 sm:py-20`}>
        <Reveal>
          <CafeHeading eyebrow="The card" heading="Short, and cooked to order">
            <p>
              Everything is made when you ask for it, so a burger takes about
              twelve minutes.
            </p>
          </CafeHeading>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10">
            <MenuBoard />
          </div>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-10 font-mono text-[10.5px] leading-relaxed tracking-[0.1em] text-cafe-muted uppercase">
            Sample prices &middot; replace the menu in src/data/cafe.ts
          </p>
        </Reveal>
      </section>

      {/* ------------------------------------------------------------ Visit */}
      <section
        id="visit"
        className="scroll-mt-4 border-t border-cafe-paper-edge bg-cafe-paper-deep/40"
      >
        <div className={`${container} py-16 sm:py-20`}>
          <Reveal>
            <CafeHeading
              eyebrow={cafe.visit.eyebrow}
              heading={cafe.visit.heading}
            />
          </Reveal>

          <Reveal delay={100}>
            <dl className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div>
                <dt className="font-mono text-[10px] tracking-[0.16em] text-cafe-muted uppercase">
                  Address
                  <SampleBadge tone="cafe" when={isSample} />
                </dt>
                <dd className="mt-2 font-cafe-body text-[15.5px] leading-[1.6] text-cafe-char">
                  {cafe.visit.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </dd>
              </div>

              <div>
                <dt className="font-mono text-[10px] tracking-[0.16em] text-cafe-muted uppercase">
                  Hours
                </dt>
                <dd className="mt-2 font-cafe-body text-[15.5px] leading-[1.6] text-cafe-char">
                  {cafe.visit.hours.map((slot) => (
                    <span key={slot.days} className="block">
                      {slot.days}
                      <span className="block font-mono text-[13px] text-cafe-muted tabular-nums">
                        {slot.time}
                      </span>
                    </span>
                  ))}
                </dd>
              </div>

              <div>
                <dt className="font-mono text-[10px] tracking-[0.16em] text-cafe-muted uppercase">
                  Contact
                  <SampleBadge tone="cafe" when={isSample} />
                </dt>
                <dd className="mt-2 font-cafe-body text-[15.5px] leading-[1.6] text-cafe-char">
                  <span className="block">{cafe.visit.phone}</span>
                  <span className="block">{cafe.visit.instagram}</span>
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-10 font-cafe-body text-[15px] text-cafe-muted italic">
              {cafe.visit.closing}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------ Back to SodWorks */}
      <section className={`${container} py-14 sm:py-16`}>
        <div className="flex flex-col gap-4 border-t border-cafe-paper-edge pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md font-cafe-body text-[15px] leading-relaxed text-cafe-muted">
            This is a concept demo built by SodWorks. The café, its menu and
            its details are sample content.
          </p>
          <Link
            href="/#catalogue"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-cafe-char px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] text-cafe-char uppercase no-underline transition-colors duration-300 ease-sod hover:bg-cafe-char hover:text-cafe-paper"
          >
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-500 ease-sod group-hover:-translate-x-1"
            >
              &larr;
            </span>
            Back to the catalogue
          </Link>
        </div>
      </section>
    </>
  );
}
