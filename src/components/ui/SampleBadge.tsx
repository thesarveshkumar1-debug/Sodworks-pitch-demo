import { showSampleMarkers } from "@/data/site";

type SampleBadgeProps = {
  label?: string;
  /** Which palette to draw in. Demo pages use their own. */
  tone?: "shell" | "cafe";
  /** Override the default visibility flag, e.g. a demo's own isSample. */
  when?: boolean;
};

const tones = {
  shell: "border-laterite-500/50 text-laterite-300",
  /* Backed, because on the dark café heroes this badge sits over everything
     from near-black panelling to a bright window, and unbacked it vanished
     against the glass. Sample content has to stay legible to be honest. */
  cafe: "border-cafe-amber/50 bg-cafe-espresso/55 text-cafe-amber backdrop-blur-[1px]",
} as const;

/**
 * Marks a value as placeholder content so it can never be mistaken for a
 * real business detail. Site-wide badges follow `showSampleMarkers` in
 * src/data/site.ts; a demo can pass its own flag through `when`.
 */
export function SampleBadge({
  label = "sample",
  tone = "shell",
  when,
}: SampleBadgeProps) {
  const visible = when ?? showSampleMarkers;
  if (!visible) return null;

  return (
    <span
      className={`ml-2 rounded-sm border px-1.5 py-0.5 align-middle font-mono text-[9px] tracking-[0.12em] uppercase ${tones[tone]}`}
    >
      {label}
    </span>
  );
}
