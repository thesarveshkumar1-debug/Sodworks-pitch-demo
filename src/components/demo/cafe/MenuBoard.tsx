import { cafe } from "@/data/cafe";

export function MenuBoard() {
  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:gap-12">
      {cafe.menu.map((section) => (
        <section key={section.section}>
          <div className="flex items-baseline justify-between gap-3 border-b border-cafe-paper-edge pb-2">
            <h3 className="font-cafe-display text-[1.25rem] font-semibold text-cafe-char">
              {section.section}
            </h3>
            {section.note ? (
              <p className="font-cafe-body text-[13px] text-cafe-muted">
                {section.note}
              </p>
            ) : null}
          </div>

          <ul className="mt-4 flex flex-col gap-3.5">
            {section.items.map((item) => (
              <li
                key={item.name}
                className="flex items-baseline justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-cafe-body text-[15.5px] leading-snug text-cafe-char">
                    {item.name}
                  </p>
                  {item.note ? (
                    <p className="font-cafe-body text-[13px] text-cafe-muted">
                      {item.note}
                    </p>
                  ) : null}
                </div>
                <p className="shrink-0 font-mono text-[13px] tracking-[0.04em] text-cafe-char tabular-nums">
                  {item.price}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
