"use client";

import { useEffect, useRef } from "react";
import { DURATION, EASE_SOD, prefersReducedMotion } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  /** Stagger, in milliseconds. */
  delay?: number;
  className?: string;
};

/**
 * Fades and lifts its children into place the first time they scroll into
 * view. Visitors who ask for reduced motion see the content immediately,
 * and a <noscript> rule in the root layout keeps it visible without JS.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => {
      el.style.opacity = "1";
      el.style.transform = "none";
    };

    if (prefersReducedMotion()) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          window.setTimeout(show, delay);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      data-reveal
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(14px)",
        transition: `opacity ${DURATION.base}ms ${EASE_SOD}, transform ${DURATION.base}ms ${EASE_SOD}`,
      }}
    >
      {children}
    </div>
  );
}
