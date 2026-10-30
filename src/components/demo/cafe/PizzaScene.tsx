"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CafeRoom } from "@/components/demo/cafe/CafeRoom";
import { cafe } from "@/data/cafe";
import { cafeRooms } from "@/data/cafe-rooms";
import {
  pizzaCanvas,
  pizzaDrawOrder,
  pizzaLayers,
  pizzaSeparationRatio,
} from "@/data/pizza-layout";

/**
 * The pizza, taken apart by scroll — the café's second food moment.
 *
 * Built on the same footing as the burger: the layer images share one canvas
 * and are already registered, so assembled is all three stacked at zero
 * offset, and the scrubbed timeline reverses naturally on the way back up.
 *
 * Its room is the café's brighter end — whitewashed brick under a row of bare
 * lamps — blurred and knocked well down, so it reads as the same café without
 * competing with the cheese. The drift matches the burger's.
 *
 * Three layers rather than six, so each gets more travel and stays legible on
 * a phone. Reduced motion creates no ScrollTrigger at all, leaving the pizza
 * whole and still, with every layer named in the list below the scene.
 */

const PIN = { desktop: 175, mobile: 110 };
const MID = (pizzaLayers.length - 1) / 2;
const SEPARATION_PORTION = 0.86;

/** Flat discs spread further than a burger's, so they pull back less. */
const PULLBACK = 0.82;

/** Mirrors `.cafe-room img` in globals.css — see the note in BurgerScene. */
const ROOM = {
  desktop: { scale: 1.08, drift: -3 },
  mobile: { scale: 1.12, drift: -2 },
};

const byKey = Object.fromEntries(pizzaLayers.map((l) => [l.key, l]));

