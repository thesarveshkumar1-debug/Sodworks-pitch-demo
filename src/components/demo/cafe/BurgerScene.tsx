"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SampleBadge } from "@/components/ui/SampleBadge";
import { CafeRoom } from "@/components/demo/cafe/CafeRoom";
import { cafe, isSample } from "@/data/cafe";
import { cafeRooms } from "@/data/cafe-rooms";
import {
  burgerCanvas,
  burgerDrawOrder,
  burgerLayers,
  separationRatio,
} from "@/data/burger-layout";

/**
 * The café hero: the name, and the burger coming apart beneath it.
 *
 * The six layer images share one canvas and are already registered, so the
 * assembled state is simply all six stacked at zero offset. Scrolling drives
 * them apart; the timeline is scrubbed, so scrolling back reassembles them.
 *
 * The side columns stay empty until the burger actually starts moving, so the
 * opening frame reads as "ABC Cafe + burger" and nothing else.
 *
 * The room behind it is a photograph, blurred — see `.cafe-room` in
 * globals.css. It drifts a few percent over the sequence, which is enough to
 * separate it from the burger in depth and far too little to follow.
 *
 * Reduced motion: no ScrollTrigger is created at all, which leaves the burger
 * assembled, still and unpinned. Every ingredient and its note is listed
 * further down the page regardless, so nothing is reachable only by scrolling.
 */

const PIN = { desktop: 200, mobile: 120 };
const MID = (burgerLayers.length - 1) / 2;

/** Separation finishes before the timeline does; it holds briefly at the end. */
const SEPARATION_PORTION = 0.88;

/**
 * How far the stage pulls back as the layers come apart.
 *
 * Separated, the stack is close to twice its assembled height, and the hero
 * also has to hold the café name. Easing the whole stage down to this scale
 * keeps the full stack on screen and clear of the title, and reads as the
 * camera pulling back rather than the burger shrinking.
 */
const PULLBACK = 0.74;

/**
 * Background parallax: how far the room drifts, and the overscale it has to
 * drift inside. Both mirror `.cafe-room img` in globals.css — GSAP writes the
 * whole transform, so it has to be told the scale the stylesheet set.
 */
const ROOM = {
  desktop: { scale: 1.08, drift: -3 },
  mobile: { scale: 1.12, drift: -2 },
};

const byKey = Object.fromEntries(burgerLayers.map((l) => [l.key, l]));

export function BurgerScene() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  /** Ingredient order, top to bottom, with the notes from src/data/cafe.ts. */
  const ingredients = cafe.burger.layers.map((l) => ({
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
        const layerEls = gsap.utils.toArray<HTMLElement>("[data-layer]");
        const cueEls = gsap.utils.toArray<HTMLElement>("[data-cue]");
        const labelEls = gsap.utils.toArray<HTMLElement>("[data-ingredient]");
        const roomEl = el.querySelector<HTMLElement>(".cafe-room img");

        /* Separation scales with the burger's rendered size, so it holds at
           any viewport. Re-read whenever ScrollTrigger refreshes. */
        const step = () => st.offsetHeight * ratio;

        const paint = (progress: number) => {
          const p = Math.min(1, progress / SEPARATION_PORTION);
          const active = Math.min(
            ingredients.length - 1,
            Math.max(0, Math.floor(p * ingredients.length)),
          );

          /* Desktop and mobile each render a full set of labels, so match on
             the element's own index, not its position in the query. */
          for (const label of labelEls) {
            label.style.opacity =
              Number(label.dataset.index) === active ? "1" : "0";
          }
          /* Hold the side cues back until the burger is genuinely moving. */
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

        /* A touch of counter-rotation on the outer layers only — it reads as
           the bun lifting rather than sliding, and stays subtle. */
        tl.to(layerEls, {
          rotate: (i: number, target: HTMLElement) => {
            const s = Number(target.dataset.stack);
            return s === 0 ? -1.1 : s === burgerLayers.length - 1 ? 0.7 : 0;
          },
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
        () => build(separationRatio.desktop, PIN.desktop, ROOM.desktop));
      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 767px)",
        () => build(separationRatio.mobile, PIN.mobile, ROOM.mobile));
    }, el);

    return () => ctx.revert();
  }, [ingredients.length]);

  return (
    <section
      ref={root}
      className="cafe-hero relative flex min-h-dvh flex-col overflow-hidden"
    >
      <CafeRoom room={cafeRooms.burger} />

      {/* ------------------------------------------------------------- Name */}
      <header className="relative z-10 px-5 pt-10 text-center sm:pt-14">
        <h1 className="font-cafe-display text-[clamp(2.1rem,6.5vw,3.6rem)] leading-none font-semibold tracking-[-0.02em] text-cafe-paper">
          {cafe.identity.name}
        </h1>
        <SampleBadge tone="cafe" when={isSample} label="sample café" />
      </header>

      {/* ------------------------------------------------------------ Stage */}
      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-5 sm:px-8 md:grid-cols-[13rem_minmax(0,1fr)_13rem] md:gap-10">
          {/* An empty column, matching the label column on the right, so the
              burger stays optically centred in the hero. */}
          <div aria-hidden="true" className="hidden md:block" />

          {/* The burger */}
          <div
            ref={stage}
            className="relative mx-auto w-full max-w-[320px] sm:max-w-[400px] md:max-w-[440px]"
            style={{ aspectRatio: `${burgerCanvas.width} / ${burgerCanvas.height}` }}
            role="img"
            aria-label={cafe.burger.name}
          >
            {burgerDrawOrder.map((key, index) => {
              const layer = byKey[key];
              if (!layer) return null;

              return (
                <div
                  key={key}
                  data-layer
                  data-stack={layer.stack}
                  className="absolute inset-0"
                  style={{ zIndex: index + 1 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/burger/layers/${key}.webp`}
                    srcSet={`/burger/layers/${key}.webp ${burgerCanvas.width}w, /burger/layers/${key}@2x.webp ${burgerCanvas.width * 2}w`}
                    sizes="(min-width: 768px) 440px, (min-width: 640px) 400px, 320px"
                    alt=""
                    aria-hidden="true"
                    width={burgerCanvas.width}
                    height={burgerCanvas.height}
                    className="h-full w-full object-contain select-none"
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>

          {/* Active ingredient, desktop only */}
          <div
            data-cue
            aria-hidden="true"
            className="relative hidden h-32 opacity-0 transition-opacity duration-700 ease-sod md:block"
          >
            {ingredients.map((ing, i) => (
              <div
                key={ing.key}
                data-ingredient
                data-index={i}
                className="absolute inset-x-0 top-0 opacity-0 transition-opacity duration-300 ease-sod"
              >
                <p className="font-mono text-[10px] tracking-[0.18em] text-cafe-amber uppercase">
                  {cafe.burger.eyebrow}
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

      {/* ------------------------------------------- Mobile readout, below */}
      <div
        data-cue
        aria-hidden="true"
        className="relative z-10 px-5 pb-10 opacity-0 transition-opacity duration-700 ease-sod md:hidden"
      >
        <div className="relative mx-auto h-14 max-w-sm text-center">
          {ingredients.map((ing, i) => (
            <div
              key={ing.key}
              data-ingredient
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
