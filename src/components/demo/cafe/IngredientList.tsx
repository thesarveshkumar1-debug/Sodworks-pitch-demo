import { cafe } from "@/data/cafe";

type Layer = { name: string; note: string };

type IngredientListProps = {
  /** Defaults to the burger's layers. */
  layers?: readonly Layer[];
  title?: string;
};

/**
 * The full build, in order, with every note. This is the plain reference
 * version of the burger scene: it needs no motion, no JavaScript and no
 * pointer, so the detail is always reachable however the page is viewed.
 */
export function IngredientList({
  layers = cafe.burger.layers,
  title = "What goes in, top to bottom",
}: IngredientListProps) {
  return (
    <div className="rounded-2xl border border-cafe-paper-edge bg-cafe-paper p-6 sm:p-8">
      <h3 className="font-mono text-[11px] tracking-[0.18em] text-cafe-ember uppercase">
        {title}
      </h3>

      <ol className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
        {layers.map((layer, index) => (
          <li key={layer.name} className="flex gap-3.5">
            <span className="mt-0.5 shrink-0 font-mono text-[11px] text-cafe-muted tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="block font-cafe-display text-[15px] leading-tight font-semibold text-cafe-char">
                {layer.name}
              </span>
              <span className="block font-cafe-body text-[13.5px] leading-snug text-cafe-muted">
                {layer.note}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