export function PizzaScene() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  const ingredients = cafe.pizza.layers.map((l) => ({
    key: l.asset.replace(/\.(png|webp)$/, ""),
    name: l.name,
    note: l.note,
  }));

  useEffect(() => {
    const el = root.current;
    const st = stage.current;
    if (!el || !st) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const build = (ratio: number, pin: number, room: typeof ROOM.desktop) => {
        const layerEls = gsap.utils.toArray<HTMLElement>("[data-pizza-layer]");
        const cueEls = gsap.utils.toArray<HTMLElement>("[data-pizza-cue]");
        const labelEls = gsap.utils.toArray<HTMLElement>("[data-pizza-label]");
        const roomEl = el.querySelector<HTMLElement>(".cafe-room img");

        const step = () => st.offsetHeight * ratio;

        const paint = (progress: number) => {
          const p = Math.min(1, progress / SEPARATION_PORTION);
          const active = Math.min(
            ingredients.length - 1,
            Math.max(0, Math.floor(p * ingredients.length)),
          );
          for (const label of labelEls) {
            label.style.opacity =
              Number(label.dataset.index) === active ? "1" : "0";
          }
          const shown = p > 0.03 ? "1" : "0";
          for (const cue of cueEls) cue.style.opacity = shown;
        };

        paint(0);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            /* The pin length in pixels, not `+=${pin}%`. The percentage
               form resolved to a zero-length pin once the room backdrop was
               added to the section — the sequence stopped running at all —
               while this says exactly what the percentage was meant to mean
               and holds at every viewport. `invalidateOnRefresh` re-runs it,
               so it follows a resize. */
            end: () => `+=${window.innerHeight * (pin / 100)}`,
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => paint(self.progress),
          },
        });

        tl.to(layerEls, {
          y: (i: number, target: HTMLElement) =>
            (Number(target.dataset.stack) - MID) * step(),
          ease: "none",
          duration: 1,
        }, 0);

        tl.to(st, {
          scale: PULLBACK,
          transformOrigin: "50% 50%",
          ease: "none",
          duration: 1,
        }, 0);

        if (roomEl) {
          gsap.set(roomEl, { scale: room.scale });
          tl.to(roomEl, {
            yPercent: room.drift,
            ease: "none",
            duration: 1,
          }, 0);
        }

        tl.to({}, { duration: 0.3 });
      };

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)",
        () => build(pizzaSeparationRatio.desktop, PIN.desktop, ROOM.desktop));
      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 767px)",
        () => build(pizzaSeparationRatio.mobile, PIN.mobile, ROOM.mobile));
    }, el);

    return () => ctx.revert();
  }, [ingredients.length]);

  return (
    <section
      ref={root}
      className="cafe-hero-oven relative flex min-h-dvh flex-col overflow-hidden"
    >
      <CafeRoom room={cafeRooms.pizza} />

      <header className="relative z-10 px-5 pt-10 text-center sm:pt-14">
        <p className="font-mono text-[11px] tracking-[0.18em] text-cafe-amber uppercase">
          {cafe.pizza.eyebrow}
        </p>
        <h2 className="mt-3 font-cafe-display text-[clamp(1.8rem,5.5vw,3rem)] leading-none font-semibold tracking-[-0.02em] text-cafe-paper">
          {cafe.pizza.name}
        </h2>
      </header>

      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-5 sm:px-8 md:grid-cols-[13rem_minmax(0,1fr)_13rem] md:gap-10">
          {/* Balances the label column so the pizza stays optically centred. */}
          <div aria-hidden="true" className="hidden md:block" />

          <div
            ref={stage}
            className="relative mx-auto w-full max-w-[320px] sm:max-w-[420px] md:max-w-[470px]"
            style={{ aspectRatio: `${pizzaCanvas.width} / ${pizzaCanvas.height}` }}
            role="img"
            aria-label={cafe.pizza.name}
          >
            {pizzaDrawOrder.map((key, index) => {
              const layer = byKey[key];
              if (!layer) return null;

              return (
                <div
                  key={key}
                  data-pizza-layer
                  data-stack={layer.stack}
                  className="absolute inset-0"
                  style={{ zIndex: index + 1 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/pizza/layers/${key}.webp`}
                    srcSet={`/pizza/layers/${key}.webp ${pizzaCanvas.width}w, /pizza/layers/${key}@2x.webp ${pizzaCanvas.width * 2}w`}
                    sizes="(min-width: 768px) 470px, (min-width: 640px) 420px, 320px"
                    alt=""
                    aria-hidden="true"
                    width={pizzaCanvas.width}
                    height={pizzaCanvas.height}
                    className="h-full w-full object-contain select-none"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>

          <div
            data-pizza-cue
            aria-hidden="true"
            className="relative hidden h-32 opacity-0 transition-opacity duration-700 ease-sod md:block"
          >
            {ingredients.map((ing, i) => (
              <div
                key={ing.key}
                data-pizza-label
                data-index={i}
                className="absolute inset-x-0 top-0 opacity-0 transition-opacity duration-300 ease-sod"
              >
                <p className="font-mono text-[10px] tracking-[0.18em] text-cafe-amber uppercase">
                  {cafe.pizza.eyebrow}
                </p>
                <p className="mt-2 font-cafe-display text-[17px] leading-tight font-semibold text-cafe-paper">
                  {ing.name}
                </p>
                <p className="mt-1.5 font-cafe-body text-[13.5px] leading-snug text-cafe-sand">
                  {ing.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        data-pizza-cue
        aria-hidden="true"
        className="relative z-10 px-5 pb-10 opacity-0 transition-opacity duration-700 ease-sod md:hidden"
      >
        <div className="relative mx-auto h-14 max-w-sm text-center">
          {ingredients.map((ing, i) => (
            <div
              key={ing.key}
              data-pizza-label
              data-index={i}
              className="absolute inset-x-0 top-0 opacity-0 transition-opacity duration-300 ease-sod"
            >
              <p className="font-cafe-display text-[16px] leading-tight font-semibold text-cafe-paper">
                {ing.name}
              </p>
              <p className="mt-1 font-cafe-body text-[13px] leading-snug text-cafe-sand">
                {ing.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
