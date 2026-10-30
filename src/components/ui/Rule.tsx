export function Rule({ accent = false }: { accent?: boolean }) {
  return (
    <hr
      className={`h-px border-0 ${accent ? "bg-laterite-500" : "bg-ink-600"}`}
    />
  );
}
